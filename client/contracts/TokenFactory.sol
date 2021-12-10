// SPDX-License-Identifier: MIT

/**
 * @title Exchange
 * @author Teja<saitejapottanigari@gmail.com>, Ankan <ankan0011@live.com>, Corey <corey.bothwell@gmail.com>
 * @dev Enables the order verification and order matching functionalities.
 */
pragma solidity ^0.8.0;

import "./BBToken.sol";

contract TokenFactory {
    // To have mapping between company URI and company's tokenFactory address
    mapping(string => address) private _tokenAddress;
    // To have mapping between company owner and company's tokenFactory address

    event TokenCreated(address indexed, address indexed, string);

    function create(string calldata URI) public returns (address) {
        // creates a new token
        BBToken token = new BBToken(URI, msg.sender);

        _tokenAddress[URI] = address(token);

        address owner = token.Owner();

        emit TokenCreated(owner, address(token), URI);

        return address(token);
    }

    function getTokenAddress(string calldata URI) public view returns (address) {
        return _tokenAddress[URI];
    }
}
