import { useEffect } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { ContractName } from '../app/chain/ContractMetadata'
import { useAppSelector, useContract, useEthers } from '../app/Hooks'
import { selectTokenContract } from '../app/store/slices/TokensSlice'
import { Token, TokenContract, TokenType } from '../app/Types'
import { classNames } from './utils/utils'

export type TokenInputProps = {
  tokenContract: TokenContract
}

const tokenTypes = [
  { id: TokenType.Fungible, title: 'Fungible' },
  { id: TokenType.NonFungible, title: 'Non Fungible' },
]

export const TokenInput = (props: TokenInputProps) => {
  const contract = useContract(ContractName.Token, props.tokenContract.address)

  const createToken = async (isNF: boolean) => {
    if (!!contract) {
      // await contract.createTokenId(isNF)
      console.log('New token nonce', await contract.tokenNonce())
    }
  }

  return (
    <>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 my-2">Token Type</label>
              <fieldset className="mt-4">
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  {tokenTypes.map((tokenType) => (
                    <div key={tokenType.id} className="flex items-center">
                      <input
                        id={tokenType.id}
                        name="token-type"
                        type="radio"
                        defaultChecked={tokenType.id === TokenType.Fungible}
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                      />
                      <label
                        htmlFor={tokenType.id}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {tokenType.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="col-span-3">
              <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
                Token Identifier
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
                    {
                    }
                  }}
                  className={classNames(
                    'focus:border-orange-500 focus:ring-orange-500',
                    'flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                  )}
                  placeholder="'Slurpee Labs Common A'"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
          <button
            onClick={() => createToken(true)}
            className={
              'block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            }
          >
            Create
          </button>
        </div>
      </div>
    </>
  )
}

export default TokenInput
