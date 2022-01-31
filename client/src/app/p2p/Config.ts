import { Libp2pOptions } from 'libp2p'
import Websockets from 'libp2p-websockets'
import Filters from 'libp2p-websockets/src/filters'
import WebRTCStar from 'libp2p-webrtc-star'
import Bootstrap from 'libp2p-bootstrap'
import Mplex from 'libp2p-mplex'
import KadDHT from 'libp2p-kad-dht'
import Gossipsub from 'libp2p-gossipsub'

import { NOISE } from '@chainsafe/libp2p-noise'

export const getConfig = (): Libp2pOptions => {
  const transportKey = Websockets.prototype[Symbol.toStringTag]

  return {
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
            filter: Filters.all,
          },
        },
      },
    },
  }
}
