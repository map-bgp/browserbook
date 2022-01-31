import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../Store'
import { Token } from '../../Token'
import { TokenContract } from '../../TokenContract'

type TokensState = {
  tokenContract: TokenContract | null
  tokens: Array<Token>
}

const initialState: TokensState = {
  tokenContract: null,
  tokens: [],
}

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokenContract: (state, action: PayloadAction<TokenContract>) => {
      state.tokenContract = action.payload
    },
    setTokens: (state, action: PayloadAction<Array<Token>>) => {
      state.tokens = action.payload
    },
  },
})

export const { setTokenContract, setTokens } = tokensSlice.actions

export const selectTokenContract = (state: RootState): TokenContract | null => state.tokens.tokenContract
export const selectTokens = (state: RootState): Array<Token> => state.tokens.tokens
export const selectTokenByAddress = (state: RootState, address: string): Token | null => {
  const res = selectTokens(state).find((e) => e.address === address)
  return res !== undefined ? res : null
}

export default tokensSlice.reducer
