import { useEffect, useState } from 'react'
import {
  ChevronDoubleRightIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  SelectorIcon,
} from '@heroicons/react/outline'
import { classNames } from '../components/utils/utils'
import { useAppSelector, useEthers, useTokenFactoryFilter, useTokenFilter } from '../app/Hooks'
import { selectTokenContract, selectTokens } from '../app/store/slices/TokensSlice'
import { Token, TokenType } from '../app/Types'
import TokenSelect from '../components/elements/TokenSelect'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { type } from 'os'

enum ActiveSection {
  Trade = 'Trade',
  Transfer = 'Transfer',
  Add = 'Add a Token',
}

const navigation = [
  { name: ActiveSection.Trade, icon: GlobeAltIcon },
  { name: ActiveSection.Transfer, icon: ChevronDoubleRightIcon },
  { name: ActiveSection.Add, icon: PlusCircleIcon },
]

const Trade = () => {
  const { primaryAccount } = useAppSelector(selectAccountData)
  const tokenContract = useAppSelector(selectTokenContract)

  useTokenFactoryFilter(primaryAccount)
  useTokenFilter(primaryAccount, tokenContract?.address)

  const [activeSection, setActiveSection] = useState<ActiveSection>(ActiveSection.Trade)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 py-8">
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={classNames(
                  item.name === activeSection
                    ? 'bg-gray-50 text-orange-700 hover:text-orange-700 hover:bg-white'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                  'group rounded-md px-3 py-2 flex items-center text-sm font-medium cursor-pointer',
                )}
                aria-current={item.name === activeSection ? 'page' : undefined}
              >
                <item.icon
                  className={classNames(
                    item.name === activeSection
                      ? 'text-orange-500 group-hover:text-orange-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>
        {activeSection === ActiveSection.Trade ? <TradeForm /> : <></>}
      </div>
    </div>
  )
}

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
  const { signer } = useEthers()

  const tokens = useAppSelector(selectTokens)
  const [selected, setSelected] = useState<Token>(tokens[0])
  const [expiryHours, setExpiryHours] = useState<string>('')
  const [expiryMinutes, setExpiryMinutes] = useState<string>('')
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(0)

  useEffect(() => {
    setSelected(tokens[0])
  }, [tokens])

  useEffect(() => {
    if (!!selected && selected.type === TokenType.NonFungible) {
      setQuantity(1)
    }
  }, [selected])

  const getDateAtInterval = (hours: number, minutes: number) => {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    date.setMinutes(date.getMinutes() + minutes)
    return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()} at ${date.getUTCHours()}:${date.getUTCMinutes()} UTC`
  }

  const submitOrder = async () => {
    const expiry = new Date()

    expiry.setHours(expiry.getHours() + Number(expiryHours))
    expiry.setHours(expiry.getMinutes() + Number(expiryMinutes))

    const expiryMS = Math.floor(expiry.getTime() / 1000)

    // Will be refactored to service method
    const domain = {
      name: 'BB Order',
      version: '1',
      chainId: 31337,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    }

    const types = {
      Order: [
        { name: 'tokenId', type: 'int32' },
        { name: 'type', type: 'string' },
        { name: 'price', type: 'int32' },
        { name: 'quantity', type: 'int32' },
        { name: 'expiry', type: 'int32' },
      ],
    }

    const order = {
      tokenId: selected.id,
      type: orderType,
      price: price,
      quantity: quantity,
      expiry: expiryMS,
    }

    console.log(order)

    const signature = await signer?._signTypedData(domain, types, order)
    console.log('Signature', signature)
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
            <div className="col-span-3 sm:col-span-2">
              {!!selected ? (
                <TokenSelect tokens={tokens} selected={selected} setSelected={setSelected} />
              ) : (
                <>
                  <div className="flex items-center">
                    <span className="block truncate text-gray-500 italic">No tokens found to trade</span>
                  </div>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </>
              )}
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
                {(price * quantity).toString().length >= 9
                  ? (price * quantity).toPrecision(9)
                  : price * quantity}
              </div>
              <div className="text-sm text-gray-500">
                expiring on {getDateAtInterval(Number(expiryHours), Number(expiryMinutes))}
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <legend className="mb-1 block text-sm font-medium text-gray-700">Expiry</legend>
              <div className="bg-white rounded-md shadow-sm -space-y-px">
                <div className="flex -space-x-px">
                  <div className="w-1/2 flex-1 min-w-0 relative">
                    <input
                      type="text"
                      name="expiry-hours"
                      id="expiry-hours"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 relative block w-full rounded-none rounded-bl-md rounded-tl-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                      placeholder="In Hours"
                    />
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <input
                      type="text"
                      name="expiry-minutes"
                      id="expiry-minutes"
                      value={expiryMinutes}
                      onChange={(e) => setExpiryMinutes(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 relative block w-full rounded-none rounded-br-md rounded-tr-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                      placeholder="and Minutes"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 my-2">Order Type</label>
              <fieldset className="mt-4">
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  <div key="buy" className="flex items-center">
                    <input
                      id="buy"
                      name="action"
                      type="radio"
                      onChange={(e) => setOrderType(e.target.id as 'buy' | 'sell')}
                      defaultChecked={true}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <label htmlFor="buy" className="ml-3 block text-sm font-medium text-gray-700">
                      Buy
                    </label>
                  </div>
                  <div key="sell" className="flex items-center">
                    <input
                      id="sell"
                      name="action"
                      type="radio"
                      onChange={(e) => setOrderType(e.target.id as 'buy' | 'sell')}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <label htmlFor="sell" className="ml-3 block text-sm font-medium text-gray-700">
                      Sell
                    </label>
                  </div>
                </div>
              </fieldset>
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
                  step="0.0000000001"
                  value={price.toString()}
                  onChange={(e) => setPrice(Number(e.target.value))}
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
                  value={quantity.toString()}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pr-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={() => submitOrder()}
            className="bg-orange-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Trade
