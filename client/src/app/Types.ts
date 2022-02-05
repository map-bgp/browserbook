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

export enum TokenType {
  Fungible = 'FUNGIBLE',
  NonFungible = 'NONFUNGIBLE',
}

export enum Tokens {
  TOKEN_A = 'Token A',
  TOKEN_B = 'Token B',
  TOKEN_C = 'Token C',
}
