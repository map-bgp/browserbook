import {
  AcademicCapIcon,
  BadgeCheckIcon,
  PlusCircleIcon,
  BookOpenIcon,
  ReceiptRefundIcon,
  UsersIcon,
} from '@heroicons/react/outline'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/Hooks'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { getAllPendingOrders, selectOrdersWithTokenData } from '../app/store/slices/PeerSlice'
import { getTokens } from '../app/store/slices/TokensSlice'
import { TokenType } from '../app/Types'
import { NavKey } from '../components/utils/constants'
import { classNames } from '../components/utils/utils'

const actions = [
  {
    icon: BadgeCheckIcon,
    name: 'Create a Token',
    href: `/${NavKey.TOKEN_ADMINISTRATION}`,
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
    description: 'Commit your entity details to the chain and create tokens',
  },
  {
    icon: UsersIcon,
    name: 'Trade with Decentralized Peers',
    href: `/${NavKey.TRADE}`,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
    description: 'Sign and submit orders to trade with the decentralized community',
  },
  {
    icon: PlusCircleIcon,
    name: 'Import a 3rd-Party Token',
    href: `/${NavKey.TRADE}/tokens`,
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
    description:
      'Import tokens from other entities. You will need the entity identifier and the token id',
  },
  {
    icon: BookOpenIcon,
    name: 'View the Decentralized Orderbook',
    href: `/${NavKey.ORDER_BOOK}`,
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
    description: 'View all of the orders coming and going through the decentralized orderbook',
  },
  {
    icon: ReceiptRefundIcon,
    name: 'Validate Orders and Earn Commissions',
    href: `/${NavKey.ORDER_VALIDATION}`,
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
    description: 'Want to earn commissions? Commit your signer key and start validating orders',
  },
  {
    icon: AcademicCapIcon,
    name: 'Read How it Works',
    href: `/${NavKey.HOW_IT_WORKS}`,
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
    description: 'Read up on how the big ideas behind browserbook and how it works',
  },
]

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const { primaryAccount } = useAppSelector(selectAccountData)
  const orders = useAppSelector(selectOrdersWithTokenData)

  useEffect(() => {
    dispatch(getAllPendingOrders())
  }, [])

  useEffect(() => {
    if (primaryAccount) {
      dispatch(getTokens())
    }
  }, [primaryAccount])

  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <main className="py-8">
          <div className="mx-auto max-w-3xl lg:max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="profile-overview-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            {!!primaryAccount ? (
                              <>
                                <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                                <p className="sm:text-md text-sm font-bold text-gray-900">
                                  {primaryAccount}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-gray-600">
                                  Please connect your wallet above to proceed
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {!!primaryAccount && (
                          <div className="mt-5 flex justify-center sm:mt-0">
                            <Link
                              to={`/${NavKey.TRADE}/orders`}
                              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                              View your orders
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="quick-links-title">
                  <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                    <h2 className="sr-only" id="quick-links-title">
                      Quick links
                    </h2>
                    {actions.map((action, actionIdx) => (
                      <div
                        key={action.name}
                        className={classNames(
                          actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                          actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                          actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                          actionIdx === actions.length - 1
                            ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
                            : '',
                          'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500',
                        )}
                      >
                        <div>
                          <span
                            className={classNames(
                              action.iconBackground,
                              action.iconForeground,
                              'inline-flex rounded-lg p-3 ring-4 ring-white',
                            )}
                          >
                            <action.icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="mt-8">
                          <h3 className="text-lg font-medium">
                            <Link to={action.href} className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              {action.name}
                            </Link>
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">{action.description}</p>
                        </div>
                        <span
                          className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="recent-hires-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-base font-medium text-gray-900" id="recent-hires-title">
                        Recent Orders
                      </h2>
                      <div className="mt-6 flow-root">
                        {orders !== null ? (
                          <ul role="list" className="-my-5 divide-y divide-gray-200">
                            {orders.slice(0, 10).map((order) => (
                              <li key={order.id} className="py-4">
                                <div className="flex items-center space-x-4">
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                      {order.tokenName}
                                      {' - '}
                                      {order.tokenType === TokenType.Fungible ? (
                                        <span className="text-sm italic text-gray-500">Fungible</span>
                                      ) : (
                                        <span className="text-sm italic text-gray-500">
                                          Non-Fungible
                                        </span>
                                      )}
                                    </p>
                                    <p className="truncate text-sm text-gray-500">
                                      Ξ {order.price} - {order.quantity}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div className="mt-6">
                        <Link
                          to={`/${NavKey.ORDER_BOOK}`}
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Go to Orderbook
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className="mx-auto max-w-3xl lg:max-w-7xl">
            <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
              <div className="block sm:inline">Browserbook v1.0.0</div>{' '}
              <div>
                Link to contracts:{' '}
                <a href="#" className="block hover:underline sm:inline">
                  etherscan
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Dashboard
