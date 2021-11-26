const TokenFactory = {
  "address": "0x9F2d7AA3884360a309A5f7D875E14cD9413FF794",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "TokenCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "TokenOwnerNotice",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "URI",
          "type": "string"
        }
      ],
      "name": "create",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "URI",
          "type": "string"
        }
      ],
      "name": "getTokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}

// TODO for some reason the enum mapping won't work - try again some other time
export const TokenMetadata = {
  "TokenFactory": TokenFactory,
}