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
  const user = {
    name: 'Test User',
    email: 'test@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }

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
      <Header user={user} />
      <Content />
    </div>
  );
}

export default App
