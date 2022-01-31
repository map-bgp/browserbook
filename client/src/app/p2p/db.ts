import Dexie from 'dexie'
import { Match, Order } from './protocol_buffers/gossip_schema'

export interface IPeer {
  id: string
  joinedTime: number
}

export class P2PDB extends Dexie {
  static instance: P2PDB

  peers: Dexie.Table<IPeer>
  orders: Dexie.Table<Order>
  matches: Dexie.Table<Match>

  private constructor() {
    super('browserbook')

    this.version(1).stores({
      peers: 'id',
      orders: 'id,tokenS,tokenT,from,status',
      matches: 'id,makerId,takerId,makerOrderId,takerOrderId,status',
    })

    this.peers = this.table('peers')
    this.orders = this.table('orders')
    this.matches = this.table('matches')
  }

  static initialize() {
    if (this.instance) {
      return this.instance
    } else {
      this.instance = new P2PDB()
      return this.instance
    }
  }
}
