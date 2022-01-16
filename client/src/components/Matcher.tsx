// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import {bufferToHex} from "ethereumjs-util";
import {encrypt} from "eth-sig-util";

import { useAppDispatch, useAppSelector, useEthers } from "../store/Hooks";
import { useAppContext } from "./context/Store";
import { ContractNames } from "../blockchain/ContractNames";
import {
  selectValidatorListen,
  selectMatchedOrders,
  selectOrders,
  selectValidators,
  toggleValidator,
  MatchedOrder,
  addValidator,
  removeMatchedOrder,
  removeValidator,
} from "../store/slices/OrdersSlice";
import ValidatorsTable from "./elements/ValidatorsTable";
import PubsubChat from "../p2p/validatorhandler";
import { TOPIC_VALIDATOR } from "../constants";
import Info from "./elements/Info";
import {inspect} from 'util';
import { ethers as ethPkg } from "ethers";
import { IOrders } from "../db";
import {MatchingResponse} from "../oms/matching";

function Matcher() {
  const dispatch = useAppDispatch();

  const [ethers, connected, address, contract, resolved, signer, provider] =
    useEthers(ContractNames.Exchange);
  const [validatorHandler, setValidatorHandler] = useState(null);
  const [publicKey, setPublicKey] = useState<any>(null);
  const [secondAddress, setSecondAddress] = useState<any>(null);
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const { state, setContext } = useAppContext();
  const orders = useAppSelector(selectOrders);
  const matchedOrders = useAppSelector(selectMatchedOrders);
  const validators = useAppSelector(selectValidators);
  const validatorListener = useAppSelector(selectValidatorListen);
  const [matchedOrder, setMatchedOrder] = useState<MatchingResponse[]>([]);


  const joinValidator = () => {
    dispatch(toggleValidator(true));
  };

  const turnOnMatching = () => {
    setInterval(() => {
      console.error("I hit the base");
      if (window.Worker) {
        const myWorker = new Worker(
          new URL("../oms/matching.ts", import.meta.url)
        );

        myWorker.postMessage(orders);

        myWorker.onmessage = function (e) {
          setMatchedOrder(() => [...e.data as MatchingResponse[]])
          console.log(`Message received from worker ${e.data}`);
        };
      } else {
        console.log("Your browser doesn't support web workers.");
      }
    }, 10000);
  };

  /**
   * Order validation for the duplicate order before final push
   */
  const orderValidation = (order1_id,order2_id) => {
    let one, two, three, four;
    //Checking if the orderid are already present in the matchedOrder table
    state.p2pDb
      .transaction("rw", state.p2pDb.matchedOrder, async () => {
        one = await state.p2pDb.matchedOrder
          .where("order1_id")
          .equalsIgnoreCase(order1_id)
          .toArray();
        two = await state.p2pDb.matchedOrder
          .where("order1_id")
          .equalsIgnoreCase(order2_id)
          .toArray();
        three = await state.p2pDb.matchedOrder
          .where("order2_id")
          .equalsIgnoreCase(order1_id)
          .toArray();
        four = await state.p2pDb.matchedOrder
          .where("order2_id")
          .equalsIgnoreCase(order2_id)
          .toArray();

          console.log(`This to test the dexie query for the duplication check :  ${one}, ${two}, ${three}, ${four}`);
        
        if (one != null || two != null || three != null || four != null) {
          return false;
        }
      })
      .catch((e) => {
        console.log(e.stack || e);
      });
      return true;
  };

  /**
   * Push Updates to all the channels
   */
  const pushUpdates = useCallback(() =>{
    //Checking if the orderid are already present in the matchedOrder table
    matchedOrder.forEach(order =>  {
      // console.log(`Got the first ID ${order.orderOne.id}`);
      // console.log(`Got the second ID ${order.orderTwo.id}`);

      const flag = orderValidation(order.orderOne.id, order.orderTwo.id);
      console.log(`Checking the flag value ${flag}`);

      if(flag){
        //Changes the status of the local DB order status on a match
        state.p2pDb
        .transaction("rw", state.p2pDb.orders, async () => {
          await state.p2pDb.orders
            .where("id")
            .equals(order.orderOne.id)
            .modify({ status: "MATCHED" });
          await state.p2pDb.orders
            .where("id")
            .equals(order.orderTwo.id)
            .modify({ status: "MATCHED" });
        })
        .catch((e) => {
          console.log(e.stack || e);
        });

        //Sent the updated status in the pubsub channel to propagate
         validatorHandler.sendOrderUpdate(order.orderOne.id , "MATCHED");
         validatorHandler.sendOrderUpdate(order.orderTwo.id , "MATCHED");

        //Send the matched order to MatchedOrder emit pubsub channel
        const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();
        validatorHandler.sendMatchedOrder(id, order.orderOne.id, order.orderTwo.id, order.orderOne.tokenB, order.orderOne.tokenS, order.orderOne.actionType, order.orderOne.amountB, order.orderOne.amountS, order.orderOne.orderFrom, "Filled", order.orderOne.created);

        //Send the matched order to MatchedOrder table local
        state.p2pDb
          .transaction('rw', state.p2pDb.matchedOrders, async() =>{
            const store_id = await state.p2pDb.matchedOrders.add({
            id: id,
            order1_id: order.orderOne.id,
            order2_id: order.orderTwo.id,
            tokenA: order.orderOne.tokenB,
            tokenB: order.orderOne.tokenS,
            actionType: order.orderOne.actionType,
            amountA: order.orderOne.amountA,
            amountB: order.orderOne.amountB,
            orderFrom: order.orderOne.orderFrom,
            status: "Filled",
            created: order.orderOne.created,
          });
          console.log(`Matched Order stored in ${store_id}`)
        })
        .catch(e => {
          console.log(e.stack || e);
        });

      }
    })
},[matchedOrder]);

  /**
   * Leverage use effect to act on state changes
   */
  useEffect(() => {
    // Wait for libp2p
    if (!state.node) return;

    // Create the pubsub Client
    if (!validatorHandler) {
      const pubsubChat = new PubsubChat(state.node, TOPIC_VALIDATOR);
      setValidatorHandler(pubsubChat);
    }

    if (validatorHandler && validatorListener) {
      const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();
      const created = Date.now();
      validatorHandler.sendMatcher(id, String(state.peerId), created);
    }
  });

  const beingMatcher = async () => {
    await createNewAccount();
    joinValidator();
    const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();
    await state.p2pDb.validators.add({
      id: id,
      peerId: String(state.peerId),
      joinedTime: Date.now().toString(),
    });
    dispatch(
      addValidator({
        peerId: String(state.peerId),
        address: address,
        joinedTime: Date.now().toString(),
      })
    );
    turnOnMatching();
  };

  const fetchPublicKey = async () => {
    const publicKey = await provider.send("eth_getEncryptionPublicKey", [
      address,
    ]);
    setPublicKey(publicKey);
  };

  const createNewAccount = async () => {
    if (resolved) {
      const [text, secondAddress] = await encryptMessage();
      await contract.setPass(text).then((tx) => console.log(tx));
      setSecondAddress(secondAddress);
    } else {
      console.log("Contract not initialized yet");
    }
  };

  const fetchAndDecryptMessage = async () => {
    if (resolved) {
      const encryptText = await contract.getPass(address);
      const decryptedText = await provider.send("eth_decrypt", [encryptText, address]);
      setDecryptedPrivateKey(decryptedText);
    } else {
      console.log("Contract not initialized yet");
    }
  };

  const encryptMessage = async () => {
    if (!publicKey) {
      await publicKeyMessage();
    }
    const wallet = ethPkg.Wallet.createRandom();
    const signerKey = wallet.privateKey;
    const secondAddress = wallet.address;

    const cipherText = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt(
            publicKey,
            { data: signerKey },
            "x25519-xsalsa20-poly1305"
          )
        ),
        "utf8"
      )
    );

    return [cipherText, secondAddress];
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      {publicKey && <Info message={`Your Public Key is: ${publicKey}`} />}
      <button
        type="submit"
        className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
        onClick={() => fetchPublicKey()}
      >
        RetrievePublicKey
      </button>
      {secondAddress && <Info message={`Your Mining Address is: ${secondAddress}`} />}
      <button
        type="submit"
        className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
        onClick={() => fetchAndDecryptMessage()}
      >
        DecryptYourPrivateKey
      </button>
      {decryptedPrivateKey && <Info message={`Your Mining Address's Private Key is: ${decryptedPrivateKey}`} />}
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2"></div>
      <button
        type="submit"
        className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
        onClick={() => beingMatcher()}
      >
        BeMatcher
      </button>
      <button
        type="submit"
        className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
        onClick={() => pushUpdates()}
      >
        checkUpdates
      </button>
      <ValidatorsTable validators={validators} />
    </div>
  );

}

export default Matcher;