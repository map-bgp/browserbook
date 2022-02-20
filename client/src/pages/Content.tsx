import { Routes, Route, Outlet } from 'react-router-dom'

import { NavPage } from '../components/utils/constants'
import Dashboard from './Dashboard'
import TokenAdministration from './TokenAdministration'
import OrderBook from './OrderBook'
import ControlPanel from './ControlPanel'
import TradeForm from '../components/trade/TradeForm'
import TransferForm from '../components/trade/TransferForm'
import TradeOutlet from './TradeOutlet'
import Tokens from '../components/trade/Tokens'
import Orders from '../components/trade/Orders'
import OrderValidation from './OrderValidation'
import Balance from '../components/trade/Balance'

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
          <Route path="/" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="token-administration" element={<Outlet />}>
            <Route index element={<TokenAdministration />} />
          </Route>
          <Route path="trade" element={<TradeOutlet />}>
            <Route index element={<TradeForm />} />
            <Route path="trade" element={<TradeForm />} />
            <Route path="balance" element={<Balance />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transfer" element={<TransferForm />} />
            <Route path="tokens" element={<Tokens />} />
            <Route path="dividends" element={<></>} />
          </Route>
          <Route path="order-book" element={<OrderBook />} />
          <Route path="order-validation" element={<OrderValidation />} />
          <Route path="control-panel" element={<ControlPanel />} />
        </Routes>
      </main>
    </div>
  )
}

export default Content
