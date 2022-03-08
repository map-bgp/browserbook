import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers as ethersLib } from 'ethers'
import { withdrawCommissions } from '../../oms/Chain'
import { queryValidatorSigner } from '../../oms/Queries'
import { createAndLoadEncryptedSigner } from '../../oms/ValidatorService'
import type { RootState } from '../Store'

type SignerState = {
  status: 'idle' | 'loading'
  signerAddress: string | null
  encryptedSignerKey: string | null
  signerBalance: string | null
  signerCommissionBalance: string | null
  tps: Array<number>
}

const initialState: SignerState = {
  status: 'idle',
  signerAddress: null,
  encryptedSignerKey: null,
  signerBalance: null,
  signerCommissionBalance: null,
  tps: [],
}

export const initializeSigner = createAsyncThunk(
  'validator/initializeSigner',
  async (options: { primaryAccount: string; etherDeposit: string }, thunkAPI: any): Promise<void> => {
    await createAndLoadEncryptedSigner(options.primaryAccount, options.etherDeposit)
    await thunkAPI.dispatch(getValidatorSigner(options.primaryAccount))
  },
)

export const depositIntoSigner = createAsyncThunk(
  'validator/depositIntoSigner',
  async (options: { primaryAccount: string; etherDeposit: string }, thunkAPI: any): Promise<void> => {
    await createAndLoadEncryptedSigner(options.primaryAccount, options.etherDeposit)
    await thunkAPI.dispatch(getValidatorSigner(options.primaryAccount))
  },
)

export const withdrawCommissionsThunk = createAsyncThunk(
  'validator/withdrawCommissions',
  async (primaryAccount: string, thunkAPI: any): Promise<void> => {
    await withdrawCommissions(primaryAccount)
  },
)

export const getValidatorSigner = createAsyncThunk(
  'validator/getSigner',
  async (
    primaryAccount: string,
  ): Promise<{
    signerAddress: string | null
    encryptedSignerKey: string | null
    signerBalance: string | null
    signerCommissionBalance: string | null
  }> => {
    if (!!primaryAccount) {
      return queryValidatorSigner(primaryAccount)
    } else {
      return {
        signerAddress: null,
        encryptedSignerKey: null,
        signerBalance: null,
        signerCommissionBalance: null,
      }
    }
  },
)

export const signerSlice = createSlice({
  name: 'signer',
  initialState,
  reducers: {
    setSignerAddress: (state, action: PayloadAction<string>) => {
      state.signerAddress = action.payload
    },
    setEncryptedSignerKey: (state, action: PayloadAction<string>) => {
      state.encryptedSignerKey = action.payload
    },
    pushTps: (state, action: PayloadAction<number>) => {
      state.tps.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getValidatorSigner.fulfilled, (state, action) => {
        state.signerAddress =
          action.payload.signerAddress !== ethersLib.constants.AddressZero
            ? action.payload.signerAddress
            : null
        state.encryptedSignerKey =
          action.payload.encryptedSignerKey !== '' ? action.payload.encryptedSignerKey : null
        state.signerBalance = action.payload.signerBalance
        state.signerCommissionBalance = action.payload.signerCommissionBalance
      })
      .addCase(initializeSigner.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(initializeSigner.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(initializeSigner.rejected, (state) => {
        state.status = 'idle'
      })
  },
})

export const { setSignerAddress, setEncryptedSignerKey, pushTps } = signerSlice.actions

export const selectValidatorStatus = (state: RootState) => state.validator.status

export const selectSignerAddress = (state: RootState) => state.validator.signerAddress
export const selectEncryptedSignerKey = (state: RootState) => state.validator.encryptedSignerKey
export const selectSignerBalance = (state: RootState) => state.validator.signerBalance
export const selectSignerCommissionBalance = (state: RootState) =>
  state.validator.signerCommissionBalance
export const selectTps = (state: RootState): number =>
  state.validator.tps.length > 0
    ? Number((state.validator.tps.reduce((a, b) => a + b) / state.validator.tps.length).toFixed(2))
    : 0

export const selectSignerData = (state: RootState) => ({
  signerAddress: selectSignerAddress(state),
  encryptedSignerKey: selectEncryptedSignerKey(state),
  signerBalance: selectSignerBalance(state),
  signerCommissionBalance: selectSignerCommissionBalance(state),
  tps: selectTps(state),
})

export default signerSlice.reducer
