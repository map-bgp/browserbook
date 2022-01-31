// SPDX-License-Identifier: MIT

/**
 * @title Exchange
 * @author Teja<saitejapottanigari@gmail.com>, Ankan <ankan0011@live.com>, Corey <corey.bothwell@uzh.ch>
 * @dev Enables the order verification and order matching functionalities.
 */

pragma solidity ^0.8.0;

import "./BBToken.sol";

contract TokenFactory {
    // Only allows creation of a single token
    mapping(address => bool) private _createdToken;
    // Address to company URI
    mapping(address => string) public addressURI;
    // Company URI to ERC-1155 token address
    mapping(string => address) public tokenAddress;
    
    // Event emission aids client-side discovery
    // (owner address, URI, token address)
    event TokenContractCreated(address indexed, string, address indexed);

    function create(string calldata URI) public returns (address) {
        require(_createdToken[msg.sender] == false, "CANNOT_CREATE_MULTIPLE_TOKENS_PER_ADDRESS");
        
        addressURI[msg.sender] = URI;
        
        BBToken token = new BBToken(msg.sender, URI);
        tokenAddress[URI] = address(token);

        _createdToken[msg.sender] = true;
        emit TokenContractCreated(token.Owner(), URI, address(token));
        return address(token);
    }

    function getTokenAddress(string calldata URI) public view returns (address) {
        return tokenAddress[URI];
    }
}