export type TokenContract = {
  uri: string
  address: string
}

export type Token = {
  id: string
  name: string
  metadataURI: string
  supply: string
  type: TokenType
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
