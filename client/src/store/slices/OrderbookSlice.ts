import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../Store'
import {Order} from "../../components/types/Order";

interface OrderbookState {
  bidQueue: Order[]
  askQueue: Order[]
}

const initialState: OrderbookState = {
  bidQueue: [],
  askQueue: []
}

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      if (action.payload.type === 'bid') {
        state.bidQueue.push(action.payload)
      }
      else if (action.payload.type === 'ask') {
        state.askQueue.push(action.payload)
      }
    }
  }
})

export const { addOrder } = orderbookSlice.actions

export const selectBidQueue = (state: RootState) => state.orderbook.bidQueue
export const selectAskQueue = (state: RootState) => state.orderbook.askQueue

export default orderbookSlice.reducer