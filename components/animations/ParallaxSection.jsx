/**
 * ParallaxSection Component - Automotive-themed parallax backgrounds
 * Optimized for performance with automotive workshop aesthetics
 */

'use client'

import { useParallax, useScrollVelocity, prefersReducedMotion } from '@/lib/scroll-animations'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const ParallaxSection = ({
  children,
  backgroundImage,
  backgroundVideo,
  parallaxSpeed = 0.5,
  overlay = true,
  overlayOpacity = 0.6,
  overlayColor = 'black',
  minHeight = '500px',
  className = '',
  contentClassName = '',
  // Automotive-specific props
  engineParticles = false,
  gearElements = false,
  speedLines = false,
  ...props
}) => {
  const [parallaxRef, parallaxOffset] = useParallax(parallaxSpeed)
  const { velocity, isScrolling } = useScrollVelocity()
  const [isClient, setIsClient] = useState(false)
  const particlesRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't apply parallax if user prefers reduced motion
  const shouldApplyParallax = isClient && !prefersReducedMotion()

  // Background transform based on parallax offset
  const backgroundTransform = shouldApplyParallax 
    ? `translate3d(0, ${parallaxOffset}px, 0)` 
    : 'none'

  // Dynamic blur based on scroll velocity for motion blur effect
  const motionBlur = shouldApplyParallax && isScrolling && velocity > 2
    ? `blur(${Math.min(velocity * 0.1, 2)}px)`
    : 'none'

  return (
    <section
      ref={parallaxRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight, ...props.style }}
      {...props}
    >
      {/* Background Layer */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{
          transform: backgroundTransform,
          filter: motionBlur,
          scale: shouldApplyParallax ? '1.1' : '1', // Slight scale to prevent edges showing
        }}
      >
        {/* Background Image */}
        {backgroundImage && (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Workshop background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={85}
            />
          </div>
        )}

        {/* Background Video */}
        {backgroundVideo && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        )}

        {/* Gradient Overlay */}
        {overlay && (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`
            }}
          />
        )}
      </div>

      {/* Automotive Effects Layer */}
      {shouldApplyParallax && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Engine Particles */}
          {engineParticles && (
            <EngineParticles 
              ref={particlesRef} 
              velocity={velocity} 
              isScrolling={isScrolling} 
            />
          )}

          {/* Gear Elements */}
          {gearElements && (
            <FloatingGears 
              parallaxOffset={parallaxOffset} 
              velocity={velocity} 
            />
          )}

          {/* Speed Lines */}
          {speedLines && isScrolling && velocity > 1 && (
            <SpeedLines velocity={velocity} />
          )}
        </div>
      )}

      {/* Content Layer */}
      <div className={`relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </section>
  )
}

// Engine Particles Effect Component
const EngineParticles = ({ velocity = 0, isScrolling = false }) => {
  const [particles, setParticles] = useState([])
  const animationRef = useRef()

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 2 + 1,
      direction: Math.random() * Math.PI * 2
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    if (!isScrolling) return

    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction) * particle.speed * velocity * 0.1) % 100,
        y: (particle.y + Math.sin(particle.direction) * particle.speed * velocity * 0.1) % 100,
        opacity: Math.max(0.1, particle.opacity - velocity * 0.01)
      })))
      
      if (isScrolling) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isScrolling, velocity])

  return (
    <div className="absolute inset-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-orange-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            filter: 'blur(0.5px)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

// Floating Gears Effect Component
const FloatingGears = ({ parallaxOffset = 0, velocity = 0 }) => {
  const gears = [
    { size: 60, x: 10, y: 20, rotation: 0, speed: 0.5 },
    { size: 40, x: 80, y: 15, rotation: 0, speed: -0.3 },
    { size: 50, x: 15, y: 70, rotation: 0, speed: 0.7 },
    { size: 35, x: 85, y: 75, rotation: 0, speed: -0.4 }
  ]

  return (
    <div className="absolute inset-0 opacity-20">
      {gears.map((gear, index) => (
        <div
          key={index}
          className="absolute text-gray-400"
          style={{
            left: `${gear.x}%`,
            top: `${gear.y}%`,
            transform: `translate(-50%, -50%) rotate(${parallaxOffset * gear.speed + velocity * gear.speed * 2}deg)`,
            transition: velocity > 1 ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <svg
            width={gear.size}
            height={gear.size}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Speed Lines Effect Component
const SpeedLines = ({ velocity = 0 }) => {
  const lines = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    width: Math.random() * 40 + 20,
    opacity: Math.random() * 0.6 + 0.2
  }))

  return (
    <div className="absolute inset-0">
      {lines.map(line => (
        <div
          key={line.id}
          className="absolute bg-gradient-to-r from-transparent via-orange-400 to-transparent"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: `${line.width}px`,
            height: '2px',
            opacity: line.opacity * (velocity * 0.1),
            transform: `translateX(-${velocity * 5}px)`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  )
}

// Specialized Parallax Sections for CarBot themes
export const WorkshopParallaxHero = ({ children, ...props }) => (
  <ParallaxSection
    parallaxSpeed={0.3}
    overlay
    overlayOpacity={0.7}
    overlayColor="rgb(15, 23, 42)"
    minHeight="100vh"
    engineParticles
    gearElements
    className="flex items-center justify-center"
    contentClassName="text-center text-white max-w-4xl mx-auto px-4"
    {...props}
  >
    {children}
  </ParallaxSection>
)

export const ServiceShowcaseParallax = ({ children, ...props }) => (
  <ParallaxSection
    parallaxSpeed={0.4}
    overlay
    overlayOpacity={0.5}
    overlayColor="rgb(31, 41, 55)"
    minHeight="80vh"
    speedLines
    className="flex items-center"
    contentClassName="max-w-7xl mx-auto px-4"
    {...props}
  >
    {children}
  </ParallaxSection>
)

export const TestimonialsParallax = ({ children, ...props }) => (
  <ParallaxSection
    parallaxSpeed={0.2}
    overlay
    overlayOpacity={0.3}
    overlayColor="rgb(17, 24, 39)"
    minHeight="60vh"
    gearElements
    className="flex items-center"
    contentClassName="max-w-6xl mx-auto px-4 text-center"
    {...props}
  >
    {children}
  </ParallaxSection>
)

export default ParallaxSection