import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { Order, OrderType } from '../../app/p2p/protocol_buffers/gossip_schema'
import { selectAccountData } from '../../app/store/slices/EthersSlice'
import { getOwnOrders, selectOrders } from '../../app/store/slices/PeerSlice'
import { selectTokensFromCurrentOrders } from '../../app/store/slices/TokensSlice'
import { OrderStatus, Token, WithStatus } from '../../app/Types'
import OrderModal from '../elements/OrderModal'
import { classNames } from '../utils/utils'

export const MyOrders = () => {
  const dispatch = useAppDispatch()
  const { primaryAccount } = useAppSelector(selectAccountData)

  const orders = useAppSelector(selectOrders)
  const orderToTokenMap = useAppSelector(selectTokensFromCurrentOrders)

  const [activeOrder, setActiveOrder] = useState<WithStatus<Order> | null>(null)
  const [activeOrderToken, setActiveOrderToken] = useState<Token | null>(null)
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!!primaryAccount) {
      dispatch(getOwnOrders(primaryAccount))
    }
  }, [primaryAccount])

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="space-y-6 py-6 px-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">My Orders</h3>
        </div>
        <OrderModal
          order={activeOrder}
          orderToken={activeOrderToken}
          open={orderModalOpen}
          setOpen={setOrderModalOpen}
        />
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, orderIdx) => {
                        const orderToken = orderToTokenMap.get(order.id)
                        return (
                          <tr
                            key={`${order.id}`}
                            className={orderIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td
                              className={classNames(
                                orderToken?.own ? 'font-medium text-gray-700' : 'text-gray-500',
                                'whitespace-nowrap px-6 py-4 text-sm ',
                              )}
                            >
                              {orderToken?.name}
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
                              <div
                                onClick={() => {
                                  setActiveOrder(order)
                                  setActiveOrderToken(!!orderToken ? orderToken : null)
                                  setOrderModalOpen(true)
                                }}
                                className="cursor-pointer text-orange-600 hover:text-orange-900"
                              >
                                View
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>It seems you don't have any orders</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyOrders
