import { configureStore } from "@reduxjs/toolkit";
import ethersReducer from "./slices/EthersSlice";
import signerReducer from "./slices/SignerSlice";

export const store = configureStore({
  reducer: {
    ethers: ethersReducer,
    signer: signerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
