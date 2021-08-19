import React from "react";
import "tailwindcss/tailwind.css"

import {Mesh,} from '@0x/mesh-browser-lite';

import Orderbook from './orderbook'
import Orderform from './orderform'
import Info from "./elements/Info";

type DashboardProps = {
  mesh: Mesh
}

const Dashboard = (props: DashboardProps) => {

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Info message="Here is a message" />
      <div className="h-screen px-4 py-16 sm:px-0 grid grid-cols-2 gap-x-8 gap-y-8">
        <div
          className="flex items-center justify-center border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
          This will be a pretty market graph
        </div>
        <div className="h-full row-span-2">
          <Orderbook />
        </div>
        <div className="flex items-center justify-around border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
          <Orderform />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
