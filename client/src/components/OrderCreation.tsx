// @ts-nocheck
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

import { Radio, RadioObject } from "./elements/inputs/Radio";
import { SelectObject, Select } from "./elements/inputs/Select";

import { ActionTypes, OrderTypes } from "../types/Order";

import { useAppDispatch, useAppSelector } from "../store/Hooks";
import { addOrder, selectOrders } from "../store/slices/OrdersSlice";
import { Tokens } from "../types/Token";
import { classNames } from "./utils/classNames";
import { XCircleIcon } from "@heroicons/react/solid";
import PubsubChat from "../p2p/messagehandler";
import { useAppContext } from "./context/Store";
import { useEthers } from "../store/Hooks";
import { orderDB } from "../db";
import { useWeb3React } from "@web3-react/core";
import { mapTokenValuesToEnum, mapActionTypeToEnum } from "./utils/mapToEnum";
import { domain } from '../constants';
import { Token } from "./elements/Token";
//import uint8arrayToString from "uint8arrays/to-string";

function OrderCreation() {
  const dispatch = useAppDispatch();
  const { state, setContext } = useAppContext();
  const [tokenA, setTokenA] = useState(Tokens[0]);
  const [tokenB, setTokenB] = useState(Tokens[1]);

  const [orderType, setOrderType] = useState(OrderTypes[0]);
  const [actionType, setActionType] = useState(ActionTypes[0]);

  const [sellPrice, setSellPrice] = useState<number>(0.0);
  const [buyPrice, setBuyPrice] = useState<number>(0.0);

  const [price, setPrice] = useState<number>(0.0);
  const [quantity, setQuantity] = useState<number>(0.0);

  const dbStateOrders = useAppSelector(selectOrders);

  const [connected, address, contract, resolved, signer] = useEthers();

  //Created while integration with Order
  const [chatClient, setChatClient] = useState(null);
  const TOPIC = "/libp2p/bbook/chat/1.0.0";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  //const [orderPeerID, setOrderPeerID] = useState('')
  const { account, library } = useWeb3React<providers.Web3Provider>();

  //const [orderObject, setOrderObject]= useState({TokenA: Tokens[0], TokenB: Tokens[1], OrderType: OrderTypes[0], ActionType: OrderActions[0], Price: '', Quantity: ''})

  const getPeerID = () => {
    return state.peerId;
  };

  const getTotal = (): number => {
    return price * quantity;
  };

  const getTotalDisplay = (): string => {
    return (price * quantity).toFixed(4);
  };

  const isValid = (): boolean => {
    return tokenA !== tokenB;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(
      addOrder({
        from: account,
        status: "Open",
        created: Date.now(),
        tokenS: tokenA.name,
        tokenB: tokenB.name,
        actionType: actionType.name,
        orderType: orderType.value,
        amountB: buyPrice,
        amountS: sellPrice,
      })
    );
  };

  const tokenSelection = Tokens.map((token) =>  <option>{token.name}</option>);

  /**
   * Sends the current message in the chat field
   */
  const sendOrderMessage = async () => {
    try {
      const id = (~~(Math.random() * 1e9)).toString(36) + Date.now();
      const created = Date.now();
      const status = "OPEN";

    console.log(``)

      //console.log(`Send message function ${id} :${tokenA.name} : ${tokenB.name} : ${orderType.value} : ${actionType.name} : ${price} : ${quantity} : ${account} : ${created}`)
      await chatClient.sendOrder(
        id,
        tokenA,
        tokenB,
        orderType,
        actionType,
        buyPrice,
        sellPrice,
        account,
        status,
        created
      );
      state.p2pDb
        .transaction("rw", state.p2pDb.orders, async () => {
          const order_id = await state.p2pDb.orders.add({
            id: id,
            tokenS: mapTokenValuesToEnum(tokenA.name),
            tokenB: mapTokenValuesToEnum(tokenB.name),
            orderType: orderType.value,
            actionType: mapActionTypeToEnum(actionType.name),
            amountB: buyPrice,
            amountS: sellPrice,
            orderFrom: account,
            status: status,
            created: created,
          });
          console.log(`Order ID is stored in ${order_id}`);
        })
        .catch((e) => {
          console.log(e.stack || e);
        });

      console.info("Publish done");
    } catch (err) {
      console.error("Could not send message", err);
    }
  };

  const randomPeers = async () => {
    const peerArray = await state.p2pDb.peers.toArray();
    const obj = peerArray[Math.floor(Math.random() * peerArray.length)];
    //console.log(`Random Peers ${obj.peerId}`);
    //setOrderPeerID(obj.peerId._idB58String);

  };

  /**
   * Leverage use effect to act on state changes
   */
  useEffect(() => {
    // Wait for libp2p
    if (!state.node) return;

    // Create the pubsub Client
    if (!chatClient) {
      const pubsubChat = new PubsubChat(state.node, TOPIC);
      setChatClient(pubsubChat);
    }
  });

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            New Order
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Submit your order to the P2P exchange
          </p>
        </div>
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      I Have
                    </label>
                    <select
                      id="token-a"
                      name="token-a"
                      onChange={(e) => setTokenA(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      {tokenSelection}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      I Want
                    </label>
                    <select
                      id="token-b"
                      name="token-b"
                      onChange={(e) => setTokenB(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      {tokenSelection}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// <form className="h-full" onSubmit={handleSubmit}>
//   <div className="mt-2 flex items-center justify-between">
//     <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
//       <div className="grid grid-cols-3 gap-6">
//         <div className="col-span-3 sm:col-span-2">
//           <label
//             htmlFor="uri"
//             className="block text-sm font-medium text-gray-700 my-2"
//           >
//             I have
//           </label>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="mt-2 mb-6 flex items-center justify-between">
//     <Select
//       label="I Want"
//       range={Tokens}
//       selected={tokenB as SelectObject}
//       setSelected={
//         setTokenB as React.Dispatch<React.SetStateAction<SelectObject>>
//       }
//     />
//   </div>
//   <div className="border-t mb-6 border-gray-200 w-4/5 mx-auto"></div>
//   <div className="mt-2 flex items-center justify-between">
//     <Radio
//       label="Queue Type"
//       range={OrderTypes}
//       selected={orderType}
//       setSelected={setOrderType}
//     />
//   </div>
//   <div className="mt-2 flex items-center justify-between">
//     <Select
//       label="Action Type"
//       range={ActionTypes}
//       selected={actionType}
//       setSelected={setActionType}
//     />
//   </div>
//   <div className="w-full mt-2 flex items-center justify-between">
//     <label
//       htmlFor="name"
//       className="block ml-2 text-sm font-medium text-gray-700"
//     >
//       Amount Selling
//     </label>
//     <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
//       <input
//         type="number"
//         name="sell"
//         id="sell"
//         step="0.0001"
//         min={0}
//         onChange={(e) => setBuyPrice(Number(e.target.value))}
//         className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
//         placeholder="0.0000"
//       />
//     </div>
//   </div>
//   <div className="w-full mt-2 flex items-center justify-between">
//     <label
//       htmlFor="name"
//       className="block ml-2 text-sm font-medium text-gray-700"
//     >
//       Amount Buying
//     </label>
//     <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
//       <input
//         type="number"
//         name="buy"
//         id="buy"
//         step="0.0001"
//         min={0}
//         onChange={(e) => setSellPrice(Number(e.target.value))}
//         className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
//         placeholder="0.0000"
//       />
//     </div>
//   </div>
//   <div className="w-full mt-4 flex items-center justify-between mt-4">
//             <span className="block ml-2 text-sm font-medium text-gray-700">
//               Total
//             </span>
//     <div className="w-1/2 mt-1 ml-4 text-right">
//               <span className="block w-full sm:text-sm">
//                 {getTotalDisplay()}
//               </span>
//     </div>
//   </div>
//   <div
//     className={classNames(
//       "mt-10",
//       isValid() ? "" : "flex items-center justify-between"
//     )}
//   >
//     {!isValid() && (
//       <div className="w-3/5">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <XCircleIcon
//               className="h-5 w-5 text-red-400"
//               aria-hidden="true"
//             />
//           </div>
//           <div className="ml-3">
//             <h3 className="text-xs font-medium text-red-800">
//               Please select two different tokens
//             </h3>
//           </div>
//         </div>
//       </div>
//     )}
//     <button
//       type="submit"
//       className={classNames(
//         !isValid()
//           ? "cursor-not-allowed hover:bg-orange-600 active:bg-orange-600 focus:outline-none focus:ring-0"
//           : "ml-auto mr-0 ",
//         "block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
//       )}
//       onClick={() => {sendOrderMessage()
//         handleSubmit()} }
//     >
//       Submit Order
//     </button>
{/*   </div> */}
{/* </form> */}

export default OrderCreation;
