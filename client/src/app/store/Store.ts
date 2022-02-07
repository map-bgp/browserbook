import { configureStore } from '@reduxjs/toolkit'
import ethersReducer from './slices/EthersSlice'
import validatorReducer from './slices/ValidatorSlice'
import tokenReducer from './slices/TokensSlice'
import peerReducer from './slices/PeerSlice'

export const store = configureStore({
  reducer: {
    ethers: ethersReducer,
    validator: validatorReducer,
    tokens: tokenReducer,
    peer: peerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
