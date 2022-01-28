import Dexie from 'dexie'

export interface IPeer {
  id?: number
  peerId: string
  joinedTime: number
}

export interface IValidator {
  id?: string
  peerId: string
  address: string
  joinedTime: number
}

export interface IOrder {
  id?: string
  tokenS: string
  tokenT: string
  amountS: number
  amountT: number
  from: string
  status: string
  created: number
}

export interface IMatchedOrder {
  id?: string
  order1: string
  order2: string
  tokenS: string
  tokenT: string
  amountS: number
  amountT: number
  from: number
  status: string
  created: number
}

export class P2PDB extends Dexie {
  static instance: P2PDB

  peers: Dexie.Table<IPeer>
  validators: Dexie.Table<IValidator>
  orders: Dexie.Table<IOrder>
  matchedOrders: Dexie.Table<IMatchedOrder>

  private constructor() {
    super('browserbook')

    this.version(1).stores({
      peers: '++id,peerId',
      validators: '++id,peerId,address',
      orders: '++id,tokenS,tokenT,from,status',
      matchedOrders: '++id,order1,order2,tokenS,tokenT,from,status',
    })

    this.peers = this.table('peers')
    this.validators = this.table('validators')
    this.orders = this.table('orders')
    this.matchedOrders = this.table('matchedOrders')
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
