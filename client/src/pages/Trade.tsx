import { useState } from 'react'
import {
  ChevronDoubleRightIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline'
import { classNames } from '../components/utils/utils'
import { useAppSelector, useTokenFactoryFilter, useTokenFilter } from '../app/Hooks'
import { selectTokenContract, selectTokens } from '../app/store/slices/TokensSlice'
import { Token, TokenType } from '../app/Types'
import TokenSelect from '../components/elements/TokenSelect'
import { selectAccountData } from '../app/store/slices/EthersSlice'

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
  const tokens = [
    {
      id: '1',
      name: 'Slurpee Labs Common A',
      metadataURI: 'slurpeelabs.eth/common-a',
      supply: '1000',
      type: TokenType.Fungible,
    },
    {
      id: '2',
      name: 'Slurpee Labs Common B',
      metadataURI: 'slurpeelabs.eth/common-a',
      supply: '1000',
      type: TokenType.Fungible,
    },
    {
      id: '3',
      name: 'Slurpee Labs Common C',
      metadataURI: 'slurpeelabs.eth/common-a',
      supply: '1000',
      type: TokenType.Fungible,
    },
  ]
  // const tokens = useAppSelector(selectTokens)
  const [selected, setSelected] = useState<Token>(tokens[0])

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <form action="#" method="POST">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Submit New Trade</h3>
              <InfoPanel message='Please be sure to read the "how it works" before trading' link="" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                {/* <TokenSelect tokens={tokens} selected={activeToken} setSelected={setActiveToken} /> */}
                <TokenSelect tokens={tokens} selected={selected} setSelected={setSelected} />
              </div>

              <div className="col-span-3">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  About
                </label>
                <div className="mt-1">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="you@example.com"
                    defaultValue={''}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="bg-orange-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Trade
