import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../Store'

// Define a type for the slice state
interface PeerState {
  peerID: string | null
  numPeers: number
}

// Define the initial state using that type
const initialState: PeerState = {
  peerID: null,
  numPeers: 0,
}

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
})

export const { setPeerId, incrementPeers, decrementPeers } = peerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPeerId = (state: RootState) => state.peer.peerID
export const selectNumPeers = (state: RootState) => state.peer.numPeers

export default peerSlice.reducer
