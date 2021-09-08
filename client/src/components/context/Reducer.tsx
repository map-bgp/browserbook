export interface StateContext {
  node?: any,
  peerId?: string,
}

export enum ActionType {
  SET_NODE = 'SET_NODE',
  SET_PEER_ID = 'SET_PEER_ID',
}

export type Action = {
  type: ActionType.SET_NODE;
  payload: any;
} | {
  type: ActionType.SET_PEER_ID;
  payload: any;
}

export const Reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SET_NODE:
      return {...state, node: action.payload}
    case ActionType.SET_PEER_ID:
      return {...state, peerId: action.payload}
    default:
      throw new Error(`Invalid action type`)
  }
}