import React from "react";
import "tailwindcss/tailwind.css"

import {Route, Switch} from "react-router-dom";
import Dashboard from './Dashboard'
import OrderCreation from "./OrderCreation";
import OrderMatch from "./OrderMatching";
import TokenAdministration from "./TokenAdministration";
import OrderValidation from './OrderValidation';


type ContentProps = {
  current: string,
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
          <Route path="/token-administration">
            <TokenAdministration/>
          </Route>
          <Route path="/order-creation">
            <OrderCreation/>
          </Route>
          <Route path="/order-matching">
            <OrderMatch/>
          </Route>
          <Route path="/order-validation">
            <OrderValidation/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default Content
