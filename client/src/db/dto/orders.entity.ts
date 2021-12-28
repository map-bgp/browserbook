export enum TokensPrime {
    tokenA = "Token A",
    tokenB = "Token B",
    tokenC = "Token C",
  }

export enum OrderType  {
    Market = "Market",
    Limit = "Limit",
  }

export interface IOrders{
    id?: string,
    tokenFrom: TokensPrime,
    tokenTo: TokensPrime,
    orderType: OrderType,
    actionType: string,
    price: number,
    quantity: number,
    orderFrm: number,
    from: string,
    status: string,
    created: string,
}