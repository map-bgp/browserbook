package queue

import "fmt"
import "github.com/blueslurpee/browserbook/order"

type node struct{
  order order.Order
  next *node
}

type queue struct{
  size int
  head *node
  tail *node
}

func InitQueue() *queue{
  // Variables initialize to null values
  Q := queue{}
  return &Q
}

func (Q *queue) Enqueue(order *order.Order) {
  new_node := node{order: *order}

  if Q.tail == nil {
    Q.head = &new_node
    Q.tail = &new_node
  } else {
    Q.tail.next = &new_node
    Q.tail = &new_node
  }
}

func (Q *queue) Dequeue() *order.Order {
  if Q.head == nil {
    fmt.Println("Queue is empty")
    return &order.Order{}
  }

  if Q.head == Q.tail {
    t := Q.head.order
    Q.head = nil
    Q.tail = nil

    return &t
  }

  t := Q.head.order
  Q.head = Q.head.next

  return &t
}

func (Q *queue) IsEmpty() bool {
  if Q.head != nil {
    return false
  }
  return true
}

func (Q *queue) Print() {
  x := Q.head

  for x != nil {
    fmt.Println(x.order)
    x = x.next
  }
}
