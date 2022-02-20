import { ethers } from 'ethers'
import { NonceManager } from '@ethersproject/experimental'
import { PriorityQueue } from 'typescript-collections'
import { ContractMetadata, ContractName } from '../chain/ContractMetadata'
import { Order, OrderType } from '../p2p/protocol_buffers/gossip_schema'
import { db } from '../store/globals/db'
import { OrderStatus } from '../Types'

enum MatchValidity {
  Valid = 'VALID',
  BidUnvalid = 'BID_UNVALID',
  AskUnvalid = 'ASK_UNVALID',
  BidAndAskUnvalid = 'BID_AND_ASK_UNVALID',
}

type OMS = {
  running: boolean
  setRunning: (running: boolean) => void
  orderbook: Map<string, { bid: PriorityQueue<Order>; ask: PriorityQueue<Order> }>
  overflow: Array<Order>
  signerNonce: number
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
  setRunning: (running: boolean) => (oms.running = running),
  orderbook: new Map(),
  overflow: [],
  signerNonce: 0,
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

  if (e.data[0] === 'stop') {
    oms.running = false
  }
}

const start = async (signerAddress: string, decryptedSignerKey: string) => {
  oms.setRunning(true)

  const provider = ethers.getDefaultProvider('http://localhost:8545')
  const signer = new ethers.Wallet(decryptedSignerKey, provider)
  oms.signerNonce = await provider.getTransactionCount(signerAddress)
  // const nonceManager = new NonceManager(signer)

  const contractMetadata = ContractMetadata[ContractName.Exchange]

  if (!hasOwnProperty(contractMetadata, 'address')) {
    throw new Error('Contract address not found')
  }

  const address = contractMetadata.address
  const contractABI = contractMetadata.abi
  const delegatedExchangeContract = new ethers.Contract(address, contractABI, signer)

  await syncOrderBook()

  setInterval(() => {
    if (oms.running) {
      matchOrders(delegatedExchangeContract)
    }
  }, 10)

  setInterval(() => {
    if (oms.running) {
      resetOverflow()
    }
  }, 30000)
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

const matchOrders = async (delegatedExchangeContract: ethers.Contract) => {
  for (const [tokenIdentifier, { bid, ask }] of oms.orderbook) {
    if (bid.peek() === undefined || ask.peek() === undefined) {
      // console.log('No liquidity') // Send message to client
      oms.running = false
      continue
    }

    const highestBid = bid.peek() as Order // Safe as we check the undefined case above
    const lowestAsk = ask.peek() as Order

    console.log('Highest Bid and Lowest Ask', highestBid, lowestAsk)

    if (validMatch(highestBid, lowestAsk) === MatchValidity.Valid) {
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

const validMatch = (bidOrder: Order, askOrder: Order): MatchValidity => {
  if (bidOrder.from === askOrder.from) {
    console.log('Unvalid case 1: same origin')
    return MatchValidity.BidAndAskUnvalid
  }
  if (Number(bidOrder.limitPrice) < Number(askOrder.limitPrice)) {
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

  return MatchValidity.Valid
}

const mapOrderToContractOrder = (order: Order) => {
  return {
    id: order.id,
    from: order.from,
    tokenAddress: order.tokenAddress,
    tokenId: Number(order.tokenId),
    orderType: order.orderType === OrderType.BUY ? 0 : 1,
    price: ethers.BigNumber.from(order.price),
    limitPrice: ethers.BigNumber.from(order.limitPrice),
    quantity: ethers.BigNumber.from(order.quantity),
    expiry: ethers.BigNumber.from(order.expiry),
    signature: order.signature,
  }
}

const matchOrder = async (
  delegatedExchangeContract: ethers.Contract,
  bidOrder: Order,
  askOrder: Order,
): Promise<void> => {
  const bidContractOrder = mapOrderToContractOrder(bidOrder)
  const askContractOrder = mapOrderToContractOrder(askOrder)

  console.log('Matching Order with nonce', oms.signerNonce)
  const nonce = oms.signerNonce
  oms.signerNonce += 1

  const tx = await delegatedExchangeContract.executeOrder(bidContractOrder, askContractOrder, {
    nonce: nonce,
  })
  await tx.wait()

  postMessage(['order-match', bidOrder.id, askOrder.id])
}

const sendToOverflow = (order: Order): void => {
  oms.overflow.push(order)
}

const resetOverflow = () => {
  for (const order of oms.overflow) {
    const tokenIdentifier = getTokenIdentifier(order)

    switch (order.orderType) {
      case OrderType.BUY:
        oms.orderbook.get(tokenIdentifier)?.bid.enqueue(order)
      case OrderType.SELL:
        oms.orderbook.get(tokenIdentifier)?.ask.enqueue(order)
    }
  }
}

// Get the initial Orders [X]
// Organize by token id [X]
// Sort and then match up queues [X]
// Prune the orderbook upon receiving a match message from 'another' validator [ ]
// Determine if orders are a valid match [X]
// If they are, match them [X]
// If they aren't send one/both to an overflow buffer where they can be temporarily stored [X]
// If there is a match, send it to the chain [X]
// Send a message to the peer that a match has been achieved [ ]
// Periodically re-incorporate overflow buffer orders [X]
// Check signature validity [ ]
