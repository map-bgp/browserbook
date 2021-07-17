import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect, useState} from "react";

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
    ethereumChainID: 1,
    ethereumRPCURL: "https://mainnet.infura.io/v3/806d459aeea74df8ac8bfeec07462d12",
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header current={current} setCurrent={setCurrent} />
      <Content current={current} setCurrent={setCurrent} mesh={mesh} />
    </div>
  );
}

export default App
