import React from "react"
import { EtherStore } from "../blockchain"

const EthersContext = React.createContext(new EtherStore())
export { EthersContext }
