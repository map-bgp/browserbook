import Libp2p from 'libp2p'
const Websockets = import('libp2p-websockets');
const TCP = import("libp2p-tcp");
const Bootstrap = import("libp2p-bootstrap");
import { Mplex } from "@libp2p/mplex";
const KadDHT = import("libp2p-kad-dht");
const Gossipsub = import("libp2p-gossipsub");

import { NOISE } from "@chainsafe/libp2p-noise";

export const getConfig = async () => {
  const transportKey = await Websockets.prototype[Symbol.toStringTag];
  return {
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      //
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    modules: {
      transport: [ await TCP],
      // @ts-ignore
      streamMuxer: [await Mplex],
      connEncryption: [await NOISE],
      peerDiscovery: [await Bootstrap],
      dht: await KadDHT,
      pubsub: await Gossipsub,
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          ],
        },
        dht: {
          enabled: true,
          randomWalk: {
            enabled: true,
          },
        },
        pubsub: {
          enabled: true,
          emitSelf: false,
        },
        transport: {
          [transportKey]: {
            filter: Websockets.Filters.all,
          },
        },
      },
    },
  };
};

export const createNode = async () => {
  const config = await getConfig()
  const node = await Libp2p.create(config)
  console.log("Get Config", config);
  console.log("Get Node", node);
}

// const node = await Libp2p.create(getConfig())
// console.log("Get Config", node);
// 

createNode()