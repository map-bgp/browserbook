import React, {useEffect, useState} from "react";
import "tailwindcss/tailwind.css"

import {useAppDispatch, useAppSelector, useEthers} from "../store/Hooks";
import { useAppContext } from "./context/Store";
import { selectMatchedOrders, selectOrders, selectValidators, addMatchedOrder,addValidator,removeMatchedOrder, removeValidator } from "../store/slices/OrdersSlice";
import ValidatorsTable from './elements/ValidatorsTable'

function Matcher() {
  const dispatch = useAppDispatch();

  const [ethers, connected, address, contract, resolved] = useEthers();
  const { state, setContext } = useAppContext();
  const orders = useAppSelector(selectOrders);
  const matchedOrders = useAppSelector(selectMatchedOrders);
  const validators = useAppSelector(selectValidators)


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


  const beingMatcher = async () => {
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