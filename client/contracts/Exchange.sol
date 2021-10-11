// SPDX-License-Identifier: MIT

/**
 * @title Exchange
 * @author Teja<saitejapottanigari@gmail.com>, Ankan <ankan0011@live.com>, Corey <corey.bothwell@gmail.com>
 * @dev Enables the order verification and order matching functionalities.
 */

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Exchange {
    function executeOrder(
        address tokenOneAddress,
        address tokenTwoAddress,
        address tokenOneOwner,
        address tokenTwoOwner,
        uint256 tokenOneId,
        uint256 tokenTwoId,
        uint256 tokenOneAmount,
        uint256 tokenTwoAmount,
        bytes calldata data
    ) public {
        // Execute `safeBatchTransferFrom` call
        // Either succeeds or throws
        IERC1155(tokenOneAddress).safeTransferFrom(
            tokenOneOwner,
            tokenTwoOwner,
            tokenOneId,
            tokenOneAmount,
            data
        );

        // Execute `safeBatchTransferFrom` call
        // Either succeeds or throws
        IERC1155(tokenTwoAddress).safeTransferFrom(
            tokenTwoOwner,
            tokenOneOwner,
            tokenTwoId,
            tokenTwoAmount,
            data
        );
    }

    function executeBatchOrder(
        address tokenOneAddress,
        address tokenTwoAddress,
        address tokenOneOwner,
        address tokenTwoOwner,
        uint256 tokenOneId,
        uint256 tokenTwoId,
        uint256 tokenOneAmount,
        uint256 tokenTwoAmount,
        bytes calldata data
    ) public {
        // Execute `safeBatchTransferFrom` call
        // Either succeeds or throws
        IERC1155(tokenOneAddress).safeTransferFrom(
            tokenOneOwner,
            tokenTwoOwner,
            tokenOneId,
            tokenOneAmount,
            data
        );

        // Execute `safeBatchTransferFrom` call
        // Either succeeds or throws
        IERC1155(tokenTwoAddress).safeTransferFrom(
            tokenTwoOwner,
            tokenOneOwner,
            tokenTwoId,
            tokenTwoAmount,
            data
        );
    }


}
