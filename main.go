package main

import "fmt"
import "math/rand"
import "github.com/blueslurpee/browserbook/queue"
import "github.com/blueslurpee/browserbook/order"

func main() {
  q := queue.InitQueue()

  for i := 0; i < 10; i++ {
    order := order.InitOrder(1, 1, rand.Float32() * 100, rand.Float32() * 100)
    q.Enqueue(order)
  }

  for q.IsEmpty() != true {
    fmt.Println("Dequeueing:", q.Dequeue())
    fmt.Println(q.GetCap())
  }

  fmt.Println(q.IsEmpty())
}
