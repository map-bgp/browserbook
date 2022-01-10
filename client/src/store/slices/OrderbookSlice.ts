import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../Store"
import { Order } from "../../types/Order"
import { mockAskQueue, mockBidQueue } from "../../mocks/MockQueues"

interface OrderbookState {
  bidQueue: Order[]
  askQueue: Order[]
}

const initialState: OrderbookState = {
  bidQueue: mockBidQueue,
  askQueue: mockAskQueue,
}

export const orderbookSlice = createSlice({
  name: "orderbook",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      // We want the highest bid at the top
      const sortBid = (key) => (a, b) => a[key] < b[key] ? 1 : -1
      // We want the lowest ask at the bottom
      const sortAsk = (key) => (a, b) => a[key] < b[key] ? 1 : -1

      if (action.payload.type === "BID") {
        state.bidQueue.push(action.payload)
        state.bidQueue = state.bidQueue.slice().sort(sortBid("price"))
      } else if (action.payload.type === "ASK") {
        state.askQueue.push(action.payload)
        state.askQueue = state.askQueue.slice().sort(sortAsk("price"))
      }
    },
  },
})

export const { addOrder } = orderbookSlice.actions

export const selectBidQueue = (state: RootState) => state.orderbook.bidQueue
export const selectAskQueue = (state: RootState) => state.orderbook.askQueue

export default orderbookSlice.reducer
