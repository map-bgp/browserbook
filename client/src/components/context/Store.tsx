import React, {useContext, useReducer} from "react";
import {Action, Reducer, StateContext} from "./Reducer";
import {P2PDB} from "../../db";
import EventEmitter from "events";

export interface Store {
  state: StateContext;
  setContext?: React.Dispatch<Action>;
}

const p2pDb = new P2PDB();
const eventBus = new EventEmitter();

const defaultState: StateContext = {
  node: null,
  p2pDb: p2pDb,
  eventBus: eventBus,
};

const AppContext = React.createContext<Store>({ state: defaultState });
export const useAppContext = () => useContext(AppContext);

export const StateProvider = ({ children }) => {
  // @ts-ignore
  const [state, setContext] = useReducer(Reducer, defaultState);
  return (
    <AppContext.Provider value={{ state, setContext }} children={children} />
  );
};
