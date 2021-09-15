import React, {useContext, useReducer} from 'react'
import {Action, Reducer, StateContext} from './Reducer'

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