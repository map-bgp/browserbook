import { ethers as ethersLib } from 'ethers'

export type TokenContract = {
  uri: string
  address: string
}

export type Token = {
  contract: TokenContract
  id: string
  own: boolean
  name: string
  metadataURI: string
  supply: string
  type: TokenType
  holdings: string
}

export type WithStatus<T> = T & { status: OrderStatus }

export enum TokenType {
  Fungible = 'FUNGIBLE',
  NonFungible = 'NONFUNGIBLE',
}

export enum OrderStatus {
  Pending = 'PENDING',
  Matched = 'MATCHED',
  Expired = 'Expired',
}

export const ensure = <T>(
  argument: T | undefined | null,
  message: string = 'This value was promised to be present.',
): T => {
  if (argument === undefined || argument === null) {
    throw new TypeError(message)
  }

  return argument
}

export type CreateTokenOptions = {
  contractAddress: string
  tokenType: TokenType
  tokenSupply: string
  tokenIdentifier: string
  tokenMetadataURI: string
}

export type TransferTokenOptions = {
  senderAddress: string
  recipientAddress: string
  contractAddress: string
  token: Token
  quantity: string
}

export type ChainOrder = {
  id: string
  from: string
  tokenAddress: string
  tokenId: ethersLib.BigNumber
  orderType: number
  price: ethersLib.BigNumber
  limitPrice: ethersLib.BigNumber
  quantity: ethersLib.BigNumber
  expiry: ethersLib.BigNumber
  signature: string
}
