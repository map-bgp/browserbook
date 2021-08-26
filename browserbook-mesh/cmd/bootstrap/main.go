// +build !js

// mesh-bootstrap is a separate executable for bootstrap nodes. Bootstrap nodes
// will not share or receive any orders and its sole responsibility is to
// facilitate peer discovery and/or serve as a relay for peer connections.
package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	leveldbStore "github.com/ipfs/go-ds-leveldb"
	_ "github.com/lib/pq" // postgres driver
	libp2p "github.com/libp2p/go-libp2p"
	autonat "github.com/libp2p/go-libp2p-autonat-svc"
	circuit "github.com/libp2p/go-libp2p-circuit"
	connmgr "github.com/libp2p/go-libp2p-connmgr"
	p2pcrypto "github.com/libp2p/go-libp2p-core/crypto"
	"github.com/libp2p/go-libp2p-core/host"
	"github.com/libp2p/go-libp2p-core/metrics"
	p2pnet "github.com/libp2p/go-libp2p-core/network"
	"github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-core/protocol"
	"github.com/libp2p/go-libp2p-core/routing"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p-peerstore/pstoreds"
	secio "github.com/libp2p/go-libp2p-secio"
	"github.com/libp2p/go-libp2p/p2p/host/relay"
	filter "github.com/libp2p/go-maddr-filter"
	"github.com/map-bgp/browserbook/browserbook-mesh/keys"
	ma "github.com/multiformats/go-multiaddr"
	"github.com/plaid/go-envvar/envvar"
	log "github.com/sirupsen/logrus"
)

const (
	// peerGraceDuration is the amount of time a newly opened connection is given
	// before it becomes subject to pruning.
	peerGraceDuration = 10 * time.Second

	//DHTProtocolID = protocol.ID("/0x-mesh-dht/version/1")
	DHTProtocolID = protocol.ID("/0x-mesh/order-sync/version/0")
	// defaultNetworkTimeout is the default timeout for network requests (e.g.
	// connecting to a new peer).
	defaultNetworkTimeout = 10 * time.Second
)

