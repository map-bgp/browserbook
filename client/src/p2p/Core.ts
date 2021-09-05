import "babel-polyfill";

import Libp2p from "libp2p";

import Websockets from "libp2p-websockets";
import WebRTCStar from "libp2p-webrtc-star";

import { NOISE } from "@chainsafe/libp2p-noise";

import Mplex from "libp2p-mplex";
import Bootstrap from "libp2p-bootstrap";
import KadDHT from "libp2p-kad-dht";

import Gossipsub from "libp2p-gossipsub";

import { store } from "../store/Store";
import {
  decrementPeers,
  incrementPeers,
  setPeerID,
} from "../store/slices/PeerSlice";

export const initNode = async () => {
  const dispatch = store.dispatch;

  // Create our libp2p node
  const libp2p: Libp2p = await Libp2p.create({
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      listen: [
        "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      ],
    },
    modules: {
      transport: [Websockets, WebRTCStar],
      connEncryption: [NOISE],
      streamMuxer: [Mplex],
      peerDiscovery: [Bootstrap],
      dht: KadDHT,
      pubsub: Gossipsub,
    },
    config: {
      peerDiscovery: {
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
        [WebRTCStar.tag]: {
          enabled: true
        },
        [Bootstrap.tag]: {
          enabled: true,
          list: [
            "/dns4/sjc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          ],
        },
      dht: {
        enabled: true,
        randomWalk: {
          enabled: true
        }
      }
      },
    },
  });

  // Listen for new peers
  libp2p.on("peer:discovery", (peerId) => {
    console.info(`Found peer ${peerId.toB58String()}`);
  });

  // Listen for new connections to peers
  libp2p.connectionManager.on("peer:connect", (connection) => {
    dispatch(incrementPeers());
    console.info(`Connected to ${connection.remotePeer.toB58String()}`);
  });

  // Listen for peers disconnecting
  libp2p.connectionManager.on("peer:disconnect", (connection) => {
    dispatch(decrementPeers());
    console.info(`Disconnected from ${connection.remotePeer.toB58String()}`);
  });

  console.info(`libp2p id is ${libp2p.peerId.toB58String()}`);
  dispatch(setPeerID(libp2p.peerId.toB58String()));

  libp2p.pubsub

  await libp2p.start();

  return libp2p;
};
