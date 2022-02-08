import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../Store'

type EthersState = {
  accounts: Array<string>
  encryptionKey: string | null
}

const initialState: EthersState = {
  accounts: [],
  encryptionKey: null,
}

export const ethersSlice = createSlice({
  name: 'ethers',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Array<string>>) => {
      state.accounts = action.payload
    },
    setEncryptionKey: (state, action: PayloadAction<string>) => {
      state.encryptionKey = action.payload
    },
  },
})

export const { setAccounts, setEncryptionKey } = ethersSlice.actions

export const selectTokenStatus = (state: RootState) => state.tokens.status

export const selectIsConnected = (state: RootState): boolean => state.ethers.accounts.length !== 0
export const selectAccounts = (state: RootState): Array<string> => state.ethers.accounts
// Would like to use the optional type here
export const selectPrimaryAccount = (state: RootState): string | null =>
  state.ethers.accounts.length !== 0 ? state.ethers.accounts[0] : null

export const selectAccountData = (state: RootState) => ({
  isConnected: selectIsConnected(state),
  accounts: selectAccounts(state),
  primaryAccount: selectPrimaryAccount(state),
})

export const selectEncryptionKey = (state: RootState): string | null => state.ethers.encryptionKey

export default ethersSlice.reducer
