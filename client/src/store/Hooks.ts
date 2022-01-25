import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ethers, EventFilter } from 'ethers'

import type { AppDispatch, RootState } from './Store'
import { setAccounts } from './slices/EthersSlice'
import { EtherStore, SlickEtherStore } from '../chain/Ethers'
import { ContractName } from '../chain/ContractMetadata'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useEthers = (contractName?: ContractName) => {
  const dispatch = useAppDispatch()

  const [ethers, setEthers] = useState<EtherStore>(new EtherStore())
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

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

  return { ethers, signer, contract }
}

export const useFilter = (
  contract: ethers.Contract | null,
  filterName: string,
  filterArgs: Array<string>,
  callback: (events: Array<ethers.Event>) => void,
) => {
  const slickEthers = new SlickEtherStore()
  useEffect(() => {
    const setupFilter = async () => {
      if (!!contract) {
        const filter = EtherStore.getFilter(contract, filterName, filterArgs)

        EtherStore.setFilterHandler(contract, filter, callback)
        callback(await EtherStore.queryFilter(contract, filter))
      }
    }

    setupFilter()
  }, [contract])
}
