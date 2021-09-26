pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BBookToken is ERC1155("BBookToken") {

    mapping(uint256 => uint256) private _totalSupply;
    
    function mint(address account,uint256 id,uint256 amount,bytes memory data) public virtual {
        super._mint(account, id, amount, data);
        _totalSupply[id] += amount;
    }

    function burn(address account, uint256 id, uint256 amount) public virtual {
        super._burn(account, id, amount);
        _totalSupply[id] -= amount;
    }
}
