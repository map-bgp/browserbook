// import { MinQueue } from 'heapify'
import { PriorityQueue } from 'typescript-collections'
import { Order, OrderType } from '../p2p/protocol_buffers/gossip_schema'
import { db } from '../store/globals/db'
import { OrderStatus } from '../Types'

let RUNNING = false
const orderBook: Map<string, { bid: PriorityQueue<Order>; ask: PriorityQueue<Order> }> = new Map()

const setRunning = (running: boolean) => {
  RUNNING = running
}

const getTokenIdentifier = (order: Order) => `${order.tokenAddress}/${order.tokenId}`

const orderExpired = (order: Order) => {
  return Number(order.expiry) < Date.now()
}

const logOrderbook = () => {
  console.log('The orderbook')
  for (const [key, val] of orderBook) {
    console.log(val.bid.size())
    console.log(val.ask.size())
  }
}

const bidComparator = (a: Order, b: Order) => (a.price > b.price ? -1 : 1)
const askComparator = (a: Order, b: Order) => (a.price < b.price ? -1 : 1)

onmessage = (e: MessageEvent) => {
  if (e.data[0] === 'start') {
    start().then(() => console.log('Started order validation'))
  }

  // If the worker is started, the peer pushes new orders here
  // and adds them to the DB
  if (e.data[0] === 'new-order') {
    addNewOrder(e.data[1])
  }

  if (e.data[0] === 'stop') {
    RUNNING = false
  }
}

// const validate = () => {
//   console.log('Reading Queue', queue.size)
// }

const start = async () => {
  setRunning(true)

  await syncOrderBook()
  setInterval(() => {
    if (RUNNING) {
      matchOrders()
    }
  }, 10)
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
    orderBook.set(
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

    if (!orderBook.get(tokenIdentifer)) {
      orderBook.set(tokenIdentifer, {
        bid: new PriorityQueue(bidComparator),
        ask: new PriorityQueue(askComparator),
      })
    }

    if (order.orderType === OrderType.BUY) {
      orderBook.get(getTokenIdentifier(order))!.bid.enqueue(order)
    } else {
      orderBook.get(getTokenIdentifier(order))!.ask.enqueue(order)
    }
  }
}

const matchOrders = async () => {
  for (const [tokenIdentifier, { bid, ask }] of orderBook) {
    if (bid.peek() === undefined || ask.peek() === undefined) {
      console.log('No liquidity')
      continue
    }

    const highestBid = bid.peek()
    const lowestAsk = ask.peek()

    console.log('Highest Bid and Lowest Ask', highestBid, lowestAsk)
  }
}

// Get the initial Orders [X]
// Organize by token id [X]
// Sort and then match up queues [X]
// Prune the orderbook upon receiving a match message from 'another' validator [ ]
// Determine if orders are a valid match [1/2]
// If they are, match them
// If they aren't send one/both to an overflow buffer where they can be temporarily stored
// If there is a match, send it to the chain
// Send a message to the peer that a match has been achieved
