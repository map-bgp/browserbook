import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../Store"

interface EthersState {
  accounts: Array<string>
}

const initialState: EthersState = {
  accounts: [],
}

export const ethersSlice = createSlice({
  name: "ethers",
  initialState,
  reducers: {
    setAccounts: (
      state,
      action: PayloadAction<Array<string>>
    ) => {
      state.accounts = action.payload
    },
  },
})

export const { setAccounts } = ethersSlice.actions

export const selectIsConnected = (state: RootState): boolean => state.ethers.accounts.length !== 0
export const selectAccounts = (state: RootState): Array<string> => state.ethers.accounts

export default ethersSlice.reducer