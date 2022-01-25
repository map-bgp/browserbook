import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ethers, EventFilter } from 'ethers'

import type { AppDispatch, RootState } from './Store'
import { setAccounts } from './slices/EthersSlice'
import { EtherStore } from '../chain/Ethers'
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
      }
    }
    setupEthers().then()
  }, [])

  return { ethers, signer, contract }
}

// export const useFilter = (
//   contract: ethers.Contract | null,
//   filterName: string,
//   filterArgs: Array<string> | null,
//   callback: (events: Array<ethers.Event>) => void,
// ) => {
//   useEffect(() => {
//     console.log('Here are the filter args', filterArgs)

//     const setupFilter = async () => {
//       if (!!contract && !!filterArgs) {
//         contract.removeAllListeners()

//         const filter = EtherStore.getFilter(contract, filterName, filterArgs)
//         EtherStore.setFilterHandler(contract, filter, callback)
//       }
//     }

//     setupFilter()
//   }, [contract, filterArgs])
// }

// Change to async thunk for integration into store?
export const useTokenFilter = (
  contract: ethers.Contract | null,
  filterName: string,
  ownerAddress: string | null,
  callback: (events: Array<ethers.Event>) => void,
) => {
  useEffect(() => {
    console.log('Here are the filter args', ownerAddress)

    const setupFilter = async () => {
      if (!!contract && !!ownerAddress) {
        contract.removeAllListeners()

        const filter = EtherStore.getFilter(contract, filterName, [ownerAddress])
        EtherStore.setFilterHandler(contract, filter, callback)
      }
    }

    setupFilter()
  }, [contract, ownerAddress])
}
