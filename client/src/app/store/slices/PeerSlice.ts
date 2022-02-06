import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers as ethersLib } from 'ethers'
import { queryOrders } from '../../oms/Queries'
import { Order } from '../../p2p/protocol_buffers/gossip_schema'
import { WithStatus } from '../../Types'
import type { RootState } from '../Store'

// Define a type for the slice state
type PeerState = {
  status: 'loading' | 'idle'
  peerID: string | null
  numPeers: number
  orders: Array<WithStatus<Order>>
}

// Define the initial state using that type
const initialState: PeerState = {
  status: 'idle',
  peerID: null,
  numPeers: 0,
  orders: [],
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
  },
})

export const { setPeerId, incrementPeers, decrementPeers } = peerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPeerId = (state: RootState) => state.peer.peerID
export const selectNumPeers = (state: RootState) => state.peer.numPeers
export const selectOrders = (state: RootState) => state.peer.orders

export default peerSlice.reducer
