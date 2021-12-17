// @ts-nocheck
import React, {useEffect, useState} from "react";
import "tailwindcss/tailwind.css"

import {useAppDispatch, useAppSelector, useEthers} from "../store/Hooks";
import { useAppContext } from "./context/Store";
import { selectValidatorListen, selectMatchedOrders, selectOrders, selectValidators, toggleValidator, MatchedOrder,addValidator,removeMatchedOrder, removeValidator } from "../store/slices/OrdersSlice";
import ValidatorsTable from './elements/ValidatorsTable'
import PubsubChat from "../p2p/validatorhandler";
import {TOPIC_VALIDATOR} from "../constants";
import {IOrders} from '../db';

function Matcher() {
  const dispatch = useAppDispatch();

  const [ethers, connected, address, contract, resolved] = useEthers();
  const [validatorHandler, setValidatorHandler] = useState(null)
  //const [validatorCheck, setValidatorCheck] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { state, setContext } = useAppContext();
  const orders = useAppSelector(selectOrders);
  const matchedOrders = useAppSelector(selectMatchedOrders);
  const validators = useAppSelector(selectValidators);
  const validatorListener = useAppSelector(selectValidatorListen);

  const joinValidator = () => {
    dispatch(toggleValidator(true));
  };

  const convertIorders = () => {
    
  }

  // const beingMatcher = () => {
  //   setTimeout(()=>{console.error('I hit the base')},1000)
  //   if (window.Worker) {
  //     const myWorker = new Worker(new URL('../oms/matching.ts', import.meta.url));

  //     myWorker.postMessage(10);
    
  //     myWorker.onmessage = function(e) {
  //       console.log(`Message received from worker ${e.data}`);
  //     }
  //   } else {
  //     console.log('Your browser doesn\'t support web workers.');
  //   }
  // };

  /**
   * Leverage use effect to act on state changes
   */
   useEffect(() => {
    // Wait for libp2p
    if (!state.node) return

    // Create the pubsub Client
    if (!validatorHandler) {
      const pubsubChat = new PubsubChat(state.node, TOPIC_VALIDATOR)
      setValidatorHandler(pubsubChat)
    }
    console.log(`Handle validator ${validatorHandler} & ${validatorListener}`)

    if (validatorHandler && validatorListener) { 
        const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();  
        const created = Date.now();
        validatorHandler.sendOrder(id , String(state.peerId), created);
        toggleValidator(false);
    }
    })

  const beingMatcher = async () => {
    joinValidator();
    const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();
    await state.p2pDb.validators.add({id: id, peerId: String(state.peerId), joinedTime: Date.now().toString()});
    dispatch(addValidator({peerId: String(state.peerId), address: address, joinedTime: Date.now().toString()}))
  };
  
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2"></div>
      <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
              onClick={() => beingMatcher()}
            >
              BeMatcher
      </button>
      <ValidatorsTable validators={validators} />
    </div>
  );
}

export default Matcher;