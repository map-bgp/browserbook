import { XCircleIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectAccountData, selectTokenStatus } from '../../app/store/slices/EthersSlice'
import {
  selectTokenContractAddress,
  selectTokens,
  transferTokenThunk,
} from '../../app/store/slices/TokensSlice'
import { Token } from '../../app/Types'
import { Spinner } from '../elements/Spinner'
import TokenSelect from '../elements/TokenSelect'

const TransferForm = () => {
  const dispatch = useAppDispatch()
  const { primaryAccount, isConnected } = useAppSelector(selectAccountData)
  const status = useAppSelector(selectTokenStatus)
  // This will have to be refactored to use the new token DB
  const tokenContractAddress = useAppSelector(selectTokenContractAddress)
  const tokens = useAppSelector(selectTokens)

  const [selected, setSelected] = useState<Token>(tokens[0])
  const [quantity, setQuantity] = useState<string>('')
  const [recipient, setRecipient] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setSelected(tokens[0])
  }, [tokens])

  const handleSubmit = () => {
    setError('')

    if (Number(quantity) === 0) {
      setError('Quantity may not be zero')
    } else if (!ethers.utils.isAddress(recipient)) {
      setError('Invalid recipient address provided')
    } else if (tokenContractAddress === null) {
      throw new Error('Token Contract not found')
    } else if (!primaryAccount) {
      throw new Error('Account not initialized')
    } else {
      dispatch(
        transferTokenThunk({
          senderAddress: primaryAccount,
          recipientAddress: recipient,
          contractAddress: tokenContractAddress,
          token: selected,
          quantity: quantity,
        }),
      )

      setQuantity('')
      setRecipient('')
    }
  }

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Transfer Tokens</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-1">
              {!!selected ? (
                <TokenSelect tokens={tokens} selected={selected} setSelected={setSelected} />
              ) : (
                <div className="flex items-center pt-6">
                  <span className="block text-gray-500 italic">No tokens found to trade</span>
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="0"
                  step="0.000000001"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                  }}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Recipient Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="recipient"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value)
                  }}
                  placeholder="i.e. 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
          {!isConnected && (
            <div className="w-full">
              <div className="flex mx-4 items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xs font-medium text-red-800">
                    You must connect your wallet in order to proceed
                  </h3>
                </div>
              </div>
            </div>
          )}
          {status == 'loading' && (
            <div className="w-full">
              <div className="flex mx-4 items-center">
                <div className="flex-shrink-0">
                  <Spinner />
                </div>
                <div className="ml-1">
                  <h3 className="text-xs font-medium text-blue-800">
                    Processing. Please wait and confirm any prompted transactions
                  </h3>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="w-full">
              <div className="flex mx-4 items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xs font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          {!!selected ? (
            <button
              onClick={() => handleSubmit()}
              className={
                'block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => {}}
              className={
                'block cursor-not-allowed flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransferForm
