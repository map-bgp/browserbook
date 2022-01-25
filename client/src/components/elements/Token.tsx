import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../store/Hooks'
import { selectTokenByAddress } from '../../store/slices/TokensSlice'

export type TokenProps = {
  uri: string
  address: string
}

const Token = () => {
  const params = useParams()
  const tokenAddress = params.tokenAddress !== undefined ? params.tokenAddress : ''
  const token = useAppSelector((state) => selectTokenByAddress(state, tokenAddress))

  console.log('Token', token)

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8"></div>
      <div className="md:col-span-1 align-top">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Token Admin</h3>
          <p className="mt-1 text-sm text-gray-600">See and administer already created tokens</p>
        </div>
      </div>
      <div className="md:col-span-2">
        {token !== null ? <div>{token.address}</div> : <div>no token</div>}
      </div>
    </div>
  )
}

export default Token
