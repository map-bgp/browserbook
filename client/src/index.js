import React from "react";
import ReactDom from "react-dom";

import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./store/Store";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";
import App from "./components/App";
import { StateProvider } from "./components/context/Store";
import {EthersContext} from "./components/EthersContext";
import {EtherStore} from "./blockchain";

function getLibrary(provider) {
  const library = new providers.Web3Provider(provider);
  return library;
}

ReactDom.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <StateProvider>
          <EthersContext.Provider value={new EtherStore()}>
          {/*<Web3ReactProvider getLibrary={getLibrary}>*/}
            <App />
          {/*</Web3ReactProvider>*/}
          </EthersContext.Provider>
        </StateProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
