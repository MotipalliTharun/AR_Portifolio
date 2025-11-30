import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
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
      {/* Card Background - Optimized for mobile with rounded corners */}
      <RoundedBox
        ref={meshRef}
        args={[1.2, 0.6, 0.05]}
        radius={0.02}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.4}
          roughness={0.3}
          emissive="#6366f1"
          emissiveIntensity={0.15}
        />
      </RoundedBox>

      {/* Glow Effect - Subtle for mobile performance */}
      <RoundedBox
        position={[0, 0, -0.03]}
        args={[1.25, 0.65, 0.02]}
        radius={0.02}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.25}
          emissive="#6366f1"
          emissiveIntensity={0.4}
        />
      </RoundedBox>


      {/* Name Text - Larger and bolder for mobile */}
      <Text
        position={[0, 0.15, 0.04]}
        fontSize={0.13}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.0}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        Tharun Motipalli
      </Text>

      {/* Title Text - Optimized for readability */}
      <Text
        position={[0, -0.1, 0.04]}
        fontSize={0.065}
        color="#b0b0b0"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.0}
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        Software Engineer • Full-Stack & AI
      </Text>
    </group>
  )
}

export default NameCard