// DefaultBootstrapList is a list of addresses to use by default for
// bootstrapping the DHT.
var DefaultBootstrapList = []string{
	// bootstrap nodes
	//"/ip4/34.136.24.16/tcp/4002/ws/ipfs/16Uiu2HAm99ALo8ZDYWxswanKRgN7aQkod9RtfQiHuatjDX6igDyb",
	"/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
	"/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
	"/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
	"/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
	"/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
	// "/ip4/3.214.190.67/tcp/60558/ipfs/16Uiu2HAmGx8Z6gdq5T5AQE54GMtqDhDFhizywTy1o28NJbAMMumF",
	// "/ip4/3.214.190.67/tcp/60559/ws/ipfs/16Uiu2HAmGx8Z6gdq5T5AQE54GMtqDhDFhizywTy1o28NJbAMMumF",
	// "/dns4/bootstrap-0.mesh.0x.org/tcp/60558/ipfs/16Uiu2HAmGx8Z6gdq5T5AQE54GMtqDhDFhizywTy1o28NJbAMMumF",
	// "/dns4/bootstrap-0.mesh.0x.org/tcp/60559/ws/ipfs/16Uiu2HAmGx8Z6gdq5T5AQE54GMtqDhDFhizywTy1o28NJbAMMumF",
	// "/dns4/bootstrap-0.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAmGx8Z6gdq5T5AQE54GMtqDhDFhizywTy1o28NJbAMMumF",
	// "/ip4/18.200.96.60/tcp/60558/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	// "/ip4/18.200.96.60/tcp/60559/ws/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	// "/dns4/bootstrap-1.mesh.0x.org/tcp/60558/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	// "/dns4/bootstrap-1.mesh.0x.org/tcp/60559/ws/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	// "/dns4/bootstrap-1.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	// "/ip4/13.232.193.142/tcp/60558/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
	// "/ip4/13.232.193.142/tcp/60559/ws/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
	// "/dns4/bootstrap-2.mesh.0x.org/tcp/60558/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
	// "/dns4/bootstrap-2.mesh.0x.org/tcp/60559/ws/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
	// "/dns4/bootstrap-2.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",

	// // relay nodes
	// // We could consider hard-coding these at the circuit-relay level. See
	// // https://github.com/libp2p/go-libp2p/pull/705. Hard-coding them in the
	// // bootstrap list is likely good enough for now.
	// "/ip4/167.172.201.142/tcp/60558/ipfs/16Uiu2HAkzuS8DfyZ2CPzZbxGCXLSHvvbvh8nvGCHjY6wEXe2jhAm",
	// "/dns4/fra1.relayer.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAkzuS8DfyZ2CPzZbxGCXLSHvvbvh8nvGCHjY6wEXe2jhAm",
	// "/ip4/167.172.201.142/tcp/60558/ipfs/16Uiu2HAmM1dkXwZK5HsnknGFxzPBLuCw4EboiC2sdwKrPJZ6kcio",
	// "/dns4/sfo2.relayer.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAmM1dkXwZK5HsnknGFxzPBLuCw4EboiC2sdwKrPJZ6kcio",
	// "/ip4/159.65.4.82/tcp/60558/ipfs/16Uiu2HAm9brLYhoM1wCTRtGRR7ZqXhk8kfEt6a2rSFSZpeV8eB7L",
	// "/dns4/sgp1.relayer.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAm9brLYhoM1wCTRtGRR7ZqXhk8kfEt6a2rSFSZpeV8eB7L",

	// // These nodes are provided by the libp2p community on a best-effort basis.
	// // We're using them as a backup for increased redundancy.
	// "/ip4/34.201.54.78/tcp/4001/ipfs/12D3KooWHwJDdbx73qiBpSCJfg4RuYyzqnLUwfLBqzn77TSy7kRX",
	// "/ip4/18.204.221.103/tcp/4001/ipfs/12D3KooWQS6Gsr2kLZvF7DVtoRFtj24aar5jvz88LvJePrawM3EM",
}

// Config contains configuration options for a Node.
type Config struct {
	// Verbosity is the logging verbosity: 0=panic, 1=fatal, 2=error, 3=warn, 4=info, 5=debug 6=trace
	Verbosity int `envvar:"VERBOSITY" default:"5"`
	// P2PBindAddrs is a comma separated list of libp2p multiaddresses which the
	// bootstrap node will bind to.
	P2PBindAddrs string `envvar:"P2P_BIND_ADDRS"`
	// P2PAdvertiseAddrs is a comma separated list of libp2p multiaddresses which the
	// bootstrap node will advertise to peers.
	P2PAdvertiseAddrs string `envvar:"P2P_ADVERTISE_ADDRS"`
	// DataStoreType is the data store which will be used to store DHT data
	// for the bootstrap node.
	// DataStoreType can be either: leveldb or sqldb
	DataStoreType string `envvar:"DATA_STORE_TYPE" default:"leveldb"`
	// LevelDBDataDir is the directory used for storing data when using leveldb as data store type.
	LevelDBDataDir string `envvar:"LEVELDB_DATA_DIR" default:"0x_mesh"`
	// UseBootstrapList determines whether or not to use the list of hard-coded
	// peers to bootstrap the DHT for peer discovery.
	UseBootstrapList bool `envvar:"USE_BOOTSTRAP_LIST" default:"true"`
	// BootstrapList is a comma-separated list of multiaddresses to use for
	// bootstrapping the DHT (e.g.,
	// "/ip4/3.214.190.67/tcp/60558/ipfs/16Uiu2HAmGx8Z6gdq5T5AQE54GMtqDhDFhizywTy1o28NJbAMMumF").
	// If empty, the default bootstrap list will be used.
	BootstrapList string `envvar:"BOOTSTRAP_LIST" default:""`
	// EnableRelayHost is whether or not the node should serve as a relay host.
	// Defaults to true.
	EnableRelayHost bool `envvar:"ENABLE_RELAY_HOST" default:"true"`
	// PeerCountLow is the target number of peers to connect to at any given time.
	// Defaults to 100.
	PeerCountLow int `envvar:"PEER_COUNT_LOW" default:"100"`
	// PeerCountHigh is the maximum number of peers to be connected to. If the
	// number of connections exceeds this number, we will prune connections until
	// we reach PeerCountLow. Defaults to 110.
	PeerCountHigh int `envvar:"PEER_COUNT_HIGH" default:"110"`
	// MaxBytesPerSecond is the maximum number of bytes per second that a peer is
	// allowed to send before failing the bandwidth check. Defaults to 5 MiB.
	MaxBytesPerSecond float64 `envvar:"MAX_BYTES_PER_SECOND" default:"5242880"`
}

