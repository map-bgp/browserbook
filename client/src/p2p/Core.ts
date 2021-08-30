import 'babel-polyfill'
import Libp2p from 'libp2p'

import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import {NOISE} from '@chainsafe/libp2p-noise'

import Mplex from 'libp2p-mplex'
import Bootstrap from 'libp2p-bootstrap'
import {store} from "../store/Store"
import {decrementPeers, incrementPeers} from "../store/slices/PeerSlice";

export const initNode = async () => {
  const dispatch = store.dispatch

  // Create our libp2p node
  const libp2p: Libp2p = await Libp2p.create({
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ]
    },
    modules: {
      transport: [Websockets, WebRTCStar],
      connEncryption: [NOISE],
      streamMuxer: [Mplex],
      peerDiscovery: [Bootstrap]
    },
    config: {
      peerDiscovery: {
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
        [Bootstrap.tag]: {
          enabled: true,
          list: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
          ]
        }
      }
    }
  })

  // Listen for new peers
  libp2p.on('peer:discovery', (peerId) => {
    console.info(`Found peer ${peerId.toB58String()}`)
  })

  // Listen for new connections to peers
  libp2p.connectionManager.on('peer:connect', (connection) => {
    dispatch(incrementPeers())
    console.info(`Connected to ${connection.remotePeer.toB58String()}`)
  })

  // Listen for peers disconnecting
  libp2p.connectionManager.on('peer:disconnect', (connection) => {
    dispatch(decrementPeers())
    console.info(`Disconnected from ${connection.remotePeer.toB58String()}`)
  })

  console.info(`libp2p id is ${libp2p.peerId.toB58String()}`)
  await libp2p.start()

  return libp2p
}


