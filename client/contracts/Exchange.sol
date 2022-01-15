pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Exchange {
    struct Order {
        string id;
        string tokenFrom;
        string tokenTo;
        string orderType;
        string price;
        string quantity;
        address from;
        string created;
    }

    bytes32 DOMAIN_SEPARATOR;

    mapping(address => string) private password;

    event TokensExchangedAt(address indexed, address indexed, uint256, uint256);

    bytes32 constant EIP712DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 constant ORDERS_TYPEHASH =
        keccak256(
            "Order(string id,string tokenFrom,string tokenTo,string orderType,string price,string quantity,address from,string created)"
        );

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

    function setPass(string memory authorizationKey) public returns (bool) {
        password[msg.sender] = authorizationKey;
        return true;
    }

    function getPass(address addr) external view returns (string memory) {
        return password[addr];
    }

    function verifySignature(
        Order memory order,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (bool) {
        bytes32 OrderHash = keccak256(
            abi.encode(
                ORDERS_TYPEHASH,
                keccak256(bytes(order.id)),
                keccak256(bytes(order.tokenFrom)),
                keccak256(bytes(order.tokenTo)),
                keccak256(bytes(order.orderType)),
                keccak256(bytes(order.price)),
                keccak256(bytes(order.quantity)),
                order.from,
                keccak256(bytes(order.created))
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, OrderHash)
        );

        return ecrecover(digest, v, r, s) == order.from;
    }

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

        emit TokensExchangedAt(
            tokenOneAddress,
            tokenTwoAddress,
            tokenOneAmount,
            tokenTwoAmount
        );
    }
}
