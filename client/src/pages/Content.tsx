import { Routes, Route, Outlet } from 'react-router-dom'

import { NavPage } from '../components/utils/constants'
import Dashboard from '../components/Dashboard'
import TokenAdministration from './TokenAdministration'
import OrderCreation from '../components/OrderCreation'
import OrderBook from '../components/OrderMatching'
import ControlPanel from '../components/ControlPanel'
import Token from '../components/elements/Token'

type ContentProps = {
  current: NavPage
}

const Content = (props: ContentProps) => {
  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <Route path="trade" element={<OrderCreation />} />
          <Route path="order-book" element={<OrderBook />} />
          <Route path="control-panel" element={<ControlPanel />} />
        </Routes>
      </main>
    </div>
  )
}

export default Content
