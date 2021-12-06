import {configureStore} from '@reduxjs/toolkit'
import peerReducer from './slices/PeerSlice'
import orderbookReducer from './slices/OrderbookSlice'
import ethersReducer from './slices/EthersSlice'
import tokenReducer from './slices/TokenSlice'

export const store = configureStore({
  reducer: {
    peer: peerReducer,
    orderbook: orderbookReducer,
    ethers: ethersReducer,
    token: tokenReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch