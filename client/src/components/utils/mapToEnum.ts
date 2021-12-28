import { TokensPrime } from "../../types/Token";
import { OrderType } from "../../types/Order";

export const mapTokenValuesToEnum = (Tokens) =>{
  if(Tokens == TokensPrime.tokenA){
    return TokensPrime.tokenA;
  }
  else if(Tokens == TokensPrime.tokenB){
    return TokensPrime.tokenB;
  }
  else if(Tokens == TokensPrime.tokenC){
    return TokensPrime.tokenC;
  }
}

export const mapOrderTypeToEnum = (orderType) =>{
  if(orderType == OrderType.Market){
    return OrderType.Market;
  }
  else{
    return OrderType.Limit;
  }
}
