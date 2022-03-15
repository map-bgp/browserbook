import { Routes, Route, Outlet } from 'react-router-dom'

import { NavKey, NavPage } from '../components/utils/constants'
import Dashboard from './Dashboard'
import TokenAdministration from './TokenAdministration'
import OrderBook from './OrderBook'
import TradeForm from '../components/trade/TradeForm'
import TransferForm from '../components/trade/TransferForm'
import TradeOutlet from './TradeOutlet'
import Tokens from '../components/trade/Tokens'
import Orders from '../components/trade/Orders'
import OrderValidation from './OrderValidation'
import Balance from '../components/trade/Balance'
import HowItWorks from './HowItWorks'

type ContentProps = {
  current: NavPage
}

const Content = (props: ContentProps) => {
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">{props.current}</h1>
        </div>
      </header>
      <main>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path={NavKey.DASHBOARD} element={<Dashboard />} />
          <Route path={NavKey.TOKEN_ADMINISTRATION} element={<Outlet />}>
            <Route index element={<TokenAdministration />} />
          </Route>
          <Route path={NavKey.TRADE} element={<TradeOutlet />}>
            <Route index element={<TradeForm />} />
            <Route path="trade" element={<TradeForm />} />
            <Route path="balance" element={<Balance />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transfer" element={<TransferForm />} />
            <Route path="tokens" element={<Tokens />} />
          </Route>
          <Route path={NavKey.ORDER_BOOK} element={<OrderBook />} />
          <Route path={NavKey.ORDER_VALIDATION} element={<OrderValidation />} />
          <Route path={NavKey.HOW_IT_WORKS} element={<HowItWorks />} />
        </Routes>
      </main>
    </div>
  )
}

export default Content
