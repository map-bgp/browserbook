export {}

// import protons from 'protons'
// import EventEmitter from 'events'
// import uint8arrayFromString from 'uint8arrays/from-string'
// import uint8arrayToString from 'uint8arrays/to-string'
// import { TOPIC_VALIDATOR } from '../constants'

// const { Request, Stats } = protons(`
// message Request {
//   enum Type {
//     SEND_MATCHER = 0;
//     STATS = 1;
//     SEND_UPDATE = 2;
//     SEND_MATCHED_ORDER = 3;
//   }
//   required Type type = 1;
//   optional SendMatcher sendMatcher = 2;
//   optional Stats stats = 3;
//   optional SendUpdate sendUpdate = 4;
//   optional SendMatchedOrder sendMatchedOrder = 5;
// }
// message SendMatchedOrder {
//   required bytes id = 1;
//   required bytes order1_id = 2;
//   required bytes order2_id = 3;
//   required bytes tokenA = 4;
//   required bytes tokenB = 5;
//   required bytes actionType = 6;
//   required bytes amountA = 7;
//   required bytes amountB = 8;
//   required bytes orderFrom = 9;
//   required int64 created = 10;
//   required bytes status = 11;
// }
// message SendMatcher {
//   required bytes peerID = 1;
//   required int64 created = 2;
//   required bytes id = 3;
// }
// message SendUpdate {
//   required bytes id = 1;
//   required bytes status = 2;
// }
// message Stats {
//   enum NodeType {
//     GO = 0;
//     NODEJS = 1;
//     BROWSER = 2;
//   }
//   repeated bytes connectedPeers = 1;
//   optional NodeType nodeType = 2;
// }
// `)

// class ValidatorHandler extends EventEmitter {
//   libp2p: any
//   topic: string
//   connectedPeers: any
//   stats: any
//   topicOrder: any

//   constructor(libp2p: any, topic: string) {
//     super()
//     this.libp2p = libp2p
//     this.topic = topic
//     this.topicOrder = 'orderUpdates/channel'

//     this.connectedPeers = new Set()
//     this.stats = new Map()

//     this._onMessage = this._onMessage.bind(this)
//     if (this.libp2p.isStarted()) {
//       this.join()
//     }
//   }

//   /**
//    * Subscribes to `Chat.topic`. All messages will be
//    * forwarded to `messageHandler`
//    * @private
//    */
//   join() {
//     this.libp2p.pubsub.on(this.topic, this._onMessage)
//     this.libp2p.pubsub.on(this.topicOrder, this._onMessage)
//     this.libp2p.pubsub.subscribe(this.topic)
//     this.libp2p.pubsub.subscribe(this.topicOrder)
//   }

//   leave() {
//     this.libp2p.pubsub.removeListener(this.topic, this._onMessage)
//     this.libp2p.pubsub.removeListener(this.topicOrder, this._onMessage)
//     this.libp2p.pubsub.unsubscribe(this.topic)
//     this.libp2p.pubsub.unsubscribe(this.topicOrder)
//   }

