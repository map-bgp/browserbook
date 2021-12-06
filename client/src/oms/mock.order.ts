import { IOrders, Tokens, OrderType } from "./matching";

export const OrderA : IOrders = {
    from: "0x12",
    tokenS: Tokens.tokenA,
    tokenB: Tokens.tokenB,
    orderType: OrderType.Market,
    amountS: 100,
    amountB: 10,
    orderFrm: 786786,
    created: '1636288913',
    id: "12",
};

export const OrderB : IOrders = {
    from: "0x13",
    tokenS: Tokens.tokenB,
    tokenB: Tokens.tokenA,
    orderType: OrderType.Market,
    amountS: 10,
    amountB: 90,
    orderFrm: 23543543,
    created: '1636289212',
    id: "14",
};

export const OrderC : IOrders = {
    from: "0x14",
    tokenS: Tokens.tokenB,
    tokenB: Tokens.tokenA,
    orderType: OrderType.Market,
    amountS: 1,
    amountB: 10,
    orderFrm: 23432445,
    created: '1636289367',
    id: "15",
};

export const OrderD : IOrders = {
    from: "0x15",
    tokenS: Tokens.tokenB,
    tokenB: Tokens.tokenC,
    orderType: OrderType.Market,
    amountS: 100,
    amountB: 20,
    orderFrm: 382748394,
    created: '38278932780',
    id: "16",
};