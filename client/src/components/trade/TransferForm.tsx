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
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Transfer Tokens</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-1">
              {!!selected ? (
                <TokenSelect tokens={tokens} selected={selected} setSelected={setSelected} />
              ) : (
                <div className="flex items-center pt-6">
                  <span className="block italic text-gray-500">No tokens found to trade</span>
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
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
                  className="block w-full rounded-md border-gray-300 pl-3 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Recipient Address
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  name="recipient"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value)
                  }}
                  placeholder="i.e. 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                  className="block w-full rounded-md border-gray-300 pl-3 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end bg-gray-50 px-4 py-3 text-right sm:px-6">
          {!isConnected && (
            <div className="w-full">
              <div className="mx-4 flex items-center">
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
              <div className="mx-4 flex items-center">
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
              <div className="mx-4 flex items-center">
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
                'block flex items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:bg-orange-900'
              }
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => {}}
              className={
                'block flex cursor-not-allowed items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
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
