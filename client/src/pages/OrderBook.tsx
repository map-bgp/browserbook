import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector, useTokenFactoryFilter, useTokenFilter } from '../app/Hooks'
import { Order, OrderType } from '../app/p2p/protocol_buffers/gossip_schema'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { getAllPendingOrders, selectOrdersWithTokenData } from '../app/store/slices/PeerSlice'
import {
  getTokens,
  selectTokenContractAddress,
  selectTokensFromCurrentOrders,
} from '../app/store/slices/TokensSlice'
import { OrderStatus, Token, WithStatus } from '../app/Types'
import { Chart } from '../components/elements/Chart'
import OrderModal from '../components/elements/OrderModal'
import { classNames } from '../components/utils/utils'

const OrderBook = () => {
  const dispatch = useAppDispatch()
  const { primaryAccount } = useAppSelector(selectAccountData)
  const tokenContractAddress = useAppSelector(selectTokenContractAddress)

  const orders = useAppSelector(selectOrdersWithTokenData)
  const orderToTokenMap = useAppSelector(selectTokensFromCurrentOrders)

  const [activeOrder, setActiveOrder] = useState<WithStatus<Order> | null>(null)
  const [activeOrderToken, setActiveOrderToken] = useState<Token | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  // For getting own tokens
  useTokenFactoryFilter(primaryAccount)
  useTokenFilter(primaryAccount, tokenContractAddress)

  useEffect(() => {
    if (primaryAccount) {
      dispatch(getTokens())
    }
  }, [primaryAccount])

  // Filters out own orders
  useEffect(() => {
    if (primaryAccount) {
      dispatch(getAllPendingOrders(primaryAccount))
    }
  }, [primaryAccount])

  return (
    <div className="mx-auto max-w-7xl py-8 px-8">
      <OrderModal
        order={activeOrder}
        orderToken={activeOrderToken}
        open={modalOpen}
        setOpen={setModalOpen}
      />
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {/* <div className="mb-8 flex flex-wrap justify-between overflow-hidden border-b border-gray-200 bg-gray-50 shadow sm:rounded-lg">
              <div className="w-1/2">
                <Chart />
                <div className="text-center">Title</div>
              </div>
              <div className="w-1/2">
                <Chart />
                <div className="text-center">Title</div>
              </div>
              <div className="flex w-full justify-center py-8">Controls</div>
            </div> */}
            {orders.length !== 0 ? (
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Asset
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Limit Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Fill</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 100).map((order, orderIdx) => {
                      const orderToken = orderToTokenMap.get(order.id)
                      return (
                        <tr
                          key={`${order.id}`}
                          className={orderIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td
                            className={classNames(
                              false ? 'font-medium text-gray-700' : 'text-gray-500',
                              'whitespace-nowrap px-6 py-4 text-sm ',
                            )}
                          >
                            {order.tokenName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {order.orderType === OrderType.BUY ? 'Buy' : 'Sell'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            Ξ {order.price}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            Ξ {order.limitPrice}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {order.quantity}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {order.status === OrderStatus.Matched ? (
                              <a
                                title="Order Matched"
                                className="relative ml-5 inline-flex h-3 w-3 rounded-full bg-green-500"
                              ></a>
                            ) : order.status === OrderStatus.Pending ? (
                              <a
                                title="Order Pending"
                                className="relative ml-5 inline-flex h-3 w-3 rounded-full bg-yellow-500"
                              ></a>
                            ) : (
                              <a
                                title="Order Expired/Rejected"
                                className="relative ml-5 inline-flex h-3 w-3 rounded-full bg-red-500"
                              ></a>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            {order.status === OrderStatus.Pending && (
                              <div
                                onClick={() => {
                                  setActiveOrder(order)
                                  setActiveOrderToken(!!orderToken ? orderToken : null)
                                  setModalOpen(true)
                                }}
                                className="cursor-pointer text-orange-600 hover:text-orange-900"
                              >
                                View
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>It seems there are no third-party orders found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
