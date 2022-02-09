import { XCircleIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectAccountData } from '../../app/store/slices/EthersSlice'
import { initializeSigner, selectValidatorStatus } from '../../app/store/slices/ValidatorSlice'
import { Spinner } from '../elements/Spinner'

const CreateAndLoadSigner = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectValidatorStatus)
  const { primaryAccount, isConnected } = useAppSelector(selectAccountData)

  const [etherDeposit, setEtherDeposit] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = async () => {
    if (!!primaryAccount) {
      const options = { primaryAccount, etherDeposit }
      dispatch(initializeSigner(options))
    }
  }

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md">
      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <label htmlFor="uri" className="my-2 block text-sm font-medium text-gray-700">
              Initial Signer Balance
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">Ξ</span>
              </div>
              <input
                type="number"
                name="ether-deposit"
                id="ether-deposit"
                min="0"
                step="0.000000001"
                value={etherDeposit}
                onChange={(e) => {
                  setEtherDeposit(e.target.value)
                }}
                className="block w-full rounded-md border-gray-300 pl-7 pr-3 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end bg-gray-50 px-4 py-3 text-right sm:px-6">
        {status == 'loading' && (
          <div className="w-full">
            <div className="mx-4 flex items-center">
              <div className="flex-shrink-0">
                <Spinner />
              </div>
              <div className="ml-1">
                <h3 className="text-xs font-medium text-blue-800">
                  Processing. Please wait and confirm the prompted transactions
                </h3>
              </div>
            </div>
          </div>
        )}
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
        {isConnected && status === 'idle' ? (
          <button
            onClick={() => handleSubmit()}
            className={
              'block flex items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:bg-orange-900'
            }
          >
            Create
          </button>
        ) : (
          <button
            onClick={() => {}}
            className={
              'block flex cursor-not-allowed items-end rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            }
          >
            Create
          </button>
        )}
      </div>
    </div>
  )
}

export default CreateAndLoadSigner
