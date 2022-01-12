import React from "react";
import "tailwindcss/tailwind.css"

import {Routes, Route} from "react-router-dom";
// import Dashboard from './Dashboard'
// import OrderCreation from "./OrderCreation";
// import OrderMatch from "./OrderMatching";
// import TokenAdministration from "./TokenAdministration";
// import OrderValidation from './OrderValidation';
import {NavPage} from "./utils/constants";
import Dashboard from "./Dashboard";


type ContentProps = {
  current: NavPage,
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
          <Route path="/" element={<Dashboard />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="token-administration" element={<Dashboard />} />
            <Route path="order-creation" element={<Dashboard />} />
            <Route path="order-matching" element={<Dashboard />} />
            <Route path="order-validation" element={<Dashboard />} />
          </Route>
        </Routes>
        {/*<Routes>*/}
          {/*<Route path={"/"} element={<Dashboard />}>*/}

          {/*</Route>*/}
          {/*<Route path="/token-administration">*/}
          {/*  <TokenAdministration/>*/}
          {/*</Route>*/}
          {/*<Route path="/order-creation">*/}
          {/*  <OrderCreation/>*/}
          {/*</Route>*/}
          {/*<Route path="/order-matching">*/}
          {/*  <OrderMatch/>*/}
          {/*</Route>*/}
          {/*<Route path="/order-validation">*/}
          {/*  <OrderValidation/>*/}
          {/*</Route>*/}
        {/*</Routes>*/}
      </main>
    </div>
  );
}

export default Content
