import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers as ethersLib } from 'ethers'
import { queryValidatorSigner } from '../../oms/Queries'
import { createAndLoadEncryptedSigner } from '../../oms/ValidatorService'
import type { RootState } from '../Store'

type SignerState = {
  status: 'idle' | 'loading'
  signerAddress: string | null
  encryptedSignerKey: string | null
  signerBalance: string | null
}

const initialState: SignerState = {
  status: 'idle',
  signerAddress: null,
  encryptedSignerKey: null,
  signerBalance: null,
}

export const initializeSigner = createAsyncThunk(
  'validator/initializeSigner',
  async (options: { primaryAccount: string; etherDeposit: string }, thunkAPI: any): Promise<void> => {
    await createAndLoadEncryptedSigner(options.primaryAccount, options.etherDeposit)
    await thunkAPI.dispatch(getValidatorSigner(options.primaryAccount))
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
  }> => {
    if (!!primaryAccount) {
      return queryValidatorSigner(primaryAccount)
    } else {
      return { signerAddress: null, encryptedSignerKey: null, signerBalance: null }
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

export const { setSignerAddress, setEncryptedSignerKey } = signerSlice.actions

export const selectValidatorStatus = (state: RootState) => state.validator.status

export const selectSignerAddress = (state: RootState) => state.validator.signerAddress
export const selectEncryptedSignerKey = (state: RootState) => state.validator.encryptedSignerKey
export const selectSignerBalance = (state: RootState) => state.validator.signerBalance

export const selectSignerData = (state: RootState) => ({
  signerAddress: selectSignerAddress(state),
  encryptedSignerKey: selectEncryptedSignerKey(state),
  signerBalance: selectSignerBalance(state),
})

export default signerSlice.reducer
