import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";

import { ethers } from "ethers";

import {loadMeshStreamingWithURLAsync, Mesh, OrderEvent, SupportedProvider,BigNumber , SignedOrder} from '@0x/mesh-browser-lite';

import Header from './Header'
import Content from './Content'

const App = async () => {

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

  // const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
  // console.log(provider)
  // console.log(provider.getSigner(0).getAddress())

  const mesh = new Mesh({
    verbosity: 6,
    ethereumChainID: 1337,
    ethereumRPCURL: "http://34.136.24.16:9545",
    useBootstrapList: true,
    //web3Provider: (window as any).ethereum as SupportedProvider,
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
  ]git 
//   const order: SignedOrder = {
//     signature:
//         '0x1c68eb1e2577e9f51776bdb06ec51fcec9aec0ea1565eca5e243917cecaafaa46b3b9590ff6575bf1c048d0b4ec5773a2e3a8df3bf117e1613e2a7b57d6f95c95a02',
//     senderAddress: '0x0000000000000000000000000000000000000000',
//     makerAddress: '0x4418755f710468e223797a006603e29937e825bc',
//     takerAddress: '0x0000000000000000000000000000000000000000',
//     makerFee: new BigNumber('0'),
//     takerFee: new BigNumber('0'),
//     makerAssetAmount: new BigNumber('3000000000'),
//     takerAssetAmount: new BigNumber('19500000000000000000'),
//     makerAssetData: '0xf47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//     takerAssetData: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     salt: new BigNumber('1579725034907'),
//     exchangeAddress: '0x61935cbdd02287b511119ddb11aeb42f1593b7ef',
//     feeRecipientAddress: '0xa258b39954cef5cb142fd567a46cddb31a670124',
//     expirationTimeSeconds: new BigNumber('1580329834'),
//     makerFeeAssetData: '0x',
//     chainId: 1,
//     takerFeeAssetData: '0x',
// };
//   mesh.startAsync()
  // mesh.getStatsAsync();



  return (
    <div className="min-h-screen bg-gray-100">
      <Header navigation={navigation} current={getCurrent()}/>
      <Content current={getCurrent()} mesh={mesh}/>
    </div>
  );
}

export default App