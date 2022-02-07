pragma solidity ^0.8.0;

contract Encrypt {
	mapping(address => address) public signerAddresses;
	mapping(address => string) public encryptedSignerKeys;

	constructor() {}

	function setSignerAddress(address signerAddress) public {
		signerAddresses[msg.sender] = signerAddress;
	}

	function setEncryptedSignerKey(address signerAddress, string calldata encryptedSignerKey) public {
		require(signerAddresses[msg.sender] == signerAddress, "BBOOK: CANNOT ENCRYPT SIGNER KEY FOR NON-OWNED SIGNER");
		encryptedSignerKeys[signerAddress] = encryptedSignerKey;
	}
}