package main

import "fmt"
import "github.com/blueslurpee/browserbook/queue"
import "github.com/blueslurpee/browserbook/order"

func main() {
  q := queue.InitQueue()

  for i := 0; i < 10; i++ {
    order := &order.Order{Action: 1, Type: 1, Price: 45.23, Quantity: 4.1}
    q.Enqueue(order)
  }

  for q.IsEmpty() != true {
    fmt.Println(q.Dequeue())
  }
}
