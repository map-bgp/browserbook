package main

import "fmt"
import "errors"
import "github.com/blueslurpee/browserbook/queue"
import "github.com/blueslurpee/browserbook/order"
import "syscall/js"

var bidq = queue.InitBidQueue()
var askq = queue.InitAskQueue()

func selectQueue(qType int) (*queue.Queue, error) {
  var q *queue.Queue

  if qType < queue.BID || qType > queue.ASK {
    return nil, errors.New("Invalid queue type")
  }

  if qType == queue.BID {
    q = bidq
  } else {
    q = askq
  }

  return q, nil
}

func enqueueWrapper() js.Func {
  enqueueFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
    if len(args) != 1 {
      return "Invalid number of arguments provided"
    }

    q, err := selectQueue(args[0].Int())

    if err != nil {
      return "Invalid queue type"
    }

    q.Enqueue(&order.Order{})
    return nil
  })

  return enqueueFunc
}

func isEmptyWrapper() js.Func {
  isEmptyFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
      if len(args) != 5 {
        return "Invalid number of arguments provided"
      }

      q, err := selectQueue(args[0].Int())

      if err != nil {
        return "Invalid queue type"
      }

      action := args[1]
      oType := args[2]
      price := args[3]
      qty := args[4]

      return q.IsEmpty()
    })

  return isEmptyFunc
}

func main() {
  fmt.Println("Go Web Assembly")
  js.Global().Set("isEmpty", isEmptyWrapper())
  js.Global().Set("enqueue", enqueueWrapper())
  <-make(chan bool)
}
  // for i := 0; i < 10; i++ {
  //   new_order := order.InitOrder(queue.BID, order.LIMIT, rand.Float32() * 100, rand.Float32() * 100)
  //   bidq.Enqueue(new_order)
  // }
  //
  // for i := 0; i < 10; i++ {
  //   new_order := order.InitOrder(queue.ASK, order.LIMIT, rand.Float32() * 100, rand.Float32() * 100)
  //   askq.Enqueue(new_order)
  // }
  //
  // for !bidq.IsEmpty() {
  //   fmt.Println(bidq.Dequeue())
  // }
  //
  // for !askq.IsEmpty() {
  //   fmt.Println(askq.Dequeue())
  // }

  // func enqueueWrapper() js.Func {
  //   enqueueFunc := js.FuncOf(
  //     func(this js.Value, args []js.Value) interface{} {
  //       input := args[0].String()
  //       fmt.Printf("input %s\n", inputJSON)
  //       return 1
  //     })
  // }
