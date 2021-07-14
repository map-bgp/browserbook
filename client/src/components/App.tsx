import * as React from "react";
import wasm from '../wasm/main.wasm'
import "tailwindcss/tailwind.css"

import {
    BigNumber,
    loadMeshStreamingWithURLAsync,
    Mesh,
    OrderEvent,
    SignedOrder,
    SupportedProvider,
} from '@0x/mesh-browser-lite';

export default class App extends React.Component {

  componentDidMount() {
    (async () => {
      await loadMeshStreamingWithURLAsync(wasm);

      // Configure Mesh to use web3.currentProvider (e.g. provided by MetaMask).
      const mesh = new Mesh({
          verbosity: 4,
          ethereumChainID: 1,
          ethereumRPCURL: "https://mainnet.infura.io/v3/806d459aeea74df8ac8bfeec07462d12",
          //web3Provider: (window as any).web3.currentProvider as SupportedProvider,
      });

      // This handler will be called whenever there is a critical error.
      mesh.onError((err: Error) => {
        console.error(err);
    });

      // This handler will be called whenever an order is added, expired,
      // cancelled, or filled.
      mesh.onOrderEvents((events: OrderEvent[]) => {
       for (const event of events) {
           console.log(event);
       }
      });

      // Start Mesh *after* we set up the handlers.
      await mesh.startAsync();

    })().catch(err => {
      console.error(err);
    });

  }
  render() {
    return <div className="text-green-500">Check the console for a stream of 0x Orders</div>
  }
}
