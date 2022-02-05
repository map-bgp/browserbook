import { Peer } from './p2p/Peer'
import { EtherStore } from './chain/EtherStore'
import { getConfig } from './p2p/Config'
import { P2PDB } from './p2p/db'

const peerConfig = getConfig()

const ethers = new EtherStore()
const peer = new Peer(peerConfig)
const db = P2PDB.initialize()

export default {
  ethers: ethers,
  peer: peer,
  db: db,
}
