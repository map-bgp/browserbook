import React from "react"
import {classNames} from "../utils/classNames";
import {Link, useRouteMatch} from "react-router-dom";

type TokenTableProps = {
  tokens: any[]
  styles?: string
}

const TokenTable = (props: TokenTableProps) => {
  let { path, url } = useRouteMatch();

  return (
    <div className={classNames(props.styles, "flex flex-col")}>
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
              {props.tokens && props.tokens.map((token, tokenIdx) => (
                <tr key={token.address} className={tokenIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{token.uri}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{token.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`${url}/${token.uri}`} className="text-orange-600 hover:text-orange-900">
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
  )}

export default TokenTable