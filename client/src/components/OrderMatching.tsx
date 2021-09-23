import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { ethers, providers, Contract } from "ethers";
import { useAppContext } from "./context/Store";
import Info from "./elements/Info";
import { filter, matches } from "lodash";
import { token2Address, token2Id, EXCHANGE,TOKENONE, exchangeAbi,tokenOneAbi } from "../constants";

function OrderMatch() {
  const { state, setContext } = useAppContext();
  const { account, library } = useWeb3React<providers.Web3Provider>();
  let orderArray;

  const fetchOrders = async () => {
    orderArray = await state.p2pDb.orders.toArray();
    console.log(orderArray[orderArray.length-1]);
  };

  const matchOrders = async () => {
    // const exemptedOrderArray = orderArray
    // filter(orderArray,matches())
    const orderOne = orderArray.pop();
    const orderTwo = orderArray.pop();
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();
    const data =
      "0x7f7465737432000000000000000000000000000000000000000000000000000000600057";

    // console.log(exchangeAbi)
    // console.log(EXCHANGE)

    const exchangeContract = new Contract(EXCHANGE, exchangeAbi, signer);

    const tokenInstance = new Contract(TOKENONE,tokenOneAbi,signer);
    //read fucntion
    const tokenBalance = await tokenInstance.balanceOf(address,1);
    const tx = await tokenInstance.mint(address,1,100,data);

    console.log(`Balance is ${tokenBalance.toString()}`);

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

    await exchangeContract.executeOrder(
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
  };

  return (
    <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
      <Info message={`${account}`} />
      <div>
        <button
          type="submit"
          className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          onClick={() => fetchOrders()}
        >
          Fetch Order
        </button>

        <button
          type="submit"
          className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          onClick={() => matchOrders()}
        >
          Match Order
        </button>
      </div>
    </div>
  );
}

export default OrderMatch;
