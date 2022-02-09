import { XCircleIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectAccountData, selectTokenStatus } from '../../app/store/slices/EthersSlice'
import { createTokenContractThunk } from '../../app/store/slices/TokensSlice'
import { Spinner } from '../elements/Spinner'
import { classNames } from '../utils/utils'

const ContractInput = () => {
  const dispatch = useAppDispatch()
  const { isConnected } = useAppSelector(selectAccountData)
  const status = useAppSelector(selectTokenStatus)

  const [uri, setURI] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = () => {
    setError('')

    if (uri.length === 0) {
      setError('Token URI may not be empty')
    } else {
      dispatch(createTokenContractThunk(uri))
    }
  }

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md">
      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <label htmlFor="uri" className="my-2 block text-sm font-medium text-gray-700">
              Unique Entity Identifier
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                URI:
              </span>
              <input
                type="text"
                name="uri"
                id="uri"
                onChange={(event) => {
                  setURI(event.target.value)
                }}
                className={classNames(
                  'focus:border-orange-500 focus:ring-orange-500',
                  'border-l-1 block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none sm:text-sm',
                )}
                placeholder="example.eth"
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
                  Processing. Please wait and confirm any prompted transactions
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
        {isConnected ? (
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

export default ContractInput
