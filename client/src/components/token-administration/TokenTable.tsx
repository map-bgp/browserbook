import { useState } from 'react'
import { Token } from '../../app/Types'
import Modal from '../elements/TokenModal'

export type TokenTableProps = {
  tokens: Array<Token>
}

export const TokenTable = (props: TokenTableProps) => {
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      <Modal tokenId={activeTokenId} open={modalOpen} setOpen={setModalOpen} />
      {props.tokens.length !== 0 && (
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
                        Metadata URI
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Supply
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.tokens &&
                      props.tokens.map((token, tokenIdx) => (
                        <tr key={token.id} className={tokenIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {token.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {token.metadataURI}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {token.supply}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {token.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div
                              onClick={() => {
                                setActiveTokenId(token.id)
                                setModalOpen(true)
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
    </>
  )
}

export default TokenTable
