import { useState, useEffect } from 'react'
import ARExperience from './ar/ARExperience'
import Fallback3DScene from './components/Fallback3DScene'

/**
 * Main App Component
 * 
 * Checks for WebXR support and renders either:
 * - ARExperience (if WebXR AR is supported)
 * - Fallback3DScene (if AR is not supported)
 */
function App() {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for WebXR AR support
    const checkARSupport = async () => {
      if (navigator.xr) {
        try {
          const isSupported = await navigator.xr.isSessionSupported('immersive-ar')
          setIsARSupported(isSupported)
        } catch (error) {
          console.log('WebXR AR not supported:', error)
          setIsARSupported(false)
        }
      } else {
        setIsARSupported(false)
      }
      setIsLoading(false)
    }

    checkARSupport()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ar-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Checking AR support...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {isARSupported ? (
        <ARExperience />
      ) : (
        <Fallback3DScene />
      )}
    </div>
  )
}

export default App

