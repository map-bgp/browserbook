import { ethers } from 'ethers'
import { PriorityQueue } from 'typescript-collections'
import { ContractMetadata, ContractName } from '../chain/ContractMetadata'
import { Order, OrderType } from '../p2p/protocol_buffers/gossip_schema'
import { db } from '../store/globals/db'
import { ChainOrder, OrderStatus } from '../Types'

enum MatchValidity {
  Valid = 'VALID',
  BidUnvalid = 'BID_UNVALID',
  AskUnvalid = 'ASK_UNVALID',
  BidAndAskUnvalid = 'BID_AND_ASK_UNVALID',
}

type OMS = {
  running: boolean
  waiting: boolean
  orderbook: Map<string, { bid: PriorityQueue<Order>; ask: PriorityQueue<Order> }>
  overflow: Array<Order>
  stale: Set<string>
  signerNonce: number
  stats: { startTime: number; endTime: number; success: number; fail: number }
}

const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop)
}

const getTokenIdentifier = (order: Order) => `${order.tokenAddress}/${order.tokenId}`

const orderExpired = (order: Order) => {
  return Number(order.expiry) < Date.now()
}

const bidComparator = (a: Order, b: Order) => (a.price > b.price ? -1 : 1)
const askComparator = (a: Order, b: Order) => (a.price < b.price ? -1 : 1)

const oms: OMS = {
  running: false,
  waiting: true,
  orderbook: new Map(),
  overflow: [],
  stale: new Set(),
  signerNonce: 0,
  stats: { startTime: 0, endTime: 0, success: 0, fail: 0 },
}

onmessage = (e: MessageEvent) => {
  if (e.data[0] === 'start') {
    start(e.data[1], e.data[2]).then(() => console.log('Started order validation'))
  }

  // If the worker is started, the peer pushes new orders here
  // and adds them to the DB
  if (e.data[0] === 'new-order') {
    addNewOrder(e.data[1])
  }

  if (e.data[0] === 'matched-order') {
    removeOrder(e.data[1])
    removeOrder(e.data[2])
  }

  if (e.data[0] === 'stop') {
    oms.running = false
  }
}

const start = async (signerAddress: string, decryptedSignerKey: string) => {
  oms.running = true
  oms.stats.startTime = Date.now()

  const provider = ethers.getDefaultProvider('http://localhost:8545')
  const signer = new ethers.Wallet(decryptedSignerKey, provider)
  oms.signerNonce = await provider.getTransactionCount(signerAddress)

  const contractMetadata = ContractMetadata[ContractName.Exchange]

  if (!hasOwnProperty(contractMetadata, 'address')) {
    throw new Error('Contract address not found')
  }

  const address = contractMetadata.address
  const contractABI = contractMetadata.abi
  const delegatedExchangeContract = new ethers.Contract(address, contractABI, signer)

  await syncOrderBook()

  setInterval(() => {
    if (oms.running && oms.waiting) {
      matchOrders(delegatedExchangeContract)
    }
  }, 10)

  setInterval(() => {
    if (oms.running) {
      resetOverflow()
    }
  }, 30000)
}

const logStats = () => {
  console.log(
    `Processed ${oms.stats.success + oms.stats.fail} orders in ${
      oms.stats.endTime - oms.stats.startTime
    } ms. ${oms.stats.success} were successful, ${oms.stats.fail} failed. TPS: ${
      (oms.stats.success + oms.stats.fail) / ((oms.stats.endTime - oms.stats.startTime) / 1000)
    }`,
  )
}

const syncOrderBook = async () => {
  const tokenIdentifiers = (await db.orders.orderBy('[tokenAddress+tokenId]').uniqueKeys()).map(
    (compoundIndex) => {
      const item = compoundIndex.valueOf() as Array<string>
      return {
        tokenAddress: item[0],
        tokenId: item[1],
      }
    },
  )

  for (const tokenIdentifier of tokenIdentifiers) {
    oms.orderbook.set(
      `${tokenIdentifier.tokenAddress}/${tokenIdentifier.tokenId}`,
      await syncTokenOrders(tokenIdentifier.tokenAddress, tokenIdentifier.tokenId),
    )
  }
}

