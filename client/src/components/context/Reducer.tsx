export interface StateContext {
  node?: any;
  peerId?: any;
  p2pDb: any;
  eventBus: any;
}

export enum ActionType {
  SET_NODE = "SET_NODE",
  SET_PEER_ID = "SET_PEER_ID",
  SET_DB = "SET_DB",
  SET_EVENTEMITTER = "SET_EVENTEMITTER",
}

export type Action =
  | {
      type: ActionType.SET_NODE;
      payload: any;
    }
  | {
      type: ActionType.SET_PEER_ID;
      payload: any;
    }
  | {
      type: ActionType.SET_DB;
      payload: any;
    }
  | {
      type: ActionType.SET_EVENTEMITTER;
      payload: any;
    };

export const Reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SET_NODE:
      return { ...state, node: action.payload };
    case ActionType.SET_PEER_ID:
      return { ...state, peerId: action.payload };
    case ActionType.SET_DB:
      return { ...state, p2pDb: action.payload };
    case ActionType.SET_EVENTEMITTER:
        return { ...state, eventBus: action.payload };
    default:
      throw new Error(`Invalid action type`);
  }
};
