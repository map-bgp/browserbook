import { configureStore } from '@reduxjs/toolkit'
import ethersReducer from './slices/EthersSlice'
import signerReducer from './slices/SignerSlice'
import tokenReducer from './slices/TokensSlice'
import peerReducer from './slices/PeerSlice'

export const store = configureStore({
  reducer: {
    ethers: ethersReducer,
    signer: signerReducer,
    tokens: tokenReducer,
    peer: peerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
