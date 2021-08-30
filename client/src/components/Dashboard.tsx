import React from "react";
import "tailwindcss/tailwind.css"

import {Mesh,} from '@0x/mesh-browser-lite';

import OrderBook from './OrderBook'
import OrderForm from './OrderForm'
import Info from "./elements/Info";
import { useEthers } from "@usedapp/core";
import {useAppSelector} from "../store/Hooks";

type DashboardProps = {
}

const Dashboard = (props: DashboardProps) => {
  const { activateBrowserWallet, account } = useEthers()
  // const etherBalance = useEtherBalance(account)

  const getPeerID = () => {
    return useAppSelector(state => state.peer.peerID)
  }

  const getNumPeers = () => {
    return useAppSelector(state => state.peer.numPeers)
  }

  let message = `Your peer ID is: ${getPeerID()}`

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Info message={message} />
      <div className="h-screen px-4 py-16 sm:px-0 grid grid-cols-2 gap-x-8 gap-y-8">
        <div>
          Here goes a graph
        </div>
        <div className="h-full row-span-2">
          <OrderBook />
        </div>
        <div className="flex items-center justify-around border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
          <OrderForm />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
