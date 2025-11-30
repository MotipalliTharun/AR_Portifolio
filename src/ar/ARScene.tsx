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
  modelPlaced: boolean
}

const ARScene: React.FC<ARSceneProps> = ({ onModelPlaced, modelPlaced }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [isPlaced, setIsPlaced] = useState(false)
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)
  
  // Get XR player for positioning
  const { player } = useXR()

  // Handle tap/click to place models
  const handlePlace = (event?: any) => {
    if (!isPlaced && groupRef.current) {
      // Position the group 1.5 meters in front of the camera
      // In AR, we'll place it at a fixed position relative to the origin
      const distance = 1.5
      const height = 0 // Eye level
      
      if (player) {
        // Get forward direction from player
        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyQuaternion(player.rotation)
        
        const position = new THREE.Vector3()
        position.copy(player.position)
        position.add(forward.multiplyScalar(distance))
        position.y = player.position.y + height
        
        groupRef.current.position.copy(position)
        
        // Make it face the player
        groupRef.current.lookAt(player.position)
      } else {
        // Fallback: place at fixed position
        groupRef.current.position.set(0, 0, -distance)
      }
      
      setIsPlaced(true)
      onModelPlaced()
      
      // Stop event propagation
      if (event) {
        event.stopPropagation()
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

      {/* Click handler for mobile/web tap - invisible plane */}
      <mesh
        position={[0, 0, -1]}
        onClick={handlePlace}
        onPointerDown={handlePlace}
        visible={false}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  )
}

export default ARScene

