import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";

import { ethers } from "ethers";

import {loadMeshStreamingWithURLAsync, Mesh, OrderEvent, SupportedProvider,} from '@0x/mesh-browser-lite';

import Header from './Header'
import Content from './Content'

const App = () => {

  const location = useLocation()
  const getCurrent = () => {
    let path = location.pathname
    let current = "Dashboard"

    for (let i = 0; i < navigation.length; i++) {
      if (navigation[i].key === path.replace("/", "")) {
        current = navigation[i].name
      }
    }

    return current
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
  console.log(provider)
  console.log(provider.getSigner(0).getAddress())

  const mesh = new Mesh({
    verbosity: 6,
    ethereumChainID: 1337,
    ethereumRPCURL: "http://192.41.136.236:9545",
    useBootstrapList: true,
    web3Provider: (window as any).ethereum as SupportedProvider,
  })

  mesh.onError((err: Error) => {
    console.error(err)
  })

  mesh.onOrderEvents((events: OrderEvent[]) => {
    for (const event of events) {
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
  // mesh.getStatsAsync();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header navigation={navigation} current={getCurrent()}/>
      <Content current={getCurrent()} mesh={mesh}/>
    </div>
  );
}

export default App
