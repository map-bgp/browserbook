// @ts-nocheck
import React, { useEffect, useState } from "react";
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
import { ethers as ethPkg } from "ethers";
import { IOrders } from "../db";

function OrderValidation() {
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
          console.log(`Message received from worker ${e.data}`);
        };
      } else {
        console.log("Your browser doesn't support web workers.");
      }
    }, 10000);
  };

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
      <ValidatorsTable validators={validators} />
    </div>
  );
}

export default OrderValidation;
