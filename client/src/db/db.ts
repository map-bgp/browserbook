import Dexie from 'dexie';
import {IPeers,Orders} from "./dto";

export class peerDB extends Dexie {
    peers: Dexie.Table<IPeers,number>

    constructor() {
        super("browserbook");

        this.version(1).stores(
            {peers: '++id,peerId,joinedTime'}
        )
        
        this.peers = this.table('peers');
    }
}

export class orderDB extends Dexie {
    orders: Dexie.Table<Orders,number>

    constructor() {
        super("browserbook");

        this.version(1).stores(
            {orders: '++id,tokenA,tokenB,ordertype,actionAction,price,quantity'}
        )
        
        this.orders = this.table('orders');
    }
}