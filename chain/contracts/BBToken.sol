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
    mapping(uint256 => itmap) private _fungibleHolderAmount;
    mapping(uint256 => itmap) public fungibleClaimableAmount;

    // Constants receiver callbacks
    bytes4 constant public ERC1155_RECEIVED       = 0xf23a6e61;
    bytes4 constant public ERC1155_BATCH_RECEIVED = 0xbc197c81;

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
        require(_contractOwner == _msgSender() || isApprovedForAll(_contractOwner, _msgSender()), "You cannot perform this action.");
        _;
    }

    modifier isExchangeApproved(address from) {
        require(from == _msgSender() || isApprovedForAll(from, _msgSender()), "ERC1155: CALLER_NOT_OWNER_OR_APPROVED");
        _;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4){
        return ERC1155_RECEIVED;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4){
        return ERC1155_BATCH_RECEIVED;
    }

    /***********************************|
    |             FUNCTIONS             |
    |__________________________________*/

    function owner() public view returns (address) {
        return _contractOwner;
    }

    function fungibleMint(string memory tokenName, uint256 amount, string memory tokenMetadataURI, bytes memory data) public onlyOwnerOrOperator() {
        uint256 newTokenId = ++tokenNonce; 

        super._mint(owner(), newTokenId, amount, data);
        tokenNames[newTokenId] = tokenName;
        tokenSupply[newTokenId] += amount;
        tokenMetadata[newTokenId] = tokenMetadataURI;

        emit TokenCreation(_contractOwner , newTokenId);
    }

    function nonFungibleMint(string memory tokenName, string memory tokenMetadataURI, bytes memory data) public onlyOwnerOrOperator() {
        uint256 newTokenId = ++tokenNonce;

        super._mint(owner(), newTokenId, 1, data);
        tokenNames[newTokenId] = tokenName;
        tokenSupply[newTokenId] = 1;
        tokenMetadata[newTokenId] = tokenMetadataURI;
        isNonFungible[newTokenId] = true;

        emit TokenCreation(_contractOwner , newTokenId);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public virtual override(ERC1155) isExchangeApproved(from) {
        if (isNonFungible[id]) {
            require(amount == 1, "ERC1155: CANNOT_TRANSFER_VALUES_GT_1_FOR_NFT");
            super._safeTransferFrom(from, to, id, amount, data);
        } else {
            super._safeTransferFrom(from, to, id, amount, data);
            _fungibleHolderAmount[id].reduce(from, amount);
            _fungibleHolderAmount[id].increase(to, amount);
        }
    }

    function provideDividend(uint256 id) public payable onlyOwnerOrOperator {
        require(!isNonFungible[id], "TRIED_TO_PROVIDE_DIVIDEND_FOR_NON_FUNGIBLE_TOKEN");

        uint256 dividend = msg.value;

        address account;
        uint256 value;
        uint256 dividendShare;

        for (uint256 i=1; _fungibleHolderAmount[id].valid(i); i+=1) {
            (account, value) = _fungibleHolderAmount[id].get(i);
            dividendShare = value.div(tokenSupply[id]).mul(dividend);
            fungibleClaimableAmount[id].insert(account,dividendShare * 100);
        }

        // emit ownerCredited(id, dividend);
    }

    function dividendClaim(address account, uint256 id) public payable {
        require(!isNonFungible[id], "TRIED_TO_CLAIM_DIVIDEND_FOR_NON_FUNGIBLE_TOKEN");

        uint256 keyIndex = fungibleClaimableAmount[id].getKeyIndex(account);
        (, uint256 value)= fungibleClaimableAmount[id].get(keyIndex);

        fungibleClaimableAmount[id].reduce(account, value);
        payable(account).transfer(value);
    }
}