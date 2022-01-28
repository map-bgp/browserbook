import Libp2p, { Libp2pOptions } from 'libp2p'
import { store } from '../store/Store'
import { decrementPeers, incrementPeers, selectPeerId, setPeerId } from '../store/slices/PeerSlice'
import { Record } from 'libp2p-kad-dht/dist/src/message/dht'

const dispatch = store.dispatch

export class Peer {
  static TOPIC: string = '/libp2p/bbook/chat/1.0.0'
  static VALIDATION_TOPIC: string = '/libp2p/example/validator/1.0.0'

  node: Libp2p
  connectedPeers: Set<string> = new Set()
  telemetry: Map<string, string> = new Map()

  private constructor(node: Libp2p) {
    dispatch(setPeerId(node.peerId.toB58String()))

    node.on('peer:discovery', (peerId) => {
      console.debug(`Found peer ${peerId.toB58String()}`)
    })

    node.connectionManager.on('peer:connect', (connection) => {
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

    node.connectionManager.on('peer:disconnect', (connection) => {
      dispatch(decrementPeers())
    })

    // this._onMessage = this._onMessage.bind(this)
    this.node = node

    // The correct syntax! this.node.pubsub :)

    // this.pubsub.on(this.topic, this._onMessage)
  }

  static async init(config: Libp2pOptions) {
    const peerId = selectPeerId(store.getState())
    const node = await Libp2p.create(config)
    return new Peer(node)
  }

  async start() {
    await this.node.start()
  }
}

// import protons from 'protons'
// import EventEmitter from 'events'

// import uint8arrayFromString from 'uint8arrays/from-string'
// import uint8arrayToString from 'uint8arrays/to-string'

// const { Request, Stats } = protons(`
// 	message Request {
// 	enum Type {
// 			SEND_ORDER = 0;
// 			STATS = 1;
// 	}
// 	required Type type = 1;
// 	optional SendOrder sendOrder = 2;
// 	optional Stats stats = 3;
// 	}
// 	message SendOrder {
// 	required bytes tokenA = 1;
// 	required bytes tokenB = 2;
// 	required bytes orderType = 3;
// 	required bytes actionType = 4;
// 	required bytes buyPrice = 5;
// 	required bytes sellPrice = 6;
// 	required bytes orderFrm = 7;
// 	required int64 created = 8;
// 	required bytes id = 9;
// 	required bytes status = 10;
// 	}
// 	message Stats {
// 	enum NodeType {
// 			GO = 0;
// 			NODEJS = 1;
// 			BROWSER = 2;
// 	}
// 	repeated bytes connectedPeers = 1;
// 	optional NodeType nodeType = 2;
// 	}
// `)

/**
   * Subscribes to `Chat.topic`. All messages will be
   * forwarded to `messageHandler`
   * @private
  //  */
// join() {
//   this.pubsub.on(this.topic, this._onMessage)
//   this.libp2p.pubsub.subscribe(this.topic)
// }

// leave() {
//   this.libp2p.pubsub.removeListener(this.topic, this._onMessage)
//   this.libp2p.pubsub.unsubscribe(this.topic)
// }

// _onMessage(message) {
//   try {
//     const request = Request.decode(message.data)
//     //console.log(`Send message function :${request.sendMessage.tokenA} : ${request.sendMessage.tokenB} : ${request.sendMessage.orderType} : ${request.sendMessage.actionType} : ${request.sendMessage.price} : ${request.sendMessage.quantity}`)
//     switch (request.type) {
//       case Request.Type.STATS:
//         this.stats.set(message.from, request.stats)
//         console.log('Incoming Stats:', message.from, request.stats)
//         this.emit('stats', this.stats)
//         break
//       default:
//         this.emit('sendOrder', {
//           from: message.from,
//           tokenA: uint8arrayToString(request.sendOrder.tokenA),
//           tokenB: uint8arrayToString(request.sendOrder.tokenB),
//           orderType: uint8arrayToString(request.sendOrder.orderType),
//           actionType: uint8arrayToString(request.sendOrder.actionType),
//           buyPrice: uint8arrayToString(request.sendOrder.buyPrice),
//           sellPrice: uint8arrayToString(request.sendOrder.sellPrice),
//           orderFrm: uint8arrayToString(request.sendOrder.orderFrm),
//           status: uint8arrayToString(request.sendOrder.status),
//           created: request.sendOrder.created,
//           id: uint8arrayToString(request.sendOrder.id),
//         })
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
  //  * Sends the updated stats to the pubsub network
  //  * @param {Array<string>} connectedPeers
  //  */
// async sendStats(connectedPeers) {
//   const msg = Request.encode({
//     type: Request.Type.STATS,
//     stats: {
//       connectedPeers: connectedPeers.map((id) => uint8arrayFromString(id)),
//       nodeType: Stats.NodeType.BROWSER,
//     },
//   })

//   try {
//     await this.libp2p.pubsub.publish(this.topic, msg)
//   } catch (err) {
//     console.error('Could not publish stats update')
//   }
// }

// async send(message) {
//   console.log(`Send message function :${message}`)
//   const msg = Request.encode({
//     type: Request.Type.SEND_MESSAGE,
//     sendMessage: {
//       id: uint8arrayFromString((~~(Math.random() * 1e9)).toString(36) + Date.now()),
//       data: uint8arrayFromString(message),
//       created: Date.now(),
//     },
//   })

//   //console.log(`Topic at send function ${this.topic} and ${msg}`);
//   await this.libp2p.pubsub.publish(this.topic, msg)
// }

// async sendOrder(
//   id,
//   tokenA,
//   tokenB,
//   orderType,
//   actionType,
//   buyPrice,
//   sellPrice,
//   account,
//   status,
//   created,
// ) {
// const msg = Request.encode({
//   type: Request.Type.SEND_ORDER,
//   sendOrder: {
//     id: uint8arrayFromString(id),
//     tokenA: uint8arrayFromString(tokenA.name),
//     tokenB: uint8arrayFromString(tokenB.name),
//     orderType: uint8arrayFromString(orderType.value),
//     actionType: uint8arrayFromString(actionType.name),
//     buyPrice: uint8arrayFromString(buyPrice),
//     sellPrice: uint8arrayFromString(sellPrice),
//     orderFrm: uint8arrayFromString(account),
//     status: uint8arrayFromString(status),
//     created: created,
//   },
// })

//console.log(`Topic at send Order function: ${this.topic}`);
// await this.libp2p.pubsub.publish(this.topic, msg)
//   }
// }
