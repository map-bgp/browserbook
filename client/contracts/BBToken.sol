/**
 * @title BrowserBookToken
 * @author Teja<saitejapottanigari@gmail.com>, Ankan <ankan0011@live.com>, Corey <corey.bothwell@gmail.com>
 * @dev for company specific ERC1155 token contract.
 */

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./helpers/IterableMapping.sol";

contract BBToken is ERC1155{

    using SafeMath for uint256;
    
    // address of owner of the token
    address private _owner;

    // token nonce
    uint256 internal nonce;

    // The top bit is a flag to tell if this is a NFI.
    uint256 internal constant TYPE_NF_BIT = 1 << 255;

    // mapping of nft to owner
    mapping(uint256 => address) private _nfOwners;

    // mapping for operator role
    mapping(uint256 => mapping(address => bool)) internal _operators;

    mapping(uint256 => itmap) internal _holderAmount;
    mapping(uint256 => itmap) internal _claimableAmount;
    using IterableMapping for itmap;

    mapping(uint256 => mapping(address => bool)) internal isHolder;

    mapping(uint256 => bool) internal unlockedId;

    mapping(uint256 => string) internal tokenMetadata;

    mapping(uint256 => uint256) public _totalSupply;

    constructor(string memory URI, address owner) ERC1155(URI) {
        _owner = owner;
    }

    /***********************************|
  |             EVENTS                |
  |__________________________________*/

    event tokenCreation(address indexed, uint256);
    event nfTokenMint(address indexed, uint256 indexed);
    event ownerCredited(uint256 indexed, uint256);

    /***********************************|
  |             Modifiers             |
  |__________________________________*/

    modifier isAlreadyOwned(uint256 id) {
        if (_nfOwners[id] != address(0)) {
            revert("NFT is already owned by others");
        }
        _;
    }

    modifier isUnlocked(uint256 id) {
        if (unlockedId[id] != true) {
            revert("Company did not create this token yet");
        }
        _;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "You cannot perform this action.");
        _;
    }

    modifier isOwnerOrOperator(uint256 id) {
        require(
            _owner == msg.sender || _operators[id][msg.sender] == true,
            "You cannot perform this action."
        );
        _;
    }

    /// @dev returns true if address is contract.
    function isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    /// @dev Returns true if token is non-fungible
    function isNonFungible(uint256 id) public pure returns (bool) {
        return id & TYPE_NF_BIT == TYPE_NF_BIT;
    }

    /// @dev Returns true if token is fungible
    function isFungible(uint256 id) public pure returns (bool) {
        return id & TYPE_NF_BIT == 0;
    }

    function Owner() public view returns (address) {
        return _owner;
    }

    function getNfOwner(uint256 id) public view returns (address) {
        return _nfOwners[id];
    }

    function transferNfOwner(uint256 id, address to)
        private
        isOwnerOrOperator(id)
    {
        _nfOwners[id] = to;
    }

    /// @dev creates a new token
    /// @param isNF is non-fungible token
    /// @return id_ of token (a unique identifier)
    function createToken(bool isNF) external onlyOwner returns (uint256 id_) {
        id_ = ++nonce;

        if (isNF) {
            id_ = id_ | TYPE_NF_BIT;
        }

        // emit a Transfer event with Create semantic to help with discovery.
        emit tokenCreation(msg.sender, id_);
    }

    function nonFungibleMint(
        address account,
        uint256 id,
        string memory tokenURI
    ) public isAlreadyOwned(id) isOwnerOrOperator(id) {
        require(
            isNonFungible(id),
            "TRIED_TO_MINT_FUNGIBLE_FOR_NON_FUNGIBLE_TOKEN"
        );

        transferNfOwner(id, account);

        _totalSupply[id] = 1;

        tokenMetadata[id] = tokenURI;

        emit nfTokenMint(account, id);
    }

    function fungibleMint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public isOwnerOrOperator(id) returns(bool){
        require(
            isFungible(id),
            "TRIED_TO_MINT_FUNGIBLE_FOR_NON_FUNGIBLE_TOKEN"
        );
        super._mint(account, id, amount, data);
        if(isHolder[id][account]){
            _totalSupply[id] += amount;
        return _holderAmount[id].increase(account,amount);
        
        }
        else{
          _totalSupply[id] += amount;
          isHolder[id][account]  = true;
          return _holderAmount[id].insert(account,amount);
        }

    }

    function fungibleBurn(
        address account,
        uint256 id,
        uint256 amount
    ) public isOwnerOrOperator(id) returns(bool){
        require(
            isFungible(id),
            "TRIED_TO_BURN_FUNGIBLE_FOR_NON_FUNGIBLE_TOKEN"
        );
        super._burn(account, id, amount);
        _totalSupply[id] -= amount;
        return _holderAmount[id].reduce(account,amount);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override(ERC1155) {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        if (isFungible(id)) {
            super._safeTransferFrom(from, to, id, amount, data);
            _holderAmount[id].reduce(from,amount);
            _holderAmount[id].increase(to,amount);
            return;
        } else {
            require(getNfOwner(id) == from, "Wrong NFT owner");
            transferNfOwner(id, to);
        }
    }

    function provideDividend(uint256 id) public payable onlyOwner {
        require(
            isFungible(id),
            "TRIED_TO_BURN_FUNGIBLE_FOR_NON_FUNGIBLE_TOKEN"
        );
        uint256 dividend = msg.value;
        address account;
        uint256 value;
        uint256 dividendShare;
        for (uint256 i=1;_holderAmount[id].valid(i);i+=1){
            (account, value) = _holderAmount[id].get(i);
            dividendShare = value.div(_totalSupply[id]).mul(dividend);
            _claimableAmount[id].insert(account,dividendShare * 100);
        }

        emit ownerCredited(id, dividend);
    }

    function dividentClaim(address account, uint256 id) public payable{
        require(
            isFungible(id),
            "TRIED_TO_BURN_FUNGIBLE_FOR_NON_FUNGIBLE_TOKEN"
        );
        uint256 keyIndex = _claimableAmount[id].getKeyIndex(account);
        (,uint256 value)= _claimableAmount[id].get(keyIndex);
        _claimableAmount[id].reduce(account,value);
        payable(account).transfer(value);
    }


}
