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
    <div className="relative w-full h-full" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      {/* AR Canvas - Optimized for mobile performance */}
      <Canvas
        camera={{ position: [0, 1.6, 0], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        performance={{ min: 0.5 }}
        style={{ width: '100%', height: '100%' }}
      >
        <XR store={xrStore}>
          <ARScene onModelPlaced={handleModelPlaced} />
        </XR>
      </Canvas>

      {/* AR Entry Button - Mobile optimized */}
      {!isARSessionActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-sm z-10">
          <div className="text-center px-6 max-w-sm">
            <div className="mb-6">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-2xl font-bold text-white mb-2">AR Portfolio</h2>
              <p className="text-gray-300 text-sm">Experience my work in Augmented Reality</p>
            </div>
            <button
              onClick={handleEnterAR}
              className="w-full px-8 py-4 bg-gradient-to-r from-ar-primary via-ar-secondary to-ar-accent text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-ar-primary/50 transition-all duration-300 transform active:scale-95 touch-manipulation"
            >
              🚀 Enter AR Experience
            </button>
            <p className="mt-4 text-gray-400 text-xs">
              📍 Point your device at a flat surface
            </p>
            <p className="mt-2 text-gray-500 text-xs">
              Works best on iOS 15+ or Android with ARCore
            </p>
          </div>
        </div>
      )}

      {/* Instructions Overlay - Mobile optimized */}
      {isARSessionActive && showInstructions && !modelPlaced && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-20 px-4">
          <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-xl border-2 border-ar-primary/60 shadow-2xl max-w-sm">
            <p className="text-white text-center text-base font-medium">
              👆 Tap anywhere to place your portfolio
            </p>
            <p className="text-gray-400 text-center text-xs mt-2">
              Move your device to explore in AR
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

