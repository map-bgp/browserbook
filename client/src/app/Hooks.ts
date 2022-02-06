import { useContext, useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'

import { AppDispatch, RootState } from './store/Store'
import { setAccounts } from './store/slices/EthersSlice'
import { EtherContractWrapper, EtherStore } from './chain/EtherStore'
import { ContractName } from './chain/ContractMetadata'
import { getTokens, getTokenContract } from './store/slices/TokensSlice'
import { AppContext } from '../components/AppContext'

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

export const useEthers = (contractName?: ContractName, contractAddress?: string) => {
  const dispatch = useAppDispatch()
  const { ethers } = useContext(AppContext)

  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const setupEthers = async () => {
      setSigner(ethers.getSigner())
      dispatch(setAccounts(await ethers.getAccounts()))

      if (contractName) {
        const contract = await ethers.getContract(contractName, contractAddress)
        setContract(contract)
      }
    }
    setupEthers().then()
  }, [])

  return { ethers, signer, contract }
}

export const useTokenFactoryFilter = (ownerAddress: string | null) => {
  const dispatch = useAppDispatch()
  const contractName = ContractName.TokenFactory
  const filterName = 'TokenContractCreated'

  const setupFilter = async () => {
    if (!!ownerAddress) {
      // Setup the thunk
      const getTokenContractThunk = () => {
        dispatch(getTokenContract(ownerAddress))
      }

      // Call the thunk initially
      getTokenContractThunk()

      // Set it on the handler
      const contract = await new EtherContractWrapper().getContract(contractName)
      const filter = EtherStore.getFilter(contract, filterName, [ownerAddress])
      EtherStore.setFilterHandler(contract, filter, getTokenContractThunk)
    }
  }

  useEffect(() => {
    setupFilter()
  }, [ownerAddress])
}

export const useTokenFilter = (ownerAddress: string | null, contractAddress: string | null) => {
  const dispatch = useAppDispatch()
  const contractName = ContractName.Token
  const filterName = 'TokenCreation'

  const setupFilter = async () => {
    if (!!ownerAddress && !!contractAddress) {
      // Setup the thunk
      const getTokensThunk = () => {
        dispatch(getTokens())
      }

      // Call the thunk initially
      getTokensThunk()

      // Set it on the handler
      const contract = await new EtherContractWrapper().getContract(contractName, contractAddress)
      const filter = EtherStore.getFilter(contract, filterName, [ownerAddress])
      EtherStore.setFilterHandler(contract, filter, getTokensThunk)
    }
  }

  useEffect(() => {
    setupFilter()
  }, [ownerAddress, contractAddress])
}
