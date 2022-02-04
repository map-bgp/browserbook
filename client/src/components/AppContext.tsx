import React from 'react'
import { P2PDB } from '../app/p2p/db'
import { getConfig } from '../app/p2p/Config'
import { Peer } from '../app/p2p/Peer'
import { EtherStore } from '../app/chain/EtherStore'

interface IAppContext {
  ethers: EtherStore
  peer: Peer
  db: P2PDB
}

const peerConfig = getConfig()

const ethers = new EtherStore()
const peer = new Peer(peerConfig)
const db = P2PDB.initialize()

export const AppContext = React.createContext<IAppContext>({
  ethers: ethers,
  peer: peer,
  db: db,
})
