import _ from "lodash";

import { IOrders } from "../db";

export enum tokens {
  tokenA = "tokenA",
  tokenB = "tokenB",
  tokenC = "tokenC",
}
export interface tokenSpecificOrder {
  token: tokens;
  asks: IOrders[];
  bids: IOrders[];
  countOfAsks: number;
  countOfBids: number;
  askedLiquidity: number;
  pooledLiquidity: number;
}


export class Matcher {
  // Tokens Asks and Bids distinguishing helps in matching quicker.
  //
  public tokenWiseOrders: tokenSpecificOrder[] = [];
  constructor(private orderArray: IOrders[]) {}

  initialTokenOrderlisting() {
    Object.keys(tokens).forEach((key) => {
      this.tokenWiseOrders.push({
        token: tokens[key],
        asks: [],
        bids: [],
        countOfAsks: 0,
        countOfBids: 0,
        askedLiquidity: 0,
        pooledLiquidity: 0,
      });
    });
    console.log("Initialized the Asks Bids");
  }

  populateTokenOrders() {
    for (let key in tokens) {
      const index = this.tokenWiseOrders.findIndex(
        (x) => x.token === tokens[key]
      );
      const askOrders: IOrders[] = _.filter(this.orderArray, {
        tokenTo: tokens[key],
      });
      const bidOrders: IOrders[] = _.filter(this.orderArray, {
        tokenFrom: tokens[key],
      });
      this.tokenWiseOrders[index].asks = askOrders;
      this.tokenWiseOrders[index].bids = bidOrders;
      this.tokenWiseOrders[index].countOfAsks = askOrders.length;
      this.tokenWiseOrders[index].countOfBids = bidOrders.length;
      if (askOrders.length > 0) {
        this.tokenWiseOrders[index].askedLiquidity = askOrders
          .map((singleOrder) => singleOrder.quantity)
          .reduce((sum, next) => sum + next);
      }
      if (bidOrders.length > 0) {
        this.tokenWiseOrders[index].pooledLiquidity = bidOrders
          .map((singleOrder) => singleOrder.quantity * singleOrder.price)
          .reduce((sum, next) => sum + next);
      }
    }
  }

  Matching() {
    for (let key in tokens) {
        
    }
  }
}
