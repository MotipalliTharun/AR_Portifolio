import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Float } from '@react-three/drei'
import NameCard from '../components/NameCard'
import InfoTile from '../components/InfoTile'
import * as THREE from 'three'

/**
 * AR Scene Component
 * 
 * Contains all 3D objects in the AR space:
 * - NameCard (main panel with name and title)
 * - InfoTiles (Skills, Projects, Contact)
 * - Handles tap-to-place functionality
 * - Manages floating animations
 */

interface ARSceneProps {
  onModelPlaced: () => void
}

const ARScene: React.FC<ARSceneProps> = ({ onModelPlaced }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [isPlaced, setIsPlaced] = useState(false)
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)
  
  // Get XR state
  const xrState = useXR()

  // Handle tap/click to place models - Mobile optimized
  const handlePlace = (event?: any) => {
    if (!isPlaced && groupRef.current) {
      // Get touch/click position for better mobile placement
      let touchX = 0
      let touchY = 0
      
      if (event) {
        // Get touch position for mobile
        if (event.touches && event.touches.length > 0) {
          touchX = (event.touches[0].clientX / window.innerWidth) * 2 - 1
          touchY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1
        } else if (event.clientX) {
          touchX = (event.clientX / window.innerWidth) * 2 - 1
          touchY = -(event.clientY / window.innerHeight) * 2 + 1
        }
      }
      
      // Position the group 1.2-1.8 meters in front (optimal for mobile viewing)
      const distance = 1.5
      const heightOffset = touchY * 0.3 // Adjust height based on tap position
      const sideOffset = touchX * 0.3 // Adjust side position
      
      // In AR mode, place relative to origin with touch offset
      if (xrState.originReferenceSpace) {
        groupRef.current.position.set(sideOffset, heightOffset, -distance)
      } else {
        groupRef.current.position.set(sideOffset, heightOffset, -distance)
      }
      
      setIsPlaced(true)
      onModelPlaced()
      
      // Stop event propagation
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }
    }
  }

  // Note: Controller input handling removed as useXRController is not available
  // Tap-to-place is handled via the invisible mesh click handler below

  // Floating animation for the entire group
  useFrame((state) => {
    if (groupRef.current && isPlaced) {
      // Subtle floating animation
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.0005
      // Subtle rotation
      groupRef.current.rotation.y += 0.001
    }
  })

  // Initial position (will be moved on placement)
  const initialPosition: [number, number, number] = [0, 0, -1.5]

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />

      {/* Main Portfolio Group */}
      <group ref={groupRef} position={initialPosition}>
        {/* Name Card - Main Panel */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <NameCard position={[0, 0.5, 0]} />
        </Float>

        {/* Info Tiles - Arranged around the name card */}
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.25}>
          <InfoTile
            position={[-0.8, 0, 0]}
            label="Skills"
            details={[
              'Java',
              'Spring Boot',
              'React',
              'Node.js',
              'Web3',
              'AI Agents'
            ]}
            color="#6366f1"
            isHovered={hoveredTile === 'skills'}
            onHover={(hovered) => setHoveredTile(hovered ? 'skills' : null)}
            onClick={handlePlace}
          />
        </Float>

        <Float speed={2.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <InfoTile
            position={[0.8, 0, 0]}
            label="Projects"
            details={[
              'Full-Stack Applications',
              'AI-Powered Solutions',
              'Web3 DApps'
            ]}
            color="#8b5cf6"
            isHovered={hoveredTile === 'projects'}
            onHover={(hovered) => setHoveredTile(hovered ? 'projects' : null)}
            onClick={handlePlace}
          />
        </Float>

        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
          <InfoTile
            position={[0, -0.6, 0]}
            label="Contact"
            details={[
              'Email: tharun@example.com',
              'Portfolio: motipallitharun.com'
            ]}
            color="#ec4899"
            isHovered={hoveredTile === 'contact'}
            onHover={(hovered) => setHoveredTile(hovered ? 'contact' : null)}
            onClick={() => {
              window.open('https://motipallitharun.com', '_blank')
            }}
            isContact={true}
          />
        </Float>
      </group>

      {/* Enhanced touch handler for mobile - larger and more responsive */}
      <mesh
        position={[0, 0, -1]}
        onClick={handlePlace}
        onPointerDown={handlePlace}
        visible={false}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visual feedback for placement area (only before placement) */}
      {!isPlaced && (
        <mesh position={[0, 0, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.5, 32]} />
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  )
}

export default ARScene

