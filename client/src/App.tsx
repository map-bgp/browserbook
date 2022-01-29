import React, { useContext, useEffect } from 'react'
import { Location, useLocation } from 'react-router-dom'
import { withErrorBoundary } from 'react-error-boundary'

import { Navigation } from './components/utils/constants'
import { getCurrent } from './components/utils/utils'
import Header from './components/Header'
import Content from './components/Content'
import { AppContext } from './components/AppContext'

const AppError = () => (
  <>
    <div className="min-h-screen bg-gray-100">
      You must install metamask in order to use this application
    </div>
  </>
)

const App = () => {
  const location: Location = useLocation()
  const { peer } = useContext(AppContext)

  useEffect(() => {
    const setup = async () => {
      await peer.init()
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

const AppBoundary = withErrorBoundary(App, {
  FallbackComponent: AppError,
  onError(error, info) {
    console.log('Error fallback', error, info)
  },
})

export default AppBoundary
