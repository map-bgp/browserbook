import { XCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectAccountData, selectTokenStatus } from '../../app/store/slices/EthersSlice'
import {
  depositEtherThunk,
  getBalance,
  selectBalance,
  withdrawEtherThunk,
} from '../../app/store/slices/PeerSlice'
import { Spinner } from '../elements/Spinner'

const Balance = () => {
  const dispatch = useAppDispatch()
  const { primaryAccount, isConnected } = useAppSelector(selectAccountData)
  const balance = useAppSelector(selectBalance)

  const status = useAppSelector(selectTokenStatus)

  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!!primaryAccount) {
      dispatch(getBalance(primaryAccount))
    }
  }, [primaryAccount])

  const handleDepositSubmit = () => {
    setError('')
    setAmount('')
    if (!primaryAccount) {
      throw new Error('Cannot deposit ether without valid account')
    }
    dispatch(depositEtherThunk({ amount, address: primaryAccount }))
  }

  const handleWithdrawSubmit = () => {
    setError('')
    setAmount('')

    if (!primaryAccount) {
      throw new Error('Cannot deposit ether without valid account')
    }
    dispatch(withdrawEtherThunk({ amount, address: primaryAccount }))
  }

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Exchange Balance</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 flex items-center sm:col-span-1">
              <div className="whitespace-nowrap text-4xl text-gray-700">
                Ξ <span className="ml-2">{balance}</span>
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Deposit Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  min="0"
                  step="0.000000001"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                  }}
                  className="block w-full rounded-md border-gray-300 pl-3 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  placeholder="0.00"
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
          <button
            onClick={() => handleWithdrawSubmit()}
            className={
              'mr-4 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
            }
          >
            Withdraw All
          </button>
          <button
            onClick={() => handleDepositSubmit()}
            className={
              'block flex items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:bg-orange-900'
            }
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Balance
