import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect, useState} from "react";

import {
  useLocation
} from "react-router-dom";

import {
    BigNumber,
    loadMeshStreamingWithURLAsync,
    Mesh,
    OrderEvent,
    SignedOrder,
    SupportedProvider,
} from '@0x/mesh-browser-lite';

import Header from './Header'
import Content from './Content'

const App = () => {

  const location = useLocation()
  const getCurrent = () => {
    let path = location.pathname
    let current = "Dashboard"

    for(let i=0; i < navigation.length; i++){
      if (navigation[i].key === path.replace("/", "")) {
        current = navigation[i].name
      }
    }

    return current
  }

  const mesh = new Mesh({
    verbosity: 6,
    ethereumChainID: 1337,
    ethereumRPCURL: "http://192.41.136.236:9545",
    useBootstrapList: true,
    //web3Provider: (window as any).web3.currentProvider as SupportedProvider,
  })

  mesh.onError((err: Error) => {
    console.error(err)
  })

  mesh.onOrderEvents((events: OrderEvent[]) => {
    for (const event of events){
      console.log(event)
    }
  })

  useEffect(() => {
    const loadWasm = async () => {
      await loadMeshStreamingWithURLAsync(wasm)
    }

    loadWasm().catch(console.error)
    console.log("WASM locked and loaded")
  })

  mesh.startAsync();
  mesh.getStatsAsync();

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

  // mesh.startAsync();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header navigation={navigation} current={getCurrent()} />
      <Content current={getCurrent()} mesh={mesh} />
    </div>
  );
}

export default App
