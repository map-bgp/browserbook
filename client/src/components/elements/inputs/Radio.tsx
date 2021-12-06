import React from 'react'
import {RadioGroup} from '@headlessui/react'
import {classNames} from "../../utils/classNames";

export type RadioObject = {
  id: number;
  value: string;
  display: string;
}

type RadioProps = {
  label: string,
  range: RadioObject[],
  selected: RadioObject,
  setSelected: React.Dispatch<React.SetStateAction<RadioObject>>
}

export const Radio = (props: RadioProps) => {
  return (
    <RadioGroup className="flex items-center justify-between w-full" value={props.selected} onChange={props.setSelected}>
      <RadioGroup.Label className="block ml-2 text-sm font-medium text-gray-700">{props.label}</RadioGroup.Label>
      <div className="w-1/2 block flex items-center justify-between">
        {props.range.map((action, actionIdx) => (
          <RadioGroup.Option className="w-1/2 flex" key={action.id} value={action}>
            {({ checked }) => (
              <RadioGroup.Label
                as="div"
                className={classNames(
                  checked ? 'bg-orange-600 border border-orange-600 text-white' : 'border border-orange-600 bg-white text-orange-600',
                  'w-full block rounded text-sm font-medium px-2 py-2 text-center mx-1 cursor-pointer')}
              >
                {action.display}
              </RadioGroup.Label>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}