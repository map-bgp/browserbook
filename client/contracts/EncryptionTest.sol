pragma solidity ^0.8.0;

contract EncryptionTest {
    mapping(address => bytes32) public encryptedSignerKeys;

    constructor() {}

    function setSignerKey(bytes32 signerKey) public {
        encryptedSignerKeys[msg.sender] = signerKey;
    }
}
