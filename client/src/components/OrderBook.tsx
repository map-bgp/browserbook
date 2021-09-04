import React from 'react'
import "tailwindcss/tailwind.css"

import {useAppSelector} from '../store/Hooks'

function OrderBook() {
  // The `state` arg is correctly typed as `RootState` already
  const askQueue = useAppSelector(state => state.orderbook.askQueue.slice(-12))
  const bidQueue = useAppSelector(state => state.orderbook.bidQueue.slice(0, 12))

  return (
    <table className="min-w-max bg-white w-full rounded flex items-center justify-between mx-auto">
      <tbody className="w-full">
        {askQueue.map(order => <tr className="block w-full first:mt-2 flex items-center justify-between text-xs font-light"><td className="block text-red-500 ml-2">{order.price.toFixed(2)}</td><td className="block text-gray-600 mr-2">{order.quantity.toFixed(2)}</td></tr>)}
        <tr className="w-full flex items-center justify-around text-md font-medium">5.55</tr>
        {bidQueue.map(order => <tr className="w-full last:mb-2 flex items-center justify-between text-xs font-light"><td className="text-green-500 ml-2">{order.price.toFixed(2)}</td><td className="text-gray-600 mr-2">{order.quantity.toFixed(2)}</td></tr>)}
      </tbody>
    </table>
  )
}

export default OrderBook