import Dexie from "dexie"
import { IPeers, IOrders, IValidators, IMatchedOrders } from "./dto"

export class P2PDB extends Dexie {
  peers: Dexie.Table<IPeers, number>
  orders: Dexie.Table<IOrders, number>
  validators: Dexie.Table<IValidators, number>
  matchedOrders: Dexie.Table<IMatchedOrders, number>

  constructor() {
    super("browserbook")

    this.version(1).stores({ peers: "++id,peerId,joinedTime" })
    this.peers = this.table("peers")

    this.version(2).stores({
      orders:
        "id,tokenS,tokenB,orderType,actionType,amountB,amountS,orderFrom,from,status,created",
    })
    this.orders = this.table("orders")

    this.version(3).stores({ validators: "id,peerId,address,joinedTime" })
    this.validators = this.table("validators")

    this.version(4).stores({
      matchedOrder:
        "id,order1_id,order2_id,tokenA,tokenB,actionType,amountA,amountB,orderFrom,status,created",
    })
    this.matchedOrders = this.table("matchedOrder")
  }

  async addPeers(peer: IPeers) {
    await this.peers.add(peer)
  }

  async addValidator(validator: IValidators) {
    await this.validators.add(validator)
  }

  async addOrder(order: IOrders) {
    await this.orders.add(order)
  }
  async addMatchOrder(matchedOrder: IMatchedOrders) {
    await this.matchedOrders.add(matchedOrder)
  }

  async removePeers(id: number) {
    await this.peers.delete(id)
  }

  async removeValidator(id: number) {
    await this.validators.delete(id)
  }

  async removeOrder(id: number) {
    await this.orders.delete(id)
  }

  async removeMatchOrder(id: number) {
    await this.matchedOrders.delete(id)
  }
}
