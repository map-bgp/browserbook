pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Exchange {
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

  mapping(address => uint256) public balances;
  mapping(address => address) public signerAddresses;
  mapping(address => string) public encryptedSignerKeys;
  mapping(address => uint256) public signerCommissionBalances;
  mapping(bytes => bool) private usedSignatures;

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

  constructor() {
    uint256 chainId = 80001; // 80001
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

  // Academic Software: WORK IN PROGRESS
  // In a production setting this function would need to be modified verify that the sender
  // uploading the signerAddress indeed possesses the actual signerKey via a signature
  // Otherwise anybody can claim a signer address as their own and claim the commissions accordingly
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
    balances[msg.sender] = 0;
  }

  function withdrawCommission() public {
    (bool sent, bytes memory data) = msg.sender.call{
      value: signerCommissionBalances[signerAddresses[msg.sender]]
    }("");
    require(sent, "Failed to send Ether");
    signerCommissionBalances[signerAddresses[msg.sender]] = 0;
  }

  function collectCommission(
    Order memory bidOrder,
    Order memory askOrder,
    uint256 price,
    uint256 quantity,
    address signerAddress
  ) private {
    uint256 commission = ((price / 1 ether) * quantity) / 100;

    balances[bidOrder.from] -= commission;
    signerCommissionBalances[signerAddress] += commission;
  }

  function exchangeTokens(
    Order memory bidOrder,
    Order memory askOrder,
    uint256 price,
    uint256 quantity,
    bytes memory transferData
  ) private {
    // Guard against re-entrancy
    balances[bidOrder.from] -= ((price / 1 ether) * quantity);

    (bool sent, bytes memory data) = askOrder.from.call{
      value: ((price / 1 ether) * quantity)
    }("");

    if (!sent) {
      balances[bidOrder.from] += ((price / 1 ether) * quantity);
    }

    require(sent, "Failed to send Ether");

    IERC1155(askOrder.tokenAddress).safeTransferFrom(
      askOrder.from,
      bidOrder.from,
      bidOrder.tokenId,
      quantity,
      transferData
    );

    usedSignatures[bidOrder.signature] = true;
    usedSignatures[askOrder.signature] = true;
  }

  function executeOrder(
    Order calldata bidOrder,
    Order calldata askOrder,
    uint256 price,
    uint256 quantity,
    bytes calldata data
  ) public {
    // Ensure we are trading the same tokens
    require(verifyTokens(bidOrder, askOrder), "ORDER TOKENS DO NOT MATCH");

    // Ensure orders are not expired (to some reasonable degree)
    require(verifyExpiry(bidOrder), "ORDER_EXPIRED: BID");
    require(verifyExpiry(askOrder), "ORDER_EXPIRED: ASK");

    // Ensure the specified exchange price falls within limits
    require(verifyBuyerPrice(price, bidOrder), "INVALID_PRICE: BID");
    require(verifySellerPrice(price, askOrder), "INVALID_PRICE: ASK");

    // Ensure the specified exchange quantity falls within limits
    require(
      verifyQuantity(quantity, bidOrder),
      "INVALID_EXECUTION_AMOUNT: BID"
    );
    require(
      verifyQuantity(quantity, askOrder),
      "INVALID_EXECUTION_AMOUNT: ASK"
    );

    // Verify buyer has sufficient funds
    require(
      verifyBuyerLiquidity(bidOrder.from, price, quantity),
      "INSUFFICIENT_FUNDS: BID"
    );

    // Verify seller has sufficient tokens
    require(
      verifySellerLiquidity(
        askOrder.from,
        askOrder.tokenAddress,
        askOrder.tokenId,
        quantity
      ),
      "INSUFFICIENT_FUNDS: ASK"
    );

    // Verify signatures
    require(verifySignature(bidOrder), "INVALID_SIGNATURE: BID");
    require(verifySignature(askOrder), "INVALID_SIGNATURE: ASK");

    // Verify only used once
    require(verifySignatureNotUsed(bidOrder.signature), "SIGNATURE_USED: BID");
    require(verifySignatureNotUsed(askOrder.signature), "SIGNATURE_USED: ASK");

    collectCommission(bidOrder, askOrder, price, quantity, msg.sender);
    exchangeTokens(bidOrder, askOrder, price, quantity, data);
  }

  function verifyTokens(Order memory bidOrder, Order memory askOrder)
    private
    pure
    returns (bool)
  {
    return
      bidOrder.tokenAddress == askOrder.tokenAddress &&
      bidOrder.tokenId == askOrder.tokenId;
  }

  // Orders can be valid for up to 15 minutes past their expiry time in order to account for "block time shift" (CB words)
  function verifyExpiry(Order memory order) private view returns (bool) {
    return ((order.expiry / 1000) + 900) > block.timestamp;
  }

  // Buyers take
  function verifyBuyerPrice(uint256 price, Order memory bidOrder)
    private
    pure
    returns (bool)
  {
    return bidOrder.limitPrice >= price;
  }

  // Sellers make
  function verifySellerPrice(uint256 price, Order memory askOrder)
    private
    pure
    returns (bool)
  {
    return askOrder.price == price;
  }

  function verifyQuantity(uint256 quantity, Order memory order)
    private
    pure
    returns (bool)
  {
    return quantity <= order.quantity;
  }

  function verifyBuyerLiquidity(
    address buyer,
    uint256 price,
    uint256 quantity
  ) private view returns (bool) {
    // Both quantity and price are in wei terms from the client
    return
      balances[buyer] >=
      ((price / 1 ether) * quantity) + (((price / 1 ether) * quantity) / 100);
  }

  function verifySellerLiquidity(
    address seller,
    address tokenAddress,
    uint256 tokenId,
    uint256 quantity
  ) private view returns (bool) {
    return IERC1155(tokenAddress).balanceOf(seller, tokenId) >= quantity;
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

  function verifySignatureNotUsed(bytes memory signature)
    private
    view
    returns (bool)
  {
    return !usedSignatures[signature];
  }
}
