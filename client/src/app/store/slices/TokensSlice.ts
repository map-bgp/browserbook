import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { queryImportedTokens, queryTokenContractEvent, queryTokens } from '../../oms/Queries'
import { createToken, createTokenContract, transferToken } from '../../oms/Chain'
import { CreateTokenOptions, Token, TokenContract, TokenType, TransferTokenOptions } from '../../Types'
import { RootState } from '../Store'
import { selectAccountData } from './EthersSlice'
import { selectOrders } from './PeerSlice'

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

export const createTokenContractThunk = createAsyncThunk(
  'tokens/createTokenContract',
  async (uri: string, thunkAPI: any): Promise<void> => {
    await createTokenContract(uri)
  },
)

export const getTokenContract = createAsyncThunk(
  'tokens/getTokenContract',
  async (ownerAddress: string, thunkAPI: any): Promise<TokenContract | null> => {
    return await queryTokenContractEvent(ownerAddress)
  },
)

export const createTokenThunk = createAsyncThunk(
  'tokens/createToken',
  async (options: CreateTokenOptions, thunkAPI: any): Promise<void> => {
    await createToken(options)
  },
)

export const getTokens = createAsyncThunk(
  'tokens/getTokens',
  async (options, thunkAPI: any): Promise<Array<Token>> => {
    const { primaryAccount } = selectAccountData(thunkAPI.getState())
    const contractAddress = selectTokenContract(thunkAPI.getState())?.address

    const importedTokens = !!primaryAccount ? await queryImportedTokens(primaryAccount) : []

    const ownTokens =
      !!primaryAccount && !!contractAddress ? await queryTokens(primaryAccount, contractAddress) : []

    return [...ownTokens, ...importedTokens]
  },
)

export const transferTokenThunk = createAsyncThunk(
  'tokens/transferToken',
  async (options: TransferTokenOptions, thunkAPI: any): Promise<void> => {
    await transferToken(options)
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
      .addCase(getTokenContract.fulfilled, (state, action) => {
        state.tokenContract = action.payload
      })
      .addCase(getTokens.fulfilled, (state, action) => {
        state.tokens = action.payload
      })
      .addCase(createTokenContractThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createTokenContractThunk.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(createTokenContractThunk.rejected, (state) => {
        state.status = 'idle'
      })
      .addCase(createTokenThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createTokenThunk.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(createTokenThunk.rejected, (state) => {
        state.status = 'idle'
      })
      .addCase(transferTokenThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(transferTokenThunk.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(transferTokenThunk.rejected, (state) => {
        state.status = 'idle'
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

// This needs to be refactored immediately, as returns third party tokens as well
export const selectTokenById = (
  state: RootState,
  tokenAddress: string,
  tokenId: string,
): Token | null => {
  const token = state.tokens.tokens.find(
    (token) => token.contract.address === tokenAddress && token.id === tokenId,
  )
  if (token === undefined) {
    return null
  }
  return token
}

export const selectTokensFromCurrentOrders = (state: RootState): Map<string, Token> => {
  const tokens = new Map<string, Token>()
  const orders = selectOrders(state)

  for (const order of orders) {
    const token = state.tokens.tokens.find(
      (token) => token.id === order.tokenId && token.contract.address === order.tokenAddress,
    )

    if (!!token) {
      tokens.set(order.id, token)
    }
  }
  return tokens
}

export const selectNumberFungibleTokens = (state: RootState): number =>
  state.tokens.tokens.filter((token) => token.type === TokenType.Fungible).length
export const selectNumberNonFungibleTokens = (state: RootState): number =>
  state.tokens.tokens.filter((token) => token.type === TokenType.NonFungible).length

export default tokensSlice.reducer