func init() {
	// Since we know that the bootstrap nodes are more stable, we can
	// safely reduce AdvertiseBootDelay. This will allow the bootstrap nodes to
	// advertise themselves as relays sooner.
	relay.AdvertiseBootDelay = 30 * time.Second
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Parse env vars
	var config Config
	if err := envvar.Parse(&config); err != nil {
		panic(fmt.Sprintf("could not parse environment variables: %s", err.Error()))
	}

	// Configure logger to output JSON
	// TODO(albrow): Don't use global settings for logger.
	log.SetFormatter(&log.JSONFormatter{})
	log.SetLevel(log.Level(config.Verbosity))
	// log.AddHook(loghooks.NewKeySuffixHook())

	// Parse private key file and add peer ID log hook
	privKey, err := initPrivateKey(getPrivateKeyPath(config))
	if err != nil {
		log.WithField("error", err).Fatal("could not initialize private key")
	}
	peerID, err := peer.IDFromPrivateKey(privKey)
	if err != nil {
		log.Fatal(err)
	}
	log.WithField("peer_id", peerID).Info("Generated PeerID")

	// We need to declare the newDHT function ahead of time so we can use it in
	// the libp2p.Routing option.
	var kadDHT *dht.IpfsDHT
	newDHT := func(h host.Host) (routing.PeerRouting, error) {
		var err error
		dhtDir := getDHTDir(config)
		// Set up the DHT to use LevelDB.
		store, err := leveldbStore.NewDatastore(dhtDir, nil)
		if err != nil {
			return nil, err
		}
		kadDHT, err = dht.New(ctx, h, dht.Datastore(store), dht.V1ProtocolOverride(DHTProtocolID), dht.Mode(dht.ModeServer))
		if err != nil {
			log.WithField("error", err).Fatal("could not create DHT")
		}
		return kadDHT, err
	}

	// Set up the peerstore to use LevelDB.
	store, err := leveldbStore.NewDatastore(getPeerstoreDir(config), nil)
	if err != nil {
		log.Fatal(err)
	}

	peerStore, err := pstoreds.NewPeerstore(ctx, store, pstoreds.DefaultOpts())
	if err != nil {
		log.Fatal(err)
	}

	// Parse multiaddresses given in the config
	bindAddrs, err := parseAddrs(config.P2PBindAddrs)
	if err != nil {
		log.Fatal(err)
	}
	log.Info(bindAddrs)
	advertiseAddrs, err := parseAddrs(config.P2PAdvertiseAddrs)
	if err != nil {
		log.Fatal(err)
	}

	// Initialize filters.
	filters := filter.NewFilters()

	// Set up the transport and the host.
	connManager := connmgr.NewConnManager(config.PeerCountLow, config.PeerCountHigh, peerGraceDuration)
	bandwidthCounter := metrics.NewBandwidthCounter()
	opts := []libp2p.Option{
		libp2p.ListenAddrs(bindAddrs...),
		libp2p.Identity(privKey),
		libp2p.ConnectionManager(connManager),
		libp2p.EnableAutoRelay(),
		libp2p.Routing(newDHT),
		libp2p.AddrsFactory(newAddrsFactory(advertiseAddrs)),
		libp2p.BandwidthReporter(bandwidthCounter),
		libp2p.Peerstore(peerStore),
		// TODO(jalextowle): This should be changed to libp2p.ConnectionGater
		// after v10
		libp2p.Filters(filters), //nolint:staticcheck
		libp2p.Security(secio.ID, secio.New),
	}

	if config.EnableRelayHost {
		opts = append(opts, libp2p.EnableRelay(circuit.OptHop))
	} else {
		opts = append(opts, libp2p.EnableRelay())
	}
	basicHost, err := libp2p.New(ctx, opts...)
	if err != nil {
		log.WithField("error", err).Fatal("could not create host")
	}

	// Set up the notifee.
	basicHost.Network().Notify(&notifee{})

	// Enable AutoNAT service.
	if _, err := autonat.NewAutoNATService(ctx, basicHost, true); err != nil {
		log.WithField("error", err).Fatal("could not enable AutoNAT service")
	}

	// Initialize the DHT and then connect to the other bootstrap nodes.
	if err := kadDHT.Bootstrap(ctx); err != nil {
		log.WithField("error", err).Fatal("could not bootstrap DHT")
	}

	// // Configure banner.
	// banner := banner.New(ctx, banner.Config{
	// 	Host:                   basicHost,
	// 	Filters:                filters,
	// 	BandwidthCounter:       bandwidthCounter,
	// 	MaxBytesPerSecond:      config.MaxBytesPerSecond,
	// 	LogBandwidthUsageStats: true,
	// })

	if config.UseBootstrapList {
		bootstrapList := DefaultBootstrapList
		if config.BootstrapList != "" {
			bootstrapList = strings.Split(config.BootstrapList, ",")
		}
		if err := ConnectToBootstrapList(ctx, basicHost, bootstrapList); err != nil {
			log.WithField("error", err).Fatal("could not connect to bootstrap peers")
		}

		// // Protect each other bootstrap peer via the connection manager so that we
		// // maintain an active connection to them. Also prevent other bootstrap nodes
		// // from being banned.
		// bootstrapAddrInfos, err := p2p.BootstrapListToAddrInfos(bootstrapList)
		// if err != nil {
		// 	log.WithField("error", err).Fatal("could not parse bootstrap list")
		// }

		// // for _, addrInfo := range bootstrapAddrInfos {
		// // 	connManager.Protect(addrInfo.ID, "bootstrap-peer")
		// // 	for _, addr := range addrInfo.Addrs {
		// // 		_ = banner.ProtectIP(addr)
		// // 	}
		// // }

	}

	log.WithFields(map[string]interface{}{
		"addrs":  basicHost.Addrs(),
		"config": config,
	}).Info("started bootstrap node")

	// Sleep until stopped
	select {}
}

