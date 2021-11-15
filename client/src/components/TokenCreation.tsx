import React, {useEffect} from "react";
import "tailwindcss/tailwind.css"
import {useAppDispatch, useAppSelector} from "../store/Hooks";
import {selectEthersActive} from "../store/slices/EthersSlice";
import {AlertMessage} from "./elements/AlertMessage";

type TokenCreationProps = {}

const TokenCreation = (props: TokenCreationProps) => {

  const dispatch = useAppDispatch();
  const ethersStatus = useAppSelector(selectEthersActive)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      {ethersStatus ?
        <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
          <div className="md:col-span-1 align-top">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Token Information</h3>
              <p className="mt-1 text-sm text-gray-600">
                Basic token information.
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <form onSubmit={() => console.log("Submitted")}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Issuer URI
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        URI:
                      </span>
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="focus:ring-orange-500 focus:border-orange-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div> :
        <AlertMessage styles={"mt-8"} message={"You must connect your wallet in order to access this page"} />
      }
    </div>
  )
}

export default TokenCreation
