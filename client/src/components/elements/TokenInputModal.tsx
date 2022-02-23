import { ethers as ethersLib } from 'ethers'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PaperClipIcon } from '@heroicons/react/outline'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectTokenById } from '../../app/store/slices/TokensSlice'
import { store } from '../../app/store/Store'
import { depositDividendThunk } from '../../app/store/slices/PeerSlice'
import { queryDividendLoad } from '../../app/oms/Queries'

type TokenModalProps = {
  tokenId: string | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TokenInputModal = (props: TokenModalProps) => {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={props.setOpen}>
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
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
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle">
              <TokenForm tokenId={props.tokenId} open={props.open} setOpen={props.setOpen} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const TokenForm = (props: TokenModalProps) => {
  const dispatch = useAppDispatch()
  const token = props.tokenId !== null ? selectTokenById(store.getState(), props.tokenId) : null

  const [dividendLoad, setDividendLoad] = useState<string>('')
  const [dividend, setDividend] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const getDividendLoad = async () => {
      if (!!token) {
        const dividendLoad = await queryDividendLoad(token.contract.address, token.id)
        setDividendLoad(dividendLoad)
      }
    }

    getDividendLoad()
  }, [token])

  const handleDividendSubmit = () => {
    setError('')
    setDividend('')

    if (!token) {
      throw new Error('Cannot add dividend to non-existant token')
    }
    dispatch(
      depositDividendThunk({
        amount: dividend,
        contractAddress: token.contract.address,
        tokenId: token.id,
      }),
    )
    props.setOpen(false)
  }

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="w-11/12 space-y-8 divide-y divide-gray-200">
        <div>
          <h3 className="text-xl font-semibold leading-6 text-gray-700">Token Information</h3>
          <dl className="mt-4 -mb-8 sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{token?.name}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Token ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{token?.id}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{token?.type}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Total Supply</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{token?.supply}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Metadata URI</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{token?.metadataURI}</dd>
            </div>
          </dl>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add Dividend</h3>
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
                  value={dividend}
                  onChange={(e) => {
                    setDividend(e.target.value)
                  }}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="block w-11/12 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="block text-sm font-medium text-gray-700">Current Dividend Load</div>
              <div className="flex h-3/4 items-center justify-start">
                <span className="text-lg font-medium text-gray-700">
                  {dividendLoad !== '' ? ethersLib.utils.formatEther(dividendLoad) : '0'} ETH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => props.setOpen(false)}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Close
          </button>
          <button
            onClick={() => handleDividendSubmit()}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default TokenInputModal
