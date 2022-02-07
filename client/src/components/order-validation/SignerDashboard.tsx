import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '../utils/utils'

type SignerDashboardProps = {
  signerAddress: string
  signerBalance: string
  commissionBalance: string
  transactionsPerSecond: string
}

const Slider = (props: {
  enabled: boolean
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Switch
      checked={props.enabled}
      onChange={props.setEnabled}
      className={classNames(
        props.enabled ? 'bg-orange-600' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          props.enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        )}
      >
        <span
          className={classNames(
            props.enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          )}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={classNames(
            props.enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          )}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-orange-600" fill="currentColor" viewBox="0 0 12 12">
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </Switch>
  )
}

const SignerDashboard = (props: SignerDashboardProps) => {
  const [enabled, setEnabled] = useState<boolean>(false)

  return (
    <div className="rounded-lg bg-white overflow-hidden shadow">
      <h2 className="sr-only" id="profile-overview-title">
        Profile Overview
      </h2>
      <div className="bg-white p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                Signer is {enabled ? 'ON' : 'OFF'}
              </p>
              <p className="text-sm font-medium text-gray-600">
                To start validating orders, toggle the switch to the right
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-center sm:mt-0">
            <Slider enabled={enabled} setEnabled={setEnabled} />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        <div className="px-6 py-5 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 truncate">Signer Balance</span>{' '}
          <span className="text-xl font-medium text-gray-900">Ξ {props.signerBalance}</span>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 truncate">Commission Balance</span>{' '}
          <span className="text-xl font-medium text-gray-900">Ξ {props.commissionBalance}</span>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 truncate">Transactions per Second</span>{' '}
          <span className="text-xl font-medium text-gray-900">{props.transactionsPerSecond}</span>
        </div>
      </div>
    </div>
  )
}

export default SignerDashboard
