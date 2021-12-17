import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMatchedOrders, IOrders, IValidators } from "../../db";
import { RootState } from "../Store";

interface OrdersState {
  orders: IOrders[];
  matchedOrders: IMatchedOrders[];
  validators: IValidators[];
  validatorListen: boolean;
}

const initialState: OrdersState = {
  orders: [],
  matchedOrders: [],
  validators: [],
  validatorListen: false
};
export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<IOrders>) => {
      state.orders.push(action.payload);
    },
    removeOrder: (state, action: PayloadAction<IOrders>) => {
      state.orders.push(action.payload);
    },
    addMatchedOrder: (state, action: PayloadAction<IMatchedOrders>) => {
      state.matchedOrders.push(action.payload);
    },
    removeMatchedOrder: (state, action: PayloadAction<IMatchedOrders>) => {
      state.matchedOrders.push(action.payload);
    },
    addValidator: (state, action: PayloadAction<IValidators>) => {
      state.validators.push(action.payload);
    },
    removeValidator: (state, action: PayloadAction<IValidators>) => {
      state.validators.push(action.payload);
    },
    toggleValidator: (state, action: PayloadAction<boolean>) => {
      state.validatorListen = action.payload;
    }
  },
});

export const {
  addOrder,
  addMatchedOrder,
  addValidator,
  removeMatchedOrder,
  removeOrder,
  removeValidator,
  toggleValidator
} = ordersSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;

export const selectMatchedOrders = (state: RootState) =>
  state.orders.matchedOrders;

export const selectValidators = (state: RootState) => state.orders.validators;

export const selectValidatorListen = (state: RootState) => state.orders.validatorListen;

export default ordersSlice.reducer;
