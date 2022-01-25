import { isSome } from 'fp-ts/lib/Option'
import { useDispatch } from 'react-redux'
import { ContractName } from '../chain/ContractMetadata'
import { EtherStore } from '../chain/Ethers'
import { useAppSelector, useEthers } from '../store/Hooks'
import { selectAccountData } from '../store/slices/EthersSlice'
import {
  selectEncryptedSignerKey,
  setEncryptedSignerKey,
  setSignerAddress,
} from '../store/slices/SignerSlice'

const ControlPanel = () => {
  const dispatch = useDispatch()

  const { isConnected, accounts, primaryAccount } = useAppSelector(selectAccountData)
  const { ethers, signer, contract } = useEthers(ContractName.TokenFactory)

  const encryptedSignerKey = useAppSelector(selectEncryptedSignerKey)

  const log = () => {
    console.log('Ethers', ethers, 'Signer', signer, 'Contract', contract)
    console.log('Filter function', EtherStore.getFilter(contract!, 'TokenCreated', []))
  }

  const encryptSigner = async () => {
    try {
      if (!!primaryAccount) {
        const [signerAddress, encryptedSignerKey] = await ethers.encryptDelegatedSigner(primaryAccount)
        dispatch(setSignerAddress(signerAddress))
        dispatch(setEncryptedSignerKey(encryptedSignerKey))
      } else {
        throw new Error('Cannot encrypt a delegated signer for an empty account')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const decryptSigner = async () => {
    if (encryptedSignerKey === null) throw new Error('Cannot decrypt null signer key')
    try {
      if (!!primaryAccount) {
        console.log('Decrypted message', await ethers.decrypt(encryptedSignerKey, primaryAccount))
      } else {
        throw new Error('Cannot decrypt a delegated signer for an empty account')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">System Control</h3>
            <p className="mt-1 text-sm text-gray-600">All the buttons and knobs you need</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <button
            type="button"
            className="w-36 my-4 block flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => {
              log()
            }}
          >
            Log
          </button>
          <button
            type="button"
            className="w-36 my-4 block flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => {
              encryptSigner()
            }}
          >
            Encrypt Signer
          </button>
          <button
            type="button"
            className="w-36 my-4 block flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => {
              decryptSigner()
            }}
          >
            Decrypt Signer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
