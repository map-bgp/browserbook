// SPDX-License-Identifier: MIT

/**
 * @title BBToken
 * @author Ankan <ankan0011@live.com>, Corey <corey.bothwell@uzh.ch>, Teja<saitejapottanigari@gmail.com>,
 * @dev
 */

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./helpers/IterableMapping.sol";

contract BBToken is ERC1155 {
  using SafeMath for uint256;
  using IterableMapping for itmap;

  // address of owner of the token contract
  address private _contractOwner;
  string public contractURI;

  // token variables
  uint256 public tokenNonce;
  mapping(uint256 => string) public tokenNames;
  mapping(uint256 => uint256) public tokenSupply;
  mapping(uint256 => string) public tokenMetadata;
  mapping(uint256 => bool) public isNonFungible;

  // Used for fungible dividends
  address[] public fungibleHolders;
  mapping(address => bool) public isHolder;

  mapping(uint256 => mapping(address => uint256)) public fungibleHolderAmount;
  mapping(uint256 => mapping(address => uint256))
    public fungibleHolderDividendClaim;

  // mapping(uint256 => itmap) private _fungibleHolderAmount;
  // mapping(uint256 => itmap) private _fungibleClaims;

  // Constants receiver callbacks
  bytes4 public constant ERC1155_RECEIVED = 0xf23a6e61;
  bytes4 public constant ERC1155_BATCH_RECEIVED = 0xbc197c81;

  /***********************************|
    |            CONSTRUCTOR            |
    |__________________________________*/

  constructor(address owner, string memory URI) ERC1155(URI) {
    _contractOwner = owner;
    contractURI = URI;
  }

  /***********************************|
    |             EVENTS                |
    |__________________________________*/

  event TokenCreation(address indexed, uint256);
  event OwnerCredited(address indexed, uint256);

  /***********************************|
    |             MODIFIERS             |
    |__________________________________*/

  modifier onlyOwner() {
    require(_contractOwner == _msgSender(), "You cannot perform this action.");
    _;
  }

  modifier onlyOwnerOrOperator() {
    require(
      _contractOwner == _msgSender() ||
        isApprovedForAll(_contractOwner, _msgSender()),
      "You cannot perform this action."
    );
    _;
  }

  modifier isExchangeApproved(address from) {
    require(
      from == _msgSender() || isApprovedForAll(from, _msgSender()),
      "ERC1155: CALLER_NOT_OWNER_OR_APPROVED"
    );
    _;
  }

  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes calldata data
  ) external returns (bytes4) {
    return ERC1155_RECEIVED;
  }

  function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
  ) external returns (bytes4) {
    return ERC1155_BATCH_RECEIVED;
  }

  /***********************************|
    |             FUNCTIONS             |
    |__________________________________*/

  function owner() public view returns (address) {
    return _contractOwner;
  }

  function fungibleMint(
    string memory tokenName,
    uint256 amount,
    string memory tokenMetadataURI,
    bytes memory data
  ) public onlyOwnerOrOperator {
    uint256 newTokenId = ++tokenNonce;

    super._mint(owner(), newTokenId, amount, data);
    tokenNames[newTokenId] = tokenName;
    tokenSupply[newTokenId] += amount;
    tokenMetadata[newTokenId] = tokenMetadataURI;

    isHolder[owner()] = true;
    fungibleHolders.push(owner());
    fungibleHolderAmount[newTokenId][owner()] += amount;

    emit TokenCreation(_contractOwner, newTokenId);
  }

  function nonFungibleMint(
    string memory tokenName,
    string memory tokenMetadataURI,
    bytes memory data
  ) public onlyOwnerOrOperator {
    uint256 newTokenId = ++tokenNonce;

    super._mint(owner(), newTokenId, 1, data);
    tokenNames[newTokenId] = tokenName;
    tokenSupply[newTokenId] = 1;
    tokenMetadata[newTokenId] = tokenMetadataURI;
    isNonFungible[newTokenId] = true;

    emit TokenCreation(_contractOwner, newTokenId);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public virtual override(ERC1155) isExchangeApproved(from) {
    if (isNonFungible[id]) {
      require(amount == 1, "ERC1155: CANNOT_TRANSFER_VALUES_GT_1_FOR_NFT");
      super._safeTransferFrom(from, to, id, amount, data);
    } else {
      super._safeTransferFrom(from, to, id, amount, data);
      fungibleHolderAmount[id][from] -= amount;
      fungibleHolderAmount[id][to] += amount;

      if (!isHolder[to]) {
        isHolder[to] = true;
        fungibleHolders.push(to);
      }
    }
  }

  // Amount per token in wei
  function provideDividend(uint256 id, uint256 amountPerToken)
    public
    payable
    onlyOwnerOrOperator
  {
    require(
      !isNonFungible[id],
      "TRIED_TO_PROVIDE_DIVIDEND_FOR_NON_FUNGIBLE_TOKEN"
    );

    uint256 dividendPool = msg.value;

    address account;
    uint256 stake;
    uint256 dividendShare;

    for (uint256 i = 0; i < fungibleHolders.length; i++) {
      account = fungibleHolders[i];
      stake = fungibleHolderAmount[id][account];

      dividendShare = amountPerToken * stake;
      fungibleHolderDividendClaim[id][account] += dividendShare;
    }
  }

  function dividendClaim(uint256 id) public {
    require(
      !isNonFungible[id],
      "TRIED_TO_CLAIM_DIVIDEND_FOR_NON_FUNGIBLE_TOKEN"
    );

    uint256 claimAmount = fungibleHolderDividendClaim[id][msg.sender];
    fungibleHolderDividendClaim[id][msg.sender] = 0;

    payable(msg.sender).transfer(claimAmount);
  }

  function getDividendAmount(address account, uint256 id)
    public
    view
    returns (uint256)
  {
    return fungibleHolderDividendClaim[id][account];
  }
}
