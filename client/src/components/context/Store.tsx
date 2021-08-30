import React, {useContext, useReducer} from 'react'
import {Action, Reducer} from './reducer'

export interface StateContext {
  node?: any,
  peerId?: string,
}

export interface Store {
  state: StateContext;
  setContext?: React.Dispatch<Action>;
}

const defaultState: StateContext = { node: null }

const AppContext = React.createContext<Store>({ state: defaultState });
export const useAppContext = () => useContext(AppContext)

export const StateProvider = ({ children }) => {
  // @ts-ignore
  const [state, setContext] = useReducer(Reducer, defaultState)
  return <AppContext.Provider value={{ state, setContext }} children={children} />
}