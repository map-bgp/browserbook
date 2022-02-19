pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Exchange {
  bytes32 public DOMAIN_SEPARATOR;

  bytes32 public constant EIP712DOMAIN_TYPEHASH =
    keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

  bytes32 public constant ORDERS_TYPEHASH =
    keccak256(
      "Order(string id,string tokenFrom,string tokenTo,string orderType,string price,string quantity,address from,string created)"
    );

  mapping(address => address) public signerAddresses;
  mapping(address => string) public encryptedSignerKeys;

  enum OrderType { BID, ASK }

  struct Order {
    string id;
    address from;
    string tokenAddress;
    string tokenId;
    OrderType orderType;
    int256 price;
    int256 limitPrice;
    int256 quantity;
    int32 expiry;
  }

  event TokensExchangedAt(address indexed, address indexed, uint256, uint256);

  constructor() {
    uint256 chainId = 1337;
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

  function toString(bytes memory data) public pure returns(string memory) {
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < data.length; i++) {
        str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
    }
    return string(str);
}

  function executeOrder(Order calldata bidOrder, Order calldata askOrder) public pure returns (string memory) {
    return toString((abi.encodePacked(bidOrder.from)));
  }

  // function executeOrder() public {

  // }

  // function verifySignature(
  //   Order memory order,
  //   uint8 v,
  //   bytes32 r,
  //   bytes32 s
  // ) internal view returns (bool) {
  //   bytes32 orderHash = keccak256(
  //     abi.encode(
  //       ORDERS_TYPEHASH,
  //       keccak256(bytes(order.id)),
  //       keccak256(bytes(order.tokenFrom)),
  //       keccak256(bytes(order.tokenTo)),
  //       keccak256(bytes(order.orderType)),
  //       keccak256(bytes(order.price)),
  //       keccak256(bytes(order.quantity)),
  //       order.from,
  //       keccak256(bytes(order.created))
  //     )
  //   );

  //   bytes32 digest = keccak256(
  //     abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, orderHash)
  //   );

  //   return ecrecover(digest, v, r, s) == order.from;
  // }

  // function executeOrder(
  //   address tokenOneAddress,
  //   address tokenTwoAddress,
  //   address tokenOneOwner,
  //   address tokenTwoOwner,
  //   uint256 tokenOneId,
  //   uint256 tokenTwoId,
  //   uint256 tokenOneAmount,
  //   uint256 tokenTwoAmount,
  //   bytes calldata data
  // ) public {
  //   // Execute `safeBatchTransferFrom` call
  //   // Either succeeds or throws
  //   IERC1155(tokenOneAddress).safeTransferFrom(
  //     tokenOneOwner,
  //     tokenTwoOwner,
  //     tokenOneId,
  //     tokenOneAmount,
  //     data
  //   );

  //   // Execute `safeBatchTransferFrom` call
  //   // Either succeeds or throws
  //   IERC1155(tokenTwoAddress).safeTransferFrom(
  //     tokenTwoOwner,
  //     tokenOneOwner,
  //     tokenTwoId,
  //     tokenTwoAmount,
  //     data
  //   );

  //   emit TokensExchangedAt(
  //     tokenOneAddress,
  //     tokenTwoAddress,
  //     tokenOneAmount,
  //     tokenTwoAmount
  //   );
  // }
}
