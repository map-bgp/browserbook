package main

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"time"

	"syscall"

	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p-core/crypto"
	peer "github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-peerstore/pstoremem"
	star "github.com/mtojek/go-libp2p-webrtc-star"
	"github.com/multiformats/go-multiaddr"
	"github.com/pion/webrtc/v2"

	pubsub "github.com/libp2p/go-libp2p-pubsub"
	yamux "github.com/libp2p/go-libp2p-yamux"
)

// TopicStreamBufSize is the number of incoming messages to buffer for each topic.
const TopicStreamBufSize = 128

// Boolean Flag
var publish = false

// TopicStream represents a subscription to a single PubSub topic. Messages
// can be published to the topic with TopicStream.Publish, and received
// messages are pushed to the Messages channel.
type TopicStream struct {
	// Messages is a channel of messages received from other peers in the chat room
	Messages chan *TopicMessage

	ctx   context.Context
	ps    *pubsub.PubSub
	topic *pubsub.Topic
	sub   *pubsub.Subscription
	self  peer.ID
}

// TopicMessage gets converted to/from JSON and sent in the body of pubsub messages.
type TopicMessage struct {
	Message  string
	SenderID string
}

// JoinTopic tries to subscribe to the PubSub topic for the room name, returning
// a TopicStream on success.
func JoinTopic(ctx context.Context, ps *pubsub.PubSub, selfID peer.ID, topicName string) (*TopicStream, error) {
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
		if msg.ReceivedFrom == ts.self {
			continue
		}
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
	flag.BoolVar(&publish, "publish", false, "Node should test publish functionality")
	flag.Parse()

	ctx := context.Background()

	// transports := libp2p.ChainOptions(
	// 	libp2p.Transport(tcp.NewTCPTransport),
	// 	libp2p.Transport(ws.New),
	// )

	// muxers := libp2p.ChainOptions(
	// 	libp2p.Muxer("/yamux/1.0.0", yamux.DefaultTransport),
	// 	libp2p.Muxer("/mplex/6.7.0", mplex.DefaultTransport),
	// )

	// security := libp2p.Security(tls.ID, tls.New)

	// listenAddrs := libp2p.ListenAddrStrings(
	// 	"/ip4/0.0.0.0/tcp/0",
	// 	"/ip4/0.0.0.0/tcp/0/ws",
	// )

	starMultiaddr, err := multiaddr.NewMultiaddr("/dns4/localhost/tcp/9090/ws/p2p-webrtc-star")
	privateKey, _, err := crypto.GenerateKeyPairWithReader(crypto.RSA, 2048, rand.Reader)
	identity, err := peer.IDFromPublicKey(privateKey.GetPublic())
	peerstore, err := pstoremem.NewPeerstore()
	muxer := yamux.DefaultTransport

	starTransport := star.New(identity, peerstore, muxer).
		WithSignalConfiguration(star.SignalConfiguration{
			URLPath: "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
		}).
		WithWebRTCConfiguration(webrtc.Configuration{
			ICEServers: []webrtc.ICEServer{
				{
					URLs: []string{
						"stun:stun.l.google.com:19302",
						"stun:stun1.l.google.com:19302",
						"stun:stun2.l.google.com:19302",
						"stun:stun3.l.google.com:19302",
						"stun:stun4.l.google.com:19302",
					},
				},
			},
		})

	node, err := libp2p.New(
		libp2p.Identity(privateKey),
		libp2p.ListenAddrs(starMultiaddr),
		libp2p.Peerstore(peerstore),
		libp2p.Transport(starTransport),
		libp2p.Muxer("/yamux/1.0.0", muxer))

	// start a libp2p node that listens on a random local TCP port,
	// node, err := libp2p.New(transports, listenAddrs, muxers, security)
	// if err != nil {
	// 	panic(err)
	// }

	// kdht, err := dht.New(ctx, node)
	// if err != nil {
	// 	panic(err)
	// }

	// if err = kdht.Bootstrap(ctx); err != nil {
	// 	panic(err)
	// }

	// // /dns4/simpleweb3.ch/tcp/443/wss/p2p-webrtc-star
	// bootstrap1, err := multiaddr.NewMultiaddr("/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN")
	// bootstrapPeers := []multiaddr.Multiaddr{bootstrap1}

	var wg sync.WaitGroup
	// for _, peerAddr := range bootstrapPeers {
	// 	peerinfo, _ := peer.AddrInfoFromP2pAddr(peerAddr)
	// 	wg.Add(1)
	// 	go func() {
	// 		defer wg.Done()
	// 		if err := node.Connect(ctx, *peerinfo); err != nil {
	// 			fmt.Println(err)
	// 		} else {
	// 			fmt.Println("Connection established with bootstrap node:", *peerinfo)
	// 		}
	// 	}()
	// }
	// wg.Wait()

	ps, err := pubsub.NewGossipSub(ctx, node)
	// ps, err := pubsub.NewGossipSub(ctx, node, pubsub.WithDiscovery(discovery.NewRoutingDiscovery(kdht)))
	if err != nil {
		panic(err)
	}

	topic := "TEST"
	ts, err := JoinTopic(ctx, ps, node.ID(), topic)
	if err != nil {
		panic(err)
	}

	if publish {
		wg.Add(1)
		func() {
			defer wg.Done()
			for i := 1; i < 10; i++ {
				msg := "Hello World"
				fmt.Println("Publishing:", msg)
				ts.Publish(msg)
				time.Sleep(10 * time.Second)
			}
		}()
		wg.Wait()
	}

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	fmt.Println("Received signal, shutting down...")

	// shut the node down
	if err := node.Close(); err != nil {
		panic(err)
	}
}
