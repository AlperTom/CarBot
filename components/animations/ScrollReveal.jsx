/**
 * ScrollReveal Component - Animated reveal on scroll
 * Supports automotive-themed animations and accessibility
 */

'use client'

import { useIntersectionObserver, AutomotiveAnimationPresets, prefersReducedMotion } from '@/lib/scroll-animations'
import { useState, useEffect } from 'react'

const ScrollReveal = ({ 
  children, 
  animation = 'engineReveal',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  staggerChildren = false,
  staggerDelay = 0.1,
  ...props 
}) => {
  const [elementRef, isVisible] = useIntersectionObserver({
    threshold,
    triggerOnce,
    rootMargin: '0px 0px -10% 0px'
  })

  const [isClient, setIsClient] = useState(false)
  const [childCount, setChildCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
    if (staggerChildren && elementRef.current) {
      const children = elementRef.current.children
      setChildCount(children.length)
    }
  }, [staggerChildren, elementRef])

  // Don't animate if user prefers reduced motion
  if (prefersReducedMotion()) {
    return (
      <div ref={elementRef} className={className} {...props}>
        {children}
      </div>
    )
  }

  // Get animation preset or use custom animation
  const animationConfig = typeof animation === 'string' 
    ? AutomotiveAnimationPresets[animation] 
    : animation

  // Base styles for the container
  const containerStyles = {
    transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    transitionDelay: `${delay}s`,
    ...(isClient && isVisible ? animationConfig?.animate : animationConfig?.initial)
  }

  // Stagger children animation styles
  const getChildStyles = (index) => {
    if (!staggerChildren) return {}
    
    const childDelay = delay + (index * staggerDelay)
    return {
      transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${childDelay}s`,
      ...(isClient && isVisible ? animationConfig?.animate : animationConfig?.initial)
    }
  }

  return (
    <div 
      ref={elementRef} 
      className={className} 
      style={!staggerChildren ? containerStyles : {}}
      {...props}
    >
      {staggerChildren ? (
        Array.isArray(children) ? (
          children.map((child, index) => (
            <div key={index} style={getChildStyles(index)}>
              {child}
            </div>
          ))
        ) : (
          <div style={getChildStyles(0)}>
            {children}
          </div>
        )
      ) : (
        children
      )}
    </div>
  )
}

// Specialized components for common automotive elements
export const ServiceCardReveal = ({ children, delay = 0, className = '', ...props }) => (
  <ScrollReveal
    animation="engineReveal"
    delay={delay}
    duration={0.8}
    className={`transform-gpu ${className}`}
    {...props}
  >
    {children}
  </ScrollReveal>
)

export const StatsCounterReveal = ({ children, delay = 0, className = '', ...props }) => (
  <ScrollReveal
    animation="speedometerCount"
    delay={delay}
    duration={1.2}
    className={`transform-gpu ${className}`}
    staggerChildren
    staggerDelay={0.2}
    {...props}
  >
    {children}
  </ScrollReveal>
)

export const HeroElementReveal = ({ children, delay = 0, className = '', ...props }) => (
  <ScrollReveal
    animation="carDriveIn"
    delay={delay}
    duration={1.2}
    threshold={0.2}
    className={`transform-gpu ${className}`}
    {...props}
  >
    {children}
  </ScrollReveal>
)

export const FeatureListReveal = ({ children, className = '', ...props }) => (
  <ScrollReveal
    animation="gearReveal"
    staggerChildren
    staggerDelay={0.15}
    className={`transform-gpu ${className}`}
    {...props}
  >
    {children}
  </ScrollReveal>
)

// Text reveal with typewriter effect for automotive themes
export const TypewriterReveal = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = '',
  showCursor = true 
}) => {
  const [elementRef, isVisible] = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true
  })

  const [displayText, setDisplayText] = useState('')
  const [showTypingCursor, setShowTypingCursor] = useState(showCursor)

  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) {
      setDisplayText(text)
      setShowTypingCursor(false)
      return
    }

    let timeoutId
    let currentIndex = 0

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1))
        currentIndex++
        timeoutId = setTimeout(typeNextCharacter, speed)
      } else {
        // Hide cursor after typing is complete
        setTimeout(() => setShowTypingCursor(false), 1000)
      }
    }

    // Start typing after delay
    timeoutId = setTimeout(typeNextCharacter, delay * 1000)

    return () => clearTimeout(timeoutId)
  }, [isVisible, text, delay, speed])

  return (
    <span ref={elementRef} className={className}>
      {displayText}
      {showTypingCursor && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  )
}

export default ScrollReveal