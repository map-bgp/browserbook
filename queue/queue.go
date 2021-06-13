package queue

import "fmt"
import "github.com/blueslurpee/browserbook/order"

// type node struct{
//   order order.Order
//   next *node
// }

type queue struct{
  size int
  curr int
  data []*order.Order
}

func InitQueue() *queue{
  // Variables initialize to null values
  return &queue{size: 0, curr: 0, data: make([]*order.Order, 0)}
}

func (Q *queue) IsEmpty() bool {
  if Q.size == 0 {
    return true
  }

  return false
}

func (Q *queue) Enqueue(order *order.Order) {
  Q.data = append(Q.data, order)

  Q.size++
}

func (Q *queue) Dequeue() *order.Order {
  if Q.IsEmpty() {
    fmt.Println("Queue is empty")
    return &order.Order{}
  }

  t := Q.data[Q.curr]

  Q.size--
  Q.curr++

  if(Q.curr > len(Q.data) / 2) {
    t := make([]*order.Order, len(Q.data) - Q.curr)
    copy(t, Q.data[Q.curr:])

    Q.data = t
    Q.curr = 0
  }

  return t
}

func(Q *queue) GetCap() int {
  return cap(Q.data)
}
