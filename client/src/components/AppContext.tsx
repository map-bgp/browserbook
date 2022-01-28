import React, { useContext, useReducer } from 'react'
import { P2PDB } from '../p2p/db'
import EventEmitter from 'events'

interface IAppContext {
  db: P2PDB
  eventBus: EventEmitter
}

const db = P2PDB.initialize()
const eventBus = new EventEmitter()

export const AppContext = React.createContext<IAppContext>({ db: db, eventBus: eventBus })
