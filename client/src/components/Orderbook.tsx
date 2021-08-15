import React, { useState } from 'react'
import "tailwindcss/tailwind.css"

import { useAppSelector, useAppDispatch } from '../app/hooks'

import { addOrder } from '../features/orderbookSlice'
import {Order} from "./types/Order";

function Orderbook() {
  // The `state` arg is correctly typed as `RootState` already
  const bidQueue = useAppSelector(state => state.orderbook.bidQueue)
  const askQueue = useAppSelector(state => state.orderbook.askQueue)

  return (
    <>
      <table>
      <tbody>
        {bidQueue.map(order => <div className="w-full">{order.type} - {order.price}</div>)}
        {askQueue.map(order => <div className="w-full">{order.type} - {order.price}</div>)}
      </tbody>
    </table>
    </>
  )
}

export default Orderbook