// notifee receives notifications for network-related events.
type notifee struct{}

var _ p2pnet.Notifiee = &notifee{}

// Listen is called when network starts listening on an addr
func (n *notifee) Listen(p2pnet.Network, ma.Multiaddr) {}

// ListenClose is called when network stops listening on an addr
func (n *notifee) ListenClose(p2pnet.Network, ma.Multiaddr) {}

// Connected is called when a connection opened
func (n *notifee) Connected(network p2pnet.Network, conn p2pnet.Conn) {
	log.WithFields(map[string]interface{}{
		"remotePeerID":       conn.RemotePeer(),
		"remoteMultiaddress": conn.RemoteMultiaddr(),
	}).Info("connected to peer")
}

// Disconnected is called when a connection closed
func (n *notifee) Disconnected(network p2pnet.Network, conn p2pnet.Conn) {
	log.WithFields(map[string]interface{}{
		"remotePeerID":       conn.RemotePeer(),
		"remoteMultiaddress": conn.RemoteMultiaddr(),
	}).Info("disconnected from peer")
}

// OpenedStream is called when a stream opened
func (n *notifee) OpenedStream(network p2pnet.Network, stream p2pnet.Stream) {}

// ClosedStream is called when a stream closed
func (n *notifee) ClosedStream(network p2pnet.Network, stream p2pnet.Stream) {}

