import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'

import { AppDispatch, RootState, store } from './store/Store'
import { setAccounts } from './store/slices/EthersSlice'
import { EtherContractWrapper, EtherStore } from './chain/EtherStore'
import { ContractName } from './chain/ContractMetadata'
import { setTokenContract, setTokens } from './store/slices/TokensSlice'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useContract = (contractName: ContractName, address?: string) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const getContract = async () => {
      const contract = await new EtherContractWrapper().getContract(contractName, address)
      setContract(contract)
    }

    getContract().then()
  }, [])

  return contract
}

export const useEthers = (contractName?: ContractName, address?: string) => {
  const dispatch = useAppDispatch()

  const [ethers, setEthers] = useState<EtherStore>(new EtherStore())
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const setupEthers = async () => {
      setSigner(ethers.getSigner())
      dispatch(setAccounts(await ethers.getAccounts()))

      if (contractName) {
        const contract = await ethers.getContract(contractName, address)
        setContract(contract)
      }
    }
    setupEthers().then()
  }, [])

  return { ethers, signer, contract }
}

const setupFilter = async (
  contractName: ContractName,
  filterName: string,
  filterArgs: Array<string>,
  callback: (events: Array<ethers.Event>) => void,
  initialQuery: boolean,
) => {
  const contract = await new EtherContractWrapper().getContract(contractName)
  const filter = EtherStore.getFilter(contract, filterName, filterArgs)
  EtherStore.setFilterHandler(contract, filter, callback, initialQuery)
}

export const useFilter = (
  contractName: ContractName,
  filterName: string,
  filterArgs: Array<string> | string | null,
  callback: (events: Array<ethers.Event>) => void,
  initialQuery: boolean,
) => {
  useEffect(() => {
    if (!!filterArgs) {
      filterArgs = filterArgs instanceof Array ? filterArgs : [filterArgs]
      setupFilter(contractName, filterName, filterArgs, callback, initialQuery)
    }
  }, [filterArgs])
}

export const useTokenContractFilter = (ownerAddress: string | null, initialQuery: boolean) => {
  const dispatch = useAppDispatch()
  const contractName = ContractName.TokenFactory
  const filterName = 'TokenContractCreated'

  const dispatchTokens = (events: Array<ethers.Event>) => {
    const tokenContractEvent = events
      .filter((e) => typeof e !== undefined)
      .filter((e) => e.args !== undefined)
      .shift()

    if (!!tokenContractEvent && !!tokenContractEvent.args) {
      const tokenContract = { uri: tokenContractEvent.args[1], address: tokenContractEvent.args[2] }
      dispatch(setTokenContract(tokenContract))
    }
  }

  useFilter(contractName, filterName, ownerAddress, dispatchTokens, initialQuery)
}