import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import NameCard from './NameCard'
import InfoTile from './InfoTile'
import BeeBot from './BeeBot'
import { useState } from 'react'

/**
 * Fallback3DScene Component
 * 
 * Shown when WebXR AR is not supported (e.g., desktop browsers).
 * Displays the same 3D portfolio scene with orbit controls.
 * 
 * Users can:
 * - Rotate: Click and drag
 * - Zoom: Scroll wheel
 * - Pan: Right-click and drag
 */

const Fallback3DScene: React.FC = () => {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [beeTargetSection, setBeeTargetSection] = useState<string | null>(null)

  // Handle section selection
  const handleSectionSelect = (section: string) => {
    setSelectedSection(section)
    setBeeTargetSection(section)
    setHoveredTile(section)
    
    // Reset bee target after animation
    setTimeout(() => {
      setBeeTargetSection(null)
    }, 2000)
  }

  // Handle bee bot tap
  const handleBeeTap = () => {
    if (selectedSection) {
      setSelectedSection(null)
      setHoveredTile(null)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Portfolio Content */}
        <group position={[0, 0, 0]}>
          {/* Name Card - Main Hub */}
          <NameCard position={[0, 0.5, 0]} />

          {/* About Me Section */}
          <InfoTile
            position={[0, 0.8, 0]}
            label="About"
            details={[
              'Software Engineer',
              'Full-Stack Developer',
              'AI Enthusiast',
              'Web3 Builder'
            ]}
            color="#10b981"
            isHovered={hoveredTile === 'about' || selectedSection === 'about'}
            onHover={(hovered) => {
              if (hovered) setHoveredTile('about')
              else if (selectedSection !== 'about') setHoveredTile(null)
            }}
            onClick={() => handleSectionSelect('about')}
          />

          {/* Skills Section */}
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
            isHovered={hoveredTile === 'skills' || selectedSection === 'skills'}
            onHover={(hovered) => {
              if (hovered) setHoveredTile('skills')
              else if (selectedSection !== 'skills') setHoveredTile(null)
            }}
            onClick={() => handleSectionSelect('skills')}
          />

          {/* Projects Section */}
          <InfoTile
            position={[0.8, 0, 0]}
            label="Projects"
            details={[
              'Full-Stack Applications',
              'AI-Powered Solutions',
              'Web3 DApps',
              'AR/VR Experiences'
            ]}
            color="#8b5cf6"
            isHovered={hoveredTile === 'projects' || selectedSection === 'projects'}
            onHover={(hovered) => {
              if (hovered) setHoveredTile('projects')
              else if (selectedSection !== 'projects') setHoveredTile(null)
            }}
            onClick={() => handleSectionSelect('projects')}
          />

          {/* Contact Section */}
          <InfoTile
            position={[0, -0.6, 0]}
            label="Contact"
            details={[
              'Email: tharun@example.com',
              'Portfolio: motipallitharun.com',
              'LinkedIn: /in/tharunmotipalli'
            ]}
            color="#ec4899"
            isHovered={hoveredTile === 'contact' || selectedSection === 'contact'}
            onHover={(hovered) => {
              if (hovered) setHoveredTile('contact')
              else if (selectedSection !== 'contact') setHoveredTile(null)
            }}
            onClick={() => {
              handleSectionSelect('contact')
              window.open('https://motipallitharun.com', '_blank')
            }}
            isContact={true}
          />

          {/* Bee Bot Assistant */}
          <BeeBot
            position={[0.3, 0.3, 0]}
            targetSection={beeTargetSection}
            currentSection={selectedSection}
            onTap={handleBeeTap}
          />
        </group>
      </Canvas>

      {/* Fallback Message Overlay */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
        <div className="bg-yellow-500/20 backdrop-blur-md px-4 py-2 rounded-lg border border-yellow-500/50">
          <p className="text-yellow-400 text-center text-sm">
            ⚠️ AR not supported on this device. Viewing 3D preview instead.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-lg border border-ar-primary/50">
          <p className="text-white text-center text-xs">
            💡 Use mouse/trackpad to rotate, scroll to zoom
          </p>
        </div>
      </div>
    </div>
  )
}

export default Fallback3DScene

