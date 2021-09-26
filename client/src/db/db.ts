import Dexie from 'dexie';
import {IPeers,IOrders} from "./dto";

export class P2PDB extends Dexie {
    peers: Dexie.Table<IPeers,number>
    orders: Dexie.Table<IOrders,number>

    constructor() {
        super("browserbook");

        this.version(1).stores(
            {peers: '++id,peerId,joinedTime'}
        )
        
        this.peers = this.table('peers');

        this.version(2).stores(
            {orders: 'id,tokenFrom,tokenTo,orderType,actionType,price,quantity,orderFrm,from,created'}
        )
        
        this.orders = this.table('orders');
    }
}