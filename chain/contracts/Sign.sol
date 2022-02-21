pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

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
//     { name: 'tokenId', type: 'uint256' },
//     { name: 'orderType', type: 'uint' },
//     { name: 'price', type: 'uint256' },
//     { name: 'limitPrice', type: 'uint256' },
//     { name: 'quantity', type: 'uint256' },
//     { name: 'expiry', type: 'uint256' },
//   ],
// }

contract Sign {
  using ECDSA for bytes32;

  bytes32 public DOMAIN_SEPARATOR;

  bytes32 public constant EIP712DOMAIN_TYPEHASH =
    keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

  bytes32 public constant ORDERS_TYPEHASH =
    keccak256(
      "Order(string id,address from,address tokenAddress,uint256 tokenId,uint orderType,uint256 price,uint256 limitPrice,uint256 quantity,uint256 expiry)"
    );

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

  function verifySignature(Order memory order) public view returns (bool) {
    bytes32 orderHash = keccak256(
      abi.encode(
        ORDERS_TYPEHASH,
        keccak256(bytes(order.id)),
        order.from,
        order.tokenAddress,
        order.tokenId,
        order.orderType,
        order.price,
        order.limitPrice,
        order.quantity,
        order.expiry
      )
    );

    bytes32 digest = keccak256(
      abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, orderHash)
    );

    return digest.recover(order.signature) == order.from;
  }
}
