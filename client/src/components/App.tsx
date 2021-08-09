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

  const [current, setCurrent] = useState('Dashboard')
  const location = useLocation()

  const mesh = new Mesh({
    verbosity: 4,
    ethereumChainID: 1337,
    ethereumRPCURL: "http://35.222.39.6:9545",
    useBootstrapList: false,
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

    setCurrent(location.pathname.replace("/", ""))
  })

  const navigation = new Map()
  navigation.set('dashboard', 'Dashboard')
  navigation.set('market', 'Market')
  navigation.set('portfolio', 'Portfolio')
  navigation.set('assets', 'Assets')
  navigation.set('how-it-works', 'How It Works')

  // mesh.startAsync();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header navigation={navigation} current={current} setCurrent={setCurrent} />
      <Content title={navigation.get(current)} mesh={mesh} />
    </div>
  );
}

export default App
