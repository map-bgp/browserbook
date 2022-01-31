import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {
  useAppDispatch,
  useAppSelector,
  useEthers,
  useFilter,
  useTokenContractFilter,
} from '../app/Hooks'
import { selectTokenContract, selectTokens, setTokens } from '../app/store/slices/TokensSlice'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { ContractName } from '../app/chain/ContractMetadata'
import TokenTable from '../components/TokenTable'
import ContractInput from '../components/ContractInput'

type TokenAdministrationProps = {}

const TokenAdministration = (props: TokenAdministrationProps) => {
  const { primaryAccount } = useAppSelector(selectAccountData)

  const tokenContract = useAppSelector(selectTokenContract)
  const tokens = useAppSelector(selectTokens)

  useTokenContractFilter(primaryAccount)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <div>
            {tokenContract === null ? (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Commit Entity URI</h3>
                <p className="mt-1 text-sm text-gray-600">Each address can link with exactly one URI</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create Token</h3>
                <p className="mt-1 text-sm text-gray-600">Create a new fungible or non-fungible token</p>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          {tokenContract === null ? <ContractInput /> : <TokenTable wrapperStyle="" tokens={tokens} />}
        </div>
      </div>
    </div>
  )
}

export default TokenAdministration
