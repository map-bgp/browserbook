import {configureStore} from '@reduxjs/toolkit'
import counterReducer from '../features/demo/counterSlice'
import orderbookReducer from '../features/orderbookSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    orderbook: orderbookReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch