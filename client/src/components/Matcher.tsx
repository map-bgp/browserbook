// @ts-nocheck
import React, {useEffect, useState} from "react";
import "tailwindcss/tailwind.css"

import {ethers as eth} from "ethers";
import {useAppDispatch, useAppSelector, useEthers} from "../store/Hooks";
import { useAppContext } from "./context/Store";
import { selectValidatorListen, selectMatchedOrders, selectOrders, selectValidators, toggleValidator, MatchedOrder,addValidator,removeMatchedOrder, removeValidator } from "../store/slices/OrdersSlice";
import ValidatorsTable from './elements/ValidatorsTable'
import PubsubChat from "../p2p/validatorhandler";
import {TOPIC_VALIDATOR} from "../constants";
import {ContractNames} from "../blockchain/ContractNames";

function Matcher() {
  const dispatch = useAppDispatch();

  const [ethers, connected, address, contract, resolved] = useEthers(ContractNames.Encrypt);
  const [validatorHandler, setValidatorHandler] = useState(null)

  const [cipherText, setCipherText] = useState<string>('')
  const [signerKey, setSignerKey] = useState<string>('')

  const { state, setContext } = useAppContext();

  const orders = useAppSelector(selectOrders);
  const matchedOrders = useAppSelector(selectMatchedOrders);
  const validators = useAppSelector(selectValidators);
  const validatorListener = useAppSelector(selectValidatorListen);

  const encryptAndStoreSignerKey = async () => {
    const [cipherText, _] = await ethers.encryptSignerKey(address)

    await contract.setSignerKey(cipherText);
    setCipherText(cipherText)
  }

  const retrieveAndDecryptSignerKey = async () => {
    const cipherText = await contract.signerKeys(address);

    const r = await ethers.decryptSignerKey(cipherText, address);
    setSignerKey(r);
  }

  const getMessage = () => {
    if (cipherText !== "") {
      if (signerKey !== "") {
        return "The decrypted signer key is: " + `${signerKey}`
      } else {
        return "The encrypted signer key cipher is:\n\n" + `${cipherText.substring(0, 10)}...` + "\n\nIt is stored on chain."
      }
    } else {
      return "Click \'Encrypt & Store Signer Key\'";
    }
  }

  const joinValidator = () => {
    dispatch(toggleValidator(true));
  };

  const convertIorders = () => {
    
  }

  const turnOnMatching = () => {
    setInterval(()=>{console.error('I hit the base')
    if (window.Worker) {
      const myWorker = new Worker(new URL('../oms/matching.ts', import.meta.url));

      myWorker.postMessage(orders);
    
      myWorker.onmessage = function(e) {
        console.log(`Message received from worker ${e.data}`);
      }
    } else {
      console.log('Your browser doesn\'t support web workers.');
    }},10000)
  };

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

    if (validatorHandler && validatorListener) { 
        const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();  
        const created = Date.now();
        validatorHandler.sendMatcher(id , String(state.peerId), created);
    }
    })

  const beingMatcher = async () => {
    joinValidator();
    const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();
    await state.p2pDb.validators.add({id: id, peerId: String(state.peerId), joinedTime: Date.now().toString()});
    dispatch(addValidator({peerId: String(state.peerId), address: address, joinedTime: Date.now().toString()}))
    turnOnMatching();
  };
  
  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex items-center justify-around">
        <div className="whitespace-normal break-all">{getMessage()}</div>
        <div>
          <button
            type="submit"
            className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
            onClick={() => encryptAndStoreSignerKey()}
          >
            Encrypt & Store Signer Key
          </button>
          <button
            type="submit"
            className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
            onClick={() => retrieveAndDecryptSignerKey()}
          >
           Retrieve and Decrypt Signer Key
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <ValidatorsTable validators={validators} />
        <button
                type="submit"
                className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
                onClick={() => beingMatcher()}
              >
                Join Match Pool
        </button>
      </div>
    </>
  );
}

export default Matcher;