import { Mesh } from '@0x/mesh-browser-lite'
import React, { useState } from 'react'
import "tailwindcss/tailwind.css"

import { useAppSelector, useAppDispatch } from '../app/hooks'

import { addOrder } from '../features/orderbookSlice'
import  {addNewOrder} from '../features/OrderCreation'
import {Order} from "./types/Order";

function Orderform() {
  const dispatch = useAppDispatch()

  const bid: Order = {
    type: "bid",
    price: 1.00
  }

  const ask: Order = {
    type: "ask",
    price: 2.00
  }

  return (
    <>
      <button
        type="button"
        className="mx-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => dispatch(addOrder(bid))}
      >
        Add Bid
      </button>

      <button
        type="button"
        className="mx-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => addNewOrder()}
      >
        Create Order
      </button>

      <button
        type="button"
        className="mx-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => dispatch(addOrder(ask))}
      >
        Add Ask
      </button>
    </>
  )
}

export default Orderform