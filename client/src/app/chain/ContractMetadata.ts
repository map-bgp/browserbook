const TokenFactory = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'string',
          name: '',
          type: 'string',
        },
        {
          indexed: true,
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'TokenContractCreated',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'addressURI',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'URI',
          type: 'string',
        },
      ],
      name: 'create',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'URI',
          type: 'string',
        },
      ],
      name: 'getTokenAddress',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      name: 'tokenAddress',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
}

const Exchange = {
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  abi: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'TokensExchangedAt',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenOneAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'tokenTwoAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'tokenOneOwner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'tokenTwoOwner',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenOneId',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'tokenTwoId',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'tokenOneAmount',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'tokenTwoAmount',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'executeOrder',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
      ],
      name: 'getPass',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'authorizationKey',
          type: 'string',
        },
      ],
      name: 'setPass',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
}

export enum ContractName {
  TokenFactory = 'TokenFactory',
  Exchange = 'Exchange',
}

export const ContractMetadata = {
  [ContractName.TokenFactory]: TokenFactory,
  [ContractName.Exchange]: Exchange,
}
