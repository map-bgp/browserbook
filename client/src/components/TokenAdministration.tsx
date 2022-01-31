import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { XCircleIcon } from '@heroicons/react/solid'

import { classNames } from './utils/utils'
import {
  useAppDispatch,
  useAppSelector,
  useEthers,
  useFilter,
  useTokenContractFilter,
} from '../app/Hooks'
import { selectTokenContract, selectTokens, setTokens } from '../app/store/slices/TokensSlice'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { ContractName } from '../chain/ContractMetadata'
import TokenTable from './elements/TokenTable'

type TokenAdministrationProps = {}

const TokenAdministration = (props: TokenAdministrationProps) => {
  const dispatch = useAppDispatch()

  const { isConnected, accounts, primaryAccount } = useAppSelector(selectAccountData)
  const { contract } = useEthers(ContractName.TokenFactory)

  const tokenContract = useAppSelector(selectTokenContract)
  const tokens = useAppSelector(selectTokens)

  useTokenContractFilter(primaryAccount)

  const createToken = async (uri: string) => {
    if (contract === null) {
      throw new Error('Cannot call method on null contract')
    }
    try {
      await contract.create(uri).then(() => console.log('Created token'))
    } catch (error: any) {
      console.log(error.data)
    }
  }

  const [uri, setURI] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const formIsValid = (): boolean => {
    return uri !== ''
  }

  const handleSubmit = () => {
    if (!formIsValid()) {
      setError(true)
      throw new Error('Submission form is not valid')
    }

    setError(false)

    if (tokens.length == 0) {
      createToken(uri)
    } else {
      throw new Error('Can only create one token per address')
    }
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Token Factory</h3>
            <p className="mt-1 text-sm text-gray-600">Create a new token factory</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
                    Issuer URI
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      URI:
                    </span>
                    <input
                      type="text"
                      name="uri"
                      id="uri"
                      onChange={(event) => {
                        setError(false)
                        setURI(event.target.value)
                      }}
                      className={classNames(
                        'focus:border-orange-500 focus:ring-orange-500',
                        'flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                      )}
                      placeholder="Token URI"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
              {error && (
                <div className="w-full">
                  <div className="flex mx-4 items-center">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-xs font-medium text-red-800">Token URI may not be empty</h3>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => handleSubmit()}
                className={
                  'block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
        {tokens.length !== 0 ? (
          <>
            <div className="md:col-span-1 align-top">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Token Admin</h3>
                <p className="mt-1 text-sm text-gray-600">See and administer already created tokens</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <TokenTable wrapperStyle="" tokens={tokens} />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default TokenAdministration
