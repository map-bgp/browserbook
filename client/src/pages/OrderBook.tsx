import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/Hooks'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import { getAllOrders } from '../app/store/slices/PeerSlice'

const OrderBook = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllOrders())
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div>You're at the order book chief</div>
    </div>
  )
}

export default OrderBook
