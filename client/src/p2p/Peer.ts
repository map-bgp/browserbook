import Libp2p, { Libp2pOptions } from 'libp2p'
import protons from 'protons'

import { store } from '../store/Store'
import { decrementPeers, incrementPeers, selectPeerId, setPeerId } from '../store/slices/PeerSlice'
// import { Record } from 'libp2p-kad-dht/dist/src/message/dht'
import { IOrder } from './db'

const dispatch = store.dispatch

const { ORDER_SCHEMA } = protons(`
syntax = "proto3";
package browserbook;

message Order {
  string id = 1;
  string tokenS = 2;
  string tokenT = 3;
  int32 amountS = 4;
  int32 amountT = 5;
  string from = 6;
  string status = 7;
  int32 created = 8;
}
`)

export class Peer {
  static TOPIC: string = '/libp2p/bbook/chat/1.0.0'
  static VALIDATION_TOPIC: string = '/libp2p/example/validator/1.0.0'
  static PROTO_PATH = './protocol_buffers/order.json'

  config: Libp2pOptions
  node: Libp2p | null = null
  connectedPeers: Set<string> = new Set()
  schemaRoot: any // We are missing the type
  // telemetry: Map<string, string> = new Map()

  constructor(config: Libp2pOptions) {
    this.config = config
    console.log(Peer.PROTO_PATH)
  }

  async init() {
    this.node = await Libp2p.create(this.config)

    dispatch(setPeerId(this.node.peerId.toB58String()))

    this.node.on('peer:discovery', (peerId) => {
      console.debug(`Found peer ${peerId.toB58String()}`)
    })

    this.node.connectionManager.on('peer:connect', (connection) => {
      dispatch(incrementPeers())

      // state.p2pDb
      //   .transaction('rw', state.p2pDb.peers, async () => {
      //     const id = await state.p2pDb.peers.add({
      //       peerId: connection.remotePeer.toB58String(),
      //       joinedTime: Date.now().toString(),
      //     })
      //     //console.log(`Peer ID is stored in ${id}`)
      //   })
      //   .catch((e) => {
      //     console.log(e.stack || e)
      //   })
    })

    this.node.connectionManager.on('peer:disconnect', (connection) => {
      dispatch(decrementPeers())
    })

    this.processOrderMessage = this.processOrderMessage.bind(this)

    await this.node.start()
  }

  join() {
    if (!this.node) {
      throw new Error('Cannot join pubsub network before Peer is initialized')
    }
    this.node.pubsub.on(Peer.TOPIC, this.processOrderMessage)
    this.node.pubsub.subscribe(Peer.TOPIC)
  }

  leave() {
    if (!this.node) {
      throw new Error('Cannot leave pubsub network before Peer is initialized')
    }
    this.node.pubsub.removeListener(Peer.TOPIC, this.processOrderMessage)
    this.node.pubsub.unsubscribe(Peer.TOPIC)
  }

  // Temporary type
  // This will stream orders to the DB, calls service methods
  // Do we need to send them to the redux store? Hmm..
  processOrderMessage(order: any) {
    // const request = Requeest.decode(message.data)
    console.log('Received order', order)
  }

  async publishOrderMessage(order: IOrder) {
    if (!this.node) {
      throw new Error('Cannot send pubsub message before Peer is initialized')
    }

    console.log('Publishing order', order)
    const encodedOrder = ORDER_SCHEMA.encode(order)
    console.log('Encoded order', encodedOrder)
    await this.node.pubsub.publish(Peer.TOPIC, encodedOrder)
  }
}
