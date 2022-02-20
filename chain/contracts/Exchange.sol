pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Exchange {
  using ECDSA for bytes32;

  bytes32 public DOMAIN_SEPARATOR;

  bytes32 public constant EIP712DOMAIN_TYPEHASH =
    keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

  // const OrderDomain = {
  //   name: 'BrowserBook',
  //   version: '1',
  //   chainId: 31337,
  //   verifyingContract: exchangeAddress,
  // }

  // const OrderTypes = {
  //   Order: [
  //     { name: 'id', type: 'string' },
  //     { name: 'from', type: 'address' },
  //     { name: 'tokenAddress', type: 'address' },
  //     { name: 'tokenId', type: 'string' },
  //     { name: 'orderType', type: 'uint' },
  //     { name: 'price', type: 'string' },
  //     { name: 'limitPrice', type: 'string' },
  //     { name: 'quantity', type: 'string' },
  //     { name: 'expiry', type: 'string' },
  //   ],
  // }

  bytes32 public constant ORDERS_TYPEHASH =
    keccak256(
      "Order(string id,address from,address tokenAddress,string tokenId,uint orderType,string price,string limitPrice,string quantity,string expiry)"
    );

  mapping(address => uint256) public balances;
  mapping(address => address) public signerAddresses;
  mapping(address => string) public encryptedSignerKeys;

  enum OrderType {
    BID,
    ASK
  }

  struct Order {
    string id;
    address from;
    address tokenAddress;
    uint256 tokenId;
    OrderType orderType;
    uint256 price;
    uint256 limitPrice;
    uint256 quantity;
    uint256 expiry;
    bytes signature;
  }

  event TokensExchangedAt(address indexed, address indexed, uint256, uint256);

  Order public testOrder;

  constructor() {
    uint256 chainId = 31337;
    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        EIP712DOMAIN_TYPEHASH,
        keccak256(bytes("BrowserBook")),
        keccak256(bytes("1")),
        chainId,
        address(this)
      )
    );
  }

  // TODO this is insecure and needs to be protected so it cannot be "spoofed"
  // with a signature from the signer itself (signs it's own address)
  function setSigner(address signerAddress, string calldata encryptedSignerKey)
    public
  {
    signerAddresses[msg.sender] = signerAddress;
    encryptedSignerKeys[signerAddress] = encryptedSignerKey;
  }

  function depositEther() public payable {
    balances[msg.sender] += msg.value;
  }

  function withdrawEther() public {
    (bool sent, bytes memory data) = msg.sender.call{
      value: balances[msg.sender]
    }("");
    require(sent, "Failed to send Ether");
  }

  function verifyOrderSignatures(Order memory bidOrder, Order memory askOrder)
    private
    pure
    returns (bool)
  {}

  function totalPrice(Order memory order) private pure returns (uint256) {
    return order.price * order.quantity;
  }

  function exchangeTokens(
    Order memory bidOrder,
    Order memory askOrder,
    uint256 quantity,
    bytes memory transferData
  ) private {
    // Guard against re-entrancy
    balances[bidOrder.from] -= totalPrice(askOrder);

    (bool sent, bytes memory data) = askOrder.from.call{
      value: totalPrice(askOrder)
    }("");

    if (!sent) {
      balances[bidOrder.from] += askOrder.price;
    }

    require(sent, "Failed to send Ether");

    IERC1155(askOrder.tokenAddress).safeTransferFrom(
      askOrder.from,
      bidOrder.from,
      bidOrder.tokenId,
      quantity,
      transferData
    );
  }

  function executeOrder(
    Order calldata bidOrder,
    Order calldata askOrder,
    uint256 quantity,
    bytes calldata data
  ) public {
    // Signatures
    require(
      verifySignature(bidOrder, bidOrder.signature),
      "INVALID_SIGNATURE_FOR_BID_ORDER"
    );
    require(
      verifySignature(askOrder, askOrder.signature),
      "INVALID_SIGNATURE_FOR_ASK_ORDER"
    );
    // Quantity
    // Check valid balance
    // Verify expiry, funds, etc.

    exchangeTokens(bidOrder, askOrder, quantity, data);
  }

  // const OrderDomain = {
  //   name: 'BrowserBook',
  //   version: '1',
  //   chainId: 31337,
  //   verifyingContract: exchangeAddress,
  // }

  // const OrderTypes = {
  //   Order: [
  //     { name: 'id', type: 'string' },
  //     { name: 'from', type: 'address' },
  //     { name: 'tokenAddress', type: 'address' },
  //     { name: 'tokenId', type: 'string' },
  //     { name: 'orderType', type: 'uint' },
  //     { name: 'price', type: 'string' },
  //     { name: 'limitPrice', type: 'string' },
  //     { name: 'quantity', type: 'string' },
  //     { name: 'expiry', type: 'string' },
  //   ],
  // }

  function verifySignature(Order memory order, bytes memory signature)
    internal
    view
    returns (bool)
  {
    bytes32 orderHash = keccak256(
      abi.encode(
        ORDERS_TYPEHASH,
        keccak256(bytes(order.id)),
        order.from,
        order.tokenAddress,
        keccak256(bytes(Strings.toString(order.tokenId))),
        order.tokenId,
        keccak256(bytes(Strings.toString(order.price))),
        keccak256(bytes(Strings.toString(order.limitPrice))),
        keccak256(bytes(Strings.toString(order.quantity))),
        keccak256(bytes(Strings.toString(order.expiry)))
      )
    );

    bytes32 digest = keccak256(
      abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, orderHash)
    );

    return digest.recover(signature) == order.from;
  }
}
