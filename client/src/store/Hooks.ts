import { useEffect, useState } from "react"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { ethers } from "ethers"

import type { AppDispatch, RootState } from "./Store"
import {
  setAccounts,
} from "./slices/EthersSlice"
import {EtherStore} from "../chain/Ethers";
import {ContractName} from "../chain/ContractMetadata";

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEthers = (contractName?: ContractName) => {
  const dispatch = useAppDispatch()

  const [ethers, setEthers] = useState<EtherStore>(new EtherStore());
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    const setupEthers = async () => {
      setSigner(ethers.getSigner())
      dispatch(setAccounts(await ethers.getAccounts()))

      if (contractName) {
        const contract = await ethers.getContract(contractName)
        setContract(contract)
        // dispatch(setEthersResolved(true))
      }
    }
    setupEthers().then()
  }, [])

  return { ethers, signer, contract };
}