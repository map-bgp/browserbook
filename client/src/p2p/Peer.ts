import Libp2p, { Libp2pOptions } from 'libp2p'
import { store } from '../store/Store'
import { decrementPeers, incrementPeers, setPeerId } from '../store/slices/PeerSlice'
import { Order } from './protocol_buffers/order'
import { IPeer, P2PDB } from './db'

const dispatch = store.dispatch

export class Peer {
  static TOPIC: string = '/libp2p/bbook/chat/1.0.0'
  static VALIDATION_TOPIC: string = '/libp2p/example/validator/1.0.0'
  static DB: P2PDB = P2PDB.initialize()

  config: Libp2pOptions
  node: Libp2p | null = null
  connectedPeers: Set<string> = new Set()
  schemaRoot: any // We are missing the type
  // telemetry: Map<string, string> = new Map()

  constructor(config: Libp2pOptions) {
    this.config = config
  }

  async init() {
    this.node = await Libp2p.create(this.config)

    dispatch(setPeerId(this.node.peerId.toB58String()))

    // this.node.on('peer:discovery', (peerId) => {})

    this.node.connectionManager.on('peer:connect', async (connection) => {
      dispatch(incrementPeers())
      await this.addPeer({ id: connection.id, joinedTime: Date.now() })
    })

    this.node.connectionManager.on('peer:disconnect', async (connection) => {
      dispatch(decrementPeers())
      await this.removePeer(connection.id)
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

  async addPeer(peer: IPeer) {
    await Peer.DB.peers.add(peer)
  }

  async removePeer(id: string) {
    await Peer.DB.peers.delete(id)
  }

  // Send to redux?
  // Sadly any type as libp2p is untyped
  processOrderMessage(encodedOrder: any) {
    const decodedOrder = Order.decode(encodedOrder.data)
    console.log('Received order', decodedOrder)
    // db.orders.add(decodedOrder)
  }

  async publishOrderMessage(order: Order) {
    if (!this.node) {
      throw new Error('Cannot send pubsub message before Peer is initialized')
    }

    console.log('Sending order', order)

    const encodedOrder = Order.encode(order).finish()
    await this.node.pubsub.publish(Peer.TOPIC, encodedOrder)
  }
}
