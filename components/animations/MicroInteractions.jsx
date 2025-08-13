/**
 * MicroInteractions Component Library
 * Automotive-themed micro-interactions and button effects
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { prefersReducedMotion } from '@/lib/scroll-animations'

// Automotive Button with Engine Start Effect
export const EngineStartButton = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  const handleMouseDown = (e) => {
    if (disabled || prefersReducedMotion()) return

    setIsPressed(true)

    // Create ripple effect
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const baseStyles = {
    position: 'relative',
    overflow: 'hidden',
    outline: 'none',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    userSelect: 'none',
    WebkitUserSelect: 'none'
  }

  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
    ghost: 'text-gray-700 hover:bg-gray-100'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      ref={buttonRef}
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${disabled ? 'opacity-50' : ''} ${className}`}
      style={baseStyles}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {/* Ripple Effects */}
      <div className="absolute inset-0">
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute bg-white bg-opacity-30 rounded-full animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
      
      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Engine glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg" />
    </button>
  )
}

// Service Card with Lift Effect
export const ServiceCard = ({
  children,
  className = '',
  onClick,
  hoverEffect = 'lift',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current || prefersReducedMotion()) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height

    setMousePosition({ x, y })
  }

  const cardStyles = {
    transform: isHovered && hoverEffect === 'tilt' && !prefersReducedMotion()
      ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) translateZ(20px)`
      : isHovered && hoverEffect === 'lift'
      ? 'translateY(-8px) scale(1.02)'
      : 'translateY(0) scale(1)',
    transition: prefersReducedMotion() ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    boxShadow: isHovered
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 ${className}`}
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      {...props}
    >
      {children}

      {/* Subtle glow effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-blue-400/10 rounded-xl pointer-events-none opacity-50" />
      )}
    </div>
  )
}

// Animated Counter for Statistics
export const AnimatedCounter = ({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
  trigger = true
}) => {
  const [currentValue, setCurrentValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!trigger || isAnimating || prefersReducedMotion()) {
      setCurrentValue(value)
      return
    }

    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for speedometer-like acceleration
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      const newValue = Math.floor(startValue + (value - startValue) * easedProgress)
      setCurrentValue(newValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCurrentValue(value)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, trigger, isAnimating])

  return (
    <span className={`font-bold ${className}`}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  )
}

// Magnetic Button Effect
export const MagneticButton = ({
  children,
  strength = 0.4,
  className = '',
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!buttonRef.current || prefersReducedMotion()) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <button
      ref={buttonRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  )
}

// Loading Spinner with Automotive Theme
export const AutomotiveSpinner = ({ size = 'md', color = 'orange' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colors = {
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    gray: 'text-gray-500'
  }

  return (
    <div className={`${sizes[size]} ${colors[color]} animate-spin`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          fill="currentColor"
          opacity="0.25"
        />
        <path
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

// Icon with Hover Effect
export const AnimatedIcon = ({
  icon,
  hoverIcon,
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`inline-block transition-transform duration-200 ${className}`}
      style={{
        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          color
        }}
      >
        {/* Base Icon */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: isHovered && hoverIcon ? 0 : 1 }}
        >
          {icon}
        </div>

        {/* Hover Icon */}
        {hoverIcon && (
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            {hoverIcon}
          </div>
        )}
      </div>
    </div>
  )
}

// Progress Ring for Loading States
export const ProgressRing = ({
  progress = 0,
  size = 60,
  strokeWidth = 4,
  color = '#f97316',
  backgroundColor = '#e5e7eb',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Progress Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold" style={{ color }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

export default {
  EngineStartButton,
  ServiceCard,
  AnimatedCounter,
  MagneticButton,
  AutomotiveSpinner,
  AnimatedIcon,
  ProgressRing
}