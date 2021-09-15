import Dexie from 'dexie';
import {IPeers} from "./dto";

export class db extends Dexie {
    peers: Dexie.Table<IPeers,number>

    constructor() {
        super("browserbook");

        this.version(1).stores(
            {peers: '++id,peerId,joinedTime'}
        )

        this.peers = this.table('peers');
    }
}