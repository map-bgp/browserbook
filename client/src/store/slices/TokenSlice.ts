import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../Store'

interface TokenState {
  tokens: object[],
}

const initialState: TokenState = {
  tokens: []
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<object[]>) => {
      state.tokens = action.payload
    },
  }
})

export const { setTokens } = tokenSlice.actions

export const selectTokens = (state: RootState) => state.token.tokens

export default tokenSlice.reducer