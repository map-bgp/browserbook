import { Link } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { classNames } from './utils/utils'
import { Navigation, NavPage } from './utils/constants'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { useAppSelector, useEthers } from '../app/Hooks'
import { selectNumPeers } from '../app/store/slices/PeerSlice'

// import {classNames} from './utils/classNames'

type HeaderProps = {
  current: NavPage
}

const Header = (props: HeaderProps) => {
  const { isConnected } = useAppSelector(selectAccountData)
  const numPeers = useAppSelector(selectNumPeers)

  const { ethers } = useEthers()

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {Object.entries(Navigation).map(([key, name]) => (
                      <Link
                        to={key}
                        key={key}
                        className={classNames(
                          props.current === name
                            ? 'border-orange-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                        )}
                        aria-current={props.current === name ? 'page' : undefined}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mr-4 flex items-center justify-end">
                  <div className="mr-4 flex items-center justify-around px-4">
                    {isConnected ? (
                      <>
                        <div className="my-4 mr-2 py-2 text-sm font-medium text-gray-500">Connected</div>
                        <div className="flex h-3 w-3">
                          <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="my-4 mr-0 ml-auto block flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        onClick={() => {
                          ethers.connect().then()
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                  <div className="my-4 mr-8 py-2 text-sm font-medium text-gray-500">
                    Peer Count: {numPeers}
                  </div>
                </div>

                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="flex flex-col items-center space-y-1 pt-2 pb-3">
                {Object.entries(Navigation).map(([key, name]) => (
                  <Link
                    to={key}
                    key={key}
                    className={classNames(
                      props.current === name
                        ? 'border-orange-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                    aria-current={props.current === name ? 'page' : undefined}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}

export default Header
