import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import { importToken } from '../../app/oms/TokenService'
import { useAppDispatch } from '../../app/Hooks'
import { getTokens } from '../../app/store/slices/TokensSlice'

type TokenModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TokenModal = (props: TokenModalProps) => {
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
              <TokenModalContent open={props.open} setOpen={props.setOpen} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const TokenModalContent = (props: TokenModalProps) => {
  const dispatch = useAppDispatch()

  const [issuerURI, setIssuerURI] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = async () => {
    setError('')

    if (issuerURI.length === 0) {
      setError('Issuer URI cannot be blank')
    } else if (tokenId === '') {
      setError('Token ID cannot be blank')
    } else {
      console.log('Valid')
    }

    try {
      await importToken(issuerURI, Number(tokenId))
      dispatch(getTokens())
      props.setOpen(false)
    } catch (error: unknown) {
      setError("We couldn't find that contract, please double check the submission")
    }
  }

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="w-11/12 space-y-8">
        <div>
          <h3 className="text-xl font-semibold leading-6 text-gray-700">Import Token</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Issuer URI
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="issuer-uri"
                id="issuer-uri"
                value={issuerURI}
                onChange={(event) => setIssuerURI(event.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="slurpeelabs.eth"
              />
            </div>
          </div>
          <div className="col-span-3 sm:col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Token ID
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="token-id"
                id="token-id"
                min="0"
                step="1"
                value={tokenId}
                onChange={(event) => setTokenId(event.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-3">
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
            type="button"
            onClick={() => props.setOpen(false)}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={() => handleSubmit()}
            className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}

export default TokenModal
