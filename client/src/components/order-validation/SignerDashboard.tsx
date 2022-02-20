import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '../utils/utils'
import { Peer } from '../../app/p2p/Peer'
import { EtherContractWrapper } from '../../app/chain/EtherStore'

type SignerDashboardProps = {
  peer: Peer
  primaryAccount: string
  signerAddress: string
  encryptedSignerKey: string
  signerBalance: string
  commissionBalance: string
  transactionsPerSecond: string
}

const Slider = (props: {
  action: (on: boolean) => void
  enabled: boolean
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Switch
      checked={props.enabled}
      onChange={(e) => {
        props.action(e.valueOf())
        props.setEnabled(e.valueOf())
      }}
      className={classNames(
        props.enabled ? 'bg-orange-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          props.enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        )}
      >
        <span
          className={classNames(
            props.enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
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
            props.enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
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

  const actionValidation = async (on: boolean) => {
    if (on) {
      const decryptedSignerKey = await new EtherContractWrapper().decrypt(
        props.encryptedSignerKey,
        props.primaryAccount,
      )
      props.peer.startValidation(props.signerAddress, decryptedSignerKey)
    } else {
      props.peer.stopValidation()
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
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
            <Slider action={actionValidation} enabled={enabled} setEnabled={setEnabled} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        <div className="flex items-center justify-between px-6 py-5">
          <span className="truncate text-sm font-medium text-gray-500">Signer Balance</span>{' '}
          <span className="text-xl font-medium text-gray-900">Ξ {props.signerBalance}</span>
        </div>
        <div className="flex items-center justify-between px-6 py-5">
          <span className="truncate text-sm font-medium text-gray-500">Commission Balance</span>{' '}
          <span className="text-xl font-medium text-gray-900">Ξ {props.commissionBalance}</span>
        </div>
        <div className="flex items-center justify-between px-6 py-5">
          <span className="truncate text-sm font-medium text-gray-500">Transactions per Second</span>{' '}
          <span className="text-xl font-medium text-gray-900">{props.transactionsPerSecond}</span>
        </div>
      </div>
    </div>
  )
}

export default SignerDashboard
