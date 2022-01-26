// import Libp2p, { Libp2pOptions } from 'libp2p'
// import { store } from '../store/Store'
// import { decrementPeers, incrementPeers, selectPeerId, setPeerId } from '../store/slices/PeerSlice'

// const dispatch = store.dispatch

// export class Peer {
//   node: Libp2p

//   private constructor(node: Libp2p) {
//     dispatch(setPeerId(node.peerId.toB58String()))

//     node.on('peer:discovery', (peerId) => {
//       console.debug(`Found peer ${peerId.toB58String()}`)
//     })

//     node.connectionManager.on('peer:connect', (connection) => {
//       dispatch(incrementPeers())

//       // state.p2pDb
//       //   .transaction('rw', state.p2pDb.peers, async () => {
//       //     const id = await state.p2pDb.peers.add({
//       //       peerId: connection.remotePeer.toB58String(),
//       //       joinedTime: Date.now().toString(),
//       //     })
//       //     //console.log(`Peer ID is stored in ${id}`)
//       //   })
//       //   .catch((e) => {
//       //     console.log(e.stack || e)
//       //   })
//     })

//     node.connectionManager.on('peer:disconnect', (connection) => {
//       dispatch(decrementPeers())
//     })

//     this.node = node
//   }

//   static async init(config: Libp2pOptions) {
//     const peerId = selectPeerId(store.getState())
//     const node = await Libp2p.create(config)
//     return new Peer(node)
//   }

//   async start() {
//     await this.node.start()
//   }
// }

export {}
