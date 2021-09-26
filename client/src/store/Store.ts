import {configureStore} from '@reduxjs/toolkit'
import peerReducer from './slices/PeerSlice'
import orderbookReducer from './slices/OrderbookSlice'

export const store = configureStore({
  reducer: {
    peer: peerReducer,
    orderbook: orderbookReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch