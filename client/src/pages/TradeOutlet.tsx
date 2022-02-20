import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  ChevronDoubleRightIcon,
  ScaleIcon,
  GlobeAltIcon,
  CollectionIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from '@heroicons/react/outline'
import { classNames } from '../components/utils/utils'
import { useAppDispatch, useAppSelector, useTokenFactoryFilter, useTokenFilter } from '../app/Hooks'
import { getTokens, selectTokenContractAddress } from '../app/store/slices/TokensSlice'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { useEffect } from 'react'

enum ActiveSection {
  Trade = 'Trade',
  Balance = 'Balance',
  MyOrders = 'My Orders',
  Transfer = 'Transfer',
  MyTokens = 'Tokens',
  MyDividends = 'Dividends',
}

const navigation = [
  { name: ActiveSection.Trade, url: 'trade', icon: GlobeAltIcon },
  { name: ActiveSection.Balance, url: 'balance', icon: ScaleIcon },
  { name: ActiveSection.MyOrders, url: 'orders', icon: CollectionIcon },
  { name: ActiveSection.Transfer, url: 'transfer', icon: ChevronDoubleRightIcon },
  { name: ActiveSection.MyTokens, url: 'tokens', icon: BookOpenIcon },
  { name: ActiveSection.MyDividends, url: 'dividends', icon: BriefcaseIcon },
]

const TradeOutlet = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()

  const { primaryAccount } = useAppSelector(selectAccountData)
  const tokenContractAddress = useAppSelector(selectTokenContractAddress)

  useTokenFactoryFilter(primaryAccount)
  useTokenFilter(primaryAccount, tokenContractAddress)

  // TODO async ui
  useEffect(() => {
    if (primaryAccount) {
      dispatch(getTokens())
    }
  }, [primaryAccount])

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="py-8 lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                to={item.url}
                key={item.name}
                className={({ isActive }) =>
                  classNames(
                    isActive || (location.pathname === '/trade' && item.name === ActiveSection.Trade)
                      ? 'bg-gray-50 text-orange-700 hover:bg-white hover:text-orange-700'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                    'group flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium',
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
                        '-ml-1 mr-3 h-6 w-6 flex-shrink-0',
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
