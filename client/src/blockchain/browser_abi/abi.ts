const TokenFactory = {
  "address": "0x158DE9dCBD61Cb02C83FEE4D606288f12BFCbebB",
  "abi":  [
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
          "indexed": true,
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "TokenCreated",
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

const Encrypt = {
  "address": "0x158DE9dCBD61Cb02C83FEE4D606288f12BFCbebB",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "signerKey",
          "type": "string"
        }
      ],
      "name": "setSignerKey",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "signerKeys",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
  "Encrypt": Encrypt,
}