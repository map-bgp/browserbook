export interface IPeers{
    id?: number,
    peerId: string,
    joinedTime:string,
}

export interface Orders{
    id?: number,
    tokenA: string,
    tokenB: string,
    ordertype: string,
    actionAction: string,
    price: string,
    quantity: number,
}