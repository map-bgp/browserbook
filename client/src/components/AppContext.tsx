import React, { useContext, useReducer } from 'react'
import { P2PDB } from '../p2p/db'
import EventEmitter from 'events'
import { getConfig } from '../p2p/Config'
import { Peer } from '../p2p/Peer'

interface IAppContext {
  peer: Peer
  db: P2PDB
  eventBus: EventEmitter
}

const peerConfig = getConfig()

const peer = new Peer(peerConfig)
const db = P2PDB.initialize()
const eventBus = new EventEmitter()

export const AppContext = React.createContext<IAppContext>({ peer: peer, db: db, eventBus: eventBus })
