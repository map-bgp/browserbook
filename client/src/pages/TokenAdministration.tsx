import { useAppDispatch, useAppSelector, useTokenFactoryFilter, useTokenIdFilter } from '../app/Hooks'
import {
  selectTokenContract,
  selectTokenIds,
  selectTokens,
  getTokens,
} from '../app/store/slices/TokensSlice'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import TokenInput from '../components/TokenInput'
import TokenTable from '../components/TokenTable'
import EntityInput from '../components/EntityInput'
import EntityStats from '../components/EntityStats'
import { useEffect } from 'react'

type TokenAdministrationProps = {}

const TokenAdministration = (props: TokenAdministrationProps) => {
  const dispatch = useAppDispatch()
  const { primaryAccount } = useAppSelector(selectAccountData)

  const tokenContract = useAppSelector(selectTokenContract)
  const tokenIds = useAppSelector(selectTokenIds)
  const tokens = useAppSelector(selectTokens)

  useTokenFactoryFilter(primaryAccount)
  useTokenIdFilter(primaryAccount, tokenContract?.address)

  useEffect(() => {
    dispatch(getTokens())
  }, [tokenIds])

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <div>
            {tokenContract === null ? (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create Unique Identifier</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Any string is allowed but we suggest <br /> an ENS name
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">{tokenContract.uri}</h3>
                <p className="mt-1 text-sm text-gray-600">See your general entity information here</p>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-2">{tokenContract === null ? <EntityInput /> : <EntityStats />}</div>
        <div className="md:col-span-1 align-top">
          <div>
            {tokenContract === null ? (
              <></>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create a New Token</h3>
                <p className="mt-1 text-sm text-gray-600">Tokens may be fungible or non-fungible</p>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          {tokenContract === null ? <></> : <TokenInput tokenContract={tokenContract} />}
        </div>
        <div className="md:col-span-1 align-top">
          <div>
            {tokenContract === null && tokens.length === 0 ? (
              <></>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Administer Your Tokens</h3>
                <p className="mt-1 text-sm text-gray-600">Get an overview and issue dividends</p>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          {tokenContract === null ? <></> : <TokenTable tokens={tokens} />}
        </div>
      </div>
    </div>
  )
}

export default TokenAdministration
