import "tailwindcss/tailwind.css";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import  createLibp2p  from "../p2p/p2pnode";

import { getOrCreatePeerId } from '../p2p/peer-id'

import Header from "./Header";
import {EtherStore,injected} from "../blockchain"
import { providers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect,useInactiveListener } from "../store/Hooks";
import { getCurrent } from "./utils/getCurrent";
import Content from "./Content";
import { useAppContext } from "./context/Store";
import { ActionType } from "./context/Reducer";


export const App = () => {

  const location = useLocation();
  const etherStore = new EtherStore();
  const { state, setContext } = useAppContext();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

const loadInitialState = async () => {

  if(setContext){

  console.info('Getting our PeerId')

  getOrCreatePeerId().then((peerid) => {
  setContext({
     type: ActionType.SET_PEER_ID,
     payload: peerid,
   })
  })

  console.info('Creating our Libp2p instance')

  const node = await createLibp2p(state.peerId)
  
  setContext({
    type: ActionType.SET_NODE,
    payload: node
  })

  await etherStore.Start();

}
}

  useEffect(() => {
    loadInitialState() 
  },[])

  const navigation = [
    {
      name: "Dashboard",
      key: "dashboard",
    },
    {
      name: "Market",
      key: "market",
    },
    {
      name: "Portfolio",
      key: "portfolio",
    },
    {
      name: "Assets",
      key: "assets",
    },
    {
      name: "How it Works",
      key: "how-it-works",
    },
    {
      name: "order subscription",
      key: "order-subscription",
    },
    {
      name: "order creation",
      key: "order-creation",
    },
  ];

  return (
    <div className="min-h-screen AppContextbg-gray-100">
        <Header
          navigation={navigation}
          current={getCurrent(location, navigation)}
        />
        <Content current={getCurrent(location, navigation)}/>
    </div>
  );
};

export default App;
