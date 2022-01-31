import { Link, Outlet, useParams } from 'react-router-dom'
import { Token } from '../app/Types'
import { classNames } from './utils/utils'

export type TokenTableProps = {
  wrapperStyle: string
  tokens: Array<Token>
}

export const TokenTable = (props: TokenTableProps) => {
  return (
    <>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
                Issuer URI
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  URI:
                </span>
                <input
                  type="text"
                  name="uri"
                  id="uri"
                  onChange={(event) => {
                    {
                    }
                  }}
                  className={classNames(
                    'focus:border-orange-500 focus:ring-orange-500',
                    'flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:outline-none sm:text-sm border border-l-1 border-gray-300',
                  )}
                  placeholder="Token URI"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end items-center">
          <button
            onClick={() => {}}
            className={
              'block flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            }
          >
            Create
          </button>
        </div>
      </div>
      <div className={classNames(props.wrapperStyle, 'flex flex-col')}>
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
                      URI
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Address
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.tokens &&
                    props.tokens.map((token, tokenIdx) => (
                      <tr key={token.address} className={tokenIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {token.uri}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {token.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`${token.address}`}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TokenTable
