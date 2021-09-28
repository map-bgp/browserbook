import React from 'react'
import "tailwindcss/tailwind.css"

import {Link, useHistory} from "react-router-dom";
import { providers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import {Disclosure} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'

import {classNames} from './utils/classNames'
import PriceTicker from "./elements/Ticker";
import {useAppSelector} from "../store/Hooks";
import {useAppContext} from "./context/Store";
import { injected } from '../blockchain';

type HeaderProps = {
  navigation: any[],
  current: string,
}

const Header = (props: HeaderProps) => {
  const { account, activate, deactivate, active, error } = useWeb3React<providers.Web3Provider>()
  const history = useHistory();

  const { state, setContext } = useAppContext()

  const getNumPeers = () => {
    return useAppSelector(state => state.peer.numPeers)
  }

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-sm">
      {({open}) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {props.navigation.map((item) => (
                    <Link
                      to={item.key}
                      key={item.key}
                      className={classNames(
                        props.current === item.name
                          ? 'border-orange-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      )}
                      aria-current={props.current === item.name ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="absolute top-0 right-0 mr-8 my-4 py-2 text-gray-500 text-sm font-medium">
                  Peer Count: {getNumPeers()}
                </div>
              </div>

              
              {!account && <button
                type="button"
                className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => activate(injected)}
              >
                Connect
              </button>}

              {account && <button
                type="button"
                className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => deactivate()}
              >
                Disconnect
              </button>}



              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button
                  className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true"/>
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {props.navigation.map((item) => (
                <Link
                  to={item.key}
                  key={item.key}
                  className={classNames(
                    props.current === item.name
                      ? 'border-orange-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  )}
                  aria-current={props.current === item.name ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
      <PriceTicker />
    </>
  );
}

export default Header
