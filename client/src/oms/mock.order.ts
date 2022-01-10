import { IOrders, ActionType, Tokens } from "./matching"

export const OrderA: IOrders = {
  from: "0x12",
  tokenS: Tokens.tokenA,
  tokenB: Tokens.tokenB,
  actionType: ActionType.Market,
  amountS: 4,
  amountB: 4,
  orderFrom: 786786,
  created: "1636288913",
  id: "12",
}
export const OrderB: IOrders = {
  from: "0x13",
  tokenS: Tokens.tokenB,
  tokenB: Tokens.tokenA,
  actionType: ActionType.Market,
  amountS: 4,
  amountB: 4,
  orderFrom: 23543543,
  created: "1636289212",
  id: "14",
}

export const OrderC: IOrders = {
  from: "0x14",
  tokenS: Tokens.tokenA,
  tokenB: Tokens.tokenB,
  actionType: ActionType.Market,
  amountS: 5,
  amountB: 5,
  orderFrom: 786786,
  created: "1636288913",
  id: "12",
}
export const OrderD: IOrders = {
  from: "0x15",
  tokenS: Tokens.tokenB,
  tokenB: Tokens.tokenA,
  actionType: ActionType.Market,
  amountS: 5,
  amountB: 5,
  orderFrom: 23543543,
  created: "1636289212",
  id: "14",
}
