import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
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
      {/* Main Tile - Rounded corners for modern look */}
      <RoundedBox
        ref={meshRef}
        args={[0.4, 0.4, 0.05]}
        radius={0.01}
        smoothness={4}
        castShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onPointerDown={(e) => {
          // Better mobile touch feedback
          e.stopPropagation()
          handleClick()
        }}
        scale={hovered ? 1.2 : 1}
      >
        <meshStandardMaterial
          color={hovered ? color : '#2a2a3e'}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </RoundedBox>

      {/* Icon/Indicator ring */}
      <mesh position={[0, 0, 0.03]}>
        <ringGeometry args={[0.22, 0.24, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label Text - Better visibility on mobile */}
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.085}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.35}
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Details Panel (shown on hover/tap) - Mobile optimized */}
      {hovered && (
        <group position={[0, -0.5, 0]}>
          <RoundedBox
            args={[0.55, details.length * 0.13 + 0.12, 0.05]}
            radius={0.01}
            smoothness={4}
          >
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.4}
              roughness={0.3}
              emissive={color}
              emissiveIntensity={0.25}
              transparent
              opacity={0.97}
            />
          </RoundedBox>
          {details.map((detail, index) => (
            <Text
              key={index}
              position={[0, -index * 0.13 + (details.length - 1) * 0.065, 0.04]}
              fontSize={0.055}
              color="#e0e0e0"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.48}
              outlineWidth={0.003}
              outlineColor="#000000"
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

