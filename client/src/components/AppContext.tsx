import React from 'react'
import Globals from '../app/Globals'
import { P2PDB } from '../app/p2p/db'
import { Peer } from '../app/p2p/Peer'
import { EtherStore } from '../app/chain/EtherStore'

interface IAppContext {
  ethers: EtherStore
  peer: Peer
  db: P2PDB
}

const ethers = Globals.ethers
const peer = Globals.peer
const db = Globals.db

export const AppContext = React.createContext<IAppContext>({
  ethers: ethers,
  peer: peer,
  db: db,
})
