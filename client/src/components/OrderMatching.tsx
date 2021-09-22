import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { ethers, providers } from "ethers";
import { useAppContext } from "./context/Store";
import Info from "./elements/Info";
import { filter, matches } from "lodash";
import { token2Address,EXCHANGE } from "../constants";
import { fetchJSONFile } from "../blockchain";

function OrderMatch() {
  const { state, setContext } = useAppContext();
  const { account, library } = useWeb3React<providers.Web3Provider>();
  let orderArray;

  const fetchOrders = async () => {
    orderArray = await state.p2pDb.orders.toArray();
    console.log(orderArray[0]);
  };

//   const matchOrders = async () => {
//     // const exemptedOrderArray = orderArray
//     // filter(orderArray,matches())
//     const orderOne = orderArray.pop();
//     const orderTwo = orderArray.pop();
//     // @ts-ignore
//     const signer = library.getSigner();

//     const address = await signer.getAddress();

//     // fetchJSONFile('BBookToken',(data) => {
//     //         console.log(data);
//     //         const abi = data?.abi
//     //         console.log(abi);
//     //     })

    
//   };

  return (
    <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
      <Info message={`${account}`} />
      <div>
        <button
          type="submit"
          className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          onClick={() => fetchOrders()}
        >
          Display Order
        </button>
      </div>
    </div>
  );
}

export default OrderMatch;
