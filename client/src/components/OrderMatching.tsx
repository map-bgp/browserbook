// @ts-nocheck
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { ethers, providers, Contract } from "ethers";
import { useAppContext } from "./context/Store";
import { SelectObject, Select } from "./elements/inputs/Select";
import PubsubChat from "../p2p/validatorhandler";
import Info from "./elements/Info";
import { filter, matches } from "lodash";
import { Tokens } from "../types/Token";
import {
  token2Address,
  token2Id,
  EXCHANGE,
  TOKENONE,
  exchangeAbi,
  tokenOneAbi,
  token2Abi,
  TOPIC_VALIDATOR,
} from "../constants";

function OrderMatch() {
  const { state, setContext } = useAppContext();
  const [validatorHandler, setValidatorHandler] = useState(null)
  const [validatorCheck, setValidatorCheck] = useState(null)
  const [token, setToken] = useState(Tokens[0]);
  const [multiToken, setMultiToken] = useState(Tokens[0]);

  const [value, setValue] = useState();

  const [authorization, setAuthorization] = useState();

  const [quantity, setQuantity] = useState<number>(0.0);
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const { account, library } = useWeb3React<providers.Web3Provider>();

  const data =
    "0x7f7465737432000000000000000000000000000000000000000000000000000000600057";


  const joinValidator = async () => {
    setValidatorCheck(true)
  };

  const getPeerID = () => {
    return state.peerId;
  };

  const matchOrders = async () => {
    const orderArray = await state.p2pDb.orders.toArray();
    console.log(`orders array length in the db ${orderArray.length}`);
    // const exemptedOrderArray = orderArray
    // filter(orderArray,matches())
    const orderOne = orderArray.pop();
    const orderTwo = orderArray.pop();
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    // console.log(exchangeAbi)
    // console.log(EXCHANGE)

    const exchangeContract = new Contract(EXCHANGE, exchangeAbi, signer);

    console.table(orderOne);
    console.table(orderTwo);

    console.table({
      from: token2Address.get(orderOne.tokenFrom),
      to: token2Address.get(orderTwo.tokenFrom),
      s1: orderOne.orderFrm,
      s2: orderTwo.orderFrm,
      t1: token2Id.get(orderOne.tokenFrom),
      t2: token2Id.get(orderTwo.tokenFrom),
      d1: orderOne.quantity,
      d2: orderTwo.quantity,
      data: data,
    });

    const tx = await exchangeContract.executeOrder(
      token2Address.get(orderOne.tokenFrom),
      token2Address.get(orderTwo.tokenFrom),
      orderOne.orderFrm,
      orderTwo.orderFrm,
      token2Id.get(orderOne.tokenFrom),
      token2Id.get(orderTwo.tokenFrom),
      orderOne.quantity,
      orderTwo.quantity,
      data
    );

    console.log(tx);
  };

  const mint = async () => {
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    const tokenContractAddress = token2Address.get(token.name);

    const tokenContractAbi = token2Abi.get(token.name);

    const tokenId = token2Id.get(token.name);

    // @ts-ignore
    const tokenInstance = new Contract(tokenContractAddress,tokenContractAbi,signer);
    //read fucntion
    const tx = await tokenInstance.mint(address, tokenId, quantity, data);

    await tx.wait();

    const tokenBalance = await tokenInstance.balanceOf(address, tokenId);

    console.log(`Balance is ${tokenBalance.toString()}`);
  };

  const balance = async () => {
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    const tokenContractAddress = token2Address.get(multiToken.name);

    const tokenContractAbi = token2Abi.get(multiToken.name);

    const tokenId = token2Id.get(multiToken.name);

    // @ts-ignore
    const tokenInstance = new Contract(tokenContractAddress,tokenContractAbi,signer);
    //read fucntion
    const balance = await tokenInstance.balanceOf(address, tokenId);

    setValue(balance.toString());
  };

  const approval = async () => {
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    const tokenContractAddress = token2Address.get(multiToken.name);

    const tokenContractAbi = token2Abi.get(multiToken.name);

    console.log(tokenContractAddress,tokenContractAbi?.length)
    // @ts-ignore
    const tokenInstance = new Contract(tokenContractAddress,tokenContractAbi,signer);

    //write
    const tx = await tokenInstance.setApprovalForAll(EXCHANGE, true);

    await tx.wait();

    const contractBool = await tokenInstance.isApprovedForAll(
      address,
      EXCHANGE
    );

    console.log(contractBool.toString());
  };

  const authentication = async () => {
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    const tokenContractAddress = token2Address.get(multiToken.name);

    const tokenContractAbi = token2Abi.get(multiToken.name);

    console.log(tokenContractAddress,tokenContractAbi?.length)
    // @ts-ignore
    const tokenInstance = new Contract(tokenContractAddress,tokenContractAbi,signer);

    const contractBool = await tokenInstance.isApprovedForAll(
      address,
      EXCHANGE
    );

    setAuthorization(contractBool.toString());
  };

   /**
   * Leverage use effect to act on state changes
   */
    useEffect(() => {
      // Wait for libp2p
      if (!state.node) return

  
      // Create the pubsub Client
      if (!validatorHandler && validatorCheck) {
        const pubsubChat = new PubsubChat(state.node, TOPIC_VALIDATOR)

        // Listen for messages
        pubsubChat.on('message', (message) => {
          if (message.from === state.node.peerId.toB58String()) {
            message.isMine = true
          }
          setMessages((messages) => [...messages, message])

          // state.p2pDb.transaction('rw', state.p2pDb.orders, async() =>{
          // const id = await state.p2pDb.orders.add({
          //     id: message.id,
          //     tokenFrom: message.tokenA, 
          //     tokenTo: message.tokenB, 
          //     orderType: message.orderType, 
          //     actionType: message.actionType,
          //     price: message.price,
          //     quantity: message.quantity,
          //     orderFrm: message.orderFrm,
          //     //from: message.from,
          //     created: message.created
              
          // });
          // console.log(`Order ID is stored in ${id}`)
          // }).catch(e => { console.log(e.stack || e);});
        })
        
        // Forward stats events to the eventBus
        //pubsubChat.on('stats', (stats) => state.eventBus.emit('stats', stats))
  
        setValidatorHandler(pubsubChat)
      }

      if (validatorHandler && validatorCheck) {
      console.log("Life ain fair :"+getPeerID())  
      const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();  
      const created = Date.now();
      validatorHandler.sendOrder(id , getPeerID(), created);
      setValidatorCheck(false);
      }
    })


  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
        <Info message={`Connected Account :${account}`} />
        <div>
          <div className="mt-2 mb-6 flex items-center justify-between space-x-6">
            <Select
              label="I Want"
              range={Tokens}
              selected={token as SelectObject}
              setSelected={
                setToken as React.Dispatch<React.SetStateAction<SelectObject>>
              }
            />
            <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
              <input
                type="number"
                name="Quantity"
                id="quantity"
                step="1"
                min={0}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => mint()}
            >
              Mint Tokens
            </button>
          </div>

          <div className="mt-2 mb-6 flex items-center justify-between space-x-6">
            <Select
              label="My Balance of"
              range={Tokens}
              selected={multiToken as SelectObject}
              setSelected={
                setMultiToken as React.Dispatch<React.SetStateAction<SelectObject>>
              }
            />
            <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
              onClick={() => balance()}
            >
              Balance
            </button>
          </div>

          <div className="mt-2 mb-6 flex items-center justify-between space-x-4">
          <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => joinValidator()}
            >
              Join Validator
            </button>

            <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => approval()}
            >
              Approve Exchange
            </button>
            <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => authentication()}
            >
              Authorization Check
            </button>
            <button
            type="submit"
            className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => matchOrders()}
            >
            Match Order
            </button>
          </div>

          <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">{value &&`Tokens Balance of ${multiToken.name} is ${value}`}</p>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">{authorization && `Exchange has access to ${multiToken.name}`}</p>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default OrderMatch;
