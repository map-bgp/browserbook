import { useState } from 'react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { useAppSelector } from '../../app/Hooks'
import { selectTokens } from '../../app/store/slices/TokensSlice'
import TokenModal from '../elements/TokenModal'
import NewTokenModal from '../elements/NewTokenModal'

const Tokens = () => {
  const tokens = useAppSelector(selectTokens)

  const [activeTokenId, setActiveTokenId] = useState<string | null>(null)
  const [newTokenModalOpen, setNewTokenModalOpen] = useState<boolean>(false)
  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false)

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="py-6 px-4 space-y-6 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">My Tokens</h3>
          <div className="group flex items-center cursor-pointer">
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
        <TokenModal tokenId={activeTokenId} open={tokenModalOpen} setOpen={setTokenModalOpen} />
        {tokens.length !== 0 && (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Issuer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          My Holdings
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens &&
                        tokens.map((token, tokenIdx) => (
                          <tr key={token.id} className={tokenIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {token.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {token.contract.uri}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {token.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {token.supply}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div
                                onClick={() => {
                                  setActiveTokenId(token.id)
                                  setTokenModalOpen(true)
                                }}
                                className="text-orange-600 hover:text-orange-900 cursor-pointer"
                              >
                                View
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tokens
