import Dexie from 'dexie'
import { WithStatus } from '../Types'
import { Match, Order } from './protocol_buffers/gossip_schema'

export interface IPeer {
  id: string
  joinedTime: number
}

export interface IToken {
  id?: string
  uri: string
  contractAddress: string // Remember these are ERC-1155 contracts (multitoken)
  tokenId: number
}

export class P2PDB extends Dexie {
  static instance: P2PDB

  peers: Dexie.Table<IPeer>
  tokens: Dexie.Table<IToken> // Can be our local type as this is not shared over the gossip protocol
  orders: Dexie.Table<WithStatus<Order>>
  matches: Dexie.Table<Match>

  private constructor() {
    super('browserbook')

    this.version(1).stores({
      peers: 'id',
      tokens: '++id,uri,contractAddress,tokenId',
      orders: 'id,from,[tokenAddress+tokenId],orderType,status',
      matches: 'id,makerId,takerId,makerOrderId,takerOrderId,status',
    })

    this.peers = this.table('peers')
    this.tokens = this.table('tokens')
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
