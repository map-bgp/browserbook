import React, {useState} from 'react'
import "tailwindcss/tailwind.css"
import {Radio} from './elements/inputs/Radio'
import {Select} from "./elements/inputs/Select";

import {useAppDispatch} from '../store/Hooks'
import {addOrder} from '../store/slices/OrderbookSlice'

function OrderForm() {
    const dispatch = useAppDispatch()

    const [price, setPrice] = useState<number>(0.00);
    const [orderType, setOrderType] = useState("bid");

    // TODO Move to ENUM on Type itself
    const orderTypes: string[] = ["bid", "ask"]

    const handleSubmit = (evt) => {
        evt.preventDefault()
        dispatch(addOrder({'price': price, 'type': orderType, 'quantity': 1.00}))
    }

    return (
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
        <form className="h-full" onSubmit={handleSubmit}>
            <div className="mt-2 flex items-center justify-between">
                <Radio />
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Select />
            </div>
            <div className="w-full mt-2 flex items-center justify-between">
                <label htmlFor="name" className="block ml-2 text-sm font-medium text-gray-700">
                    Price
                </label>
                <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                      placeholder="0.00"
                    />
                </div>
            </div>
            <div className="w-full mt-2 flex items-center justify-between">
                <label htmlFor="name" className="block ml-2 text-sm font-medium text-gray-700">
                    Quantity
                </label>
                <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                      placeholder="0.00"
                    />
                </div>
            </div>
            <div className="w-full mt-2 flex items-center justify-between mt-10">
                <span className="block ml-2 text-sm font-medium text-gray-700">
                    Total
                </span>
                <div className="w-1/2 mt-1 ml-4 text-right">
                    <span className="block w-full sm:text-sm">Total</span>
                </div>
            </div>
            <div className="mt-20">
                <button
                    type="submit"
                    className="ml-auto mr-0 block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    Submit Order
                </button>
            </div>
        </form>
      </div>
    )
}

export default OrderForm