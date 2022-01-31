import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Token, TokenContract, TokenType } from '../../Types'
import type { RootState } from '../Store'

type TokensState = {
  tokenContract: TokenContract | null
  tokenIds: Array<string>
  tokens: Array<Token>
}

const initialState: TokensState = {
  tokenContract: null,
  tokenIds: [],
  tokens: [],
}

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokenContract: (state, action: PayloadAction<TokenContract>) => {
      state.tokenContract = action.payload
    },
    setTokenIds: (state, action: PayloadAction<Array<string>>) => {
      state.tokenIds = action.payload
    },
    setTokens: (state, action: PayloadAction<Array<Token>>) => {
      state.tokens = action.payload
    },
  },
})

export const { setTokenContract, setTokenIds, setTokens } = tokensSlice.actions

export const selectTokenContract = (state: RootState): TokenContract | null => state.tokens.tokenContract
export const selectTokenIds = (state: RootState): Array<string> => state.tokens.tokenIds
export const selectTokens = (state: RootState): Array<Token> => state.tokens.tokens

export const selectNumberFungibleTokens = (state: RootState): number =>
  state.tokens.tokens.filter((token) => token.type === TokenType.Fungible).length

export const selectNumberNonFungibleTokens = (state: RootState): number =>
  state.tokens.tokens.filter((token) => token.type === TokenType.NonFungible).length

export default tokensSlice.reducer
