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
