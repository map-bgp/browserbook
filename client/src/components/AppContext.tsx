import React from 'react'
import { P2PDB } from '../app/p2p/db'
import { Peer } from '../app/p2p/Peer'
import { EtherStore } from '../app/chain/EtherStore'

import { ethers as ethersStore } from '../app/store/globals/ethers'
import { peer as peerStore } from '../app/store/globals/peer'
import { db as dbStore } from '../app/store/globals/db'

interface IAppContext {
  ethers: EtherStore
  peer: Peer
  db: P2PDB
}

const ethers = ethersStore
const peer = peerStore
const db = dbStore

export const AppContext = React.createContext<IAppContext>({
  ethers: ethers,
  peer: peer,
  db: db,
})
