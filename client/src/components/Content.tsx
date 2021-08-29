import React, {useContext} from "react";
import "tailwindcss/tailwind.css"

import {Route, Switch} from "react-router-dom";

import {Mesh,} from '@0x/mesh-browser-lite';

import Dashboard from './Dashboard'
import Market from './Market'
import Portfolio from './Portfolio'
import Assets from './Assets'
import HowItWorks from './HowItWorks'
import {useAppContext} from "./store/Store";

type ContentProps = {
  current: string,
}

const Content = (props: ContentProps) => {
  const { state, dispatch } = useAppContext()

  const getPeerID = (state) => {
    if (state.peerId !== null) {
      return state.peerId
    } else {
      return "Pending"
    }
  }

  // console.log("Is the node null")
  // console.log(state.node === null)
  //
  // if (state.node != null) {
  //   console.log("Here is the peer ID")
  //   console.log(state.node.peerId.toB58String())
  // }

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">{props.current} - {getPeerID(state)}</h1>
        </div>
      </header>
      <main>
        <Switch>
          <Route exact path={["", "/", "/dashboard"]}>
            <Dashboard />
          </Route>
          <Route path="/market">
            <Market/>
          </Route>
          <Route path="/portfolio">
            <Portfolio/>
          </Route>
          <Route path="/assets">
            <Assets/>
          </Route>
          <Route path={"/how-it-works"}>
            <HowItWorks/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default Content
