import React from 'react'
import { Tokens } from '../app/constants'

const Trade = () => {
  const tokenSelection = Object.values(Tokens).map((val) => <option>{val}</option>)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">New Order</h3>
            <p className="mt-1 text-sm text-gray-600">Input your order details</p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="have" className="block text-sm font-medium text-gray-700">
                    I Have
                  </label>
                  <select
                    id="have"
                    name="have"
                    autoComplete="have"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    {tokenSelection}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="have" className="block text-sm font-medium text-gray-700">
                    I Want
                  </label>
                  <select
                    id="want"
                    name="want"
                    autoComplete="want"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    {tokenSelection}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.00001"
                    id="price"
                    name="price"
                    autoComplete="price"
                    placeholder="0"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    id="quantity"
                    name="quantity"
                    autoComplete="quantity"
                    placeholder="0"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Order Type</div>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-5">
                    <div className="flex items-center">
                      <input
                        id="bid"
                        name="order-type"
                        type="radio"
                        checked
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                      />
                      <label htmlFor="bid" className="ml-3 block text-sm font-medium text-gray-700">
                        Bid
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="ask"
                        name="order-type"
                        type="radio"
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                      />
                      <label htmlFor="ask" className="ml-3 block text-sm font-medium text-gray-700">
                        Ask
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <div className="block text-sm font-medium text-gray-700 mb-2">Order Mechanism</div>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-5">
                    <div className="flex items-center">
                      <input
                        id="bid"
                        name="order-mechanism"
                        type="radio"
                        checked
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                      />
                      <label htmlFor="bid" className="ml-3 block text-sm font-medium text-gray-700">
                        Market
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="ask"
                        name="order-mechanism"
                        type="radio"
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                      />
                      <label htmlFor="ask" className="ml-3 block text-sm font-medium text-gray-700">
                        Limit
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-1 align-top">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Token Admin</h3>
            <p className="mt-1 text-sm text-gray-600">See and administer already created tokens</p>
          </div>
        </div>
        <div className="md:col-span-2">
          Here is the token table
          {/*<TokenTable tokens={tokens} />*/}
        </div>
      </div>
    </div>
  )
}

export default Trade
