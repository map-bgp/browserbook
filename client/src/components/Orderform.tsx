import React, { Fragment, useState } from 'react'
import { Mesh } from '@0x/mesh-browser-lite'
import "tailwindcss/tailwind.css"

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { useAppDispatch } from '../app/hooks'

import { addOrder } from '../features/orderbookSlice'
import  {addNewOrder} from '../features/OrderCreation'
import {Order} from "./types/Order";

import { classNames} from "./utils/classNames";

function OrderForm() {
  const dispatch = useAppDispatch()

  const [price, setPrice] = useState<number>(0.00);
  const [orderType, setOrderType] = useState("bid");

  // TODO Move to ENUM on Type itself
  const orderTypes: string[] = ["bid", "ask"]

  const handleSubmit = (evt) => {
    evt.preventDefault()
    dispatch(addOrder({'price': price, 'type': orderType}))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 border-b border-gray-300 focus-within:border-orange-600">
            <input
              type="number"
              name="Price"
              id="price"
              className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
              placeholder="0.00"
              onChange={e => setPrice(e.target.valueAsNumber)}
            />
          </div>
        </div>
        <Listbox value={orderType} onChange={setOrderType}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700">Order Type</Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <span className="block truncate">{orderType}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {orderTypes.map((item) => (
                      <Listbox.Option
                        key={item}
                        className={({ active }) =>
                          classNames(
                            active ? 'text-white bg-orange-600' : 'text-gray-900',
                            'cursor-default select-none relative py-2 pl-3 pr-9'
                          )
                        }
                        value={item}
                      >
                        {({ active }) => (
                          <>
                        <span className={classNames(orderType ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {item}
                        </span>

                            {orderType ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-orange-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <div>
        <button
          type="submit"
          className="mx-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Add Order to Queue
        </button>

        <button
            type="button"
            className="mx-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => addNewOrder()}
        >
          Create Order
        </button>
      </div>
    </form>
  )
}

export default OrderForm