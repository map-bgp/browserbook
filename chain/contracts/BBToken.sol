/**
 * @title BrowserBookToken
 * @author Teja<saitejapottanigari@gmail.com>, Ankan <ankan0011@live.com>, Corey <corey.bothwell@uzh.ch>
 * @dev for company specific ERC1155 token contract.
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

    // mapping for operator role
    mapping(uint256 => mapping(address => bool)) internal _operators;

    // token variables
    uint256 internal tokenNonce;
    mapping(uint256 => uint256) public _totalSupply;

    // The top bit is a flag to tell if this is a NFT.
    uint256 internal constant TYPE_NF_BIT = 1 << 255;

    // Fungible tokens
    mapping(uint256 => mapping(address => bool)) internal fIsHolder;
    mapping(uint256 => itmap) internal _fHolderAmount;
    mapping(uint256 => itmap) internal _fClaimableAmount;

    // Non-fungible tokens
    mapping(uint256 => string) internal nfMetadata;
    mapping(uint256 => address) private _nfOwners;

    // selectors for receiver callbacks
    // bytes4 constant public ERC1155_RECEIVED       = 0xf23a6e61;
    // bytes4 constant public ERC1155_BATCH_RECEIVED = 0xbc197c81;

    constructor(address owner, string memory URI) ERC1155(URI) {
        _contractOwner = owner;
        contractURI = URI;
    }

    /***********************************|
    |             EVENTS                |
    |__________________________________*/

    event tokenCreation(address indexed, uint256);
    event nfTokenMint(address indexed, uint256 indexed);
    event ownerCredited(uint256 indexed, uint256);

    /***********************************|
    |             MODIFIERS             |
    |__________________________________*/

    modifier onlyOwner() {
        require(_contractOwner == msg.sender, "You cannot perform this action.");
        _;
    }

    modifier isOwnerOrOperator(uint256 id) {
        require(_contractOwner == msg.sender || _operators[id][msg.sender] == true, "You cannot perform this action.");
        _;
    }

    modifier isNotAlreadyOwned(uint256 id) {
        if (_nfOwners[id] != address(0)) {
            revert("NFT already owned");
        }
        _;
    }

    // function onERC1155Received(
    //     address operator,
    //     address from,
    //     uint256 id,
    //     uint256 value,
    //     bytes calldata data
    // ) external returns (bytes4){
    //     return ERC1155_RECEIVED;
    // }

    // function onERC1155BatchReceived(
    //     address operator,
    //     address from,
    //     uint256[] calldata ids,
    //     uint256[] calldata values,
    //     bytes calldata data
    // ) external returns (bytes4){
    //     return ERC1155_BATCH_RECEIVED;
    // }

    /***********************************|
    |             FUNCTIONS             |
    |__________________________________*/

    // /// @dev returns true if address is contract.
    // function isContract(address _addr) private view returns (bool) {
    //     uint32 size;
    //     assembly {
    //         size := extcodesize(_addr)
    //     }
    //     return (size > 0);
    // }

    /// @dev Returns true if token is non-fungible
    function isNonFungible(uint256 id) public pure returns (bool) {
        return id & TYPE_NF_BIT == TYPE_NF_BIT;
    }

    /// @dev Returns true if token is fungible
    function isFungible(uint256 id) public pure returns (bool) {
        return id & TYPE_NF_BIT == 0;
    }

    function Owner() public view returns (address) {
        return _contractOwner;
    }

    function getNfOwner(uint256 id) public view returns (address) {
        return _nfOwners[id];
    }

    function transferNfOwner(uint256 id, address to) private isOwnerOrOperator(id) {
        _nfOwners[id] = to;
    }

    /// @dev creates a new token
    /// @param isNF is non-fungible token
    /// @return id_ of token (a unique identifier)
    function createToken(bool isNF) external onlyOwner returns (uint256 id_) {
        id_ = ++tokenNonce;

        if (isNF) {
            id_ = id_ | TYPE_NF_BIT;
        }

        // emit a Transfer event to aid discovery
        emit tokenCreation(msg.sender, id_);
    }

    function nonFungibleMint(address account, uint256 id, string memory tokenURI) public isNotAlreadyOwned(id) isOwnerOrOperator(id) {
        require(isNonFungible(id), "TOKEN_ID_NOT_NON_FUNG");

        transferNfOwner(id, account);
        _totalSupply[id] = 1;

        nfMetadata[id] = tokenURI;
        emit nfTokenMint(account, id);
    }

    function fungibleMint(address account, uint256 id, uint256 amount, bytes memory data) public isOwnerOrOperator(id) returns(bool) {
        require(isFungible(id), "TOKEN_ID_NOT_FUNG");
        super._mint(account, id, amount, data);

        if (fIsHolder[id][account]) {
            _totalSupply[id] += amount;
            return _fHolderAmount[id].increase(account, amount);
        } else {
            _totalSupply[id] += amount;
            fIsHolder[id][account]  = true;
            return _fHolderAmount[id].insert(account, amount);
        }
    }

    function fungibleBurn(address account, uint256 id, uint256 amount) public isOwnerOrOperator(id) returns(bool) {
        require(isFungible(id), "TOKEN_ID_NOT_FUNG");
        super._burn(account, id, amount);

        _totalSupply[id] -= amount;
        return _fHolderAmount[id].reduce(account, amount);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public virtual override(ERC1155) {
        require(from == _msgSender() || isApprovedForAll(from, _msgSender()), "ERC1155: CALLER_NOT_OWNER_OR_APPROVED");

        if (isFungible(id)) {
            super._safeTransferFrom(from, to, id, amount, data);
            _fHolderAmount[id].reduce(from, amount);
            _fHolderAmount[id].increase(to, amount);
            return;
        } else {
            require(getNfOwner(id) == from, "WRONG_NFT_OWNER");
            transferNfOwner(id, to);
        }
    }

    function provideDividend(uint256 id) public payable onlyOwner {
        require(isFungible(id), "TRIED_TO_PROVIDE_DIVIDEND_FOR_NON_FUNGIBLE_TOKEN");

        uint256 dividend = msg.value;

        address account;
        uint256 value;
        uint256 dividendShare;

        for (uint256 i=1; _fHolderAmount[id].valid(i); i+=1) {
            (account, value) = _fHolderAmount[id].get(i);
            dividendShare = value.div(_totalSupply[id]).mul(dividend);
            _fClaimableAmount[id].insert(account,dividendShare * 100);
        }

        emit ownerCredited(id, dividend);
    }

    function dividendClaim(address account, uint256 id) public payable {
        require(isFungible(id), "TRIED_TO_CLAIM_DIVIDEND_FOR_NON_FUNGIBLE_TOKEN");

        uint256 keyIndex = _fClaimableAmount[id].getKeyIndex(account);
        ( , uint256 value)= _fClaimableAmount[id].get(keyIndex);

        _fClaimableAmount[id].reduce(account, value);
        payable(account).transfer(value);
    }
}