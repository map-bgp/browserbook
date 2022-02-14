// @ts-ignore
import { MinQueue } from 'heapify'

onmessage = (e: Event) => {
  // console.log('Message received from main script')
  setTimeout(() => postMessage({ transactions: 100, commited: 50 }), 5000)
  const queue = new MinQueue(32)

  postMessage(queue)
}
