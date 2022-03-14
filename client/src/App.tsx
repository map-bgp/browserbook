import { Fragment, useContext, useEffect, useState } from 'react'
import { Location, useLocation } from 'react-router-dom'
import { withErrorBoundary } from 'react-error-boundary'
import Lottie from 'lottie-react'
import blocks from './blocks.json'

import { Navigation } from './components/utils/constants'
import { getCurrent } from './components/utils/utils'
import Header from './components/Header'
import Content from './pages/Content'
import { AppContext } from './components/AppContext'
import { useEthers } from './app/Hooks'
import { Dialog, Transition } from '@headlessui/react'

const AppError = () => (
  <>
    <div className="min-h-screen bg-gray-100">
      You must install metamask in order to use this application
    </div>
  </>
)

const App = () => {
  const location: Location = useLocation()
  const { peer, db } = useContext(AppContext)
  const [animating, setAnimating] = useState<boolean>(true)

  // Have to call this somewhere in the app to initialize ethers connection
  // Could write an initialize hook
  useEthers()

  useEffect(() => {
    const setup = async () => {
      await peer.init()
      peer.join()
      db.expireOrders()
    }

    setup()
  }, [])

  useEffect(() => {
    setTimeout(() => setAnimating(false), 1000)
  }, [])

  return (
    <>
      <Transition.Root show={animating} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => {}}>
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-white bg-opacity-100 transition-opacity" />
            </Transition.Child>

            {/* Tricks the browser to center */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block transform transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle">
                <div className="mx-auto h-64 w-64">
                  <Lottie animationData={blocks} loop={true} />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {!animating && (
        <div className="min-h-screen bg-gray-100">
          <Header current={getCurrent(location, Navigation)} />
          <Content current={getCurrent(location, Navigation)} />
        </div>
      )}
    </>
  )
}

const AppBoundary = withErrorBoundary(App, {
  FallbackComponent: AppError,
  onError(error, info) {
    console.log('Error fallback', error, info)
  },
})

export default AppBoundary
