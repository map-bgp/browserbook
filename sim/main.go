package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p-core/host"
	peerstore "github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-core/routing"
	kaddht "github.com/libp2p/go-libp2p-kad-dht"
	mplex "github.com/libp2p/go-libp2p-mplex"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	tls "github.com/libp2p/go-libp2p-tls"
	yamux "github.com/libp2p/go-libp2p-yamux"
	"github.com/libp2p/go-tcp-transport"
	ws "github.com/libp2p/go-ws-transport"
	"github.com/multiformats/go-multiaddr"
)

// ChatRoomBufSize is the number of incoming messages to buffer for each topic.
const TopicStreamBufSize = 128

// ChatRoom represents a subscription to a single PubSub topic. Messages
// can be published to the topic with ChatRoom.Publish, and received
// messages are pushed to the Messages channel.
type TopicStream struct {
	// Messages is a channel of messages received from other peers in the chat room
	Messages chan *TopicMessage

	ctx   context.Context
	ps    *pubsub.PubSub
	topic *pubsub.Topic
	sub   *pubsub.Subscription
	self  peerstore.ID
}

// ChatMessage gets converted to/from JSON and sent in the body of pubsub messages.
type TopicMessage struct {
	Message  string
	SenderID string
}

// JoinChatRoom tries to subscribe to the PubSub topic for the room name, returning
// a ChatRoom on success.
func JoinTopic(ctx context.Context, ps *pubsub.PubSub, selfID peerstore.ID, topicName string) (*TopicStream, error) {
	// join the pubsub topic
	topic, err := ps.Join(topicName)
	if err != nil {
		return nil, err
	}

	sub, err := topic.Subscribe()
	if err != nil {
		return nil, err
	}

	ts := &TopicStream{
		ctx:      ctx,
		ps:       ps,
		topic:    topic,
		sub:      sub,
		self:     selfID,
		Messages: make(chan *TopicMessage, TopicStreamBufSize),
	}

	go ts.readLoop()
	go ts.handleEvents()
	return ts, nil
}

// Publish sends a message to the pubsub topic.
func (ts *TopicStream) Publish(message string) error {
	m := TopicMessage{
		Message:  message,
		SenderID: ts.self.Pretty(),
	}
	msgBytes, err := json.Marshal(m)
	if err != nil {
		return err
	}
	return ts.topic.Publish(ts.ctx, msgBytes)
}

// readLoop pulls messages from the pubsub topic and pushes them onto the Messages channel.
func (ts *TopicStream) readLoop() {
	for {
		msg, err := ts.sub.Next(ts.ctx)
		if err != nil {
			close(ts.Messages)
			return
		}
		// only forward messages delivered by others
		// if msg.ReceivedFrom == ts.self {
		// 	continue
		// }
		tm := new(TopicMessage)
		err = json.Unmarshal(msg.Data, tm)
		if err != nil {
			continue
		}
		// send valid messages onto the Messages channel
		ts.Messages <- tm
	}
}

func (ts *TopicStream) handleEvents() {
	for {
		select {
		case m := <-ts.Messages:
			fmt.Println("Received message:", m.Message)
		}
	}
}

func main() {
	ctx := context.Background()

	transports := libp2p.ChainOptions(
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Transport(ws.New),
	)

	muxers := libp2p.ChainOptions(
		libp2p.Muxer("/yamux/1.0.0", yamux.DefaultTransport),
		libp2p.Muxer("/mplex/6.7.0", mplex.DefaultTransport),
	)

	security := libp2p.Security(tls.ID, tls.New)

	listenAddrs := libp2p.ListenAddrStrings(
		"/ip4/0.0.0.0/tcp/0",
		"/ip4/0.0.0.0/tcp/0/ws",
	)

	var dht *kaddht.IpfsDHT
	newDHT := func(h host.Host) (routing.PeerRouting, error) {
		var err error
		dht, err = kaddht.New(ctx, h)
		return dht, err
	}
	routing := libp2p.Routing(newDHT)

	// start a libp2p node that listens on a random local TCP port,
	node, err := libp2p.New(transports, listenAddrs, muxers, security, routing)
	if err != nil {
		panic(err)
	}

	// bootstrap1, err := multiaddr.NewMultiaddr("/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN")
	// if err != nil {
	// 	panic(err)
	// }

	// bootstrap2, err := multiaddr.NewMultiaddr("/dns4/simpleweb3.ch/tcp/443/wss/p2p-webrtc-star")
	// if err != nil {
	// 	panic(err)
	// }

	// bootstrapPeers := []multiaddr.Multiaddr{bootstrap1}
	// ConnectToBootstrapPeers(ctx, node, bootstrapPeers)

	ps, err := pubsub.NewGossipSub(ctx, node)
	if err != nil {
		panic(err)
	}

	topic := "TEST"
	ts, err := JoinTopic(ctx, ps, node.ID(), topic)
	if err != nil {
		panic(err)
	}

	targetAddr, err := multiaddr.NewMultiaddr("/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star")
	if err != nil {
		panic(err)
	}

	targetInfo, err := peerstore.AddrInfoFromP2pAddr(targetAddr)
	if err != nil {
		panic(err)
	}

	err = node.Connect(ctx, *targetInfo)
	if err != nil {
		panic(err)
	}

	err = dht.Bootstrap(ctx)
	if err != nil {
		panic(err)
	}

	msg := "Hello World"

	fmt.Println("Publishing:", msg)
	ts.Publish(msg)

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	fmt.Println("Received signal, shutting down...")

	// shut the node down
	if err := node.Close(); err != nil {
		panic(err)
	}
}
