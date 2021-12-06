import React from "react";
import ReactDom from "react-dom";

import {BrowserRouter as Router} from "react-router-dom";
import {store} from "../store/Store";
import {Provider} from "react-redux";
import App from "../components/App";
import {StateProvider} from "../components/context/Store";

ReactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <StateProvider>
          <App />
        </StateProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
