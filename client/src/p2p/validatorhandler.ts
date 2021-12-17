import protons from "protons";
import EventEmitter from "events";
import uint8arrayFromString from "uint8arrays/from-string";
import uint8arrayToString from "uint8arrays/to-string";

const { Request, Stats } = protons(`
message Request {
  enum Type {
    SEND_MESSAGE = 0;
    STATS = 1;
    SEND_UPDATE = 2;
    SEND_ORDER = 3;
  }
  required Type type = 1;
  optional SendMessage sendMessage = 2;
  optional Stats stats = 3;
  optional SendUpdate sendUpdate = 4;
  optional SendOrder sendOrder = 5;
}
message SendOrder {
  required bytes id = 1;
  required bytes order1_id = 2;
  required bytes order2_id = 3;
  required bytes tokenA = 4;
  required bytes tokenB = 5;
  required bytes orderType = 6;
  required bytes actionType = 7;
  required bytes price = 8;
  required bytes quantity = 9;
  required bytes orderFrm = 10;
  required int64 created = 11;
  required bytes status = 12;
}
message SendMessage {
  required bytes peerID = 1;
  required int64 created = 2;
  required bytes id = 3;
}
message SendUpdate {
  required bytes id = 1;
  required bytes status = 2;
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

class ValidatorHandler extends EventEmitter {
  libp2p: any;
  topic: string; 
  connectedPeers: any;
  stats: any;
  topicOrder: any;
  
  constructor(libp2p: any, topic: string) {

    super();
    this.libp2p = libp2p;
    this.topic = topic;
    this.topicOrder = "orderUpdates/channel";

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
    this.libp2p.pubsub.on(this.topicOrder, this._onMessage)
    this.libp2p.pubsub.subscribe(this.topic)
    this.libp2p.pubsub.subscribe(this.topicOrder)
  }

  leave () {
    this.libp2p.pubsub.removeListener(this.topic, this._onMessage)
    this.libp2p.pubsub.removeListener(this.topicOrder, this._onMessage)
    this.libp2p.pubsub.unsubscribe(this.topic)
    this.libp2p.pubsub.unsubscribe(this.topicOrder)
  }

  _onMessage (message) {
    try {
      const request = Request.decode(message.data)
      console.log(`onMessage emit function ${request.type}`)
      switch (request.type) {
        case Request.Type.SEND_ORDER:
          this.emit('sendOrder', {
            //from: message.from,
            id: uint8arrayToString(request.sendOrder.id),
            order1_id: uint8arrayToString(request.sendOrder.order1_id),
            order2_id: uint8arrayToString(request.sendOrder.order2_id),
            tokenA: uint8arrayToString(request.sendOrder.tokenA),
            tokenB: uint8arrayToString(request.sendOrder.tokenB),
            orderType: uint8arrayToString(request.sendOrder.orderType),
            actionType: uint8arrayToString(request.sendOrder.actionType),
            price: uint8arrayToString(request.sendOrder.price),
            quantity: uint8arrayToString(request.sendOrder.quantity),
            orderFrm: uint8arrayToString(request.sendOrder.orderFrm),
            status: uint8arrayToString(request.sendOrder.status),
            created: request.sendOrder.created,
          })
          break
        case Request.Type.SEND_UPDATE:
          this.emit('sendUpdate', {
            from: message.from,
            status: uint8arrayToString(request.sendUpdate.status),
            id: uint8arrayToString(request.sendUpdate.id)
          })
          break
        case Request.Type.SEND_MESSAGE:
          this.emit('sendMatcher', {
            from: message.from,
            peerID: uint8arrayToString(request.sendMessage.peerID),
            created: request.sendMessage.created,
            id: uint8arrayToString(request.sendMessage.id)
          })
          break
      }
    } catch (err) {
      console.error(err)
    }
  }

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

  async sendOrder(id, peerID, created) {
   //console.log(`Send message function :${id} : ${peerID} : ${created}`)
    const msg = Request.encode({
      type: Request.Type.SEND_MESSAGE,
      sendMessage: {
        id: uint8arrayFromString(id),
        peerID: uint8arrayFromString(peerID),
        created: created
      }
    });

      //console.log(`Topic at send function: ${this.topic}`);   
      await this.libp2p.pubsub.publish(this.topic, msg);
  }

  async sendOrderUpdate(id, status) {
    //console.log(`Send message function :${id} : ${status} : ${this.topicOrder}`)
     const msg = Request.encode({
       type: Request.Type.SEND_UPDATE,
       sendUpdate: {
         id: uint8arrayFromString(id),
         status: uint8arrayFromString(status)
       }
     });

       //console.log(`Topic at send function: ${this.topic}`);   
       await this.libp2p.pubsub.publish(this.topicOrder, msg);
   }

   async sendMatchedOrder(id, order1_id, order2_id, tokenA, tokenB, orderType, actionType, price, quantity, account, status, created) {
    //console.log(`Send message function : ${order1_id} : ${order2_id} : ${tokenA} : ${tokenB} : ${orderType} : ${actionType} : ${price} : ${quantity} : ${account} : ${status} : ${created}`)
     const msg = Request.encode({
       type: Request.Type.SEND_ORDER,
       sendOrder: {
         id: uint8arrayFromString(id),
         order1_id: uint8arrayFromString(order1_id),
         order2_id: uint8arrayFromString(order2_id),
         tokenA: uint8arrayFromString(tokenA),
         tokenB: uint8arrayFromString(tokenB),
         orderType: uint8arrayFromString(orderType),
         actionType: uint8arrayFromString(actionType),
         price: uint8arrayFromString(price),
         quantity: uint8arrayFromString(quantity),
         orderFrm: uint8arrayFromString(account),
         status: uint8arrayFromString(status),
         created: created
       }
     });

       //console.log(`Topic at send function ${msg.tokenA} : ${msg.orderFrm}`);   
       await this.libp2p.pubsub.publish(this.topicOrder, msg);
   }
}

export default ValidatorHandler;