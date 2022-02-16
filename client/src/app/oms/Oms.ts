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

onmessage = (e: MessageEvent) => {
  if (e.data === 'start') {
    console.log('Starting')
    start().then(() => console.log('Started order validation'))
  }

  // If the worker is started, the peer pushes new orders here
  // and adds them to the DB
  if (e.data === 'new-order') {
    console.log('Received new order')
  }

  if (e.data === 'stop') {
    RUNNING = false
  }
}

// const validate = () => {
//   console.log('Reading Queue', queue.size)
// }

const start = async () => {
  setRunning(true)

  syncOrderBook()
  setInterval(() => {
    if (RUNNING) console.log('Running')
  }, 10)
}

const syncTokenOrders = async (tokenAddress: string, tokenId: string) => {
  const bid: PriorityQueue<Order> = new PriorityQueue((a, b) => (a.price > b.price ? -1 : 1))
  const ask: PriorityQueue<Order> = new PriorityQueue((a, b) => (a.price < b.price ? -1 : 1))

  const tokenOrders = await db.orders.where({ tokenAddress: tokenAddress, tokenId: tokenId }).toArray()

  tokenOrders
    .filter((order) => order.orderType === OrderType.BUY && order.status === OrderStatus.Pending)
    .forEach((order) => bid.enqueue(order))

  tokenOrders
    .filter((order) => order.orderType === OrderType.SELL && order.status === OrderStatus.Pending)
    .forEach((order) => ask.enqueue(order))

  return {
    bid,
    ask,
  }
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

  console.log('Initial Order Book', orderBook)
}

// Get the initial Orders [X]
// Organize by token id [X]
// Sort and then match up queues [X]
// Match the orders if they are not already matched - add filter [X]
// Notify the peer process which sends them to the chain? Or send here perhaps
