import "tailwindcss/tailwind.css";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
//import { createLibp2p } from "../p2p/p2pnode";
import EventEmitter from 'events'
import PeerID from "peer-id";
import PubsubChat from "../p2p/messagehandler";
import { getOrCreatePeerId } from '../p2p/peer-id'

import Header from "./Header";

import { getCurrent } from "./utils/getCurrent";
import Content from "./Content";
import { useAppContext } from "./context/Store";
import { ActionType } from "./context/Reducer";





export const App = ({ createLibp2p}) => {
  const location = useLocation();
  const { state, setContext } = useAppContext();

  const [peerId, setPeerId] = useState<PeerID>()
  const [libp2p, setLibp2p] = useState(null)
  const [started, setStarted] = useState(false)
  const eventBus = new EventEmitter()
  

  useEffect(() => {
    if (!peerId) {
      console.info('Getting our PeerId')
      getOrCreatePeerId().then((node) => {
        setPeerId(node);
      })
      //getOrCreatePeerId().then(setPeerId)
      return
    }

    // If the libp2p instance is not created, create it with our PeerId instance
    if (!libp2p) {
      (async () => {
        console.info('Creating our Libp2p instance')
        const node = await createLibp2p(peerId)
        setLibp2p(node)
        setStarted(true)
      })()
    }
  })

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
        <Content current={getCurrent(location, navigation)} libp2p={libp2p}  eventbus={eventBus} />
    </div>
  );
};

export default App;
