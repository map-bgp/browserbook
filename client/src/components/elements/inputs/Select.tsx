import React, {Fragment} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid'

export type SelectObject = {
  id: number,
  name: string,
}

type SelectProps = {
  label: string,
  range: SelectObject[],
  selected: SelectObject,
  setSelected: React.Dispatch<React.SetStateAction<SelectObject>>,
}

export const Select = (props: SelectProps) => {

  return (
    <div className="flex items-center justify-between w-full">
      <Listbox value={props.selected} onChange={props.setSelected}>
        <label className="block ml-2 text-sm font-medium text-gray-700">{props.label}</label>
        <div className="relative w-1/2 mt-1 ml-4">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left border-b text-gray-500 border-gray-300 border-0 border-b border-transparent bg-gray-50 cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-orange-500 sm:text-sm">
          <span className="block truncate">{props.selected.name}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
          <SelectorIcon
          className="w-5 h-5 text-gray-400"
          aria-hidden="true"
          />
          </span>
        </Listbox.Button>
        <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
      {props.range.map((action, actionIdx) => (
        <Listbox.Option
        key={actionIdx}
        className={({ active }) =>
        `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                            cursor-default select-none relative py-2 pl-10 pr-4`
      }
        value={action}
        >
        {({ selected, active }) => (
        <>
          <span
          className={`${
          selected ? 'font-medium' : 'font-normal'
        } block truncate`}
          >
        {action.name}
          </span>
        {selected ? (
          <span
          className={`${
          active ? 'text-amber-600' : 'text-amber-600'
        }
                                    absolute inset-y-0 left-0 flex items-center pl-3`}
          >
          <CheckIcon className="w-5 h-5" aria-hidden="true" />
        </span>
        ) : null}
      </>
      )}
        </Listbox.Option>
        ))}
        </Listbox.Options>
      </Transition>
      </div>
      </Listbox>
    </div>
  )
}