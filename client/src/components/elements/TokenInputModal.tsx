import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PaperClipIcon } from '@heroicons/react/outline'
import { useAppSelector } from '../../app/Hooks'
import { selectTokenById } from '../../app/store/slices/TokensSlice'
import { store } from '../../app/store/Store'

type TokenModalProps = {
  tokenId: string | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TokenInputModal = (props: TokenModalProps) => {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={props.setOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* Tricks the browser to center */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <TokenForm tokenId={props.tokenId} open={props.open} setOpen={props.setOpen} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const TokenForm = (props: TokenModalProps) => {
  const token = props.tokenId !== null ? selectTokenById(store.getState(), props.tokenId) : null

  return (
    <form className="space-y-8 divide-y divide-gray-200">
      <div className="w-11/12 space-y-8 divide-y divide-gray-200">
        <div>
          <h3 className="text-xl leading-6 font-semibold text-gray-700">Token Information</h3>
          <dl className="sm:divide-y sm:divide-gray-200 mt-4 -mb-8">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{token?.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{token?.type}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Total Supply</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{token?.supply}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Metadata URI</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{token?.metadataURI}</dd>
            </div>
          </dl>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Add Dividend</h3>
            <p className="mt-1 text-sm text-gray-500">
              Holders can claim a proportional stake of the total dividend
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="dividend" className="block text-sm font-medium text-gray-700">
                Additional Dividend
              </label>
              <div className="mt-1">
                <input
                  id="dividend"
                  name="dividend"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-11/12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="block text-sm font-medium text-gray-700">Current Dividend Load</div>
              <div className="flex h-3/4 justify-start items-center">
                <span className="text-lg font-medium text-gray-700">{'dividendLoad'} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => props.setOpen(false)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default TokenInputModal
