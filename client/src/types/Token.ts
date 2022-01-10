export type Token = {
  id: number
  name: string
}

export const Tokens: Token[] = [
  { id: 1, name: "TokenA" },
  { id: 2, name: "TokenB" },
  { id: 3, name: "TokenC" },
]

export enum TokensPrime {
  tokenA = "TokenA",
  tokenB = "TokenB",
  tokenC = "TokenC",
}
