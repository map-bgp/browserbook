import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/Hooks'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { getValidatorSigner, selectSignerData } from '../app/store/slices/ValidatorSlice'
import CreateAndLoadSigner from '../components/order-validation/CreateAndLoadSinger'
import SignerDashboard from '../components/order-validation/SignerDashboard'

type OrderValidationPros = {}

const OrderValidation = (props: OrderValidationPros) => {
  const dispatch = useAppDispatch()

  const { primaryAccount } = useAppSelector(selectAccountData)
  const { signerAddress, encryptedSignerKey, signerBalance } = useAppSelector(selectSignerData)

  useEffect(() => {
    if (!!primaryAccount) {
      dispatch(getValidatorSigner(primaryAccount))
    }
  }, [primaryAccount])

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        <div className="md:col-span-1 align-top">
          <div>
            {!!signerAddress ? (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Order Signing</h3>
                <p className="mt-1 text-sm text-gray-600">Validate orders and earn commission</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create Unique Signer Key</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Simply click the button to the right
                  <br />
                  You will be prompted for two transactions
                </p>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          {!!signerAddress ? (
            <>
              <SignerDashboard
                signerAddress={signerAddress}
                signerBalance={signerBalance !== null ? signerBalance : ''}
                commissionBalance={'0'}
                transactionsPerSecond={'0'}
              />
            </>
          ) : (
            <CreateAndLoadSigner />
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderValidation
