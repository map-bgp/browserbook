import "tailwindcss/tailwind.css"
import wasm from '../wasm/main.wasm'

import React from "react";

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

  // componentDidMount() {
  //   (async () => {
  //     await loadMeshStreamingWithURLAsync(wasm);
  //
  //     // Configure Mesh to use web3.currentProvider (e.g. provided by MetaMask).
  //     const mesh = new Mesh({
  //       verbosity: 4,
  //       ethereumChainID: 1,
  //       ethereumRPCURL: "https://mainnet.infura.io/v3/806d459aeea74df8ac8bfeec07462d12",
  //       //web3Provider: (window as any).web3.currentProvider as SupportedProvider,
  //     });
  //
  //     // This handler will be called whenever there is a critical error.
  //     mesh.onError((err: Error) => {
  //       console.error(err);
  //     });
  //
  //     // This handler will be called whenever an order is added, expired,
  //     // cancelled, or filled.
  //     mesh.onOrderEvents((events: OrderEvent[]) => {
  //      for (const event of events) {
  //        console.log(event);
  //      }
  //     });
  //
  //     // Start Mesh *after* we set up the handlers.
  //     await mesh.startAsync();
  //
  //   })().catch(err => {
  //     console.error(err);
  //   });
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Content />
    </div>
  );
}

export default App
