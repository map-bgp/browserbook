import { ethers as ethersLib } from 'ethers'
import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../app/Hooks'
import { submitOrder } from '../../app/oms/OrderService'
import { Order, OrderType } from '../../app/p2p/protocol_buffers/gossip_schema'
import { selectAccountData } from '../../app/store/slices/EthersSlice'
import { selectTokens } from '../../app/store/slices/TokensSlice'
import { Token, TokenType } from '../../app/Types'
import { classNames, getDateAtInterval } from '../utils/utils'
import TokenSelect from '../elements/TokenSelect'
import { selectBalance } from '../../app/store/slices/PeerSlice'

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
  const { primaryAccount } = useAppSelector(selectAccountData)
  const tokens = useAppSelector(selectTokens)
  const balance = useAppSelector(selectBalance)
  const [selected, setSelected] = useState<Token>(tokens[0])
  const [orderType, setOrderType] = useState<OrderType>(OrderType.BUY)
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

  // Sellers make orders
  useEffect(() => {
    if (orderType === OrderType.SELL) {
      setLimitPrice(price)
    }
  }, [orderType, price])

  const handleSubmit = () => {
    setError('')

    if (Number(price) === 0) {
      setError('Cannot offer a price of 0')
    } else if (Number(limitPrice) === 0) {
      setError('Cannot have a limit price of 0')
    } else if (orderType === OrderType.BUY && Number(limitPrice) < Number(price)) {
      setError('Limit price must be greater than price for BUY order')
    } else if (orderType === OrderType.SELL && Number(limitPrice) > Number(price)) {
      setError('Limit price must be lesser than price for SELL order')
    } else if (Number(quantity) === 0) {
      setError('Quantity cannot be 0')
    } else if (Number(expiryHours) === 0) {
      setError('Expiry must be at least one hour')
    } else if (Number(balance) < Number(limitPrice) * Number(quantity) && orderType === OrderType.BUY) {
      setError('Insufficient funds')
    } else if (primaryAccount === null) {
      setError('Could not find your account. Is your wallet connected?')
      throw new Error('Trying to submit order without accompanying address')
    } else {
      submitOrder(
        primaryAccount,
        selected,
        orderType,
        price,
        limitPrice,
        quantity,
        expiryHours,
        expiryMinutes,
      )
    }
  }

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Submit New Trade</h3>
            <InfoPanel message='Please be sure to read the "How it Works" before trading' link="" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-1">
              {!!selected ? (
                <TokenSelect tokens={tokens} selected={selected} setSelected={setSelected} />
              ) : (
                <div className="flex items-center pt-6">
                  <span className="block italic text-gray-500">No tokens found to trade</span>
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-1">
              <div className="-space-y-px">
                <legend className="mb-1 block text-sm font-medium text-gray-700">Order Type</legend>
                <RadioGroup value={orderType} onChange={setOrderType} className="mt-2">
                  <div className="flex items-center justify-between gap-4">
                    <RadioGroup.Option
                      key={OrderType.BUY}
                      value={OrderType.BUY}
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-orange-500 ring-offset-2' : '',
                          checked
                            ? 'border-transparent bg-orange-600 text-white hover:bg-orange-700'
                            : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                          'flex cursor-pointer items-center  justify-center rounded-md rounded-md border py-2 px-2 text-sm font-medium uppercase shadow-sm sm:flex-1',
                        )
                      }
                    >
                      <RadioGroup.Label as="p">Buy</RadioGroup.Label>
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      key={OrderType.SELL}
                      value={OrderType.SELL}
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-orange-500 ring-offset-2' : '',
                          checked
                            ? 'border-transparent bg-orange-600 text-white hover:bg-orange-700'
                            : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                          'flex cursor-pointer items-center  justify-center rounded-md rounded-md border py-2 px-2 text-sm font-medium uppercase shadow-sm sm:flex-1',
                        )
                      }
                    >
                      <RadioGroup.Label as="p">Sell</RadioGroup.Label>
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="flex hidden flex-col items-center justify-between pt-5 text-center sm:col-span-1 sm:row-span-3 sm:flex">
              <div className="text-sm text-gray-500">You are offering to</div>
              <div className="text-4xl text-gray-700">
                {orderType === OrderType.BUY ? 'BUY' : 'SELL'}
              </div>
              <div className="text-sm text-gray-500">
                <div className="text-center">
                  {quantity} {!!selected && selected.name}
                </div>
              </div>
              <div className="-mt-2 text-sm text-gray-500">for</div>
              <div className="whitespace-nowrap text-4xl text-gray-700">
                Ξ{' '}
                {!!price && !!quantity
                  ? (Number(price) * Number(quantity)).toString().length >= 9
                    ? (Number(price) * Number(quantity)).toPrecision(9)
                    : Number(price) * Number(quantity)
                  : 0}
              </div>
              <div className="text-sm text-gray-500">
                expiring on {getDateAtInterval(Number(expiryHours), Number(expiryMinutes)).toUTCString()}
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                  className="block w-full rounded-md border-gray-300 pl-7 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Limit Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                  className={classNames(
                    orderType === OrderType.SELL ? 'cursor-not-allowed bg-gray-50 ' : '',
                    'block w-full rounded-md border-gray-300 pl-7 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm',
                  )}
                  placeholder="0.00"
                  disabled={orderType === OrderType.SELL}
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="0"
                  step="0.0000000001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <legend className="mb-1 block text-sm font-medium text-gray-700">Expiry</legend>
              <div className="-space-y-px rounded-md bg-white shadow-sm">
                <div className="flex -space-x-px">
                  <div className="relative w-1/2 min-w-0 flex-1">
                    <input
                      type="number"
                      name="expiry-hours"
                      id="expiry-hours"
                      min="0"
                      max="48"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(e.target.value)}
                      className="relative block w-full rounded-none rounded-bl-md rounded-tl-md border-gray-300 bg-transparent focus:z-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      placeholder="In Hours"
                    />
                  </div>
                  <div className="relative min-w-0 flex-1">
                    <input
                      type="number"
                      name="expiry-minutes"
                      id="expiry-minutes"
                      min="0"
                      max="60"
                      value={expiryMinutes}
                      onChange={(e) => setExpiryMinutes(e.target.value)}
                      className="relative block w-full rounded-none rounded-br-md rounded-tr-md border-gray-300 bg-transparent focus:z-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      placeholder="and Minutes"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end bg-gray-50 px-4 py-3 text-right sm:px-6">
          {error && (
            <div className="w-full">
              <div className="mx-4 flex items-center">
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
                'block flex items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:bg-orange-900'
              }
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => {}}
              className={
                'block flex cursor-not-allowed items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
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
