import Libp2p, { Libp2pOptions } from 'libp2p'
import { store } from '../store/Store'
import { decrementPeers, incrementPeers, setPeerId } from '../store/slices/PeerSlice'
import { Order, Match } from './protocol_buffers/gossip_schema'
import { IToken, P2PDB } from './db'
import { Token } from '../Types'

const dispatch = store.dispatch

export class Peer {
  static ORDER_TOPIC: string = '/bb/order/1.0.0'
  static MATCH_TOPIC: string = '/bb/match/1.0.0'
  static DB: P2PDB = P2PDB.initialize()

  config: Libp2pOptions
  node: Libp2p | null = null
  isMatcher: boolean = false

  constructor(config: Libp2pOptions) {
    this.config = config
  }

  async init() {
    this.node = await Libp2p.create(this.config)
    dispatch(setPeerId(this.node.peerId.toB58String()))

    // this.node.on('peer:discovery', (peerId) => {})

    this.node.connectionManager.on('peer:connect', async (connection: any) => {
      dispatch(incrementPeers())
      await this.addPeer(connection.id)
    })

    this.node.connectionManager.on('peer:disconnect', async (connection: any) => {
      dispatch(decrementPeers())
      await this.removePeer(connection.id)
    })

    this.processOrderMessage = this.processOrderMessage.bind(this)
    this.processMatchMessage = this.processMatchMessage.bind(this)

    await this.node.start()
  }

  setMatcher(isMatcher: boolean) {
    this.isMatcher = isMatcher
  }

  join() {
    if (!this.node) {
      throw new Error('Cannot join pubsub network before Peer is initialized')
    }
    this.node.pubsub.on(Peer.ORDER_TOPIC, this.processOrderMessage)
    this.node.pubsub.subscribe(Peer.ORDER_TOPIC)

    this.node.pubsub.on(Peer.MATCH_TOPIC, this.processMatchMessage)
    this.node.pubsub.subscribe(Peer.MATCH_TOPIC)
  }

  leave() {
    if (!this.node) {
      throw new Error('Cannot leave pubsub network before Peer is initialized')
    }
    this.node.pubsub.removeListener(Peer.ORDER_TOPIC, this.processOrderMessage)
    this.node.pubsub.unsubscribe(Peer.ORDER_TOPIC)

    this.node.pubsub.removeListener(Peer.MATCH_TOPIC, this.processMatchMessage)
    this.node.pubsub.unsubscribe(Peer.MATCH_TOPIC)
  }

  // Send to redux?
  async processOrderMessage(encodedOrder: any) {
    const decodedOrder = Order.decode(encodedOrder.data)
    await this.addOrder(decodedOrder)
  }

  async publishOrderMessage(order: Order) {
    if (!this.node) {
      throw new Error('Cannot send pubsub message before Peer is initialized')
    }

    const encodedOrder = Order.encode(order).finish()
    await this.node.pubsub.publish(Peer.ORDER_TOPIC, encodedOrder)
  }

  async processMatchMessage(encodedMatch: any) {
    const decodedMatch = Match.decode(encodedMatch.data)
    console.log('Decoded match', decodedMatch)
    await this.addMatch(decodedMatch)
  }

  async publishMatchMessage(match: Match) {
    if (!this.node) {
      throw new Error('Cannot send pubsub message before Peer is initialized')
    }

    if (!this.isMatcher) {
      throw new Error('Can only publish a matcher message if the node is a valid matcher')
    }

    const encodedMatch = Match.encode(match).finish()
    await this.node.pubsub.publish(Peer.MATCH_TOPIC, encodedMatch)
  }

  async addPeer(id: string) {
    await Peer.DB.peers.add({ id: id, joinedTime: Date.now() })
  }

  async removePeer(id: string) {
    await Peer.DB.peers.delete(id)
  }

  async addToken(token: IToken) {
    await Peer.DB.tokens.add(token)
  }

  async removeToken(id: Token) {
    await Peer.DB.tokens.delete(id)
  }

  async getTokens() {
    return await Peer.DB.tokens.toArray()
  }

  async addOrder(order: Order) {
    await Peer.DB.orders.add(order)
  }

  async addMatch(match: Match) {
    await Peer.DB.matches.add(match)
  }
}
