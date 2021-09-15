import "tailwindcss/tailwind.css"

import React from 'react'
import Ticker from 'react-ticker'

const PriceTicker = () => (
  <div className="bg-white border-t border-b border-gray-200" >
    <Ticker speed={2}>
      {() => (
        <div className="my-2">
          <div className="mx-5 text-xs inline-block">
            ABC - <span className="text-green-500">$1.44</span>
          </div>
          <div className="mx-5 text-xs inline-block">
            XYZ - <span className="text-red-500">$192.13</span>
          </div>
          <div className="mx-5 text-xs inline-block">
            ABC - <span className="text-green-500">$1.44</span>
          </div>
          <div className="mx-5 text-xs inline-block">
            XYZ - <span className="text-red-500">$192.13</span>
          </div>
          <div className="mx-5 text-xs inline-block">
            ABC - <span className="text-green-500">$1.44</span>
          </div>
          <div className="mx-5 text-xs inline-block">
            XYZ - <span className="text-red-500">$192.13</span>
          </div>
        </div>
      )}
    </Ticker>
  </div>
)

export default PriceTicker

