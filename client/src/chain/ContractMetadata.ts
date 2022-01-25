const Greeter = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_greeting',
          type: 'string',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'greet',
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
          name: '_greeting',
          type: 'string',
        },
      ],
      name: 'setGreeting',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
}

const TokenFactory = {
  address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
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
      ],
      name: 'TokenCreated',
      type: 'event',
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
  ],
}

const Exchange = {
  address: '0xe75411DC167f5369b93407A756e06ab1a65e2590',
  abi: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
  Greeter = 'Greeter',
  TokenFactory = 'TokenFactory',
  Exchange = 'Exchange',
}

export const ContractMetadata = {
  [ContractName.Greeter]: Greeter,
  [ContractName.TokenFactory]: TokenFactory,
  [ContractName.Exchange]: Exchange,
}
