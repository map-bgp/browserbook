import React from 'react'
import ReactDom from 'react-dom'

import {BrowserRouter as Router} from "react-router-dom";

import {store} from './store/Store'
import {Provider} from 'react-redux'

import App from './components/App'
import {StateProvider} from "./components/context/Store";
import createLibp2p from './p2p/p2pnode'

ReactDom.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <StateProvider>
                    <App createLibp2p={createLibp2p} />
                </StateProvider>
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('app')
)
