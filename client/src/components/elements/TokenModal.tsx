import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Token } from '../../app/Types'
import { queryDividendClaim } from '../../app/oms/Queries'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { selectAccountData, selectTokenStatus } from '../../app/store/slices/EthersSlice'
import { claimDividendThunk } from '../../app/store/slices/PeerSlice'
import { Spinner } from './Spinner'

type TokenModalProps = {
  token: Token | null
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
              <TokenModalContent token={props.token} open={props.open} setOpen={props.setOpen} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const TokenModalContent = (props: TokenModalProps) => {
  const dispatch = useAppDispatch()

  const token = props.token
  const { primaryAccount } = useAppSelector(selectAccountData)
  const status = useAppSelector(selectTokenStatus)

  const [dividendClaimAmount, setDividendClaimAmount] = useState<string>('')

  useEffect(() => {
    const getDividendClaimAmount = async () => {
      if (!!primaryAccount && !!token) {
        console.log('Requesting')
        const dividendClaim = await queryDividendClaim(token.contract.address, token.id, primaryAccount)
        console.log('Dividend Load', dividendClaim)
        setDividendClaimAmount(dividendClaim)
      }
    }

    getDividendClaimAmount()
  }, [primaryAccount, token])

  const claimDividend = () => {
    if (!!token) {
      dispatch(claimDividendThunk({ contractAddress: token.contract.address, tokenId: token.id }))
    }
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
              <dt className="text-sm font-medium text-gray-500">Issuer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{token?.contract.uri}</dd>
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
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Dividend Claim</dt>
              <dd className="mt-1 text-sm text-orange-600 sm:col-span-2 sm:mt-0">
                {dividendClaimAmount}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
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
          <button
            type="button"
            onClick={() => props.setOpen(false)}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={() => claimDividend()}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Claim Dividend
          </button>
        </div>
      </div>
    </div>
  )
}

export default TokenModal
