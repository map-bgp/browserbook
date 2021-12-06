import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../Store'

interface TokenState {
  tokens: string[],
}

const initialState: TokenState = {
  tokens: []
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<string[]>) => {
      state.tokens = action.payload
    },
  }
})

export const { setTokens } = tokenSlice.actions

export const selectTokens = (state: RootState) => state.token.tokens

export default tokenSlice.reducer