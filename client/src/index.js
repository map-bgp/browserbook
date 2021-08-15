import React from 'react'
import ReactDom from 'react-dom'

import {BrowserRouter as Router} from "react-router-dom";

import store from './app/store'
import {Provider} from 'react-redux'

import App from './components/App'

ReactDom.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('app')
)
