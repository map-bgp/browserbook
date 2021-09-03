import React, { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import {classNames} from "../../utils/classNames";

export const Radio = () => {
  let [orderType, setOrderType] = useState('bid')

  return (
    <RadioGroup className="flex items-center justify-between w-full" value={orderType} onChange={setOrderType}>
      <RadioGroup.Label className="block ml-2 text-sm font-medium text-gray-700">Order Type</RadioGroup.Label>
      <div className="w-1/2 block flex items-center justify-between">
        <RadioGroup.Option className="w-1/2 flex" value="bid">
          {({ checked }) => (
            <RadioGroup.Label
              as="div"
              className={classNames(
         checked ? 'bg-orange-600 border border-orange-600 text-white' : 'border border-orange-600 bg-white text-orange-600',
                'w-full block rounded text-sm font-medium px-2 py-2 text-center mx-1 cursor-pointer')}
            >
              Buy
            </RadioGroup.Label>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option className="w-1/2" value="ask">
          {({ checked }) => (
            <RadioGroup.Label
              as="div"
              className={classNames(
                checked ? 'bg-orange-600 border border-orange-600 text-white' : 'border border-orange-600 bg-white text-orange-600',
                'w-full block rounded text-sm font-medium px-2 py-2 text-center mx-1 cursor-pointer')}
            >
              Sell
            </RadioGroup.Label>
          )}
        </RadioGroup.Option>
      </div>
    </RadioGroup>
  )
}