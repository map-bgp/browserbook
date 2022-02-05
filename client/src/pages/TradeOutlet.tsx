import { NavLink, Outlet, useLocation } from 'react-router-dom'
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

enum ActiveSection {
  Trade = 'Trade',
  Transfer = 'Transfer',
  MyTokens = 'My Tokens',
  MyDividends = 'My Dividends',
}

const navigation = [
  { name: ActiveSection.Trade, url: 'trade', icon: GlobeAltIcon },
  { name: ActiveSection.Transfer, url: 'transfer', icon: ChevronDoubleRightIcon },
  { name: ActiveSection.MyTokens, url: 'my-tokens', icon: BookOpenIcon },
  { name: ActiveSection.MyDividends, url: 'my-dividends', icon: BriefcaseIcon },
]

const TradeOutlet = () => {
  const location = useLocation()

  const { primaryAccount } = useAppSelector(selectAccountData)
  const tokenContractAddress = useAppSelector(selectTokenContractAddress)

  useTokenFactoryFilter(primaryAccount)
  useTokenFilter(primaryAccount, tokenContractAddress)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 py-8">
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                to={item.url}
                key={item.name}
                className={({ isActive }) =>
                  classNames(
                    isActive || (location.pathname === '/trade' && item.name === ActiveSection.Trade)
                      ? 'bg-gray-50 text-orange-700 hover:text-orange-700 hover:bg-white'
                      : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                    'group rounded-md px-3 py-2 flex items-center text-sm font-medium cursor-pointer',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={classNames(
                        isActive || (location.pathname === '/trade' && item.name === ActiveSection.Trade)
                          ? 'text-orange-500 group-hover:text-orange-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <Outlet />
      </div>
    </div>
  )
}

export default TradeOutlet
