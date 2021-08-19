import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";

import {ChainId, Config, DAppProvider} from "@usedapp/core";
import { ethers } from "ethers";

import {loadMeshStreamingWithURLAsync, Mesh, OrderEvent, BigNumber , SignedOrder} from '@0x/mesh-browser-lite';

import Header from './Header'
import { navigation } from "./Navigation";
import { getCurrent } from "./utils/getCurrent";

import Content from './Content'

declare const window: any;

const config: Config = {
  readOnlyChainId: ChainId.Mumbai,
  readOnlyUrls: {
    [ChainId.Mumbai]: "https://polygon-mumbai.infura.io/v3/e8c847c8a43a4f9b95ac3182349c0932"
  }
}

const App = () => {
  const location = useLocation()

  // let provider;
  // window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
  // const signer = provider.getSigner();

  // const provider = new ethers.providers.Web3Provider((window as any).ethereum)

  // console.log(provider)
  // console.log(signer)
  // console.log(signer.getAddress())
  // console.log(provider)
  // console.log(provider.getSigner(0).getAddress())
  const order: SignedOrder = {
    signature:
        '0x1c68eb1e2577e9f51776bdb06ec51fcec9aec0ea1565eca5e243917cecaafaa46b3b9590ff6575bf1c048d0b4ec5773a2e3a8df3bf117e1613e2a7b57d6f95c95a02',
    senderAddress: '0x0000000000000000000000000000000000000000',
    makerAddress: '0x4418755f710468e223797a006603e29937e825bc',
    takerAddress: '0x0000000000000000000000000000000000000000',
    makerFee: new BigNumber('0'),
    takerFee: new BigNumber('0'),
    makerAssetAmount: new BigNumber('3000000000'),
    takerAssetAmount: new BigNumber('19500000000000000000'),
    makerAssetData: '0xf47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    takerAssetData: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    salt: new BigNumber('1579725034907'),
    exchangeAddress: '0x61935cbdd02287b511119ddb11aeb42f1593b7ef',
    feeRecipientAddress: '0xa258b39954cef5cb142fd567a46cddb31a670124',
    expirationTimeSeconds: new BigNumber('1580329834'),
    makerFeeAssetData: '0x',
    chainId: 1,
    takerFeeAssetData: '0x',
};

  const mesh = new Mesh({
    verbosity: 4,
    ethereumChainID: 80001,
    ethereumRPCURL: "https://polygon-mumbai.infura.io/v3/e8c847c8a43a4f9b95ac3182349c0932",
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
      console.time("WASM");
      await loadMeshStreamingWithURLAsync(wasm)
      console.timeEnd("WASM");
      console.time("meshStarted")
      await mesh.startAsync()
      console.timeEnd("meshStarted")
      console.time("OrderAdding")
      await mesh.addOrdersAsync([order])
      console.timeEnd("OrderAdding")
    }

    loadWasm().catch(console.error)
    console.log("WASM locked and loaded")
  })

  // mesh.startAsync();
  // mesh.getStatsAsync();

  return (
    <div className="min-h-screen bg-gray-100">
      <DAppProvider config={config}>
        <Header navigation={navigation} current={getCurrent(location, navigation)}/>
        <Content current={getCurrent(location, navigation)} mesh={mesh}/>
      </DAppProvider>
    </div>
  );
}

export default App