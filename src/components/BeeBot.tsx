import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * BeeBot Component
 * 
 * Interactive 3D bee assistant that:
 * - Hovers with idle animations (bobbing, wing flapping)
 * - Shows speech bubbles on tap
 * - Flies between sections when navigating
 * - Provides context-aware guidance
 */

interface BeeBotProps {
  position: [number, number, number]
  targetSection?: string | null
  onTap?: () => void
  currentSection?: string | null
}

const BeeBot: React.FC<BeeBotProps> = ({ 
  position, 
  targetSection, 
  onTap,
  currentSection 
}) => {
  const beeGroupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const leftWingRef = useRef<THREE.Mesh>(null)
  const rightWingRef = useRef<THREE.Mesh>(null)
  const [isActive, setIsActive] = useState(false)
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const [speechText, setSpeechText] = useState('')
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(...position)
  )

  // Speech bubble messages based on context
  const getSpeechMessage = (): string => {
    if (!currentSection) {
      return "Hi! I'm your guide! 👋\nTap me to learn about Tharun!"
    }
    
    switch (currentSection) {
      case 'about':
        return "Tharun is a Software Engineer\nspecializing in Full-Stack & AI! 🚀"
      case 'skills':
        return "Tharun's skills include:\nJava, React, Node.js, Web3, AI! 💻"
      case 'projects':
        return "Check out Tharun's amazing\nFull-Stack & AI projects! 🎯"
      case 'contact':
        return "Want to connect? Tap the\nContact section! 📧"
      default:
        return "Explore Tharun's portfolio\nby tapping the sections! ✨"
    }
  }

  // Handle tap/click
  const handleClick = () => {
    setIsActive(true)
    setShowSpeechBubble(true)
    setSpeechText(getSpeechMessage())
    onTap?.()
    
    // Hide speech bubble after 4 seconds
    setTimeout(() => {
      setShowSpeechBubble(false)
      setIsActive(false)
    }, 4000)
  }

  // Update target position when section changes
  useEffect(() => {
    if (targetSection) {
      // Calculate position near the target section
      const sectionPositions: Record<string, [number, number, number]> = {
        about: [0, 0.8, 0],
        skills: [-0.8, 0, 0],
        projects: [0.8, 0, 0],
        contact: [0, -0.6, 0],
      }
      
      const target = sectionPositions[targetSection]
      if (target) {
        setTargetPosition(new THREE.Vector3(...target))
      }
    }
  }, [targetSection])

  // Idle animation: hovering and bobbing
  useFrame((state) => {
    if (beeGroupRef.current) {
      const time = state.clock.elapsedTime
      
      // Hovering motion
      beeGroupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1
      beeGroupRef.current.position.x = position[0] + Math.cos(time * 1.5) * 0.05
      
      // Slight rotation for more natural movement
      beeGroupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
      
      // Smooth movement toward target section
      if (targetSection) {
        beeGroupRef.current.position.lerp(targetPosition, 0.05)
      }
    }

    // Wing flapping animation
    if (leftWingRef.current && rightWingRef.current) {
      const flapSpeed = isActive ? 20 : 15
      const flapAmount = isActive ? 0.8 : 0.6
      const time = state.clock.elapsedTime
      
      leftWingRef.current.rotation.x = Math.sin(time * flapSpeed) * flapAmount
      rightWingRef.current.rotation.x = -Math.sin(time * flapSpeed) * flapAmount
    }

    // Body bobbing when active
    if (bodyRef.current && isActive) {
      const time = state.clock.elapsedTime
      bodyRef.current.position.y = Math.sin(time * 8) * 0.05
    }
  })

  return (
    <group ref={beeGroupRef} position={position}>
      {/* Bee Body */}
      <mesh ref={bodyRef} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.3}
          roughness={0.4}
          emissive="#FFA500"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Bee Head */}
      <mesh position={[0, 0.1, 0.05]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.02, 0.12, 0.08]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.02, 0.12, 0.08]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Left Wing */}
      <mesh
        ref={leftWingRef}
        position={[-0.05, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <planeGeometry args={[0.06, 0.1]} />
        <meshStandardMaterial
          color="#E6E6FA"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right Wing */}
      <mesh
        ref={rightWingRef}
        position={[0.05, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <planeGeometry args={[0.06, 0.1]} />
        <meshStandardMaterial
          color="#E6E6FA"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Stripes on body */}
      {[0, -0.03, 0.03].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}

      {/* Stinger */}
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.01, 0.03, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Clickable area - invisible sphere */}
      <mesh onClick={handleClick} onPointerEnter={() => {}} visible={false}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Speech Bubble */}
      {showSpeechBubble && (
        <group position={[0, 0.3, 0]}>
          {/* Bubble background */}
          <RoundedBox
            args={[0.8, 0.4, 0.02]}
            radius={0.02}
            smoothness={4}
          >
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.95}
              emissive="#ffffff"
              emissiveIntensity={0.1}
            />
          </RoundedBox>
          
          {/* Bubble border */}
          <RoundedBox
            args={[0.82, 0.42, 0.01]}
            radius={0.02}
            smoothness={4}
          >
            <meshBasicMaterial
              color="#6366f1"
              transparent
              opacity={0.8}
            />
          </RoundedBox>

          {/* Speech text */}
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.04}
            color="#1a1a2e"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.75}
            textAlign="center"
          >
            {speechText}
          </Text>

          {/* Speech bubble tail */}
          <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.05, 0.1, 3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* Glow effect when active */}
      {isActive && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            transparent
            opacity={0.3}
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  )
}

export default BeeBot

