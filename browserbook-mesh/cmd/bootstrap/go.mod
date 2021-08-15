module github.com/0xProject/0x-mesh

go 1.15

replace (
	// github.com/ethereum/go-ethereum => github.com/0xProject/go-ethereum wasm-support
	github.com/ethereum/go-ethereum => github.com/0xProject/go-ethereum v1.8.8-0.20200603225022-cb1f52043425
	github.com/libp2p/go-flow-metrics => github.com/libp2p/go-flow-metrics v0.0.3
	github.com/libp2p/go-libp2p-pubsub => github.com/0xProject/go-libp2p-pubsub v0.1.1-0.20200228234556-aaa0317e068a
	// github.com/libp2p/go-ws-transport => github.com/0xProject/go-ws-transport upgrade-go-1.14
	github.com/libp2p/go-ws-transport => github.com/0xProject/go-ws-transport v0.1.1-0.20200602173532-300f0ff55a11
	github.com/plaid/go-envvar => github.com/albrow/go-envvar v1.1.1-0.20200123010345-a6ece4436cb7
	// github.com/syndtr/goleveldb => github.com/0xProject/goleveldb upgrade-go-1.14
	github.com/syndtr/goleveldb => github.com/0xProject/goleveldb v1.0.1-0.20200602173211-6ee893c9b83a
)

require (
	github.com/ipfs/go-ds-leveldb v0.4.2
	github.com/lib/pq v1.3.0
	github.com/libp2p/go-libp2p v0.11.1-0.20200916050736-636d0787c332
	github.com/libp2p/go-libp2p-autonat-svc v0.2.0
	github.com/libp2p/go-libp2p-circuit v0.3.1
	github.com/libp2p/go-libp2p-connmgr v0.2.4
	github.com/libp2p/go-libp2p-core v0.6.1
	github.com/libp2p/go-libp2p-kad-dht v0.10.0
	github.com/libp2p/go-libp2p-peerstore v0.2.6
	github.com/libp2p/go-libp2p-secio v0.2.2
	github.com/libp2p/go-maddr-filter v0.1.0
	github.com/map-bgp/browserbook/browserbook-mesh v0.0.0-20210806112316-41b0f95102ee
	github.com/multiformats/go-multiaddr v0.3.1
	github.com/plaid/go-envvar v1.1.0
	github.com/sirupsen/logrus v1.6.0
	golang.org/x/sys v0.0.0-20210616094352-59db8d763f22 // indirect
	golang.org/x/tools v0.1.3 // indirect
)
