import { useState } from 'react'
import {
  ChevronDoubleRightIcon,
  GlobeAltIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from '@heroicons/react/outline'
import { classNames } from '../components/utils/utils'
import { useAppSelector, useTokenFactoryFilter, useTokenFilter } from '../app/Hooks'
import { selectTokenContractAddress } from '../app/store/slices/TokensSlice'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import TradeForm from '../components/TradeForm'
import TransferForm from '../components/TransferForm'

enum ActiveSection {
  Trade = 'Trade',
  Transfer = 'Transfer',
  MyTokens = 'My Tokens',
  MyDividends = 'My Dividends',
}

const navigation = [
  { name: ActiveSection.Trade, icon: GlobeAltIcon },
  { name: ActiveSection.Transfer, icon: ChevronDoubleRightIcon },
  { name: ActiveSection.MyTokens, icon: BookOpenIcon },
  { name: ActiveSection.MyDividends, icon: BriefcaseIcon },
]

const Trade = () => {
  const { primaryAccount } = useAppSelector(selectAccountData)
  const tokenContractAddress = useAppSelector(selectTokenContractAddress)

  useTokenFactoryFilter(primaryAccount)
  useTokenFilter(primaryAccount, tokenContractAddress)

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
        {activeSection === ActiveSection.Transfer ? <TransferForm /> : <></>}
        {activeSection === ActiveSection.MyTokens ? <div>My Tokens</div> : <></>}
        {activeSection === ActiveSection.MyDividends ? <div>My Dividends</div> : <></>}
      </div>
    </div>
  )
}

export default Trade
