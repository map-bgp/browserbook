import React, {useState} from 'react'
import "tailwindcss/tailwind.css"

import {Radio, RadioObject} from './elements/inputs/Radio'
import {SelectObject, Select} from "./elements/inputs/Select";

import {OrderActions, OrderTypes} from "../types/Order";

import { useAppDispatch } from '../store/Hooks'
import { addOrder } from '../store/slices/OrderbookSlice'
import { Tokens } from "../types/Token";
import {classNames} from "./utils/classNames";
import {XCircleIcon} from "@heroicons/react/solid";


function OrderForm() {
    const dispatch = useAppDispatch()

    const [tokenA, setTokenA] = useState(Tokens[0])
    const [tokenB, setTokenB] = useState(Tokens[1])

    const [orderType, setOrderType] = useState(OrderTypes[0]);
    const [actionType, setActionType] = useState(OrderActions[0])

    const [price, setPrice] = useState<number>(0.00);
    const [quantity, setQuantity] = useState<number>(0.00)

    const getTotal = (): number => {
        return (price * quantity)
    }

    const getTotalDisplay = (): string => {
        return (price * quantity).toFixed(4)
    }

    const isValid = (): boolean => {
        return tokenA !== tokenB
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        dispatch(addOrder({'type': orderType.value, 'price': price, 'quantity': quantity}))
    }

    return (
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
        <form className="h-full" onSubmit={handleSubmit}>
            <div className="mt-2 flex items-center justify-between">
                <Select label="I Have" range={Tokens} selected={tokenA as SelectObject} setSelected={setTokenA as React.Dispatch<React.SetStateAction<SelectObject>>} />
            </div>
            <div className="mt-2 mb-6 flex items-center justify-between">
                <Select label="I Want" range={Tokens} selected={tokenB as SelectObject} setSelected={setTokenB as React.Dispatch<React.SetStateAction<SelectObject>>} />
            </div>
            <div className="border-t mb-6 border-gray-200 w-4/5 mx-auto">
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Radio label="Queue Type" range={OrderTypes} selected={orderType} setSelected={setOrderType} />
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Select label="Action Type" range={OrderActions} selected={actionType} setSelected={setActionType} />
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
                      step="0.0001"
                      min={0}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                      placeholder="0.0000"
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
                      step="0.0001"
                      min={0}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                      placeholder="0.0000"
                    />
                </div>
            </div>
            <div className="w-full mt-4 flex items-center justify-between mt-4">
                <span className="block ml-2 text-sm font-medium text-gray-700">
                    Total
                </span>
                <div className="w-1/2 mt-1 ml-4 text-right">
                    <span className="block w-full sm:text-sm">{getTotalDisplay()}</span>
                </div>
            </div>
            <div className={classNames("mt-10", isValid() ? "" : "flex items-center justify-between")}>
                {!isValid() &&
                    <div className="w-3/5">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-xs font-medium text-red-800">Please select two different tokens</h3>
                            </div>
                        </div>
                    </div>
                }
                <button
                    type="submit"
                    className={classNames( !isValid() ? "cursor-not-allowed hover:bg-orange-600 active:bg-orange-600 focus:outline-none focus:ring-0" : "ml-auto mr-0 ", "block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500")}
                >
                    Submit Order
                </button>
            </div>
        </form>
      </div>
    )
}

export default OrderForm