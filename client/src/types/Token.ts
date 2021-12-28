export type Token = {
  id: number;
  name: string;
}

export const Tokens: Token[] = [
  { id: 1, name: 'Token A' },
  { id: 2, name: 'Token B' },
  { id: 3, name: 'Token C' },
]

export enum TokensPrime {
  tokenA = "Token A",
  tokenB = "Token B",
  tokenC = "Token C",
}