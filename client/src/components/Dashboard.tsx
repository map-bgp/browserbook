import React from "react";
import "tailwindcss/tailwind.css";

import OrderBook from "./OrderBook";
import OrderForm from "./OrderForm";
import Info from "./elements/Info";
import Chart from "./elements/Chart";
import { useEthers } from "@usedapp/core";
import { useAppSelector } from "../store/Hooks";
import { Libp2p } from "libp2p-interfaces/src/pubsub";
import EventEmitter from 'events'
import {db, IPeers } from "../db";

const Dashboard = () => {
  const { activateBrowserWallet, account } = useEthers();
  // const etherBalance = useEtherBalance(account)

  const getPeerID = () => {
    return useAppSelector((state) => state.peer.peerID);
  };

  const indexDB = new db();

  let peerIDMessage = `Your peer ID is: ${getPeerID()}`;

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Info message={peerIDMessage} />
      <div className="px-4 py-4 sm:px-0 grid grid-cols-12 gap-x-8 gap-y-8">
        <div className="flex justify-around h-[30rem] col-span-6 md:col-span-7">
          <Chart />
        </div>
        <div className="flex justify-around h-[30rem] col-span-2 md:col-span-1">
          <OrderBook />
        </div>
        <div className="flex justify-around h-[30rem] col-span-4">
          <OrderForm/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
