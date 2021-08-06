package constants

import (
	"errors"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"

	// Side-effect import to support DNS multiaddresses.
	_ "github.com/multiformats/go-multiaddr-dns"
)

/**
 * General
 */

// TestChainID is the test (Ganache) chainId used for testing
const TestChainID = 1337

// GanacheEndpoint specifies the Ganache test Ethereum node JSON RPC endpoint used in tests
const GanacheEndpoint = "http://localhost:9545"

var (
	// NullAddress is an Ethereum address with all zeroes.
	NullAddress = common.HexToAddress("0x0000000000000000000000000000000000000000")
	// NullBytes is an empty byte array
	NullBytes = common.FromHex("0x")
)

var (
	// GanacheAccount0 is the first account exposed on the Ganache test Ethereum node
	GanacheAccount0           = common.HexToAddress("0x468929A0DAC6D5A1c7BA1ab09c0862195D63b18c")
	ganacheAccount0PrivateKey = common.Hex2Bytes("12646e8d228ab365b969db1aabe4bceb20a7d865e8c57795528a250d8a7b0080")
	// GanacheAccount1 is the second account exposed on the Ganache test Ethereum node
	GanacheAccount1           = common.HexToAddress("0xBC0782fCCdf14293e6CB20FB28ba4943fBa0F92c")
	ganacheAccount1PrivateKey = common.Hex2Bytes("6eca3402cfe63ba2538bed62e4f37d6744358063aa8208ba0fabab7cc2d54c3b")
	// GanacheAccount2 is the third account exposed on the Ganache test Ethereum node
	GanacheAccount2           = common.HexToAddress("0xd200C901b33B04a879F17F8D17426B64eAc28d3F")
	ganacheAccount2PrivateKey = common.Hex2Bytes("65a68a4e665b1ed7e85d32574bf409301538c638dbb5f93924aa4bc8c9b2584e")
	// GanacheAccount3 is the fourth account exposed on the Ganache test Ethereum node
	GanacheAccount3           = common.HexToAddress("0x36c9465a37251EBAC3Cd8D6b1B35759FcF6b27D0")
	ganacheAccount3PrivateKey = common.Hex2Bytes("eee6a31583a233d36ad41c69520b7ff379b05f3fd490c738913723eabc340525")
	// GanacheAccount4 is the fifth account exposed on the Ganache test Ethereum node
	GanacheAccount4           = common.HexToAddress("0x8f3c223Ab9C5366fbd7128b706158c4c27BFD591")
	ganacheAccount4PrivateKey = common.Hex2Bytes("8a2b22d446323df766be45fefd2d105371c44236abf173f7b05f423088641ade")
)

// GanacheAccountToPrivateKey maps Ganache test Ethereum node accounts to their private key
var GanacheAccountToPrivateKey = map[common.Address][]byte{
	GanacheAccount0: ganacheAccount0PrivateKey,
	GanacheAccount1: ganacheAccount1PrivateKey,
	GanacheAccount2: ganacheAccount2PrivateKey,
	GanacheAccount3: ganacheAccount3PrivateKey,
	GanacheAccount4: ganacheAccount4PrivateKey,
}

// GanacheDummyERC721TokenAddress is the dummy ERC721 token address in the Ganache snapshot
//#HASTOBECHANGED
var GanacheDummyERC721TokenAddress = common.HexToAddress("0x07f96aa816c1f244cbc6ef114bb2b023ba54a2eb")

// GanacheDummyERC1155MintableAddress is the dummy ERC1155 token address in the Ganache snapshot
//#HASTOBECHANGED
var GanacheDummyERC1155MintableAddress = common.HexToAddress("0x038f9b392fb9a9676dbaddf78ea5fdbf6c7d9710")

// ErrInternal is used whenever we don't wish to expose internal errors to a client
var ErrInternal = errors.New("internal error")

// TestMaxContentLength is the max Ethereum RPC Content-Length used in tests
var TestMaxContentLength = 1024 * 512

// UnlimitedExpirationTime is the maximum value for uint256 (2^256-1), which
// means there is effectively no limit on the maximum expiration time for
// orders.
var UnlimitedExpirationTime *big.Int

func init() {
	UnlimitedExpirationTime, _ = big.NewInt(0).SetString("115792089237316195423570985008687907853269984665640564039457584007913129639935", 10)
}

const (
	// MaxOrderSizeInBytes is the maximum number of bytes allowed for encoded
	// orders. It allows for MultiAssetProxy orders with roughly 45 total ERC20
	// assets or roughly 36 total ERC721 assets (combined between both maker and
	// taker; depends on the other fields of the order).
	MaxOrderSizeInBytes = 16000
	messageOverhead     = len(`{"messageType":"order","Order":}`)
	// MaxMessageSizeInBytes is the maximum size for messages sent through
	// GossipSub. It is the max order size plus some overhead for the message
	// format.
	MaxMessageSizeInBytes = MaxOrderSizeInBytes + messageOverhead
)

// MaxBlocksStoredInNonArchiveNode is the max number of historical blocks for which a regular Ethereum
// node stores archive-level state. One cannot make `eth_call` requests specifying blocks earlier than
// 128 blocks ago on non-archive nodes.
const MaxBlocksStoredInNonArchiveNode = 128

var (
	// ErrMaxMessageSize is returned or emitted when a GossipSub message exceeds
	// the max size.
	ErrMaxMessageSize = fmt.Errorf("message exceeds maximum size of %d bytes", MaxMessageSizeInBytes)
	// ErrMaxOrderSize is returned or emitted when a signed order encoded as JSON
	// exceeds the max size.
	ErrMaxOrderSize = fmt.Errorf("order exceeds maximum size of %d bytes", MaxOrderSizeInBytes)
)

const ParityFilterUnknownBlock = "One of the blocks specified in filter (fromBlock, toBlock or blockHash) cannot be found"

const GethFilterUnknownBlock = "unknown block"

var (
	//#HASTOBECHANGED
	ZRXAssetData  = common.Hex2Bytes("f47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c")
	WETHAssetData = common.Hex2Bytes("f47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082")
)
