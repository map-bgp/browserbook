import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";

import {loadMeshStreamingWithURLAsync, Mesh, OrderEvent, SupportedProvider,} from '@0x/mesh-browser-lite';

import Header from './Header'
import { navigation } from "./Navigation";
import { getCurrent } from "./utils/getCurrent";

import Content from './Content'



declare const window: any;

const App = () => {
  const location = useLocation()

  // let provider;
  // window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
  // const signer = provider.getSigner();
  
  // console.log(provider)
  // console.log(signer)
  // console.log(signer.getAddress())

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

  // mesh.startAsync();
  // mesh.getStatsAsync();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header navigation={navigation} current={getCurrent(location, navigation)}/>
      <Content current={getCurrent(location, navigation)} mesh={mesh}/>
    </div>
  );
}

export default App
