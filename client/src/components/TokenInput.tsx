import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { ContractName } from '../app/chain/ContractMetadata'
import { useAppSelector, useContract, useEthers } from '../app/Hooks'
import { selectTokenContract } from '../app/store/slices/TokensSlice'
import { TokenContract, TokenType } from '../app/Types'
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
  const [tokenIdentifier, setTokenIdentifier] = useState<string>('')
  const [tokenMetadataURI, setTokenMetadataURI] = useState<string>('')
  const [tokenType, setTokenType] = useState<TokenType>(TokenType.Fungible)
  const [tokenSupply, setTokenSupply] = useState<number>(0)

  const onSubmit = async () => {
    await createToken()

    setTokenIdentifier('')
    setTokenMetadataURI('')
    setTokenType(TokenType.Fungible)
    setTokenSupply(0)
  }

  const createToken = async () => {
    if (!!contract) {
      if (tokenType === TokenType.Fungible) {
        await contract.fungibleMint(
          tokenIdentifier,
          tokenSupply,
          tokenMetadataURI,
          ethers.utils.toUtf8Bytes(''),
        )
      } else {
        await contract.nonFungibleMint(tokenIdentifier, tokenMetadataURI, ethers.utils.toUtf8Bytes(''))
      }
    }
  }

  return (
    <>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-5 md:col-span-4">
              <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
                Token Identifier
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="uri"
                  id="uri"
                  value={tokenIdentifier}
                  onChange={(event) => {
                    {
                      setTokenIdentifier(event.target.value)
                    }
                  }}
                  className={classNames(
                    'focus:border-orange-500 focus:ring-orange-500',
                    'flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                  )}
                  placeholder="'Slurpee Labs Common A'"
                />
              </div>
            </div>
            <div className="col-span-5 md:col-span-4">
              <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
                Metadata URI
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="uri"
                  id="uri"
                  value={tokenMetadataURI}
                  onChange={(event) => {
                    {
                      setTokenMetadataURI(event.target.value)
                    }
                  }}
                  className={classNames(
                    'focus:border-orange-500 focus:ring-orange-500',
                    'flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                  )}
                  placeholder="slurpeelabs.eth/common-a"
                />
              </div>
            </div>
            <div className="col-span-4 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 my-2">Token Type</label>
              <fieldset className="mt-4">
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  {tokenTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        id={type.id}
                        name="token-type"
                        type="radio"
                        onChange={(e) => {
                          setTokenType(e.target.id as TokenType)
                          if (e.target.id === TokenType.NonFungible) {
                            setTokenSupply(1)
                          } else {
                            setTokenSupply(0)
                          }
                        }}
                        defaultChecked={tokenType === type.id}
                        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                      />
                      <label htmlFor={type.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {type.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="col-span-4 lg:col-span-2">
              <label htmlFor="supply" className="block text-sm font-medium text-gray-700 my-2">
                Token Supply
              </label>
              {tokenType === TokenType.Fungible ? (
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    min="0"
                    name="supply"
                    id="supply"
                    value={tokenSupply.toString()}
                    onChange={(e) => {
                      {
                        setTokenSupply(Number(e.target.value))
                      }
                    }}
                    className={classNames(
                      'focus:border-orange-500 focus:ring-orange-500',
                      'flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                    )}
                    placeholder="0"
                  />
                </div>
              ) : (
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    disabled
                    type="number"
                    min="0"
                    name="supply"
                    id="supply"
                    value={tokenSupply.toString()}
                    className={classNames(
                      'bg-gray-200 cursor-not-allowed',
                      'focus:border-orange-500 focus:ring-orange-500',
                      'flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                    )}
                    placeholder="1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
          <button
            onClick={() => onSubmit()}
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
