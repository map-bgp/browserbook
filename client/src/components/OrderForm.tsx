import React, {useEffect, useState} from 'react'
import "tailwindcss/tailwind.css"

import {Radio, RadioObject} from './elements/inputs/Radio'
import {SelectObject, Select} from "./elements/inputs/Select";

import {OrderActions, OrderTypes} from "../types/Order";

import { useAppDispatch } from '../store/Hooks'
import { addOrder } from '../store/slices/OrderbookSlice'
import { Tokens } from "../types/Token";
import {classNames} from "./utils/classNames";
import {XCircleIcon} from "@heroicons/react/solid";
import Info from "./elements/Info";
import {BigNumber, ethers, providers,utils} from "ethers";
import { EXCHANGE,TOKENTWO,TOKENONE, tokenOneAbi } from "../constants";
import {useAppContext} from "./context/Store";
import { EtherStore} from '../blockchain';
import { useWeb3React } from "@web3-react/core";

const abi = tokenOneAbi;

function OrderForm() {
    const dispatch = useAppDispatch()
    const { state, setContext } = useAppContext()
    const { account, library } = useWeb3React<providers.Web3Provider>()
    

    const [tokenA, setTokenA] = useState(Tokens[0])
    const [tokenB, setTokenB] = useState(Tokens[1])

    const [orderType, setOrderType] = useState(OrderTypes[0]);
    const [actionType, setActionType] = useState(OrderActions[0])

    const [price, setPrice] = useState<number>(0.00);
    const [quantity, setQuantity] = useState<number>(0.00)
    const [balance, setBalance] = useState<number>(0);

    const tx = {
    gasPrice: utils.hexValue( utils.parseUnits("1",'gwei')),
    gasLimit: utils.hexValue( utils.parseUnits("21",'gwei')),
    to: '0x5d11ec064836D356833A3193814ad89Ab3D25832',
    value: utils.hexValue( utils.parseUnits("1200",'gwei')),
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
    }

    const getBalance = async (): Promise<number> => {
        // @ts-ignore
        return await library?.getBalance();
    }

    const signTransaction = async(): Promise<providers.TransactionResponse> => {
        // @ts-ignore
        const signer = library.getSigner();
        return await signer.sendTransaction(tx);
    }

    const useContractFunction = async()=> {
        // @ts-ignore
        const signer = library.getSigner();
        const address = await signer.getAddress();
        // let abi;
        // fetchJSONFile('BBookToken',(data) => {
        //     abi = data?.abi
        // })
        // contractInstance creation
        const contractInstance = new ethers.Contract(TOKENONE,abi,signer);
        //read fucntion
        const tokenBalance = await contractInstance.balanceOf(address,1);
        console.log(tokenBalance.toString());
    }

    const useSendContractFunction = async()=> {
        // @ts-ignore
        const signer = library.getSigner();
        const address = await signer.getAddress();
        // let abi;
        // fetchJSONFile('BBookToken',(data) => {
        //     abi = data?.abi
        // })
        const contractInstance = new ethers.Contract(TOKENONE,abi,signer);
        //write 
        await contractInstance.setApprovalForAll(EXCHANGE,true);
        const contractBool = await contractInstance.isApprovedForAll(address,EXCHANGE);
        console.log(contractBool.toString());
    }


    const getTotal = (): number => {
        return (price * quantity)
    }

    const getTotalDisplay = (): string => {
        return (price * quantity).toFixed(4)
    }

    const isValid = (): boolean => {
        return tokenA !== tokenB
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        dispatch(addOrder({'type': orderType.value, 'price': price, 'quantity': quantity}))
    }

    useEffect(()=> {
        if(!balance){
        getBalance().then((value)=>{
            setBalance(value)
        })
    }
    },[]);

    const message = `Connected Address:${account}`

    return (
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
        <Info message={message} />
        <form className="h-full" onSubmit={handleSubmit}>
            <div className="mt-2 flex items-center justify-between">
                <Select label="I Have" range={Tokens} selected={tokenA as SelectObject} setSelected={setTokenA as React.Dispatch<React.SetStateAction<SelectObject>>} />
            </div>
            <div className="mt-2 mb-6 flex items-center justify-between">
                <Select label="I Want" range={Tokens} selected={tokenB as SelectObject} setSelected={setTokenB as React.Dispatch<React.SetStateAction<SelectObject>>} />
            </div>
            <div className="border-t mb-6 border-gray-200 w-4/5 mx-auto">
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Radio label="Queue Type" range={OrderTypes} selected={orderType} setSelected={setOrderType} />
            </div>
            <div className="mt-2 flex items-center justify-between">
                <Select label="Action Type" range={OrderActions} selected={actionType} setSelected={setActionType} />
            </div>
            <div className="w-full mt-2 flex items-center justify-between">
                <label htmlFor="name" className="block ml-2 text-sm font-medium text-gray-700">
                    Price
                </label>
                <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      step="0.0001"
                      min={0}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                      placeholder="0.0000"
                    />
                </div>
            </div>
            <div className="w-full mt-2 flex items-center justify-between">
                <label htmlFor="name" className="block ml-2 text-sm font-medium text-gray-700">
                    Quantity
                </label>
                <div className="w-1/2 mt-1 ml-4 border-b border-gray-300 focus-within:border-orange-600">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      step="0.0001"
                      min={0}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="block w-full text-gray-500 border-0 border-b border-transparent bg-gray-50 focus:border-orange-600 focus:ring-0 sm:text-sm"
                      placeholder="0.0000"
                    />
                </div>
            </div>
            <div className="w-full mt-4 flex items-center justify-between mt-4">
                <span className="block ml-2 text-sm font-medium text-gray-700">
                    Total
                </span>
                <div className="w-1/2 mt-1 ml-4 text-right">
                    <span className="block w-full sm:text-sm">{getTotalDisplay()}</span>
                </div>
            </div>
            <div className={classNames("mt-10", isValid() ? "" : "flex items-center justify-between")}>
                {!isValid() &&
                    <div className="w-3/5">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-xs font-medium text-red-800">Please select two different tokens</h3>
                            </div>
                        </div>
                    </div>
                }
                <button
                    type="submit"
                    className={classNames( !isValid() ? "cursor-not-allowed hover:bg-orange-600 active:bg-orange-600 focus:outline-none focus:ring-0" : "ml-auto mr-0 ", "block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500")}
                >
                    Submit Order
                </button>

            </div>
        </form>
        <div>
            <button type="button"
                className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => signTransaction()}>
                blankTransaction
            </button>
        </div>
        <div>
            <button type="button"
                className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => useContractFunction()}>
                blankTokenExchange
            </button>
            <button type="button"
                className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => useSendContractFunction()}>
                sendTokenExchange
            </button>
        </div>
      </div>
    )
}

export default OrderForm