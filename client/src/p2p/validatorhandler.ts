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
  }
  required Type type = 1;
  optional SendMessage sendMessage = 2;
  optional Stats stats = 3;
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
      switch (request.type) {
        case Request.Type.STATS:
          this.stats.set(message.from, request.stats)
          console.log('Incoming Stats:', message.from, request.stats)
          this.emit('stats', this.stats)
          break
        case Request.Type.SEND_UPDATE:
          this.stats.set(message.from, request.stats)
          console.log('Incoming Stats:', message.from, request.stats)
          this.emit('stats', this.stats)
          break
        default:
          this.emit('message', {
            from: message.from,
            peerID: uint8arrayToString(request.sendMessage.peerID),
            created: request.sendMessage.created,
            id: uint8arrayToString(request.sendMessage.id)
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
    //console.log(`Send message function :${id} : ${peerID} : ${created}`)
     const msg = Request.encode({
       type: Request.Type.SEND_UPDATE,
       sendMessage: {
         id: uint8arrayFromString(id),
         status: uint8arrayFromString(status)
       }
     });
 
       //console.log(`Topic at send function: ${this.topic}`);   
       await this.libp2p.pubsub.publish(this.topic, msg);
   }
  

}

export default ValidatorHandler;