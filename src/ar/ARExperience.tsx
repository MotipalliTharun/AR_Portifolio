import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import ARScene from './ARScene'

/**
 * AR Experience Component
 * 
 * Main container for the AR experience. Handles:
 * - WebXR session management
 * - AR button for entering AR mode
 * - Overlay UI instructions
 */
// Create XR store for managing XR state
const xrStore = createXRStore()

const ARExperience: React.FC = () => {
  const [isARSessionActive, setIsARSessionActive] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [modelPlaced, setModelPlaced] = useState(false)

  const handleModelPlaced = () => {
    setModelPlaced(true)
  }

  const handleEnterAR = async () => {
    if (!navigator.xr) {
      alert('WebXR is not supported on this device')
      return
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking'],
      })
      
      setIsARSessionActive(true)
      setShowInstructions(false)
      
      session.addEventListener('end', () => {
        setIsARSessionActive(false)
        setModelPlaced(false)
      })
    } catch (error) {
      console.error('Failed to start AR session:', error)
      alert('Failed to start AR. Please ensure you are on a supported device with HTTPS.')
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* AR Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <XR store={xrStore}>
          <ARScene onModelPlaced={handleModelPlaced} />
        </XR>
      </Canvas>

      {/* AR Entry Button */}
      {!isARSessionActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="text-center px-4">
            <button
              onClick={handleEnterAR}
              className="px-8 py-4 bg-gradient-to-r from-ar-primary to-ar-secondary text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Enter AR Experience
            </button>
            <p className="mt-4 text-gray-400 text-sm">
              Point your device at a flat surface
            </p>
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      {isARSessionActive && showInstructions && !modelPlaced && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20">
          <div className="bg-black/70 backdrop-blur-md px-6 py-4 rounded-lg border border-ar-primary/50">
            <p className="text-white text-center text-sm">
              👆 Tap to place your portfolio in AR space
            </p>
          </div>
        </div>
      )}

      {/* Model Placed Confirmation */}
      {modelPlaced && (
        <div className="absolute top-4 left-0 right-0 flex justify-center z-20">
          <div className="bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-lg border border-green-500/50">
            <p className="text-green-400 text-center text-xs">
              ✓ Portfolio placed! Look around to explore
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARExperience

