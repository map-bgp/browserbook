import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../Store"

interface EthersState {
  connected: boolean
  address: string | null | undefined
  resolved: boolean
}

const initialState: EthersState = {
  connected: false,
  address: null,
  resolved: false,
}

export const ethersSlice = createSlice({
  name: "ethers",
  initialState,
  reducers: {
    setEthersConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setEthersAddress: (
      state,
      action: PayloadAction<string | null | undefined>
    ) => {
      state.address = action.payload
    },
    setEthersResolved: (state, action: PayloadAction<boolean>) => {
      state.resolved = action.payload
    },
  },
})

export const { setEthersConnected, setEthersAddress, setEthersResolved } =
  ethersSlice.actions

export const selectEthersConnected = (state: RootState) =>
  state.ethers.connected

export const selectEthersAddress = (state: RootState) => {
  if (state.ethers.address == null) {
    return "Not Available"
  }
  return state.ethers.address
}

export const selectEthersResolved = (state: RootState) => state.ethers.resolved

export default ethersSlice.reducer
