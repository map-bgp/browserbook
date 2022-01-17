import { configureStore } from "@reduxjs/toolkit"
import ethersReducer from "./slices/EthersSlice"

export const store = configureStore({
  reducer: {
    ethers: ethersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch