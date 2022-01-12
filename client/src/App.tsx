import React from "react";
import {Location, useLocation} from "react-router-dom";

import {Navigation} from "./components/utils/constants";
import {getCurrent} from "./components/utils/utils";

import Header from "./components/Header";
import Content from "./components/Content";

const App = () => {
  const location: Location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        current={getCurrent(location, Navigation)}
      />
      <Content current={getCurrent(location, Navigation)}/>
    </div>
  )
}

export default App


