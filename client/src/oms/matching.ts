import _ from "lodash";

export enum Tokens {
  tokenA = "tokenA",
  tokenB = "tokenB",
  tokenC = "tokenC",
}

export enum OrderType {
  Market = "Market",
  Limit = "Limit",
}

export enum MatchingStatus {
  Fulfilled = "fulfilled",
  Started = "Started",
  Wait = "Wait",
}

export interface IOrders {
  id?: string;
  tokenS: Tokens;
  tokenB: Tokens;
  orderType: OrderType;
  amountS: number;
  amountB: number;
  orderFrom: number;
  from: string;
  created: string;
}

export interface tokenSpecificOrder {
  token: Tokens;
  asks: IOrders[];
  bids: IOrders[];
  countOfAsks: number;
  countOfBids: number;
  askedLiquidity: number;
  pooledLiquidity: number;
}

export interface MatchingResponse {
  orderOne: IOrders;
  orderTwo: IOrders;
  orderStatus: MatchingStatus;
  price: number;
  orderOneQuantity?: number;
  orderTwoQuantity?: number;
}

export interface PriceInfo {
  from: Tokens;
  to: Tokens;
  price: number;
}

onmessage = function (orders) {
  console.log("Worker: Message received from main script");
  // const result = new Matcher(orders.data).processStarted();
  const result = 10;
  if (isNaN(result)) {
    postMessage("Please write two numbers");
  } else {
    const workerResult = "Result: " + result;
    console.log("Worker: Posting message back to main script");
    postMessage(workerResult);
  }
};

export class Matcher {
  /* What all this matcher contains
    Step-wise: 
    1) Firstly it organizes the Orders coming in Tokenwise Order and update in individual using `initialOrderlisting` and `populateLiquidity`
    2) Secondly, Now I have reduced matchableTokenSetOrders,
  */

  // Tokens Asks and Bids distinguishing helps in matching quicker.
  public tokenWiseOrders: tokenSpecificOrder[] = [];
  public matchableTokenSets: tokenSpecificOrder[] = [];
  public matchableTokens: Tokens[] = [];
  public totalPooledLiquidity: number;
  constructor(private orderArray: IOrders[]) {}

  public initialOrderlisting() {
    Object.keys(Tokens).forEach((key) => {
      this.tokenWiseOrders.push({
        token: Tokens[key],
        asks: [],
        bids: [],
        countOfAsks: 0,
        countOfBids: 0,
        askedLiquidity: 0,
        pooledLiquidity: 0,
      });
    });
    console.log("Initialized the Asks Bids");
    return this;
  }

  public populateLiquidity() {
    for (let key in Tokens) {
      const index = this.tokenWiseOrders.findIndex(
        (x) => x.token === Tokens[key]
      );
      const askOrders: IOrders[] = _.filter(this.orderArray, {
        tokenB: Tokens[key],
      });
      const bidOrders: IOrders[] = _.filter(this.orderArray, {
        tokenS: Tokens[key],
      });
      this.tokenWiseOrders[index].asks = askOrders;
      this.tokenWiseOrders[index].bids = bidOrders;
      this.tokenWiseOrders[index].countOfAsks = askOrders.length;
      this.tokenWiseOrders[index].countOfBids = bidOrders.length;
      if (askOrders.length > 0) {
        this.tokenWiseOrders[index].askedLiquidity = askOrders
          .map((singleOrder) => singleOrder.amountB)
          .reduce((sum, next) => sum + next, 0);
      }
      if (bidOrders.length > 0) {
        this.tokenWiseOrders[index].pooledLiquidity = bidOrders
          .map((singleOrder) => singleOrder.amountS)
          .reduce((sum, next) => sum + next, 0);
      }
    }
    return this;
  }

  processStarted() {
    const matchingRequest = [];
    this.matchableTokenSets = _.filter(this.tokenWiseOrders, (o) => {
      return o.askedLiquidity > 0 && o.pooledLiquidity > 0;
    });
    // this.preCleanOrder(matchableTokenSets)
    this.matchableTokens.push(...this.matchableTokenSets.map((o) => o.token));
    console.log(this.matchableTokens);
    console.log(this.matchableTokenSets);

    this.matchableTokenSets.forEach((singleTokenSet) => {
      return singleTokenSet.bids.forEach((order2) => {
        return singleTokenSet.asks.every((order1) => {
          const matchingResponse = this.orderCompare(order1, order2);
          if (matchingResponse) {
            this.handleMatchingResponse(matchingResponse);
            return matchingResponse;
          }
        });
      });
    });
  }

