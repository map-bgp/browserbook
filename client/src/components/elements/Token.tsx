import React from "react";
import {useAppDispatch, useEthers} from "../../store/Hooks";
import {ContractNames} from "../../blockchain/ContractNames";
import {classNames} from "../utils/classNames";
import {AlertMessage} from "./AlertMessage";

import {Link, useParams} from "react-router-dom";

type TokenProps = {}

export const Token = (props: TokenProps) => {
  // @ts-ignore
  let { uri } = useParams();
  
  const dispatch = useAppDispatch();
  const [ethers, connected, address, contract, resolved] = useEthers(ContractNames.TokenFactory);

  return (
    <div>
       {connected ?
         <div className="px-4 pt-8 pb-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
         <Link to="/token-administration" className="col-span-3 text-orange-600 hover:text-orange-700 absolute top-20 left-28 ml-2 mt-8">&#8592; Back to overview</Link>
         <div className="md:col-span-1 align-top">
           <div>
             <h3 className="text-lg font-medium leading-6 text-gray-900">{uri}</h3>
             <p className="mt-1 text-sm text-gray-600">
               All token options
             </p>
           </div>
         </div>
         <div className="md:col-span-2">
             <div className="shadow sm:rounded-md sm:overflow-hidden">
               <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                 <div className="grid grid-cols-3 gap-6">
                   <div className="col-span-3 sm:col-span-2">
                     <div className="block text-sm font-medium text-gray-700 my-2">
                       Issuer URI
                     </div>
                     <div className="mt-1 flex rounded-md shadow-sm">
                         <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                           URI:
                         </span>
                       <div className={classNames("focus:ring-orange-500 focus:border-orange-500 border-gray-300","flex-1 block w-full rounded-none rounded-r-md sm:text-sm")}>
                         Hello
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                 <button
                   type="submit"
                   className={"block ml-auto mr-0 flex items-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"}
                 >
                   Create Dividend
                 </button>
               </div>
             </div>
         </div>
         <div className="md:col-span-1 align-top">
           <div>
             <h3 className="text-lg font-medium leading-6 text-gray-900">Token Actions</h3>
             <p className="mt-1 text-sm text-gray-600">
               Perform actions and pay dividends to token holders
             </p>
           </div>
         </div>
         <div className="md:col-span-2">
           Table
         </div>
       </div> : 
         <AlertMessage styles={"mt-8"} message={"You must connect your wallet in order to access this page"} />
      }
    </div>
  )
}

 