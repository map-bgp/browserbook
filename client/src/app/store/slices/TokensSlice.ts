import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { queryToken } from '../../chain/Queries'
import { Token, TokenContract, TokenType } from '../../Types'
import type { RootState } from '../Store'

type TokensState = {
  status: 'idle' | 'loading' | 'failed'
  tokenContract: TokenContract | null
  tokenIds: Array<string>
  tokens: Array<Token>
}

const initialState: TokensState = {
  status: 'idle',
  tokenContract: null,
  tokenIds: [],
  tokens: [],
}

export const getTokens = createAsyncThunk('tokens/getTokens', async (options, thunkAPI: any) => {
  const tokenIds = selectTokenIds(thunkAPI.getState())
  const contractAddress = selectTokenContract(thunkAPI.getState())?.address
  let tokens: Array<Token> = []
  console.log('Token Ids', tokenIds)

  if (!!contractAddress) {
    for (let i = 0; i < tokenIds.length; i++) {
      let token = await queryToken(tokenIds[i], contractAddress)
      tokens.push(token)
    }
  }
  return tokens
})

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
  extraReducers: (builder) => {
    builder
      .addCase(getTokens.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getTokens.fulfilled, (state, action) => {
        state.status = 'idle'
        state.tokens = action.payload
      })
  },
})

export const { setTokenContract, setTokenIds, setTokens } = tokensSlice.actions

export const selectTokenContract = (state: RootState): TokenContract | null => state.tokens.tokenContract
export const selectTokenIds = (state: RootState): Array<string> => state.tokens.tokenIds
export const selectTokens = (state: RootState): Array<Token> => state.tokens.tokens
export const selectTokenById = (state: RootState, tokenId: string): Token | null => {
  const token = state.tokens.tokens.find((token) => token.id === tokenId)
  if (token === undefined) {
    return null
  }
  return token
}

export const selectNumberFungibleTokens = (state: RootState): number =>
  state.tokens.tokens.filter((token) => token.type === TokenType.Fungible).length

export const selectNumberNonFungibleTokens = (state: RootState): number =>
  state.tokens.tokens.filter((token) => token.type === TokenType.NonFungible).length

export default tokensSlice.reducer
