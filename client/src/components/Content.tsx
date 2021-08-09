import React from "react";
import "tailwindcss/tailwind.css"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {
  Mesh,
} from '@0x/mesh-browser-lite';

import Dashboard from './Dashboard'
import Market from './Market'
import Portfolio from './Portfolio'
import Assets from './Assets'
import HowItWorks from './HowItWorks'

type ContentProps = {
  title: string,
  mesh: Mesh
}

const Content = (props: ContentProps) => {
  return(
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">{props.title}</h1>
        </div>
      </header>
      <main>
        <Switch>
          <Route exact path={["", "/", "/dashboard"]}>
            <Dashboard mesh={props.mesh} />
          </Route>
          <Route path="/market">
            <Market />
          </Route>
          <Route path="/portfolio">
            <Portfolio />
          </Route>
          <Route path="/assets">
            <Assets />
          </Route>
          <Route path={"/how-it-works"}>
            <HowItWorks />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default Content
