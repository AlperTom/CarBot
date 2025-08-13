/**
 * Apple.com-Style Animation Components for CarBot
 * Sophisticated scroll-driven animations with magnetic interactions
 * Optimized for 60fps performance with advanced parallax effects
 */

'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { 
  useAppleParallax, 
  useMagneticInteraction, 
  useScrollReveal, 
  AppleEasing,
  useScrollVelocity,
  prefersReducedMotion 
} from '@/lib/scroll-animations'

// Apple-style Hero Section with sophisticated parallax
export function AppleHeroSection({ 
  children, 
  backgroundLayers = [], 
  className = '',
  enableParticles = true 
}) {
  const parallaxLayers = useMemo(() => [
    { speed: 0.1, depth: 0.5 }, // Background layer
    { speed: 0.3, depth: 1 },   // Mid layer
    { speed: 0.5, depth: 1.5 }  // Foreground layer
  ], [])
  
  const [containerRef, layerOffsets] = useAppleParallax(parallaxLayers)
  const { velocity, isScrolling } = useScrollVelocity()
  
  return (
    <section 
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden ${className}`}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
    >
      {/* Background Layers with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 0 - Deep background */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            transform: `translate3d(0, ${layerOffsets[0]?.y || 0}px, 0) scale(${layerOffsets[0]?.scale || 1})`,
            willChange: 'transform',
            transition: isScrolling ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          {/* Subtle geometric patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />
          </div>
        </div>

        {/* Layer 1 - Mid layer with floating elements */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            transform: `translate3d(0, ${layerOffsets[1]?.y || 0}px, 0) scale(${layerOffsets[1]?.scale || 1})`,
            willChange: 'transform',
            transition: isScrolling ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <FloatingElements velocity={velocity} />
        </div>

        {/* Layer 2 - Foreground particles */}
        {enableParticles && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translate3d(0, ${layerOffsets[2]?.y || 0}px, 0) scale(${layerOffsets[2]?.scale || 1})`,
              willChange: 'transform',
              transition: isScrolling ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <ParticleField count={50} />
          </div>
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        {children}
      </div>
    </section>
  )
}

// Magnetic Button Component inspired by Apple
export function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  strength = 1,
  ...props 
}) {
  const [buttonRef, transform] = useMagneticInteraction(strength)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-orange-600 to-purple-600 
        text-white font-semibold px-8 py-4 rounded-xl
        transition-all duration-300
        ${className}
      `}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
        transition: prefersReducedMotion() ? 'none' : `transform 0.3s ${AppleEasing.magnetic}`,
        willChange: 'transform'
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      {...props}
    >
      {/* Ripple effect */}
      <div 
        className={`
          absolute inset-0 bg-white/20 rounded-xl
          transition-all duration-200
          ${isPressed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}
        style={{
          transformOrigin: 'center',
          transition: `all 0.2s ${AppleEasing.snappy}`
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// Apple-style Content Reveal Animation
export function ContentReveal({ 
  children, 
  direction = 'up',
  delay = 0,
  distance = 60,
  className = '' 
}) {
  const { elementRef, getTransform, getOpacity, getFilter } = useScrollReveal(0.1, true)

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: getOpacity(),
        transform: getTransform(direction, distance),
        filter: getFilter(),
        transition: prefersReducedMotion() ? 'none' : `all 0.8s ${AppleEasing.reveal} ${delay}ms`,
        willChange: prefersReducedMotion() ? 'auto' : 'opacity, transform, filter'
      }}
    >
      {children}
    </div>
  )
}

// Staggered Animation Container
export function StaggeredReveal({ 
  children, 
  staggerDelay = 100, 
  className = '',
  direction = 'up' 
}) {
  const { elementRef, isVisible } = useScrollReveal(0.1, true)
  const childElements = Array.isArray(children) ? children : [children]

  return (
    <div ref={elementRef} className={className}>
      {childElements.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? 'translateY(0) scale(1)' 
              : direction === 'up' 
                ? 'translateY(40px) scale(0.95)' 
                : 'translateY(-40px) scale(0.95)',
            filter: isVisible ? 'blur(0px)' : 'blur(4px)',
            transition: prefersReducedMotion() 
              ? 'none' 
              : `all 0.7s ${AppleEasing.reveal} ${index * staggerDelay}ms`,
            willChange: prefersReducedMotion() ? 'auto' : 'opacity, transform, filter'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Apple-style Card with Hover Depth Effect
export function DepthCard({ 
  children, 
  className = '',
  hoverStrength = 1,
  ...props 
}) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, translateZ: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || prefersReducedMotion()) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const rotateY = ((e.clientX - centerX) / rect.width) * 15 * hoverStrength
    const rotateX = -((e.clientY - centerY) / rect.height) * 15 * hoverStrength
    
    setTransform({
      rotateX,
      rotateY,
      translateZ: 20 * hoverStrength
    })
  }, [hoverStrength])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setTransform({ rotateX: 0, rotateY: 0, translateZ: 0 })
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave])

  return (
    <div
      ref={cardRef}
      className={`
        relative transform-gpu perspective-1000
        transition-all duration-300
        ${className}
      `}
      style={{
        transform: prefersReducedMotion() 
          ? 'none' 
          : `
            perspective(1000px) 
            rotateX(${transform.rotateX}deg) 
            rotateY(${transform.rotateY}deg) 
            translateZ(${transform.translateZ}px)
            ${isHovering ? 'translateY(-8px)' : 'translateY(0)'}
          `,
        boxShadow: isHovering 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: prefersReducedMotion() ? 'none' : `all 0.3s ${AppleEasing.reveal}`,
        willChange: 'transform, box-shadow'
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// Floating Elements for Background
function FloatingElements({ velocity = 0 }) {
  const elements = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * 360,
      speed: Math.random() * 0.5 + 0.2
    })), []
  )

  return (
    <div className="absolute inset-0">
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-orange-400/20 to-purple-600/20 backdrop-blur-sm"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            opacity: element.opacity,
            transform: `
              translate(-50%, -50%) 
              rotate(${element.rotation + velocity * element.speed}deg)
              scale(${1 + velocity * 0.01})
            `,
            transition: velocity > 1 ? 'none' : 'transform 0.3s ease-out'
          }}
        />
      ))}
    </div>
  )
}

// Particle Field for Background Effects
function ParticleField({ count = 30 }) {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.5 + 0.1
    })), [count]
  )

  const [animationOffset, setAnimationOffset] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const animate = () => {
      setAnimationOffset(prev => prev + 0.5)
      requestAnimationFrame(animate)
    }
    
    const frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div className="absolute inset-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${(particle.y + animationOffset * particle.speed) % 100}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  )
}

// Scroll Progress Indicator
export function ScrollProgressIndicator({ className = '' }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.max(0, Math.min(1, scrollProgress)))
    }

    const handleScroll = () => {
      requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 h-1 bg-white/10 ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-150 ease-out"
        style={{
          width: `${progress * 100}%`,
          transition: prefersReducedMotion() ? 'none' : 'width 0.15s ease-out'
        }}
      />
    </div>
  )
}

export default {
  AppleHeroSection,
  MagneticButton,
  ContentReveal,
  StaggeredReveal,
  DepthCard,
  ScrollProgressIndicator
}