import { TokensPrime } from "../../types/Token"
import { ActionType } from "../../types/Order"

export const mapTokenValuesToEnum = (Tokens) => {
  if (Tokens == TokensPrime.tokenA) {
    return TokensPrime.tokenA
  } else if (Tokens == TokensPrime.tokenB) {
    return TokensPrime.tokenB
  } else if (Tokens == TokensPrime.tokenC) {
    return TokensPrime.tokenC
  }
}

export const mapActionTypeToEnum = (actionType) => {
  if (actionType == ActionType.Market) {
    return ActionType.Market
  } else {
    return ActionType.Limit
  }
}
