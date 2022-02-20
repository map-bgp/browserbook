import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers as ethersLib } from 'ethers'
import { depositEther } from '../../oms/Chain'
import { queryBalance, queryOrders } from '../../oms/Queries'
import { Order } from '../../p2p/protocol_buffers/gossip_schema'
import { OrderStatus, WithStatus } from '../../Types'
import type { RootState } from '../Store'

// Define a type for the slice state
type PeerState = {
  status: 'loading' | 'idle'
  peerID: string | null
  numPeers: number
  orders: Array<WithStatus<Order>>
  balance: string
}

// Define the initial state using that type
const initialState: PeerState = {
  status: 'idle',
  peerID: null,
  numPeers: 0,
  orders: [],
  balance: '0',
}

export const getAllOrders = createAsyncThunk(
  'peer/getAllOrders',
  async (): Promise<Array<WithStatus<Order>>> => {
    const orders = await queryOrders()
    return orders.map((order) => ({
      ...order,
      price: ethersLib.utils.formatEther(order.price),
      limitPrice: ethersLib.utils.formatEther(order.limitPrice),
      quantity: ethersLib.utils.formatEther(order.quantity),
    }))
  },
)

// filterAddress is not an optional parameter as we need to ensure
// clients are only looking at their own orders, or at least on
// the actual screen
export const getOwnOrders = createAsyncThunk(
  'peer/getOwnOrders',
  async (filterAddress: string): Promise<Array<WithStatus<Order>>> => {
    const orders = await queryOrders(filterAddress)
    return orders.map((order) => ({
      ...order,
      price: ethersLib.utils.formatEther(order.price),
      limitPrice: ethersLib.utils.formatEther(order.limitPrice),
      quantity: ethersLib.utils.formatEther(order.quantity),
    }))
  },
)

export const getBalance = createAsyncThunk(
  'peer/getBalance',
  async (address: string): Promise<string> => {
    return await queryBalance(address)
  },
)

export const depositEtherThunk = createAsyncThunk(
  'peer/depositEther',
  async (options: { amount: string; address: string }, thunkAPI: any): Promise<void> => {
    await depositEther(options.amount)
    thunkAPI.dispatch(getBalance(options.address))
  },
)

export const peerSlice = createSlice({
  name: 'peer',
  initialState,
  reducers: {
    setPeerId: (state, action: PayloadAction<string>) => {
      state.peerID = action.payload
    },
    incrementPeers: (state) => {
      state.numPeers += 1
    },
    decrementPeers: (state) => {
      state.numPeers -= 1
    },
    setOrderStatus: (
      state,
      action: PayloadAction<{ id: string; from: string; status: OrderStatus }>,
    ) => {
      const order = state.orders.find(
        ({ id, from }) => id === action.payload.id && from === action.payload.from,
      )

      if (!!order) {
        order.status = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOwnOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getOwnOrders.fulfilled, (state, action) => {
        state.status = 'idle'
        state.orders = action.payload
      })
      .addCase(getAllOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.status = 'idle'
        state.orders = action.payload
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        ;(state.status = 'idle'), (state.balance = action.payload)
      })
      .addCase(depositEtherThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(depositEtherThunk.fulfilled, (state) => {
        state.status = 'idle'
      })
      .addCase(depositEtherThunk.rejected, (state) => {
        state.status = 'idle'
      })
  },
})

export const { setPeerId, incrementPeers, decrementPeers, setOrderStatus } = peerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPeerId = (state: RootState) => state.peer.peerID
export const selectNumPeers = (state: RootState) => state.peer.numPeers
export const selectOrders = (state: RootState) => state.peer.orders
export const selectBalance = (state: RootState) => state.peer.balance

export default peerSlice.reducer
