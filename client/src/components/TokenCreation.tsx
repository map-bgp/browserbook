import React, {useEffect} from "react";
import "tailwindcss/tailwind.css"
import {useAppDispatch, useAppSelector} from "../store/Hooks";
import {selectEthersActive} from "../store/slices/EthersSlice";
import {ethers} from "ethers";

type TokenCreationProps = {}

const TokenCreation = (props: TokenCreationProps) => {

  const dispatch = useAppDispatch();
  const ethersStatus = useAppSelector(selectEthersActive)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div
        className="px-4 py-8 sm:px-0 flex flex-col items-center sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        Is the wallet connected?<br/>
      </div>
    </div>
  )
}

export default TokenCreation
