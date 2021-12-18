import "babel-polyfill";

import Libp2p from "libp2p";

import Websockets from "libp2p-websockets";
import WebRTCStar from "libp2p-webrtc-star";

import { NOISE } from "@chainsafe/libp2p-noise";
import filters from "libp2p-websockets/src/filters"
import Mplex from "libp2p-mplex";
import Bootstrap from "libp2p-bootstrap";
import KadDHT from "libp2p-kad-dht";

import Gossipsub from "libp2p-gossipsub";
import { useAppDispatch } from "../store/Hooks";

import { store } from "../store/Store";
import {decrementPeers, incrementPeers, setPeerID} from "../store/slices/PeerSlice";

import PeerID from 'peer-id';

const transportKey = Websockets.prototype[Symbol.toStringTag]

const createLibp2p = async (state) => {
  const dispatch = store.dispatch;
  const peerId = state.peerId;
  //const Peerid = await PeerID.create()
  // Create our libp2p node
  const libp2p: Libp2p = await Libp2p.create({
    peerId,
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      //"/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        //'/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ],
    },
    modules: {
      transport: [Websockets, WebRTCStar],
      streamMuxer: [Mplex],
      connEncryption: [NOISE],
      peerDiscovery: [Bootstrap],
      dht: KadDHT,
      pubsub: Gossipsub,
    },
    config: {
      peerDiscovery: {
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
        //dns4/sjc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN"
        bootstrap: {
          list: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            // '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            // '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
            // '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            // '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
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
            filter: filters.all
          }
        },
      },
    },
  });


  // Listen for new peers
  libp2p.on('peer:discovery', (peerId) => {
    console.debug(`Found peer ${peerId.toB58String()}`)
  })

  // Listen for new connections to peers
  libp2p.connectionManager.on('peer:connect', (connection) => {
    dispatch(incrementPeers())
    console.debug(`Connected to ${connection.remotePeer.toB58String()}`)
    state.p2pDb.transaction('rw', state.p2pDb.peers, async() =>{
      const id = await state.p2pDb.peers.add({peerId: connection.remotePeer.toB58String(), joinedTime: Date.now().toString()});
      //console.log(`Peer ID is stored in ${id}`)
    }).catch(e => { console.log(e.stack || e);});
  })

  // Listen for peers disconnecting
  libp2p.connectionManager.on('peer:disconnect', (connection) => {
    dispatch(decrementPeers())
    console.debug(`Disconnected from ${connection.remotePeer.toB58String()}`)
  })

  console.debug(`libp2p id is ${libp2p.peerId.toB58String()}`)
  dispatch(setPeerID(libp2p.peerId.toB58String()))

  await libp2p.start();

  return libp2p;
};

export default createLibp2p