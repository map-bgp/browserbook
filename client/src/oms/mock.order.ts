import { IOrders } from "../db";
import { tokens } from "./matching";

export const OrderA : IOrders = {
    from: "0x12",
    tokenFrom: tokens.tokenA,
    tokenTo: tokens.tokenB,
    orderType: "1",
    actionType: "2",
    price: 100,
    quantity: 10,
    orderFrm: 786786,
    created: '1636288913',
    id: "12",
};

export const OrderB : IOrders = {
    from: "0x13",
    tokenFrom: tokens.tokenB,
    tokenTo: tokens.tokenA,
    orderType: "1",
    actionType: "2",
    price: 0.1,
    quantity: 80,
    orderFrm: 23543543,
    created: '1636289212',
    id: "14",
};

export const OrderC : IOrders = {
    from: "0x14",
    tokenFrom: tokens.tokenB,
    tokenTo: tokens.tokenA,
    orderType: "1",
    actionType: "2",
    price: 0.1,
    quantity: 20,
    orderFrm: 23432445,
    created: '1636289367',
    id: "15",
};

export const OrderD : IOrders = {
    from: "0x15",
    tokenFrom: tokens.tokenB,
    tokenTo: tokens.tokenC,
    orderType: "1",
    actionType: "2",
    price: 100,
    quantity: 20,
    orderFrm: 382748394,
    created: '38278932780',
    id: "16",
};