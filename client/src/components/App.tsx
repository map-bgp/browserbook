import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";

import { ethers } from "ethers";

import {loadMeshStreamingWithURLAsync, Mesh, OrderEvent, SupportedProvider,BigNumber , SignedOrder} from '@0x/mesh-browser-lite';
import { Order, orderHashUtils, signatureUtils } from '@0x/order-utils';
import { RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';

import Header from './Header'
import Content from './Content'

export const mesh = new Mesh({
  verbosity: 5,
  ethereumChainID: 1337,
  ethereumRPCURL: "http://192.41.136.236:9545",
  useBootstrapList: true,
  customOrderFilter: {
    properties: { makerAddress: { const: '0x468929A0DAC6D5A1c7BA1ab09c0862195D63b18c' } },
},
  //web3Provider: (window as any).ethereum as SupportedProvider,
})

export const App = () => {

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

  //const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  
  // console.log(provider)
  // console.log(provider.getSigner(0).getAddress())

  mesh.onError((err: Error) => {
    console.error(err)
  })

  mesh.onOrderEvents((events: OrderEvent[]) => {
    for (const event of events) {
      console.log(event)
    }
  })



//   // Set up a Web3 Provider that uses the RPC endpoint
// const ethereumRPCURL= 'http://192.41.136.236:9545';
// const provider = new Web3ProviderEngine();
// provider.addProvider(new RPCSubprovider(ethereumRPCURL));
// provider.start();


// const currentTime = Math.floor(Date.now() / 1000); // tslint:disable-line:custom-no-magic-numbers
// const expirationTime = currentTime + 24 * 60 * 60; 
// const order: Order = {
//   makerAddress: '0x468929A0DAC6D5A1c7BA1ab09c0862195D63b18c',
//   makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
//   makerFeeAssetData: '0x',
//   makerAssetAmount: new BigNumber('100'),
//   makerFee: new BigNumber('0'),
//   takerAddress: '0x0000000000000000000000000000000000000000',
//   takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
//   takerFeeAssetData: '0x',
//   takerAssetAmount: new BigNumber('100'),
//   takerFee: new BigNumber('0'),
//   senderAddress: '0x468929A0DAC6D5A1c7BA1ab09c0862195D63b18c',
//   exchangeAddress: '0x0DE191A5885cC120D78075C1FC14142ef3B91E54',
//   feeRecipientAddress: '0xa258b39954cef5cb142fd567a46cddb31a670124',
//   expirationTimeSeconds: new BigNumber(expirationTime),
//   salt: new BigNumber(expirationTime),
//   chainId: 1337,
// };



  useEffect(() => {
    const loadWasm = async () => {
      console.time("WASM");
      await loadMeshStreamingWithURLAsync(wasm);
      console.timeEnd("WASM");
      console.time("meshStarted")
      await mesh.startAsync()
      await mesh.getStatsAsync()
      console.timeEnd("meshStarted")
      //console.log(window.mesh);
      //console.time("OrderAdding")
      //const signedOrder = await signatureUtils.ecSignOrderAsync(provider, order, order.makerAddress);
      //await mesh.addOrdersAsync([signedOrder]);
      // console.timeEnd("OrderAdding");
      await mesh.getOrdersAsync();
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


  return (
    <div className="min-h-screen bg-gray-100">
      <Header navigation={navigation} current={getCurrent()}/>
      <Content current={getCurrent()} mesh={mesh}/>
    </div>
  );
}

export default App