  handleMatchingResponse(matchingResponse: MatchingResponse) {
    this.removeOrder(matchingResponse.orderOne);
    this.removeOrder(matchingResponse.orderTwo);
  }

  removeOrder(order: IOrders) {
    this.matchableTokenSets.forEach((element) => {
      if (element.asks.indexOf(order) !== -1) {
        element.asks.splice(element.asks.indexOf(order), 1);
        element.askedLiquidity -= order.amountB;
      }
      if (element.bids.indexOf(order) !== -1) {
        element.bids.splice(element.bids.indexOf(order), 1);
        element.pooledLiquidity -= order.amountS;
      }
    });
  }

  orderCompare(order1: IOrders, order2: IOrders): MatchingResponse | undefined {
    // Best CASE 1: Both orders containing same tokens are getting exchanged A<=>B and Same Amount of Tokens are being exchanged.
    if (
      order1.tokenS == order2.tokenB &&
      order1.tokenB == order2.tokenS &&
      order1.amountB === order2.amountS
    ) {
      console.log(`Comparing orders between ${order1.id} and ${order2.id}`);

      const tradeBenefitRatio =
        (order1.amountS / order1.amountB) * (order2.amountS / order2.amountB);

      if (
        order1.orderType === OrderType.Market &&
        order2.orderType === OrderType.Market
      ) {
        // CASE1.1: Same tokens at same price
        if (tradeBenefitRatio == 1 && order1.amountS == order2.amountB) {
          return {
            orderOne: order1,
            orderTwo: order2,
            orderStatus: MatchingStatus.Fulfilled,
            price: order1.amountS || order2.amountB,
          } as MatchingResponse;
        }
        // CASE1.2: Same tokens at different quoted price, so mean price of the two quoted
        else {
          if (tradeBenefitRatio > 1)
            return {
              orderOne: order1,
              orderTwo: order2,
              orderStatus: MatchingStatus.Fulfilled,
              price:
                order1.amountS < order2.amountB
                  ? order1.amountS
                  : order2.amountB,
            } as MatchingResponse;
        }
        return undefined;
      } else if (
        order1.orderType === OrderType.Market &&
        order2.orderType === OrderType.Limit
      ) {
        // CASE2.1: Same tokens at same price
        if (tradeBenefitRatio == 1 && order1.amountS == order2.amountB) {
          return {
            orderOne: order1,
            orderTwo: order2,
            orderStatus: MatchingStatus.Fulfilled,
            price: order1.amountS || order2.amountB,
          } as MatchingResponse;
        }
        // CASE2.2: Same tokens at different quoted price, so mean price of the two quoted
        else if (tradeBenefitRatio > 1 && order1.amountB < order2.amountS) {
          return {
            orderOne: order1,
            orderTwo: order2,
            orderStatus: MatchingStatus.Fulfilled,
            price: order1.amountB,
          } as MatchingResponse;
        }
        return undefined;
      } else if (
        order1.orderType === OrderType.Limit &&
        order2.orderType === OrderType.Market
      ) {
        // CASE3.1: Same tokens at same price
        if (tradeBenefitRatio == 1 && order1.amountS == order2.amountB) {
          return {
            orderOne: order1,
            orderTwo: order2,
            orderStatus: MatchingStatus.Fulfilled,
            price: order1.amountS || order2.amountB,
          } as MatchingResponse;
        }
        // CASE3.2: Same tokens at different quoted price, so mean price of the two quoted
        else {
          if (tradeBenefitRatio > 1 && order1.amountB < order2.amountS)
            return {
              orderOne: order1,
              orderTwo: order2,
              orderStatus: MatchingStatus.Fulfilled,
              price: order2.amountS,
            } as MatchingResponse;
        }
        return undefined;
      } else if (
        order1.orderType === OrderType.Limit &&
        order2.orderType === OrderType.Limit
      ) {
        // CASE1.1: Same tokens at same price
        if (tradeBenefitRatio == 1 && order1.amountS == order2.amountB) {
          return {
            orderOne: order1,
            orderTwo: order2,
            orderStatus: MatchingStatus.Fulfilled,
            price: order1.amountS || order2.amountB,
          } as MatchingResponse;
        }
        return undefined;
      }
    }
  }
}
