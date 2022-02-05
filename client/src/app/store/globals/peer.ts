import { Peer } from '../../p2p/Peer'
import { getConfig } from '../../p2p/Config'

const peerConfig = getConfig()
export const peer = new Peer(peerConfig)
