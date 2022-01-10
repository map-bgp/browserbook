export enum Tokens {
  tokenA = "TokenA",
  tokenB = "TokenB",
  tokenC = "TokenC",
}

export enum ActionType {
  Market = "Market",
  Limit = "Limit",
}

export interface IOrders {
  id?: string
  tokenS: Tokens
  tokenB: Tokens
  orderType: string
  actionType: ActionType
  amountB: number
  amountS: number
  orderFrom: number
  from: string
  status: string
  created: string
}
