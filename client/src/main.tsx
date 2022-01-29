import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import { store } from './store/Store'

import './index.css'
import AppBoundary from './App'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <AppBoundary />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)
