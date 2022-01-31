import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../Store'
import { Token } from '../../types/Token'

type TokensState = {
  tokens: Array<Token>
}

const initialState: TokensState = {
  tokens: [],
}

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Array<Token>>) => {
      state.tokens = action.payload
    },
  },
})

export const { setTokens } = tokensSlice.actions

export const selectTokens = (state: RootState): Array<Token> => state.tokens.tokens
export const selectTokenByAddress = (state: RootState, address: string): Token | null => {
  const res = selectTokens(state).find((e) => e.address === address)
  return res !== undefined ? res : null
}

export default tokensSlice.reducer
