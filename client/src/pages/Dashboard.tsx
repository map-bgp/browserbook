import React from 'react'
// import OrderBook from "./OrderBook";
// import OrdersTable from "./elements/OrdersTable";
// import { useAppDispatch, useAppSelector } from "../store/Hooks";
// import { useAppContext } from "./context/Store";
// import { selectOrders } from "../store/slices/OrdersSlice";

import Info from '../components/elements/Info'
import Chart from '../components/elements/Chart'

const Dashboard = () => {
  //   const { state, setContext } = useAppContext();
  //   const orders = useAppSelector(selectOrders);
  //   const getPeerID = () => {
  //     return state.peerId;
  //   };

  //   //Index DB storage for the peer ID
  //   const peerID = getPeerID();
  //   // state.p2pDb.transaction('rw', state.p2pDb.peers, async() =>{
  //   //   const id = await state.p2pDb.peers.add({peerId: peerID, joinedTime: Date.now().toString()});
  //   //   console.log(`Peer ID is stored in ${id}`)
  //   // }).catch(e => { console.log(e.stack || e);});
  //

  //   let peerIDMessage = `Your peer ID is: ${getPeerID()}`;

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Info message={'Here is your Peer ID: 12345'} />
      <div className="px-4 py-4 sm:px-0 grid grid-cols-12 gap-x-8 gap-y-8">
        <div className="flex justify-around h-[30rem] col-span-6 md:col-span-7">
          <Chart />
        </div>
        <div className="flex justify-around h-[30rem] col-span-2 md:col-span-1">
          {/*<OrderBook />*/}
          Here is the order book
        </div>
      </div>
      <div className="flex justify-around h-[30rem] col-span-4">
        {/*<OrdersTable orders={orders} />*/}
        Here is the order table
      </div>
    </div>
  )
}

export default Dashboard
