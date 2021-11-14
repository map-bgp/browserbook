import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../Store'

interface EthersState {
  connected: boolean,
  address: string | null | undefined
}

const initialState: EthersState = {
  connected: false,
  address: null,
}

export const ethersSlice = createSlice({
  name: 'ethers',
  initialState,
  reducers: {
    setEthersConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setEthersAddress: (state, action: PayloadAction<string | null | undefined>) => {
      state.address = action.payload
    },
  }
})

export const { setEthersConnected, setEthersAddress } = ethersSlice.actions

export const selectEthersActive = (state: RootState) => state.ethers.connected

export const selectEthersAddress = (state: RootState) => {
  if (state.ethers.address == null) {
    return "Not Available"
  }
  return state.ethers.address
}

export default ethersSlice.reducer