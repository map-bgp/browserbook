package main

import "fmt"
import "math/rand"
import "github.com/blueslurpee/browserbook/queue"
import "github.com/blueslurpee/browserbook/order"

func main() {
  bidq := queue.InitBidQueue()
  askq := queue.InitAskQueue()

  for i := 0; i < 10; i++ {
    new_order := order.InitOrder(queue.BID, order.LIMIT, rand.Float32() * 100, rand.Float32() * 100)
    bidq.Enqueue(new_order)
  }

  for i := 0; i < 10; i++ {
    new_order := order.InitOrder(queue.ASK, order.LIMIT, rand.Float32() * 100, rand.Float32() * 100)
    askq.Enqueue(new_order)
  }

  for !bidq.IsEmpty() {
    fmt.Println(bidq.Dequeue())
  }

  for !askq.IsEmpty() {
    fmt.Println(askq.Dequeue())
  }
}
