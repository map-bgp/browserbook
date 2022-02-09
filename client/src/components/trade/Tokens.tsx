import { useState } from 'react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { useAppSelector } from '../../app/Hooks'
import { selectTokens } from '../../app/store/slices/TokensSlice'
import TokenModal from '../elements/TokenModal'
import NewTokenModal from '../elements/NewTokenModal'
import { classNames } from '../utils/utils'
import { Token } from '../../app/Types'

const Tokens = () => {
  const tokens = useAppSelector(selectTokens)

  const [activeToken, setActiveToken] = useState<Token | null>(null)
  const [newTokenModalOpen, setNewTokenModalOpen] = useState<boolean>(false)
  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false)

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="space-y-6 py-6 px-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">My Tokens</h3>
          <div className="group flex cursor-pointer items-center">
            <div
              onClick={() => {
                setNewTokenModalOpen(true)
              }}
              className="mr-1 whitespace-nowrap text-right text-sm font-medium text-gray-500 group-hover:text-orange-600"
            >
              Add New Token
            </div>
            <PlusCircleIcon
              className="h-5 w-5 text-gray-500 group-hover:text-orange-600"
              aria-hidden="true"
            />
          </div>
        </div>
        <NewTokenModal open={newTokenModalOpen} setOpen={setNewTokenModalOpen} />
        <TokenModal token={activeToken} open={tokenModalOpen} setOpen={setTokenModalOpen} />
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {tokens.length !== 0 ? (
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Issuer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          My Holdings
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, tokenIdx) => (
                        <tr
                          key={`${token.contract.uri}${token.id}`}
                          className={tokenIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td
                            className={classNames(
                              token.own ? 'font-medium text-gray-700' : 'text-gray-500',
                              'whitespace-nowrap px-6 py-4 text-sm',
                            )}
                          >
                            {token.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.contract.uri}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.type}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.holdings}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div
                              onClick={() => {
                                console.log('Clicked', token.id)
                                setActiveToken(token)
                                setTokenModalOpen(true)
                              }}
                              className="cursor-pointer text-orange-600 hover:text-orange-900"
                            >
                              View
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>It seems you don't have any tokens</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tokens
