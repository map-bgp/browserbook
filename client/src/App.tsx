import React, { useEffect } from 'react'
import { Location, useLocation } from 'react-router-dom'

import { getConfig } from './p2p/Config'

import { Navigation } from './components/utils/constants'
import { getCurrent } from './components/utils/utils'
import Header from './components/Header'
import Content from './components/Content'
// import { Peer } from './p2p/PeerNode'

const App = () => {
  const location: Location = useLocation()

  useEffect(() => {
    const setup = async () => {
      const config = getConfig()
      // const peer = await Peer.init(config)
      // await peer.start()
    }

    setup()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header current={getCurrent(location, Navigation)} />
      <Content current={getCurrent(location, Navigation)} />
    </div>
  )
}

export default App
