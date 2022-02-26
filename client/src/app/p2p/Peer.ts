import Libp2p, { Libp2pOptions } from 'libp2p'
import { store } from '../store/Store'
import { decrementPeers, incrementPeers, setOrderStatus, setPeerId } from '../store/slices/PeerSlice'
import { Order, Match } from './protocol_buffers/gossip_schema'
import { IToken, P2PDB } from './db'
import { OrderStatus, Token } from '../Types'
import { selectAccountData } from '../store/slices/EthersSlice'

const dispatch = store.dispatch

const worker: Worker = new Worker(new URL('./../oms/Oms.ts', import.meta.url), { type: 'module' })

export class Peer {
  static ORDER_TOPIC: string = '/bb/order/1.0.0'
  static MATCH_TOPIC: string = '/bb/match/1.0.0'
  static DB: P2PDB = P2PDB.initialize()

  config: Libp2pOptions
  node: Libp2p | null = null
  isValidator: boolean = false
  signerAddress: string | null = null

  constructor(config: Libp2pOptions) {
    this.config = config

    worker.onmessage = (e: MessageEvent) => {
      if (this.isValidator && !!this.signerAddress) {
        if (e.data[0] === 'order-match') {
          const match = {
            id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
            validatorAddress: this.signerAddress, // Rename when appropriate
            makerId: e.data[1],
            takerId: e.data[2],
            status: 'Matched',
          }

          this.publishMatchMessage(match)
          this.addMatch(match) // Match may be from own order
        }
        if (e.data[0] === 'order-rejection') {
          const match = {
            id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
            validatorAddress: this.signerAddress,
            makerId: e.data[1],
            takerId: e.data[2],
            status: 'Rejected',
          }

          this.publishMatchMessage(match)
          this.addMatch(match) // Match may be from own order
        }
      }
    }
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

    this.processOrder = this.processOrder.bind(this)
    this.processMatchMessage = this.processMatchMessage.bind(this)

    await this.node.start()
  }

  setMatcher(isValidator: boolean) {
    this.isValidator = isValidator
  }

  join() {
    if (!this.node) {
      throw new Error('Cannot join pubsub network before Peer is initialized')
    }
    this.node.pubsub.on(Peer.ORDER_TOPIC, this.processOrder)
    this.node.pubsub.subscribe(Peer.ORDER_TOPIC)

    this.node.pubsub.on(Peer.MATCH_TOPIC, this.processMatchMessage)
    this.node.pubsub.subscribe(Peer.MATCH_TOPIC)
  }

  leave() {
    if (!this.node) {
      throw new Error('Cannot leave pubsub network before Peer is initialized')
    }
    this.node.pubsub.removeListener(Peer.ORDER_TOPIC, this.processOrder)
    this.node.pubsub.unsubscribe(Peer.ORDER_TOPIC)

    this.node.pubsub.removeListener(Peer.MATCH_TOPIC, this.processMatchMessage)
    this.node.pubsub.unsubscribe(Peer.MATCH_TOPIC)
  }

  async processOrder(encodedOrder: any) {
    const decodedOrder = Order.decode(encodedOrder.data)
    await this.addOrder(decodedOrder)

    if (this.isValidator) {
      await this.notifyNewOrder(decodedOrder)
    }
  }

  async publishOrder(order: Order) {
    if (!this.node) {
      throw new Error('Cannot send pubsub message before Peer is initialized')
    }

    const encodedOrder = Order.encode(order).finish()
    await this.node.pubsub.publish(Peer.ORDER_TOPIC, encodedOrder)
    await this.addOrder(order)
  }

  async processMatchMessage(encodedMatch: any) {
    const decodedMatch = Match.decode(encodedMatch.data)

    if (decodedMatch.status === 'Matched') {
      worker.postMessage(['matched-order', decodedMatch.makerId, decodedMatch.takerId])
    }

    await this.addMatch(decodedMatch)
  }

  async publishMatchMessage(match: Match) {
    if (!this.node) {
      throw new Error('Cannot send pubsub message before Peer is initialized')
    }

    if (!this.isValidator) {
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
    await Peer.DB.orders.add({ ...order, status: OrderStatus.Pending })
  }

  private async getMatchingOrder(match: Match) {
    const { primaryAccount } = selectAccountData(store.getState())
    if (primaryAccount === null) {
      throw new Error('Cannot query matching orders when ethers account is undefined')
    }

    const matchedMakerOrder = await Peer.DB.orders.get({
      from: primaryAccount,
      id: match.makerId,
    })

    const matchedTakerOrder = await Peer.DB.orders.get({
      from: primaryAccount,
      id: match.takerId,
    })

    return matchedMakerOrder !== undefined ? matchedMakerOrder : matchedTakerOrder
  }

  async addMatch(match: Match) {
    await Peer.DB.matches.add(match)
    const orderToUpdate = await this.getMatchingOrder(match)

    if (!!orderToUpdate) {
      const { id, from } = orderToUpdate

      if (match.status === 'Matched') {
        await Peer.DB.orders.update(id, { status: OrderStatus.Matched })
        dispatch(setOrderStatus({ id, from, status: OrderStatus.Matched }))
      } else if (match.status === 'Rejected') {
        await Peer.DB.orders.update(id, { status: OrderStatus.Rejected })
        dispatch(setOrderStatus({ id, from, status: OrderStatus.Rejected }))
      }
    }
  }

  startValidation(signerAddress: string, decryptedSignerKey: string) {
    this.isValidator = true
    this.signerAddress = signerAddress
    worker.postMessage(['start', signerAddress, decryptedSignerKey])
  }

  stopValidation() {
    this.isValidator = false
    worker.postMessage(['stop'])
  }

  notifyNewOrder(order: Order) {
    worker.postMessage(['new-order', order])
  }
}
