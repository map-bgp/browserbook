import { useAppSelector } from '../../app/Hooks'
import {
  selectNumberFungibleTokens,
  selectNumberNonFungibleTokens,
} from '../../app/store/slices/TokensSlice'

const ContractStats = () => {
  const numberFungibleTokens = useAppSelector(selectNumberFungibleTokens)
  const numberNonFungibleTokens = useAppSelector(selectNumberNonFungibleTokens)

  return (
    <div>
      <dl className="grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
        <div key="total-fungible" className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Fungible Tokens</dt>
          <dd className="mt-1 text-3xl font-medium text-gray-900">{numberFungibleTokens}</dd>
        </div>
        <div key="total-non-fungible" className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Non-Fungible Tokens</dt>
          <dd className="mt-1 text-3xl font-medium text-gray-900">{numberNonFungibleTokens}</dd>
        </div>
        <div key="total-dividend-load" className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Dividend Load</dt>
          <dd className="mt-1 text-3xl font-medium text-gray-900">{0}</dd>
        </div>
      </dl>
    </div>
  )
}

export default ContractStats
