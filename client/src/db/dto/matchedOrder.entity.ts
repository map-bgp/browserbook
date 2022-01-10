export interface IMatchedOrders {
  id?: string
  order1_id: string
  order2_id: string
  tokenFrom: string
  tokenTo: string
  orderType: string
  actionType: string
  price: number
  quantity: number
  orderFrm: number
  status: string
  created: string
}
