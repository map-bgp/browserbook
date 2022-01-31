import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'

import { AppDispatch, RootState, store } from './store/Store'
import { setAccounts } from './store/slices/EthersSlice'
import { EtherContractWrapper, EtherStore } from './chain/EtherStore'
import { ContractName } from './chain/ContractMetadata'
import { setTokenContract, setTokens, setTokenIds } from './store/slices/TokensSlice'
import { Token } from './Types'
import { queryToken } from './chain/Queries'

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
  initialQuery?: boolean,
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
  initialQuery?: boolean,
) => {
  useEffect(() => {
    if (!!filterArgs) {
      filterArgs = filterArgs instanceof Array ? filterArgs : [filterArgs]
      setupFilter(contractName, filterName, filterArgs, callback, initialQuery)
    }
  }, [filterArgs])
}

const setupVariableFilter = async (
  contractName: ContractName,
  filterName: string,
  filterArgs: Array<string>,
  callback: (events: Array<ethers.Event>) => void,
  contractAddress: string,
  initialQuery?: boolean,
) => {
  const contract = await new EtherContractWrapper().getContract(contractName, contractAddress)
  const filter = EtherStore.getFilter(contract, filterName, filterArgs)
  EtherStore.setFilterHandler(contract, filter, callback, initialQuery)
}

export const useVariableFilter = (
  contractName: ContractName,
  filterName: string,
  filterArgs: Array<string> | string | null,
  callback: (events: Array<ethers.Event>) => void,
  contractAddress?: string,
  initialQuery?: boolean,
) => {
  useEffect(() => {
    if (!!filterArgs && !!contractAddress) {
      filterArgs = filterArgs instanceof Array ? filterArgs : [filterArgs]
      setupVariableFilter(contractName, filterName, filterArgs, callback, contractAddress, initialQuery)
    }
  }, [filterArgs, contractAddress])
}

export const useTokenFactoryFilter = (ownerAddress: string | null, initialQuery?: boolean) => {
  const dispatch = useAppDispatch()
  const contractName = ContractName.TokenFactory
  const filterName = 'TokenContractCreated'

  const dispatchTokenContract = (events: Array<ethers.Event>) => {
    const tokenFactoryEvent = events
      .filter((e) => typeof e !== undefined)
      .filter((e) => e.args !== undefined)
      .shift()

    if (!!tokenFactoryEvent && !!tokenFactoryEvent.args) {
      const tokenContract = { uri: tokenFactoryEvent.args[1], address: tokenFactoryEvent.args[2] }
      dispatch(setTokenContract(tokenContract))
    }
  }

  useFilter(contractName, filterName, ownerAddress, dispatchTokenContract, initialQuery)
}

export const useTokenIdFilter = (
  ownerAddress: string | null,
  contractAddress?: string,
  initialQuery?: boolean,
) => {
  const dispatch = useAppDispatch()
  const contractName = ContractName.Token
  const filterName = 'TokenCreation'

  const dispatchTokenIds = (events: Array<ethers.Event>) => {
    const tokenIds: Array<string> = events
      .filter((e) => typeof e !== undefined)
      .filter((e) => e.args !== undefined)
      .map((e) => e.args![1].toString())

    dispatch(setTokenIds(tokenIds))
  }

  useVariableFilter(
    contractName,
    filterName,
    ownerAddress,
    dispatchTokenIds,
    contractAddress,
    initialQuery,
  )
}

export const useTokenQuery = (tokenIds: Array<string>, contractAddress?: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const mapTokens = async (contractAddress: string) => {
      let tokens: Array<Token> = []

      for (let i = 0; i < tokenIds.length; i++) {
        let token = await queryToken(tokenIds[i], contractAddress)
        tokens.push(token)
      }
      dispatch(setTokens(tokens))
    }

    if (!!contractAddress) {
      mapTokens(contractAddress)
    }
  }, [tokenIds, contractAddress])
}
