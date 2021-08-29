import React, { useContext, useState, useReducer } from 'react'
import { Reducer, Action } from './reducer'

export interface StateContext {
  node?: any,
  peerId?: string,
}

export interface Store {
  state: StateContext;
  dispatch?: React.Dispatch<Action>;
}

const defaultState: StateContext = { node: null }

const AppContext = React.createContext<Store>({ state: defaultState });
export const useAppContext = () => useContext(AppContext)

export const StateProvider = ({ children }) => {
  // @ts-ignore
  const [state, dispatch] = useReducer(Reducer, defaultState)
  return <AppContext.Provider value={{ state, dispatch }} children={children} />
}