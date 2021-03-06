import { useAppSelector, useTokenFactoryFilter, useTokenFilter } from '../app/Hooks'
import {
  selectTokenContract,
  selectTokenContractAddress,
  selectOwnTokens,
} from '../app/store/slices/TokensSlice'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import TokenInput from '../components/token-administration/TokenInput'
import TokenTable from '../components/token-administration/TokenTable'
import ContractInput from '../components/token-administration/ContractInput'
import ContractStats from '../components/token-administration/ContractStats'

type TokenAdministrationProps = {}

const TokenAdministration = (props: TokenAdministrationProps) => {
  const { primaryAccount } = useAppSelector(selectAccountData)

  const tokenContract = useAppSelector(selectTokenContract)
  const tokenContractAddress = useAppSelector(selectTokenContractAddress)
  const tokens = useAppSelector(selectOwnTokens)

  useTokenFactoryFilter(primaryAccount)
  useTokenFilter(primaryAccount, tokenContractAddress)

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-x-8 gap-y-8 px-4 py-8 sm:grid sm:flex-none sm:grid-cols-2 sm:px-0 md:grid-cols-3">
        <div className="align-top md:col-span-1">
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
        <div className="md:col-span-2">
          {tokenContract === null ? <ContractInput /> : <ContractStats />}
        </div>
        <div className="align-top md:col-span-1">
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
        <div className="align-top md:col-span-1">
          <div>
            {tokenContract === null || tokens.length === 0 ? (
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