const syncTokenOrders = async (tokenAddress: string, tokenId: string) => {
  const bid: PriorityQueue<Order> = new PriorityQueue(bidComparator)
  const ask: PriorityQueue<Order> = new PriorityQueue(askComparator)

  const tokenOrders = await db.orders.where({ tokenAddress: tokenAddress, tokenId: tokenId }).toArray()
  // const tokenOrders = await db.orders.where({ tokenAddress: tokenAddress, tokenId: tokenId, status: OrderStatus.Pending }).toArray()

  tokenOrders
    .filter(
      (order) =>
        order.orderType === OrderType.BUY &&
        order.status === OrderStatus.Pending &&
        !orderExpired(order),
    )
    .forEach((order) => bid.enqueue(order))

  tokenOrders
    .filter(
      (order) =>
        order.orderType === OrderType.SELL &&
        order.status === OrderStatus.Pending &&
        !orderExpired(order),
    )
    .forEach((order) => ask.enqueue(order))

  return {
    bid,
    ask,
  }
}

const addNewOrder = async (order: Order) => {
  if (!orderExpired(order)) {
    const tokenIdentifer = getTokenIdentifier(order)

    if (!oms.orderbook.get(tokenIdentifer)) {
      oms.orderbook.set(tokenIdentifer, {
        bid: new PriorityQueue(bidComparator),
        ask: new PriorityQueue(askComparator),
      })
    }

    if (order.orderType === OrderType.BUY) {
      oms.orderbook.get(getTokenIdentifier(order))!.bid.enqueue(order)
    } else {
      oms.orderbook.get(getTokenIdentifier(order))!.ask.enqueue(order)
    }
  }
}

const removeOrder = async (orderId: string) => {
  oms.stale.add(orderId)
}

const matchOrders = async (delegatedExchangeContract: ethers.Contract) => {
  oms.waiting = false
  for (const [_, { bid, ask }] of oms.orderbook) {
    for (let i = 0; i < 100; i++) {
      // Match 100 orders
      if (bid.peek() !== undefined && ask.peek() !== undefined) {
        const highestBid = bid.peek() as Order // Safe as we check the undefined case above
        const lowestAsk = ask.peek() as Order

        if (validMatch(highestBid, lowestAsk) === MatchValidity.Valid) {
          console.log('Matching Order')
          await matchOrder(delegatedExchangeContract, bid.dequeue() as Order, ask.dequeue() as Order) // Changed to dequeue when necessary
        } else if (validMatch(highestBid, lowestAsk) === MatchValidity.BidUnvalid) {
          sendToOverflow(bid.dequeue() as Order)
        } else if (validMatch(highestBid, lowestAsk) === MatchValidity.AskUnvalid) {
          sendToOverflow(ask.dequeue() as Order)
        } else if (validMatch(highestBid, lowestAsk) === MatchValidity.BidAndAskUnvalid) {
          sendToOverflow(bid.dequeue() as Order)
          sendToOverflow(ask.dequeue() as Order)
        }
      }
    }
  }

  let shouldContinue = false

  for (const [_, { bid, ask }] of oms.orderbook) {
    if (bid.peek() !== undefined && ask.peek() !== undefined) {
      shouldContinue = true
    }
  }

  oms.running = shouldContinue
  oms.waiting = true

  if (!oms.running) {
    oms.stats.endTime = Date.now()
    logStats()
  }
}

