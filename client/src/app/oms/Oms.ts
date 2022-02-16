// @ts-ignore
import { MinQueue } from 'heapify'

const queue = new MinQueue()

onmessage = (e: MessageEvent) => {
  if (e.data === 'start') {
    console.log('Starting')
    queue.push(1, 10)
    setInterval(validate, 500)
  }

  if (e.data === 'push') {
    queue.push(1, 10)
  }

  // if (e.data === 'stop')
}

const validate = () => {
  console.log('Reading Queue', queue.size)
}
