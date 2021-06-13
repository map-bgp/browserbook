package order

type Action int
type OrderType int

const (
  _ Action = iota
  BUY
  SELL
)

const (
  _ OrderType = iota
  LIMIT
)

type Order struct{
  Action Action
  Type OrderType
  Price float32
  Quantity float32
}

func (s Action) String() string {
  strings := [...]string{"BUY", "SELL"}

  if s < BUY || s > SELL {
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
