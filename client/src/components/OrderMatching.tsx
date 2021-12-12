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
  const [updatemsg, setUpdateMessage] = useState('')
  const [updatemsgs, setUpdateMessages] = useState([])
  const [matchedOrder, setMatchedOrder] = useState('')
  const [matchedOrders, setMatchedOrders] = useState([])

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
    const matchedOrder = await state.p2pDb.matchedOrder.toArray();
    //console.log(`orders array length in the db ${orderArray.length}`);
    // const exemptedOrderArray = orderArray
    // filter(orderArray,matches())
    const orderOne = orderArray.pop();
    const orderTwo = orderArray.pop();
    const matchedOrder = matchedOrder.pop();
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    // console.log(exchangeAbi)
    // console.log(EXCHANGE)

    const exchangeContract = new Contract(EXCHANGE, exchangeAbi, signer);

    console.table(orderOne);
    console.table(orderTwo);
    console.table(matchedOrder);
    
    //Changes the status of the local DB order status on a match
    state.p2pDb.transaction('rw', state.p2pDb.orders, async() =>{
      await state.p2pDb.orders.where("id").equals(orderOne.id).modify({status: "MATCHED"});
      await state.p2pDb.orders.where("id").equals(orderTwo.id).modify({status: "MATCHED"});
      }).catch(e => { console.log(e.stack || e);});

    //Sent the updated status in the pubsub channel to propagate
    //await validatorHandler.sendOrderUpdate(orderOne.id , "MATCHED");
    //await validatorHandler.sendOrderUpdate(orderTwo.id , "MATCHED");

    const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();  
    const created = Date.now();
    const one, two , three, four;

    //Checking if the orderid are already present in the matchedOrder table
    state.p2pDb.transaction('rw', state.p2pDb.matchedOrder, async() =>{
      one = await state.p2pDb.matchedOrder.where("order1_id").equalsIgnoreCase(orderOne.id).toArray();
      two = await state.p2pDb.matchedOrder.where("order1_id").equalsIgnoreCase(orderTwo.id).toArray();
      three = await state.p2pDb.matchedOrder.where("order2_id").equalsIgnoreCase(orderOne.id).toArray();
      four = await state.p2pDb.matchedOrder.where("order2_id").equalsIgnoreCase(orderTwo.id).toArray();
      console.log(`This to test the dexie query for the duplication check : ${orderOne.id} : ${one}, ${orderTwo.id} : ${two}, ${orderOne.id} : ${three}, ${orderTwo.id} : ${four}`)
      //await state.p2pDb.matchedOrder.where({order1_id : "orderOne.id"}).equalsIgnoreCase("david").toArray();

      if( one != null || two != null || three != null || four != null){
        console.log(`Order have been matched previously.`);
      }
      }).catch(e => { console.log(e.stack || e);});

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
          //console.log(`update Messages ${message}`)

          state.p2pDb.transaction('rw', state.p2pDb.validators, async() =>{
          const id = await state.p2pDb.validators.add({
              id: message.id,
              peerId: message.peerID,
              address: message.address,
              joinedTime: message.created,
          });
          console.log(`Order ID is stored in ${id}`)
          }).catch(e => { console.log(e.stack || e);});
        })


        // Forward order update event to the eventBus(should be for all the users---> need to move)
        pubsubChat.on('sendUpdate', (updatemsg) => {
          if (updatemsg.from === state.node.peerId.toB58String()) {
            updatemsg.isMine = true
          }
          setUpdateMessages((updatemsgs) => [...updatemsgs, updatemsg])
          console.log(`update Messages ${updatemsg}`)

        //Update the database with the updates status of the order.
          state.p2pDb.transaction('rw', state.p2pDb.orders, async() =>{
            const transaction_id = await state.p2pDb.orders.where("id").equals(updatemsg.id).modify({status: "MATCHED"});
            }).catch(e => { console.log(e.stack || e);});
      })

        // Matched order entry to database
        pubsubChat.on('sendOrder', (matchedOrder) => {
          if (matchedOrder.from === state.node.peerId.toB58String()) {
              matchedOrder.isMine = true
          }
          setMatchedOrders((matchedOrders) => [...matchedOrders, matchedOrder])
          console.log(`update Messages ${matchedOrder}`)

         //Update the database with the updates status of the order.
          state.p2pDb.transaction('rw', state.p2pDb.matchedOrder, async() =>{
            const id = await state.p2pDb.matchedOrder.add({
              id: matchedOrder.id,
              order1_id: matchedOrder.order1_id,
              order2_id: matchedOrder.order2_id,
              tokenA: matchedOrder.tokenA,
              tokenB: matchedOrder.tokenB,
              orderType: matchedOrder.orderType,
              actionType: matchedOrder.actionType,
              price: matchedOrder.price,
              quantity: matchedOrder.quantity,
              orderFrm: matchedOrder.orderFrm,
              status: matchedOrder.status,
              created: matchedOrder.created
            });
            console.log(`Order ID is stored in ${id}`)
            }).catch(e => { console.log(e.stack || e);});
      })
  
        setValidatorHandler(pubsubChat)
      }

      if (validatorHandler && validatorCheck) { 
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
