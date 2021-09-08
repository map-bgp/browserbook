import protons from "protons";
import EventEmitter from "events";

const { Request, Stats } = protons(`
message Request {
  enum Type {
    SEND_MESSAGE = 0;
    UPDATE_PEER = 1;
    STATS = 2;
  }

  required Type type = 1;
  optional SendMessage sendMessage = 2;
  optional UpdatePeer updatePeer = 3;
  optional Stats stats = 4;
}

message SendMessage {
  required bytes data = 1;
  required int64 created = 2;
  required bytes id = 3;
}

message UpdatePeer {
  optional bytes userHandle = 1;
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

    console.log(this.topic);

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

    if (this.libp2p.isStarted()) {
      this.join();
    }

    const msg = {
        id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
        data: Buffer.from("Something to test"),
        created: Date.now(),
    }

    setInterval(()=>{
      this.emit("message",{from:this.libp2p.peerId.toB58String(),
        ...msg})}, 1000)
   }

  join() {
    console.log("joining the subscribption");
    this.libp2p.pubsub.subscribe(this.topic, (message) => {
      try {
        const request = Request.decode(message.data);
        console.log(`Checking the message before event :${request.sendMessage.id}`);
        switch (request.type) {
          case Request.Type.UPDATE_PEER:
            this.emit('peer:update', {
              id: message.from,
              name: request.updatePeer.userHandle.toString()
            })
            break
          case Request.Type.STATS:
            this.stats.set(message.from, request.stats)
            console.log('Incoming Stats:', message.from, request.stats)
            this.emit('stats', this.stats)
            break
          default:
            this.emit('message', {
              from: message.from,
              ...request.sendMessage
            })
        }
      } catch (err) {
        console.error(err);
      }
    })
  }


  leave() {
    this.libp2p.pubsub.unsubscribe(this.topic);
  }

  checkCommand(input) {
    const str = input.toString();
    if (str.startsWith("/")) {
      const args = str.slice(1).split(" ");
      switch (args[0]) {
        case "name":
          this.updatePeer(args[1]);
          return true;
      }
    }
    return false;
  }

  async updatePeer(name) {
    const msg = Request.encode({
      type: Request.Type.UPDATE_PEER,
      updatePeer: {
        userHandle: Buffer.from(name),
      },
    });

    try {
      await this.libp2p.pubsub.publish(this.topic, msg);
    } catch (err) {
      console.error("Could not publish name change");
    }
  }

  async sendStats(connectedPeers) {
    const msg = Request.encode({
      type: Request.Type.STATS,
      stats: {
        connectedPeers,
        nodeType: Stats.NodeType.BROWSER,
      },
    });

    try {
      await this.libp2p.pubsub.publish(this.topic, msg);
    } catch (err) {
      console.error("Could not publish stats update");
    }
  }

  async send(message) {
    console.log(`Send message function :${message}`)
    const msg = Request.encode({
      type: Request.Type.SEND_MESSAGE,
      sendMessage: {
        id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
        data: Buffer.from(message),
        created: Date.now(),
      },
    });

      //console.log(`Topic at send function ${this.topic} and ${msg}`);   
      await this.libp2p.pubsub.publish(this.topic, msg);
  }
}

export default MessageHandler;