import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * InfoTile Component
 * 
 * Small floating tile panels that show:
 * - A label (e.g., "Skills", "Projects", "Contact")
 * - Details on hover/tap (array of strings)
 * 
 * Customize:
 * - label: The main label text
 * - details: Array of detail strings to show
 * - color: The accent color for this tile
 * - isContact: Set to true for the Contact tile to enable link opening
 */

interface InfoTileProps {
  position: [number, number, number]
  label: string
  details: string[]
  color: string
  isHovered?: boolean
  onHover?: (hovered: boolean) => void
  onClick?: () => void
  isContact?: boolean
}

const InfoTile: React.FC<InfoTileProps> = ({
  position,
  label,
  details,
  color,
  isHovered = false,
  onHover,
  onClick,
  isContact = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [localHovered, setLocalHovered] = useState(false)

  const hovered = isHovered || localHovered

  // Subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
    }
  })

  const handlePointerEnter = () => {
    setLocalHovered(true)
    onHover?.(true)
  }

  const handlePointerLeave = () => {
    setLocalHovered(false)
    onHover?.(false)
  }

  const handleClick = () => {
    if (isContact) {
      // Open portfolio link
      window.open('https://motipallitharun.com', '_blank')
    }
    onClick?.()
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Main Tile */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        <meshStandardMaterial
          color={hovered ? color : '#2a2a3e'}
          metalness={0.5}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Label Text */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.35}
      >
        {label}
      </Text>

      {/* Details Panel (shown on hover) */}
      {hovered && (
        <group position={[0, -0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.5, details.length * 0.12 + 0.1, 0.05]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.3}
              roughness={0.4}
              emissive={color}
              emissiveIntensity={0.2}
              transparent
              opacity={0.95}
            />
          </mesh>
          {details.map((detail, index) => (
            <Text
              key={index}
              position={[0, -index * 0.12 + (details.length - 1) * 0.06, 0.03]}
              fontSize={0.05}
              color="#cccccc"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.45}
            >
              {detail}
            </Text>
          ))}
        </group>
      )}

      {/* Click indicator for contact */}
      {isContact && hovered && (
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.04}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          Tap to open portfolio →
        </Text>
      )}
    </group>
  )
}

export default InfoTile

