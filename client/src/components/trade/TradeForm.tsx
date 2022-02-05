import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon, SelectorIcon, XCircleIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { OrderType } from '../../app/constants'
import { useAppSelector, useEthers } from '../../app/Hooks'
import { submitOrder } from '../../app/oms/OrderService'
import { Order } from '../../app/p2p/protocol_buffers/gossip_schema'
import { selectTokens } from '../../app/store/slices/TokensSlice'
import { Token, TokenType } from '../../app/Types'
import TokenSelect from '../elements/TokenSelect'
import { classNames } from '../utils/utils'

const InfoPanel = (props: { message: string; link: string }) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">{props.message}</p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a href="#" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
              Details <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

const TradeForm = () => {
  const tokens = useAppSelector(selectTokens)
  const [selected, setSelected] = useState<Token>(tokens[0])
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Buy)
  const [price, setPrice] = useState<string>('')
  const [limitPrice, setLimitPrice] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [expiryHours, setExpiryHours] = useState<string>('')
  const [expiryMinutes, setExpiryMinutes] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setSelected(tokens[0])
  }, [tokens])

  useEffect(() => {
    if (!!selected && selected.type === TokenType.NonFungible) {
      setQuantity('1')
    }
  }, [selected])

  const getDateAtInterval = (hours: number, minutes: number) => {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    date.setMinutes(date.getMinutes() + minutes)
    return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()} at ${date.getUTCHours()}:${date.getUTCMinutes()} UTC`
  }

  const handleSubmit = () => {
    setError('')

    if (Number(price) === 0) {
      setError('Cannot offer a price of 0')
    } else if (Number(limitPrice) === 0) {
      setError('Cannot have a limit price of 0')
    } else if (orderType === OrderType.Buy && Number(limitPrice) < Number(price)) {
      setError('Limit price must be greater than price for BUY order')
    } else if (orderType === OrderType.Sell && Number(limitPrice) > Number(price)) {
      setError('Limit price must be lesser than price for SELL order')
    } else if (Number(quantity) === 0) {
      setError('Quantity cannot be 0')
    } else if (Number(expiryHours) === 0) {
      setError('Expiry must be at least one hour')
    } else {
      submitOrder(selected, orderType, price, limitPrice, quantity, expiryHours, expiryMinutes)
    }
  }

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Submit New Trade</h3>
            <InfoPanel message='Please be sure to read the "How it Works" before trading' link="" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-1">
              {!!selected ? (
                <TokenSelect tokens={tokens} selected={selected} setSelected={setSelected} />
              ) : (
                <div className="flex items-center pt-6">
                  <span className="block text-gray-500 italic">No tokens found to trade</span>
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-1">
              <div className="-space-y-px">
                <legend className="mb-1 block text-sm font-medium text-gray-700">Order Type</legend>
                <RadioGroup value={orderType} onChange={setOrderType} className="mt-2">
                  <div className="flex items-center justify-between gap-4">
                    <RadioGroup.Option
                      key={OrderType.Buy}
                      value={OrderType.Buy}
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-orange-500' : '',
                          checked
                            ? 'bg-orange-600 border-transparent text-white hover:bg-orange-700'
                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                          'cursor-pointer rounded-md shadow-sm  border rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase sm:flex-1',
                        )
                      }
                    >
                      <RadioGroup.Label as="p">{OrderType.Buy}</RadioGroup.Label>
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      key={OrderType.Sell}
                      value={OrderType.Sell}
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-orange-500' : '',
                          checked
                            ? 'bg-orange-600 border-transparent text-white hover:bg-orange-700'
                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                          'cursor-pointer rounded-md shadow-sm  border rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase sm:flex-1',
                        )
                      }
                    >
                      <RadioGroup.Label as="p">{OrderType.Sell}</RadioGroup.Label>
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="hidden sm:flex sm:col-span-1 sm:row-span-3 flex flex-col items-center justify-between pt-5 text-center">
              <div className="text-sm text-gray-500">You are offering to</div>
              <div className="text-4xl text-gray-700">{orderType.toUpperCase()}</div>
              <div className="text-sm text-gray-500">
                <div className="text-center">
                  {quantity} {!!selected && selected.name}
                </div>
              </div>
              <div className="text-sm text-gray-500 -mt-2">for</div>
              <div className="text-4xl text-gray-700 whitespace-nowrap">
                Ξ{' '}
                {!!price && !!quantity
                  ? (Number(price) * Number(quantity)).toString().length >= 9
                    ? (Number(price) * Number(quantity)).toPrecision(9)
                    : Number(price) * Number(quantity)
                  : 0}
              </div>
              <div className="text-sm text-gray-500">
                expiring on {getDateAtInterval(Number(expiryHours), Number(expiryMinutes))}
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Ξ</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.000000001"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                  }}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Limit Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Ξ</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.000000001"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="0"
                  step="0.0000000001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pr-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <legend className="mb-1 block text-sm font-medium text-gray-700">Expiry</legend>
              <div className="bg-white rounded-md shadow-sm -space-y-px">
                <div className="flex -space-x-px">
                  <div className="w-1/2 flex-1 min-w-0 relative">
                    <input
                      type="number"
                      name="expiry-hours"
                      id="expiry-hours"
                      min="0"
                      max="48"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 relative block w-full rounded-none rounded-bl-md rounded-tl-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                      placeholder="In Hours"
                    />
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <input
                      type="number"
                      name="expiry-minutes"
                      id="expiry-minutes"
                      min="0"
                      max="60"
                      value={expiryMinutes}
                      onChange={(e) => setExpiryMinutes(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 relative block w-full rounded-none rounded-br-md rounded-tr-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                      placeholder="and Minutes"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
          {error && (
            <div className="w-full">
              <div className="flex mx-4 items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xs font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          {!!selected ? (
            <button
              onClick={() => handleSubmit()}
              className={
                'block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => {}}
              className={
                'block cursor-not-allowed flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradeForm
