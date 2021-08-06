import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect, useState} from "react";

import {
  BrowserRouter as Router,
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
  })

  // mesh.startAsync();

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Header current={current} setCurrent={setCurrent} />
        <Content current={current} setCurrent={setCurrent} mesh={mesh} />
      </Router>
    </div>
  );
}

export default App