const validMatch = (bidOrder: Order, askOrder: Order): MatchValidity => {
  if (bidOrder.from === askOrder.from) {
    console.log('Unvalid case 1: same origin')
    return MatchValidity.BidAndAskUnvalid
  }
  if (Number(bidOrder.limitPrice) < Number(askOrder.price)) {
    console.log('Unvalid case 2: pricing invalid')
    return MatchValidity.AskUnvalid // Favors buyers
  }
  if (orderExpired(bidOrder)) {
    console.log('Unvalid case 3: bid expired')
    return MatchValidity.BidUnvalid
  }
  if (orderExpired(askOrder)) {
    console.log('Unvalid case 4: ask expired')
    return MatchValidity.AskUnvalid
  }
  if (oms.stale.has(bidOrder.id)) {
    console.log('Unvalid case 5: bid stale')
    return MatchValidity.BidUnvalid
  }
  if (oms.stale.has(askOrder.id)) {
    console.log('Unvalid case 6: ask stale')
    return MatchValidity.AskUnvalid
  }

  const bidQ = ethers.BigNumber.from(bidOrder.quantity)
  const askQ = ethers.BigNumber.from(askOrder.quantity)

  if (bidQ > askQ) {
    if (askQ.div(bidQ) < ethers.BigNumber.from(0.8)) {
      return MatchValidity.BidUnvalid
    }
  }

  if (askQ > bidQ) {
    if (bidQ.div(askQ) < ethers.BigNumber.from(0.8)) {
      return MatchValidity.AskUnvalid
    }
  }

  return MatchValidity.Valid
}

const peerOrderToChainOrder = (order: Order): ChainOrder => {
  return {
    id: order.id,
    from: order.from,
    tokenAddress: order.tokenAddress,
    tokenId: ethers.BigNumber.from(order.tokenId),
    orderType: order.orderType === OrderType.BUY ? 0 : 1,
    price: ethers.BigNumber.from(order.price),
    limitPrice: ethers.BigNumber.from(order.limitPrice),
    quantity: ethers.BigNumber.from(order.quantity),
    expiry: ethers.BigNumber.from(order.expiry),
    signature: order.signature,
  }
}

const determinePrice = (bidOrder: ChainOrder, askOrder: ChainOrder): ethers.BigNumber => {
  return askOrder.price
}

const determineQuantity = (bidOrder: ChainOrder, askOrder: ChainOrder): ethers.BigNumber => {
  if (bidOrder.quantity.lte(askOrder.quantity)) {
    return bidOrder.quantity
  } else {
    return askOrder.quantity
  }
}

const matchOrder = async (
  delegatedExchangeContract: ethers.Contract,
  bidOrder: Order,
  askOrder: Order,
): Promise<void> => {
  const bidContractOrder = peerOrderToChainOrder(bidOrder)
  const askContractOrder = peerOrderToChainOrder(askOrder)

  const nonce = oms.signerNonce
  oms.signerNonce += 1

  const price = determinePrice(bidContractOrder, askContractOrder)
  const quantity = determineQuantity(bidContractOrder, askContractOrder)

  try {
    // const tx = await delegatedExchangeContract.executeOrder(
    //   bidContractOrder,
    //   askContractOrder,
    //   price,
    //   quantity,
    //   ethers.utils.randomBytes(32),
    //   {
    //     nonce: nonce,
    //   },
    // )
    // await tx.wait()
    postMessage(['order-match', bidOrder.id, askOrder.id])
    oms.stats.success += 1
  } catch (error) {
    oms.stale.add(bidOrder.id)
    oms.stale.add(askOrder.id)
    postMessage(['order-rejection', bidOrder.id, askOrder.id])
    oms.stats.fail += 1
  }
}

const sendToOverflow = (order: Order): void => {
  oms.overflow.push(order)
}

const resetOverflow = () => {
  for (const order of oms.overflow) {
    const tokenIdentifier = getTokenIdentifier(order)

    if (!orderExpired(order) && !oms.stale.has(order.id)) {
      switch (order.orderType) {
        case OrderType.BUY:
          oms.orderbook.get(tokenIdentifier)?.bid.enqueue(order)
        case OrderType.SELL:
          oms.orderbook.get(tokenIdentifier)?.ask.enqueue(order)
      }
    }
  }
}
