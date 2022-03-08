import { useState } from 'react'
import { Token } from '../../app/Types'
import TokenInputModal from '../elements/TokenInputModal'

export type TokenTableProps = {
  tokens: Array<Token>
}

export const TokenTable = (props: TokenTableProps) => {
  const [activeTokenAddress, setActiveTokenAddress] = useState<string | null>(null)
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      <TokenInputModal
        tokenAddress={activeTokenAddress}
        tokenId={activeTokenId}
        open={modalOpen}
        setOpen={setModalOpen}
      />
      {props.tokens.length !== 0 && (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                        Metadata URI
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Supply
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
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
                        <tr
                          key={`${token.contract.uri}${token.id}`}
                          className={tokenIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.metadataURI}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.supply}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {token.type}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div
                              onClick={() => {
                                setActiveTokenAddress(token.contract.address)
                                setActiveTokenId(token.id)
                                setModalOpen(true)
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
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TokenTable
