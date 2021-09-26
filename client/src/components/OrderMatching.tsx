import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { ethers, providers, Contract } from "ethers";
import { useAppContext } from "./context/Store";
import { SelectObject, Select } from "./elements/inputs/Select";
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
} from "../constants";

function OrderMatch() {
  const { state, setContext } = useAppContext();

  const [token, setToken] = useState(Tokens[0]);

  const [quantity, setQuantity] = useState<number>(0.0);

  const { account, library } = useWeb3React<providers.Web3Provider>();

  const data = "0x7f7465737432000000000000000000000000000000000000000000000000000000600057";
  

  const matchOrders = async () => {
    const orderArray = await state.p2pDb.orders.toArray();
    console.log(orderArray[orderArray.length - 1]);
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

    await exchangeContract.executeOrder(
      token2Address.get(orderOne.tokenFrom),
      token2Address.get(orderTwo.tokenFrom),
      orderOne.orderFrm,
      orderTwo.orderFrm,
      token2Id.get(orderOne.tokenFrom),
      token2Id.get(orderTwo.tokenFrom),
      orderOne.quantity,
      orderOne.quantity * orderOne.price,
      data
    );
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


  const approval = async() => {
    // @ts-ignore
    const signer = library.getSigner();

    const address = await signer.getAddress();

    const tokenContractAddress = token2Address.get(token.name);

    const tokenContractAbi = token2Abi.get(token.name);

    // @ts-ignore
    const tokenInstance = new Contract(tokenContractAddress,tokenContractAbi,signer);

    //write 
    const tx = await tokenInstance.setApprovalForAll(EXCHANGE,true);

    await tx.wait();

    const contractBool = await tokenInstance.isApprovedForAll(address,EXCHANGE);

    console.log(contractBool.toString());
}

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
    <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
      <Info message={`${account}`} />
      <div>


        <div className="mt-2 mb-6 flex items-center justify-between">
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
        <div>
          <button
            type="submit"
            className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => approval()}
          >
            Approve Exchange
          </button>
        </div>
      </div>
      <button
          type="submit"
          className="absolute inset-x-0 top-100 mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          onClick={() => matchOrders()}
        >
          Match Order
      </button>
    </div>
    </div>
  );
}

export default OrderMatch;
