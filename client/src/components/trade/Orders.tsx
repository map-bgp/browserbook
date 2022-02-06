import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/Hooks'
import { Order, OrderType } from '../../app/p2p/protocol_buffers/gossip_schema'
import { selectAccountData } from '../../app/store/slices/EthersSlice'
import { getOwnOrders, selectOrders } from '../../app/store/slices/PeerSlice'
import { selectTokensFromCurrentOrders } from '../../app/store/slices/TokensSlice'
import { OrderStatus, Token } from '../../app/Types'
import OrderModal from '../elements/OrderModal'
import { classNames } from '../utils/utils'

export const MyOrders = () => {
  const dispatch = useAppDispatch()
  const { primaryAccount } = useAppSelector(selectAccountData)
  const orders = useAppSelector(selectOrders)
  const orderToTokenMap = useAppSelector(selectTokensFromCurrentOrders)

  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const [activeOrderToken, setActiveOrderToken] = useState<Token | null>(null)
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!!primaryAccount) {
      dispatch(getOwnOrders(primaryAccount))
    }
  }, [primaryAccount])

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="py-6 px-4 space-y-6 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">My Orders</h3>
        </div>
        <OrderModal
          order={activeOrder}
          orderToken={activeOrderToken}
          open={orderModalOpen}
          setOpen={setOrderModalOpen}
        />
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              {orders.length !== 0 ? (
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Asset
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Limit Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                                orderToken?.own ? 'text-gray-700 font-medium' : 'text-gray-500',
                                'px-6 py-4 whitespace-nowrap text-sm ',
                              )}
                            >
                              {orderToken?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.orderType === OrderType.BUY ? 'Buy' : 'Sell'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Ξ {order.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Ξ {order.limitPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.status === OrderStatus.Matched ? (
                                <a
                                  title="Order Matched"
                                  className="ml-5 relative inline-flex rounded-full h-3 w-3 bg-green-500"
                                ></a>
                              ) : order.status === OrderStatus.Pending ? (
                                <a
                                  title="Order Pending"
                                  className="ml-5 relative inline-flex rounded-full h-3 w-3 bg-yellow-500"
                                ></a>
                              ) : (
                                <a
                                  title="Order Expired"
                                  className="ml-5 relative inline-flex rounded-full h-3 w-3 bg-red-500"
                                ></a>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div
                                onClick={() => {
                                  setActiveOrder(order)
                                  setActiveOrderToken(!!orderToken ? orderToken : null)
                                  setOrderModalOpen(true)
                                }}
                                className="text-orange-600 hover:text-orange-900 cursor-pointer"
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
