import { AsyncThunkPayloadCreator, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { queryImportedTokens, queryTokenContractEvent, queryTokens } from '../../oms/Queries'
import { IToken } from '../../p2p/db'
import { Token, TokenContract, TokenType } from '../../Types'
import type { RootState } from '../Store'
import { selectAccountData } from './EthersSlice'

type TokensState = {
  status: 'idle' | 'loading' | 'failed'
  tokenContract: TokenContract | null
  tokens: Array<Token>
}

const initialState: TokensState = {
  status: 'idle',
  tokenContract: null,
  tokens: [],
}

export const getTokenContract = createAsyncThunk(
  'tokens/getTokenContract',
  async (ownerAddress: string, thunkAPI: any): Promise<TokenContract | null> => {
    return await queryTokenContractEvent(ownerAddress)
  },
)

export const getTokens = createAsyncThunk(
  'tokens/getTokens',
  async (options, thunkAPI: any): Promise<Array<Token>> => {
    const tokens: Array<Token> = []
    const { primaryAccount } = selectAccountData(thunkAPI.getState())
    const contractAddress = selectTokenContract(thunkAPI.getState())?.address

    if (!!primaryAccount && !!contractAddress) {
      const importedTokens = await queryImportedTokens(primaryAccount)
      const ownTokens = await queryTokens(primaryAccount, contractAddress)

      return [...ownTokens, ...importedTokens]
    } else {
      return []
    }
  },
)

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
  extraReducers: (builder) => {
    builder
      .addCase(getTokenContract.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getTokenContract.fulfilled, (state, action) => {
        state.status = 'idle'
        state.tokenContract = action.payload
      })
      .addCase(getTokens.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getTokens.fulfilled, (state, action) => {
        state.status = 'idle'
        state.tokens = action.payload
      })
  },
})

export const { setTokenContract, setTokens } = tokensSlice.actions

export const selectTokenContract = (state: RootState): TokenContract | null => state.tokens.tokenContract
export const selectTokenContractAddress = (state: RootState): string | null =>
  !!state.tokens.tokenContract ? state.tokens.tokenContract.address : null

export const selectTokenIds = (state: RootState): Array<string> =>
  state.tokens.tokens.map((token: Token) => token.id)
export const selectTokens = (state: RootState): Array<Token> => state.tokens.tokens
export const selectOwnTokens = (state: RootState): Array<Token> =>
  state.tokens.tokens.filter((token) => token.own === true)
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
