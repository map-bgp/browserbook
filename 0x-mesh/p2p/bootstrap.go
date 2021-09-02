package p2p

import (
	"context"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p-core/host"
	"github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-core/protocol"
	ma "github.com/multiformats/go-multiaddr"
	log "github.com/sirupsen/logrus"
)

const DHTProtocolID = protocol.ID("/0x-mesh-dht/version/1")

// DefaultBootstrapList is a list of addresses to use by default for
// bootstrapping the DHT.
var DefaultBootstrapList = []string{
	// bootstrap nodes
	"/dns4/bootstrap-1.mesh.0x.org/tcp/60558/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	"/dns4/bootstrap-1.mesh.0x.org/tcp/60559/ws/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	"/dns4/bootstrap-1.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAkwsDZk4LzXy2rnWANRsyBjB4fhjnsNeJmjgsBqxPGTL32",
	"/dns4/bootstrap-2.mesh.0x.org/tcp/60558/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
	"/dns4/bootstrap-2.mesh.0x.org/tcp/60559/ws/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
	"/dns4/bootstrap-2.mesh.0x.org/tcp/443/wss/ipfs/16Uiu2HAkykwoBxwyvoEbaEkuKMeKrmJDPZ2uKFPUKtqd2JbGHUNH",
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
	// See: https://github.com/bbook/0x-mesh/pull/69#discussion_r286849679
	time.Sleep(2 * time.Second)

	return nil
}