func newAddrsFactory(advertiseAddrs []ma.Multiaddr) func([]ma.Multiaddr) []ma.Multiaddr {
	return func([]ma.Multiaddr) []ma.Multiaddr {
		return advertiseAddrs
	}
}

func parseAddrs(commaSeparatedAddrs string) ([]ma.Multiaddr, error) {
	maddrStrings := strings.Split(commaSeparatedAddrs, ",")
	maddrs := make([]ma.Multiaddr, len(maddrStrings))
	for i, maddrString := range maddrStrings {
		log.Info(maddrString)
		ma, err := ma.NewMultiaddr(maddrString)
		if err != nil {
			return nil, err
		}
		maddrs[i] = ma
	}
	return maddrs, nil
}

func getPrivateKeyPath(config Config) string {
	return filepath.Join(config.LevelDBDataDir, "keys", "privkey")
}

func getDHTDir(config Config) string {
	return filepath.Join(config.LevelDBDataDir, "p2p", "dht")
}

func getPeerstoreDir(config Config) string {
	return filepath.Join(config.LevelDBDataDir, "p2p", "peerstore")
}

func initPrivateKey(path string) (p2pcrypto.PrivKey, error) {
	privKey, err := keys.GetPrivateKeyFromPath(path)
	if err == nil {
		return privKey, nil
	} else if os.IsNotExist(err) {
		// If the private key doesn't exist, generate one.
		log.Info("No private key found. Generating a new one.")
		return keys.GenerateAndSavePrivateKey(path)
	}

	// For any other type of error, return it.
	return nil, err
}

func BootstrapListToAddrInfos(bootstrapList []string) ([]peer.AddrInfo, error) {
	maddrs := make([]ma.Multiaddr, len(bootstrapList))
	for i, addrString := range bootstrapList {
		maddr, err := ma.NewMultiaddr(addrString)
		if err != nil {
			return nil, err
		}
		maddrs[i] = maddr
	}
	return peer.AddrInfosFromP2pAddrs(maddrs...)
}

func ConnectToBootstrapList(ctx context.Context, host host.Host, bootstrapList []string) error {
	log.WithField("bootstrapList", bootstrapList).Info("connecting to bootstrap peers")
	bootstrapAddrInfos, err := BootstrapListToAddrInfos(bootstrapList)
	if err != nil {
		return err
	}
	connectCtx, cancel := context.WithTimeout(ctx, defaultNetworkTimeout)
	defer cancel()
	wg := sync.WaitGroup{}
	for _, peerInfo := range bootstrapAddrInfos {
		if peerInfo.ID == host.ID() {
			// Don't connect to self.
			continue
		}
		wg.Add(1)
		go func(peerInfo peer.AddrInfo) {
			defer wg.Done()
			if err := host.Connect(connectCtx, peerInfo); err != nil {
				log.WithFields(map[string]interface{}{
					"error":    err.Error(),
					"peerInfo": peerInfo,
				}).Warn("failed to connect to bootstrap peer")
			}
		}(peerInfo)
	}
	wg.Wait()

	// It is recommended to wait for 2 seconds after connecting to all the
	// bootstrap peers to give time for the relevant notifees to trigger and the
	// DHT to fully initialize.
	// See: https://github.com/0xProject/0x-mesh/pull/69#discussion_r286849679
	time.Sleep(2 * time.Second)

	return nil
}
