package queue

import "fmt"

type node struct{
  val int
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

func (Q *queue) enqueue(val int) {
  new := node{val: val}

  if Q.tail == nil {
    Q.head = &new
    Q.tail = &new
  } else {
    Q.tail.next = &new
    Q.tail = &new
  }
}

func (Q *queue) dequeue() int {
  if Q.head == Q.tail {
    t := Q.head.val
    Q.head = nil
    Q.tail = nil

    return t
  }

  t := Q.head.val
  Q.head = Q.head.next

  return t
}

func (Q *queue) printqueue() {
  x := Q.head

  for x != nil {
    fmt.Println(x)
    x = x.next
  }
}