//   _onMessage(message) {
//     try {
//       const request = Request.decode(message.data)
//       //console.log(`onMessage emit function`)
//       switch (request.type) {
//         case Request.Type.SEND_MATCHED_ORDER:
//           console.log(`Emitting the sendMatched Order`)
//           this.emit('sendMatchedOrder', {
//             id: uint8arrayToString(request.sendMatchedOrder.id),
//             order1_id: uint8arrayToString(request.sendMatchedOrder.order1_id),
//             order2_id: uint8arrayToString(request.sendMatchedOrder.order2_id),
//             tokenA: uint8arrayToString(request.sendMatchedOrder.tokenA),
//             tokenB: uint8arrayToString(request.sendMatchedOrder.tokenB),
//             actionType: uint8arrayToString(request.sendMatchedOrder.actionType),
//             amountA: uint8arrayToString(request.sendMatchedOrder.amountA),
//             amountB: uint8arrayToString(request.sendMatchedOrder.amountB),
//             orderFrom: uint8arrayToString(request.sendMatchedOrder.orderFrom),
//             status: uint8arrayToString(request.sendMatchedOrder.status),
//             created: request.sendMatchedOrder.created,
//           })
//           break
//         case Request.Type.SEND_UPDATE:
//           this.emit('sendUpdate', {
//             from: message.from,
//             status: uint8arrayToString(request.sendUpdate.status),
//             id: uint8arrayToString(request.sendUpdate.id),
//           })
//           break
//         case Request.Type.SEND_MATCHER:
//           this.emit('sendMatcher', {
//             from: message.from,
//             peerID: uint8arrayToString(request.sendMatcher.peerID),
//             created: request.sendMatcher.created,
//             id: uint8arrayToString(request.sendMatcher.id),
//           })
//           break
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   /**
//    * Sends the updated stats to the pubsub network
//    * @param {Array<string>} connectedPeers
//    */
//   async sendStats(connectedPeers) {
//     const msg = Request.encode({
//       type: Request.Type.STATS,
//       stats: {
//         connectedPeers: connectedPeers.map((id) => uint8arrayFromString(id)),
//         nodeType: Stats.NodeType.BROWSER,
//       },
//     })

//     try {
//       await this.libp2p.pubsub.publish(this.topic, msg)
//     } catch (err) {
//       console.error('Could not publish stats update')
//     }
//   }

//   async sendMatcher(id, peerID, created) {
//     //console.log(`Send message function :${id} : ${peerID} : ${created}`)
//     const msg = Request.encode({
//       type: Request.Type.SEND_MATCHER,
//       sendMatcher: {
//         id: uint8arrayFromString(id),
//         peerID: uint8arrayFromString(peerID),
//         created: created,
//       },
//     })

//     //console.log(`Topic at send function: ${this.topic}`);
//     await this.libp2p.pubsub.publish(TOPIC_VALIDATOR, msg)
//   }

//   async sendOrderUpdate(id, status) {
//     //console.log(`Send message function :${id} : ${status} : ${this.topicOrder}`)
//     const msg = Request.encode({
//       type: Request.Type.SEND_UPDATE,
//       sendUpdate: {
//         id: uint8arrayFromString(id),
//         status: uint8arrayFromString(status),
//       },
//     })

//     //console.log(`Topic at send function: ${this.topic}`);
//     await this.libp2p.pubsub.publish(this.topicOrder, msg)
//   }

//   async sendMatchedOrder(
//     id,
//     order1_id,
//     order2_id,
//     tokenA,
//     tokenB,
//     actionType,
//     amountA,
//     amountB,
//     account,
//     status,
//     created,
//   ) {
//     //console.log(`Send message function : ${order1_id} : ${order2_id} : ${tokenA} : ${tokenB} : ${orderType} : ${actionType} : ${price} : ${quantity} : ${account} : ${status} : ${created}`)
//     const msg = Request.encode({
//       type: Request.Type.SEND_MATCHED_ORDER,
//       sendMatchedOrder: {
//         id: uint8arrayFromString(id),
//         order1_id: uint8arrayFromString(order1_id),
//         order2_id: uint8arrayFromString(order2_id),
//         tokenA: uint8arrayFromString(tokenA),
//         tokenB: uint8arrayFromString(tokenB),
//         actionType: uint8arrayFromString(actionType),
//         amountA: uint8arrayFromString(amountA),
//         amountB: uint8arrayFromString(amountB),
//         orderFrom: uint8arrayFromString(account),
//         status: uint8arrayFromString(status),
//         created: created,
//       },
//     })

//     //console.log(`Topic at send function ${msg.tokenA} : ${msg.orderFrm}`);
//     await this.libp2p.pubsub.publish(this.topicOrder, msg)
//   }
// }

// export default ValidatorHandler
