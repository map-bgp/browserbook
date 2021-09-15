import React from "react";
import "tailwindcss/tailwind.css"

import {Route, Switch} from "react-router-dom";
import EventEmitter from 'events'

import Dashboard from './Dashboard'
import Market from './Market'
import Portfolio from './Portfolio'
import Assets from './Assets'
import HowItWorks from './HowItWorks'
import OrderSub from './OrderSubscription'
import OrderCreate from "./OrderCreate";
import { Libp2p } from "libp2p-interfaces/src/pubsub";

type ContentProps = {
  current: string,
  libp2p: Libp2p,
  eventbus: EventEmitter
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
        <Switch>
          <Route exact path={["", "/", "/dashboard"]}>
            <Dashboard/>
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
          <Route path="/order-creation">
            <OrderCreate libp2p={props.libp2p} eventBus={props.eventbus}/>
          </Route>
          <Route path="/order-subscription">
            <OrderSub libp2p={props.libp2p} eventBus={props.eventbus}/>  
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
