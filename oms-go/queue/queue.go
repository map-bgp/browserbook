package queue

import "fmt"
import "github.com/blueslurpee/browserbook/order"

const (
	_ = iota
	BID
	ASK
)

type Queue struct {
	size  int
	curr  int
	qtype int
	data  []*order.Order
}

func InitBidQueue() *Queue {
	return &Queue{size: 0, curr: 0, qtype: BID, data: make([]*order.Order, 0)}
}

func InitAskQueue() *Queue {
	return &Queue{size: 0, curr: 0, qtype: ASK, data: make([]*order.Order, 0)}
}

func (Q *Queue) IsEmpty() bool {
	if Q.size == 0 {
		return true
	}

	return false
}

// func (Q *Queue) heapify(i int, n int) {
//   p := i
//
//   left := (p*2) + 1
//   right := (p*2)+ 2
//
//   if left < n && Q.data[p].Price < Q.data[left].Price {
//     p = left
//   }
//   if right < n && Q.data[p].Price < Q.data[right].Price {
//     p = right
//   }
//
//   if p != i {
//     t := Q.data[p]
//     Q.data[p] = Q.data[i]
//     Q.data[i] = t
//
//     Q.heapify(p, n)
//   }
// }

func (Q *Queue) arrangePriority(i int) {
	p := (i - 1) / 2

	for i > 0 {
		if Q.qtype == BID && Q.data[i].Price > Q.data[p].Price {
			t := Q.data[i]
			Q.data[i] = Q.data[p]
			Q.data[p] = t

			i = p
			p = (i - 1) / 2
		} else if Q.qtype == ASK && Q.data[i].Price < Q.data[p].Price {
			t := Q.data[i]
			Q.data[i] = Q.data[p]
			Q.data[p] = t

			i = p
			p = (i - 1) / 2
		} else {
			break
		}
	}
}

func (Q *Queue) Enqueue(order *order.Order) {
	Q.data = append(Q.data, order)
	Q.size++

	Q.arrangePriority(Q.size - 1)
}

func (Q *Queue) Dequeue() *order.Order {
	if Q.IsEmpty() {
		fmt.Println("Queue is empty")
		return &order.Order{}
	}

	temp := Q.data[Q.curr]

	Q.size--
	Q.curr++

	if Q.curr > len(Q.data)/2 {
		t := make([]*order.Order, len(Q.data)-Q.curr)
		copy(t, Q.data[Q.curr:])

		Q.data = t
		Q.curr = 0
	}

	return temp
}
