import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * NameCard Component
 * 
 * Main 3D panel displaying:
 * - Name: "Tharun Motipalli"
 * - Title: "Software Engineer • Full-Stack & AI"
 * 
 * Customize the name and title in the Text components below.
 */

interface NameCardProps {
  position: [number, number, number]
}

const NameCard: React.FC<NameCardProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  // Subtle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Card Background */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.4}
          emissive="#6366f1"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Glow Effect */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[1.25, 0.65, 0.02]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.2}
          emissive="#6366f1"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Name Text */}
      <Text
        position={[0, 0.15, 0.03]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.0}
      >
        Tharun Motipalli
      </Text>

      {/* Title Text */}
      <Text
        position={[0, -0.1, 0.03]}
        fontSize={0.06}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.0}
      >
        Software Engineer • Full-Stack & AI
      </Text>
    </group>
  )
}

export default NameCard

