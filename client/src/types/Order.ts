import {RadioObject} from "../components/elements/inputs/Radio";
import {SelectObject} from "../components/elements/inputs/Select";

export type Order = {
  type: string;
  price: number;
  quantity: number;
}

export const OrderTypes: RadioObject[] = [
  {
    id: 1,
    value: "BID",
    display: "Bid"
  },
  {
    id: 2,
    value: "ASK",
    display: "Ask"
  }
]

export const OrderActions: SelectObject[] = [
  { id: 1, name: 'Market Order' },
  { id: 2, name: 'Limit Order' },
  { id: 3, name: 'Fill or Kill' },
  { id: 4, name: 'Yolo' },
]

export enum OrderType {
  Market = "Market",
  Limit = "Limit",
}