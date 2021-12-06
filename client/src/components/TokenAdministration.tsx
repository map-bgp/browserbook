import React, {useContext, useEffect, useState} from "react";
import "tailwindcss/tailwind.css"
import {useAppDispatch, useAppSelector, useEthers} from "../store/Hooks";
import {selectEthersConnected} from "../store/slices/EthersSlice";
import {AlertMessage} from "./elements/AlertMessage";
import {ContractNames} from "../blockchain/ContractNames";
import {EthersContext} from "./EthersContext";
import {addOrder} from "../store/slices/OrderbookSlice";
import {classNames} from "./utils/classNames";
import {XCircleIcon} from "@heroicons/react/solid";
import TokenTable from "./elements/TokenTable";
import {selectTokens, setTokens} from "../store/slices/TokenSlice";

type TokenAdministrationProps = {}

const TokenAdministration = (props: TokenAdministrationProps) => {
  const dispatch = useAppDispatch();

  const tokens = useAppSelector(selectTokens)
  const [ethers, connected, address, contract, resolved] = useEthers("TokenFactory");

  const queryAndDispatchTokens = async (contract) => {
    var res: any[] = []

    const ownerFilter = contract.filters.TokenOwnerNotice(address, null);
    await contract.queryFilter(ownerFilter).then(async query => {
      query.forEach(event => res.push(
        {
          // @ts-ignore
          "address": event.args[1]
        }
      ))

      for (const token of res) {
        var uriFilter = contract.filters.TokenCreated(null, token.address);
        var query = await contract.queryFilter(uriFilter)

        query.forEach(event => {
          // @ts-ignore
          token.uri = event.args[0];
        })
      }

      dispatch(setTokens(res))
    });
  }

  const logNewEthersHook = () => {
    console.log("New Ethers", ethers)
    console.log("New Address", address)
    console.log("New Contract", contract)
    console.log("New Resolved", resolved)
  }

  useEffect(() => {
    const setup = async () => {
      if (address !== null && contract !== null) {
        await queryAndDispatchTokens(contract).then(() => console.log("Tokens successfully queried"));

        const ownerFilter = contract.filters.TokenOwnerNotice(address, null);
        contract.on(ownerFilter, () => queryAndDispatchTokens(contract));
      }
    }
    setup().then(() => console.log("Contract initialized"))
    logNewEthersHook()
  }, [address, contract])

  const createToken = (uri: string) => {
    if (contract != null) {
      contract.create(uri).then(tx => console.log(tx))
    } else {
      console.log("Contract not initialized yet")
    }
  }

  const [uri, setURI] = useState("");
  const [alert, setAlert] = useState(false)

  const formIsValid = (): boolean => {
    return uri !== ""
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formIsValid()) {
      setAlert(true);
    } else {
      setAlert(false);
      createToken(uri);
    }
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      {connected ?
        <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
          <div className="md:col-span-1 align-top">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">New Token</h3>
              <p className="mt-1 text-sm text-gray-600">
                Create a new token here
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="uri" className="block text-sm font-medium text-gray-700 my-2">
                        Issuer URI
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        URI:
                      </span>
                        <input
                          type="text"
                          name="uri"
                          id="uri"
                          onChange={e => setURI(e.target.value)}
                          className={classNames(alert ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "focus:ring-orange-500 focus:border-orange-500 border-gray-300","flex-1 block w-full rounded-none rounded-r-md sm:text-sm")}
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {alert &&
                <div className="w-full bg-white pl-2 pb-4">
                    <div className="flex mx-4">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-xs font-medium text-red-800">Token URI may not be empty</h3>
                        </div>
                    </div>
                </div>
                }
                <button
                  className={"block ml-auto mr-0 flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"}
                  onClick={() => logNewEthersHook()}
                >
                  Create
                </button>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className={"block ml-auto mr-0 flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"}
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="md:col-span-1 align-top">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Token Admin</h3>
              <p className="mt-1 text-sm text-gray-600">
                See and administer already created tokens
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <TokenTable tokens={tokens} />
          </div>
        </div> :
        <AlertMessage styles={"mt-8"} message={"You must connect your wallet in order to access this page"} />
      }
    </div>
  )
}

export default TokenAdministration
