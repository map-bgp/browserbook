import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'
import { Token } from '../../app/Types'
import { classNames } from '../utils/utils'

type TokenSelectProps = {
  tokens: Array<Token>
  selected: Token
  setSelected: React.Dispatch<React.SetStateAction<Token>>
}

const TokenSelect = (props: TokenSelectProps) => {
  return (
    <Listbox value={props.selected} onChange={props.setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">Select Token</Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button
              className={classNames(
                props.tokens.length !== 0
                  ? 'focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                  : '',
                'relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm',
              )}
            >
              <>
                <div className="flex items-center">
                  <span
                    className={classNames(
                      props.selected !== undefined && props.selected.own === true
                        ? 'bg-green-400'
                        : 'bg-gray-200',
                      'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                    )}
                  />
                  <span className="ml-3 block truncate">
                    {props.selected !== undefined ? props.selected.name : 'Select a token'}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </>
            </Listbox.Button>

            {props.tokens.length !== 0 && (
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {props.tokens.map((token) => (
                    <Listbox.Option
                      key={token.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-orange-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value={token}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                token.own === true ? 'bg-green-400' : 'bg-gray-200',
                                'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'ml-3 block truncate',
                              )}
                            >
                              {token.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-orange-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            )}
          </div>
        </>
      )}
    </Listbox>
  )
}

export default TokenSelect
