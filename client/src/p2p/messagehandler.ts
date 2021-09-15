import protons from "protons";
import EventEmitter from "events";
import uint8arrayFromString from "uint8arrays/from-string";
import uint8arrayToString from "uint8arrays/to-string";
import { TOPIC } from "../constants";

const { Request, Stats } = protons(`
message Request {
  enum Type {
    SEND_MESSAGE = 0;
    STATS = 1;
  }
  required Type type = 1;
  optional SendMessage sendMessage = 2;
  optional Stats stats = 3;
}
message SendMessage {
  required bytes tokenA = 1;
  required bytes tokenB = 2;
  required bytes orderType = 3;
  required bytes actionType = 4;
  required bytes price = 5;
  required bytes quantity = 6;
  required int64 created = 7;
  required bytes id = 8;
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
  libp2p: any;
  topic: string; 
  connectedPeers: any;
  stats: any;
  
  constructor(libp2p: any, topic: string) {

    super();
    this.libp2p = libp2p;
    this.topic = topic;

    this.connectedPeers = new Set();
    this.stats = new Map();

    this.libp2p.connectionManager.on("peer:connect", (connection) => {
      console.log("Connected to", connection.remotePeer.toB58String());
      if (this.connectedPeers.has(connection.remotePeer.toB58String())) return;
      this.connectedPeers.add(connection.remotePeer.toB58String());
      this.sendStats(Array.from(this.connectedPeers));
    });

    this.libp2p.connectionManager.on("peer:disconnect", (connection) => {
      console.log("Disconnected from", connection.remotePeer.toB58String());
      if (this.connectedPeers.delete(connection.remotePeer.toB58String())) {
        this.sendStats(Array.from(this.connectedPeers));
      }
    });

    this._onMessage = this._onMessage.bind(this)
    //this._onOrder = this._onOrder.bind(this)

    if (this.libp2p.isStarted()) {
      this.join();
    }
   }

    /**
   * Subscribes to `Chat.topic`. All messages will be
   * forwarded to `messageHandler`
   * @private
   */
  join () {
    this.libp2p.pubsub.on(this.topic, this._onMessage)
    this.libp2p.pubsub.subscribe(this.topic)
  }

  leave () {
    this.libp2p.pubsub.removeListener(this.topic, this._onMessage)
    this.libp2p.pubsub.unsubscribe(this.topic)
  }

  _onMessage (message) {
    try {
      const request = Request.decode(message.data)
      //console.log(`Send message function :${request.sendMessage.tokenA} : ${request.sendMessage.tokenB} : ${request.sendMessage.orderType} : ${request.sendMessage.actionType} : ${request.sendMessage.price} : ${request.sendMessage.quantity}`)
      //console.log(`OnOrder function reached ${request.sendMessage.tokenA}`)
      switch (request.type) {
        case Request.Type.STATS:
          this.stats.set(message.from, request.stats)
          console.log('Incoming Stats:', message.from, request.stats)
          this.emit('stats', this.stats)
          break
        default:
          this.emit('message', {
            from: message.from,
            tokenA: uint8arrayToString(request.sendMessage.tokenA),
            tokenB: uint8arrayToString(request.sendMessage.tokenB),
            orderType: uint8arrayToString(request.sendMessage.orderType),
            actionType: uint8arrayToString(request.sendMessage.actionType),
            price: uint8arrayToString(request.sendMessage.price),
            quantity: uint8arrayToString(request.sendMessage.quantity),
            created: request.sendMessage.created,
            id: uint8arrayToString(request.sendMessage.id)
          })
      }
    } catch (err) {
      console.error(err)
    }
  }

  // _onMessage (message) {
  //   try {
  //     const request = Request.decode(message.data)
  //     switch (request.type) {
  //       case Request.Type.STATS:
  //         this.stats.set(message.from, request.stats)
  //         console.log('Incoming Stats:', message.from, request.stats)
  //         this.emit('stats', this.stats)
  //         break
  //       default:
  //         this.emit('message', {
  //           from: message.from,
  //           data: uint8arrayToString(request.sendMessage.data),
  //           created: request.sendMessage.created,
  //           id: uint8arrayToString(request.sendMessage.id)
  //         })
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

   /**
   * Sends the updated stats to the pubsub network
   * @param {Array<string>} connectedPeers
   */
    async sendStats (connectedPeers) {
      const msg = Request.encode({
        type: Request.Type.STATS,
        stats: {
          connectedPeers: connectedPeers.map(id => uint8arrayFromString(id)),
          nodeType: Stats.NodeType.BROWSER
        }
      })
  
      try {
        await this.libp2p.pubsub.publish(this.topic, msg)
      } catch (err) {
        console.error('Could not publish stats update')
      }
    }

  async send(message) {
    console.log(`Send message function :${message}`)
    const msg = Request.encode({
      type: Request.Type.SEND_MESSAGE,
      sendMessage: {
        id: uint8arrayFromString((~~(Math.random() * 1e9)).toString(36) + Date.now()),
        data: uint8arrayFromString(message),
        created: Date.now()
      }
    });

      //console.log(`Topic at send function ${this.topic} and ${msg}`);   
      await this.libp2p.pubsub.publish(this.topic, msg);
  }

  async sendOrder(tokenA, tokenB, orderType, actionType, price, quantity) {
    //console.log(`Send message function :${tokenA.name} : ${tokenB.name} : ${orderType.value} : ${actionType.name} : ${price} : ${quantity}`)
    const msg = Request.encode({
      type: Request.Type.SEND_MESSAGE,
      sendMessage: {
        id: uint8arrayFromString((~~(Math.random() * 1e9)).toString(36) + Date.now()),
        tokenA: uint8arrayFromString(tokenA.name),
        tokenB: uint8arrayFromString(tokenB.name),
        orderType: uint8arrayFromString(orderType.value),
        actionType: uint8arrayFromString(actionType.name),
        price: uint8arrayFromString(price),
        quantity: uint8arrayFromString(quantity),
        created: Date.now()
      }
    });

      //console.log(`Topic at send function ${this.topic} and ${uint8arrayToString(msg.token1)}`);   
      await this.libp2p.pubsub.publish(this.topic, msg);
  }

}


export default MessageHandler;