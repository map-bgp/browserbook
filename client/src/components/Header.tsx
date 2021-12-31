import React, {useContext, useEffect, useState} from 'react'
import "tailwindcss/tailwind.css"

import {Link} from "react-router-dom";
import {Disclosure} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'

import {classNames} from './utils/classNames'
import {useAppDispatch, useAppSelector} from "../store/Hooks";
import {selectEthersConnected, selectEthersAddress} from "../store/slices/EthersSlice";
import { addOrder, selectValidatorListen } from "../store/slices/OrdersSlice";
import PubsubChat from "../p2p/messagehandler";
import ValidatorHandler from "../p2p/validatorhandler";
import {useEthers} from '../store/Hooks';
import {useAppContext} from './context/Store';

import EthCrypto from 'eth-crypto'

type HeaderProps = {
  navigation: any[],
  current: string,
}

const Header = (props: HeaderProps) => {
  const dispatch = useAppDispatch();
  const TOPIC = "/libp2p/bbook/chat/1.0.0";
  const TOPIC_VALIDATOR = "/libp2p/example/validator/1.0.0";

  const [ethers, isConnected, address ]  = useEthers();
  const { state, setContext } = useAppContext();

  // Testing
  const [cipherText, setCipherText] = useState<string>("")
  const [localAddress, setLocalAddress] = useState<string>("")

  const validatorListener = useAppSelector(selectValidatorListen);

  useEffect(() => {
    if (!state.node) return;
    // Create the pubsub Client
      const pubsubChat = new PubsubChat(state.node, TOPIC);
      const validatorChannel = new ValidatorHandler(state.node, TOPIC_VALIDATOR)

      // Listen for messages
      pubsubChat.on("message", (message) => {
        if (message.from === state.node.peerId.toB58String()) {
          message.isMine = true;
        }
        dispatch(
          addOrder({
            id: message.id,
            tokenFrom: message.tokenA,
            tokenTo: message.tokenB,
            orderType: message.orderType,
            actionType: message.actionType,
            price: message.price,
            quantity: message.quantity,
            orderFrm: message.orderFrm,
            from: message.from,
            status: message.status,
            created: message.created,
          })
        );
        state.p2pDb
          .transaction("rw", state.p2pDb.orders, async () => {
            const id = await state.p2pDb.orders.add({
              id: message.id,
              tokenFrom: message.tokenA,
              tokenTo: message.tokenB,
              orderType: message.orderType,
              actionType: message.actionType,
              price: message.price,
              quantity: message.quantity,
              orderFrm: message.orderFrm,
              status: message.status,
              created: message.created,
            });
            console.log(`Order ID is stored in ${id}`);
          })
          .catch((e) => {
            console.log(e.stack || e);
          });
      });

      
      if (validatorListener) {
      // Listen for messages
      validatorChannel.on('sendMatcher', (message) => {
        if (message.from === state.node.peerId.toB58String()) { 
          message.isMine = true
        }

        //dispatch(addValidator({peerId: String(message.peerID), address: message.address, joinedTime: message.created}));
        state.p2pDb
          .transaction('rw', state.p2pDb.validators, async() =>{
            const id = await state.p2pDb.validators.add({
              id: message.id,
              peerId: message.peerID,
              address: message.address,
              joinedTime: message.created,
          });
          console.log(`Validator stored in ${id}`)
        })
        .catch(e => {
          console.log(e.stack || e);
        });
      });
     }
},[validatorListener]);

  const getNumPeers = () => {
    return useAppSelector(state => state.peer.numPeers)
  }

  const getEthersConnected = () => {
    return useAppSelector(selectEthersConnected)
  }

  const encrypt = async () => {
    const [cipherText, localAddress] = await ethers.encryptMessage(address)

    setCipherText(cipherText)
    setLocalAddress(localAddress)
  }

  const decrypt = async () => {
    let r = await ethers.decryptMessage(cipherText, address)
    console.log(r)
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
              <div className="flex items-center justify-end mr-4">
                <div className="px-4 flex items-center justify-around mr-4">
                  {getEthersConnected() ?
                    <>
                    <div className="mr-2 my-4 py-2 text-gray-500 text-sm font-medium">Connected</div>
                    <div className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <button
                      type="button"
                      className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      onClick={() => {
                        encrypt().then()
                      }}
                    >
                      Encrypt
                    </button>
                    <button
                      type="button"
                      className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      onClick={() => {
                        decrypt().then()
                      }}
                    >
                      Decrypt
                    </button>
                    </> :
                    <button
                      type="button"
                      className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      onClick={() => {
                        ethers.connect()
                      }}
                    >
                      Connect
                    </button>}
                </div>
                <div className="mr-8 my-4 py-2 text-gray-500 text-sm font-medium">
                  Peer Count: {getNumPeers()}
                </div>
              </div>

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
    </>
  );
}

export default Header
