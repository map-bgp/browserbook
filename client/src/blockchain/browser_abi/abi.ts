const TokenFactory = {
  address: "0x0a61F35b57AEe0F4d47b2F84F8F37A78A56B5D30",
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "TokenCreated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "URI",
          type: "string",
        },
      ],
      name: "create",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "URI",
          type: "string",
        },
      ],
      name: "getTokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
}

const Exchange = {
  address: "0x2f2c80fACC4621430456105aAf58908B5eABd456",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "TokensExchangedAt",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenOneAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenTwoAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenOneOwner",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenTwoOwner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenOneId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "tokenTwoId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "tokenOneAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "tokenTwoAmount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "executeOrder",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      name: "getPass",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "authorizationKey",
          type: "string",
        },
      ],
      name: "setPass",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
}

// TODO for some reason the enum mapping won't work - try again some other time
export const TokenMetadata = {
  TokenFactory: TokenFactory,
  Exchange: Exchange,
}
