import "tailwindcss/tailwind.css"

import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";

import {ChainId, Config, DAppProvider} from "@usedapp/core";
import {initNode} from "../p2p/core"
import Header from './Header'

import {getCurrent} from "./utils/getCurrent";
import Content from './Content'
import {useAppContext} from "./store/Store";
import {ActionType} from "./store/Reducer";

declare const window: any;

const config: Config = {
  readOnlyChainId: ChainId.Mumbai,
  readOnlyUrls: {
    [ChainId.Mumbai]: "https://polygon-mumbai.infura.io/v3/e8c847c8a43a4f9b95ac3182349c0932"
  }
}

export const App = () => {

  const location = useLocation()
  const { state, dispatch } = useAppContext()

  const loadNode = async() => {
    await initNode().then(node => {
      if (dispatch) {
        dispatch({
          type: ActionType.SET_NODE,
          payload: node
        })

        dispatch({
          type: ActionType.SET_PEER_ID,
          payload: node.peerId.toB58String()
        })
      }
    })
  }

  useEffect(() => {
    loadNode().catch(error => console.log(error))
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      key: 'dashboard'
    },
    {
      name: 'Market',
      key: 'market'
    },
    {
      name: 'Portfolio',
      key: 'portfolio'
    },
    {
      name: 'Assets',
      key: 'assets'
    },
    {
      name: 'How it Works',
      key: 'how-it-works'
    },
  ]

  return (
      <div className="min-h-screen bg-gray-100">
        <DAppProvider config={config}>
          <Header navigation={navigation} current={getCurrent(location, navigation)}/>
          <Content current={getCurrent(location, navigation)} />
        </DAppProvider>
      </div>
  );
}

export default App
