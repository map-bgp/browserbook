import { Option, some, none } from 'fp-ts/Option'

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

export const selectIsConnected = (state: RootState): boolean => state.ethers.accounts.length !== 0
export const selectAccounts = (state: RootState): Array<string> => state.ethers.accounts
export const selectPrimaryAccount = (state: RootState): Option<string> =>
  state.ethers.accounts.length !== 0 ? some<string>(state.ethers.accounts[0]) : none

export const selectAccountData = (state: RootState) => ({
  isConnected: selectIsConnected(state),
  accounts: selectAccounts(state),
  primaryAccount: selectPrimaryAccount(state),
})

export const selectEncryptionKey = (state: RootState): string | null => state.ethers.encryptionKey

export default ethersSlice.reducer
