import Dexie from 'dexie';
import {IPeers,Orders} from "./dto";

export class P2PDB extends Dexie {
    peers: Dexie.Table<IPeers,number>
    orders: Dexie.Table<Orders,number>

    constructor() {
        super("browserbook");

        this.version(1).stores(
            {peers: '++id,peerId,joinedTime'}
        )
        
        this.peers = this.table('peers');

        this.version(2).stores(
            {orders: 'id,tokenA,tokenB,ordertype,actionType,price,quantity,orderFrm,from,created'}
        )
        
        this.orders = this.table('orders');
    }
}