import protons from "protons"
import EventEmitter from "events"
import uint8arrayFromString from "uint8arrays/from-string"
import uint8arrayToString from "uint8arrays/to-string"
import { TOPIC } from "../constants"
import { useAppDispatch } from "../store/Hooks"

const { Request, Stats } = protons(`
message Request {
  enum Type {
    SEND_ORDER = 0;
    STATS = 1;
  }
  required Type type = 1;
  optional SendOrder sendOrder = 2;
  optional Stats stats = 3;
}
message SendOrder {
  required bytes tokenA = 1;
  required bytes tokenB = 2;
  required bytes orderType = 3;
  required bytes actionType = 4;
  required bytes buyPrice = 5;
  required bytes sellPrice = 6;
  required bytes orderFrm = 7;
  required int64 created = 8;
  required bytes id = 9;
  required bytes status = 10;
}
message Stats {
  enum NodeType {
    GO = 0;
    NODEJS = 1;
    BROWSER = 2;
  }
  repeated bytes connectedPeers = 1;
  optional NodeType nodeType = 2;
}
`)

class MessageHandler extends EventEmitter {
  libp2p: any
  topic: string
  topic_universal: string
  connectedPeers: any
  stats: any

  constructor(libp2p: any, topic: string) {
    super()
    this.libp2p = libp2p
    this.topic = topic

    this.connectedPeers = new Set()
    this.stats = new Map()

    this._onMessage = this._onMessage.bind(this)

    if (this.libp2p.isStarted()) {
      this.join()
    }
  }

  /**
   * Subscribes to `Chat.topic`. All messages will be
   * forwarded to `messageHandler`
   * @private
   */
  join() {
    this.libp2p.pubsub.on(this.topic, this._onMessage)
    this.libp2p.pubsub.subscribe(this.topic)
  }

  leave() {
    this.libp2p.pubsub.removeListener(this.topic, this._onMessage)
    this.libp2p.pubsub.unsubscribe(this.topic)
  }

  _onMessage(message) {
    try {
      const request = Request.decode(message.data)
      //console.log(`Send message function :${request.sendMessage.tokenA} : ${request.sendMessage.tokenB} : ${request.sendMessage.orderType} : ${request.sendMessage.actionType} : ${request.sendMessage.price} : ${request.sendMessage.quantity}`)
      switch (request.type) {
        case Request.Type.STATS:
          this.stats.set(message.from, request.stats)
          console.log("Incoming Stats:", message.from, request.stats)
          this.emit("stats", this.stats)
          break
        default:
          this.emit("sendOrder", {
            from: message.from,
            tokenA: uint8arrayToString(request.sendOrder.tokenA),
            tokenB: uint8arrayToString(request.sendOrder.tokenB),
            orderType: uint8arrayToString(request.sendOrder.orderType),
            actionType: uint8arrayToString(request.sendOrder.actionType),
            buyPrice: uint8arrayToString(request.sendOrder.buyPrice),
            sellPrice: uint8arrayToString(request.sendOrder.sellPrice),
            orderFrm: uint8arrayToString(request.sendOrder.orderFrm),
            status: uint8arrayToString(request.sendOrder.status),
            created: request.sendOrder.created,
            id: uint8arrayToString(request.sendOrder.id),
          })
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Sends the updated stats to the pubsub network
   * @param {Array<string>} connectedPeers
   */
  async sendStats(connectedPeers) {
    const msg = Request.encode({
      type: Request.Type.STATS,
      stats: {
        connectedPeers: connectedPeers.map((id) => uint8arrayFromString(id)),
        nodeType: Stats.NodeType.BROWSER,
      },
    })

    try {
      await this.libp2p.pubsub.publish(this.topic, msg)
    } catch (err) {
      console.error("Could not publish stats update")
    }
  }

  async send(message) {
    console.log(`Send message function :${message}`)
    const msg = Request.encode({
      type: Request.Type.SEND_MESSAGE,
      sendMessage: {
        id: uint8arrayFromString(
          (~~(Math.random() * 1e9)).toString(36) + Date.now()
        ),
        data: uint8arrayFromString(message),
        created: Date.now(),
      },
    })

    //console.log(`Topic at send function ${this.topic} and ${msg}`);
    await this.libp2p.pubsub.publish(this.topic, msg)
  }

  async sendOrder(
    id,
    tokenA,
    tokenB,
    orderType,
    actionType,
    buyPrice,
    sellPrice,
    account,
    status,
    created
  ) {
    //console.log(`Send message function :${tokenA.name} : ${tokenB.name} : ${orderType.value} : ${actionType.name} : ${price} : ${quantity} : ${account}`)
    //console.log(`Status field at sendOrder :${status}`)
    const msg = Request.encode({
      type: Request.Type.SEND_ORDER,
      sendOrder: {
        id: uint8arrayFromString(id),
        tokenA: uint8arrayFromString(tokenA.name),
        tokenB: uint8arrayFromString(tokenB.name),
        orderType: uint8arrayFromString(orderType.value),
        actionType: uint8arrayFromString(actionType.name),
        buyPrice: uint8arrayFromString(buyPrice),
        sellPrice: uint8arrayFromString(sellPrice),
        orderFrm: uint8arrayFromString(account),
        status: uint8arrayFromString(status),
        created: created,
      },
    })

    //console.log(`Topic at send Order function: ${this.topic}`);
    await this.libp2p.pubsub.publish(this.topic, msg)
  }
}

export default MessageHandler
