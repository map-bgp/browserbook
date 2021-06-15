package order

type Action int
type OrderType int

const (
  _ Action = iota
  BID
  ASK
)

const (
  _ OrderType = iota
  LIMIT
)

type Order struct{
  Action Action
  OrderType OrderType
  Price float64
  Quantity float64
}

func InitOrder(action Action, orderType OrderType, price float64, quantity float64) *Order {
  newOrder := Order{Action: action, OrderType: orderType, Price: price, Quantity: quantity}
  return &newOrder
}

func (s Action) String() string {
  strings := [...]string{"BID", "ASK"}

  if s < BID || s > ASK {
    return "UNKNOWN"
  }

  // Offset for throwaway
  return strings[s - 1]
}

func (s OrderType) String() string {
  strings := [...]string{"LIMIT"}

  if s < LIMIT || s > LIMIT {
    return "UNKNOWN"
  }

  // Offset for throwaway
  return strings[s - 1]
}
