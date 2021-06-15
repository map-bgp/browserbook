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

func isEmptyWrapper() js.Func {
  isEmptyFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
      if len(args) != 1 {
        result := map[string] interface{} {
          "error": "Invalid number of arguments",
        }

        return result
      }

      q, err := selectQueue(args[0].Int())

      if err != nil {
        result := map[string] interface{} {
          "error": "Invalid queue type",
        }

        return result
      }

      return q.IsEmpty()
    })

  return isEmptyFunc
}

func enqueueWrapper() js.Func {
  enqueueFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
    if len(args) != 5 {
      result := map[string] interface{} {
        "error": "Invalid number of arguments",
      }

      return result
    }

    q, err := selectQueue(args[0].Int())

    if err != nil {
      result := map[string] interface{} {
        "error": "Invalid queue type",
      }

      return result
    }

    action := order.Action(args[1].Int())
    oType := order.OrderType(args[2].Int())
    price := args[3].Float()
    qty := args[4].Float()

    q.Enqueue(&order.Order{action, oType, price, qty})

    result := map[string] interface{} {
      "action": action.String(),
      "orderType": oType.String(),
      "price": price,
      "qty": qty,
    }

    return result
  })

  return enqueueFunc
}

func dequeueWrapper() js.Func {
  dequeueFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
    if len(args) != 1 {
      result := map[string] interface{} {
        "error": "Invalid number of arguments",
      }

      return result
    }

    q, err := selectQueue(args[0].Int())

    if err != nil {
      result := map[string] interface{} {
        "error": "Invalid queue type",
      }

      return result
    }

    order := q.Dequeue()

    result := map[string] interface{} {
      "action": order.Action.String(),
      "orderType": order.OrderType.String(),
      "price": order.Price,
      "qty": order.Quantity,
    }

    return result
  })

  return dequeueFunc
}

func getQueueWrapper() js.Func {
  getQueueWrapper := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
    if len(args) != 1 {
      result := map[string] interface{} {
        "error": "Invalid number of arguments",
      }

      return result
    }

    q, err := selectQueue(args[0].Int())

    if err != nil {
      result := map[string] interface{} {
        "error": "Invalid queue type",
      }

      return result
    }

    result := make([]interface{}, 0, 0)

    for !q.IsEmpty() {
      order := q.Dequeue()

      orderMap := map[string] interface{} {
        "action": order.Action.String(),
        "orderType": order.OrderType.String(),
        "price": order.Price,
        "qty": order.Quantity,
      }

      result = append(result, orderMap)
    }

    return result
  })

  return getQueueWrapper
}

func main() {
  fmt.Println("Go Web Assembly")
  js.Global().Set("isEmpty", isEmptyWrapper())
  js.Global().Set("enqueue", enqueueWrapper())
  js.Global().Set("dequeue", dequeueWrapper())
  js.Global().Set("getQueue", getQueueWrapper())
  <-make(chan bool)
}
