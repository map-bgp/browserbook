import React, {useEffect, useState} from "react";
import "tailwindcss/tailwind.css"

import {useAppDispatch, useAppSelector, useEthers} from "../store/Hooks";

function Matcher() {
  const dispatch = useAppDispatch();

  const beingMatcher = () => {
    setTimeout(()=>{console.error('I hit the base')},1000)
    if (window.Worker) {
      const myWorker = new Worker(new URL('../oms/matching.ts', import.meta.url));

      myWorker.postMessage(10);
    
      myWorker.onmessage = function(e) {
        console.log(`Message received from worker ${e.data}`);
      }
    } else {
      console.log('Your browser doesn\'t support web workers.');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="w-full bg-white border-gray-200 rounded px-4 py-2"></div>
      <button
              type="submit"
              className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 "
              onClick={() => beingMatcher()}
            >
              BeMatcher
            </button>
    </div>
  );
}

export default Matcher;