import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import { importToken } from '../../app/oms/TokenService'

type TokenModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TokenModal = (props: TokenModalProps) => {
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
              <TokenModalContent open={props.open} setOpen={props.setOpen} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const TokenModalContent = (props: TokenModalProps) => {
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
      props.setOpen(false)
    } catch (error: unknown) {
      setError("We couldn't find that contract, please double check the submission")
    }
  }

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="w-11/12 space-y-8">
        <div>
          <h3 className="text-xl leading-6 font-semibold text-gray-700">Import Token</h3>
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
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
          <button
            type="button"
            onClick={() => props.setOpen(false)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={() => handleSubmit()}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}

export default TokenModal
