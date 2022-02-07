import { XCircleIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectAccountData } from '../../app/store/slices/EthersSlice'
import { initializeSigner, selectValidatorStatus } from '../../app/store/slices/ValidatorSlice'

const Spinner = () => (
  <svg
    role="status"
    className="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    ></path>
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    ></path>
  </svg>
)

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
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
              Initial Signer Balance
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
        {status == 'loading' && (
          <div className="w-full">
            <div className="flex mx-4 items-center">
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
        {isConnected && status === 'idle' ? (
          <button
            onClick={() => handleSubmit()}
            className={
              'block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            }
          >
            Create
          </button>
        ) : (
          <button
            onClick={() => {}}
            className={
              'block cursor-not-allowed flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
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
