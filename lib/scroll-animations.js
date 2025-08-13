/**
 * Apple.com-Style Scroll Animations Library for CarBot Platform
 * Sophisticated scroll interactions with magnetic interactions and smooth parallax
 * Optimized for 60fps performance with advanced easing curves
 */

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// Apple-style easing curves
export const AppleEasing = {
  // Apple's signature ease curve - used throughout their site
  signature: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  // For smooth reveals and hero animations
  reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
  // For magnetic interactions and micro-animations
  magnetic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // For parallax and background elements
  parallax: 'cubic-bezier(0.23, 1, 0.32, 1)',
  // For snappy UI interactions
  snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // For smooth page transitions
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
}

// Performance configuration
const PERFORMANCE_CONFIG = {
  throttleMs: 16, // 60fps
  enableGPU: true,
  enableWillChange: true,
  enableTransform3d: true,
  maxConcurrentAnimations: 10
}

// Animation state management
const animationState = {
  activeAnimations: new Set(),
  frameRate: 60,
  lastFrameTime: 0
}

// Utility function to check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Intersection Observer for scroll-triggered animations
export const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    triggerOnce: true,
    ...options
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion()) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        if (defaultOptions.triggerOnce) {
          setHasAnimated(true)
        }
      } else if (!defaultOptions.triggerOnce) {
        setIsVisible(false)
      }
    }, defaultOptions)

    observer.observe(element)

    return () => observer.disconnect()
  }, [defaultOptions.threshold, defaultOptions.rootMargin, defaultOptions.triggerOnce])

  return [elementRef, isVisible, hasAnimated]
}

// Apple-style parallax with advanced depth layers
export const useAppleParallax = (layers = [{ speed: 0.5, depth: 1 }]) => {
  const elementRef = useRef(null)
  const [layerOffsets, setLayerOffsets] = useState({})
  const frameRef = useRef()

  const updateOffsets = useCallback(() => {
    if (!elementRef.current || prefersReducedMotion()) return

    const element = elementRef.current
    const rect = element.getBoundingClientRect()
    const scrollY = window.pageYOffset
    const elementTop = rect.top + scrollY
    const windowHeight = window.innerHeight
    const elementHeight = rect.height
    
    // Calculate progress through viewport (0 to 1)
    const progress = Math.max(0, Math.min(1, 
      (scrollY - elementTop + windowHeight) / (windowHeight + elementHeight)
    ))

    // Calculate offsets for each layer with depth-based perspective
    const newOffsets = {}
    layers.forEach((layer, index) => {
      const { speed, depth = 1 } = layer
      const perspectiveOffset = (progress - 0.5) * speed * 100
      const depthMultiplier = 1 + (depth - 1) * 0.1 // Subtle depth effect
      
      newOffsets[index] = {
        y: perspectiveOffset * depthMultiplier,
        scale: 1 + (progress - 0.5) * 0.02 * depth, // Subtle scale change
        opacity: Math.max(0.3, 1 - Math.abs(progress - 0.5) * 0.5)
      }
    })

    setLayerOffsets(newOffsets)
  }, [layers])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const handleScroll = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(updateOffsets)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateOffsets() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [updateOffsets])

  return [elementRef, layerOffsets]
}

// Custom hook for parallax scrolling (backwards compatible)
export const useParallax = (speed = 0.5, direction = 'vertical') => {
  const [elementRef, layerOffsets] = useAppleParallax([{ speed, depth: 1 }])
  const offset = layerOffsets[0]?.y || 0
  return [elementRef, offset]
}

// Scroll progress hook for progress indicators
export const useScrollProgress = (target = null) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      let progressValue = 0

      if (target) {
        // Progress relative to specific element
        const element = typeof target === 'string' ? document.querySelector(target) : target
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementHeight = rect.height
          const elementTop = rect.top
          const viewportHeight = window.innerHeight
          
          if (elementTop <= 0 && elementTop + elementHeight >= 0) {
            progressValue = Math.min(Math.abs(elementTop) / (elementHeight - viewportHeight), 1)
          }
        }
      } else {
        // Progress relative to entire page
        const scrollTop = window.pageYOffset
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight
        progressValue = documentHeight > 0 ? scrollTop / documentHeight : 0
      }

      setProgress(Math.max(0, Math.min(1, progressValue)))
    }

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    calculateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [target])

  return progress
}

// Scroll-triggered number counter animation
export const useCounterAnimation = (endValue, duration = 2000, startTrigger = true) => {
  const [currentValue, setCurrentValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!startTrigger || isAnimating || prefersReducedMotion()) {
      setCurrentValue(endValue)
      return
    }

    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      const value = startValue + (endValue - startValue) * easedProgress
      setCurrentValue(Math.floor(value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCurrentValue(endValue)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [endValue, duration, startTrigger, isAnimating])

  return currentValue
}

// Smooth scroll to element with custom easing
export const smoothScrollTo = (target, duration = 1000, offset = 0, easing = 'easeInOutCubic') => {
  if (prefersReducedMotion()) {
    const element = typeof target === 'string' ? document.querySelector(target) : target
    if (element) {
      element.scrollIntoView({ behavior: 'auto' })
    }
    return
  }

  const targetElement = typeof target === 'string' ? document.querySelector(target) : target
  if (!targetElement) return

  const startPosition = window.pageYOffset
  const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset
  const distance = targetPosition - startPosition
  const startTime = Date.now()

  const easingFunctions = {
    linear: (t) => t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
  }

  const easingFunction = easingFunctions[easing] || easingFunctions.easeInOutCubic

  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easedProgress = easingFunction(progress)
    const currentPosition = startPosition + distance * easedProgress

    window.scrollTo(0, currentPosition)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

// Scroll velocity detector for performance optimization
export const useScrollVelocity = () => {
  const [velocity, setVelocity] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)

  useEffect(() => {
    let timeoutId

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset
      const currentTime = Date.now()
      
      if (lastTimestamp.current > 0) {
        const deltaY = Math.abs(currentScrollY - lastScrollY.current)
        const deltaTime = currentTime - lastTimestamp.current
        const currentVelocity = deltaTime > 0 ? deltaY / deltaTime : 0
        
        setVelocity(currentVelocity)
      }

      lastScrollY.current = currentScrollY
      lastTimestamp.current = currentTime
      setIsScrolling(true)

      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsScrolling(false)
        setVelocity(0)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  return { velocity, isScrolling }
}

// Magnetic interaction hook for Apple-style hover effects
export const useMagneticInteraction = (strength = 1) => {
  const elementRef = useRef(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const isHovering = useRef(false)

  const handleMouseMove = useCallback((e) => {
    if (!elementRef.current || !isHovering.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength * 0.1
    const deltaY = (e.clientY - centerY) * strength * 0.1

    setTransform({
      x: deltaX,
      y: deltaY,
      scale: 1.02
    })
  }, [strength])

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true
    document.addEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [handleMouseMove])

  useEffect(() => {
    const element = elementRef.current
    if (!element || prefersReducedMotion()) return

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove])

  return [elementRef, transform]
}

// Scroll-synchronized reveal animation
export const useScrollReveal = (threshold = 0.1, triggerOnce = true) => {
  const [elementRef, isVisible] = useIntersectionObserver({
    threshold,
    triggerOnce,
    rootMargin: '0px 0px -10% 0px'
  })
  const [animationPhase, setAnimationPhase] = useState('hidden')

  useEffect(() => {
    if (isVisible && animationPhase === 'hidden') {
      setAnimationPhase('revealing')
      // Add slight delay for more natural reveal
      setTimeout(() => setAnimationPhase('visible'), 50)
    }
  }, [isVisible, animationPhase])

  const getTransform = (direction = 'up', distance = 60) => {
    if (animationPhase === 'hidden') {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`
        case 'down': return `translateY(-${distance}px)`
        case 'left': return `translateX(${distance}px)`
        case 'right': return `translateX(-${distance}px)`
        case 'scale': return 'scale(0.9)'
        default: return `translateY(${distance}px)`
      }
    }
    return 'translateY(0) translateX(0) scale(1)'
  }

  const getOpacity = () => {
    return animationPhase === 'hidden' ? 0 : 1
  }

  const getFilter = () => {
    return animationPhase === 'hidden' ? 'blur(8px)' : 'blur(0px)'
  }

  return { elementRef, isVisible, getTransform, getOpacity, getFilter, animationPhase }
}

// Automotive-themed animation presets with Apple-style curves
export const AutomotiveAnimationPresets = {
  // Apple-style hero reveal with magnetic effect
  appleHeroReveal: {
    initial: { 
      opacity: 0, 
      transform: 'translateY(80px) scale(0.95)',
      filter: 'blur(12px)'
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) scale(1)',
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: AppleEasing.reveal
      }
    }
  },

  // Engine-like reveal animation with Apple curves
  engineReveal: {
    initial: { 
      opacity: 0, 
      transform: 'translateY(60px) scale(0.9)',
      filter: 'blur(8px)'
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) scale(1)',
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: AppleEasing.signature
      }
    }
  },

  // Smooth content reveal like Apple product pages
  contentReveal: {
    initial: { 
      opacity: 0, 
      transform: 'translateY(40px)',
      filter: 'blur(4px)'
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px)',
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: AppleEasing.reveal
      }
    }
  },

  // Gear-like rotation reveal
  gearReveal: {
    initial: { 
      opacity: 0, 
      transform: 'rotate(-15deg) scale(0.8)',
      transformOrigin: 'center center'
    },
    animate: { 
      opacity: 1, 
      transform: 'rotate(0deg) scale(1)',
      transition: {
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55] // Bouncy gear-like easing
      }
    }
  },

  // Speedometer-like counter animation
  speedometerCount: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  },

  // Car driving in from side
  carDriveIn: {
    initial: { 
      x: -100, 
      opacity: 0,
      transform: 'rotate(-5deg)'
    },
    animate: { 
      x: 0, 
      opacity: 1,
      transform: 'rotate(0deg)',
      transition: {
        duration: 1.2,
        ease: [0.23, 1, 0.32, 1] // Smooth acceleration like a car
      }
    }
  },

  // Service card hover (like lifting a car)
  serviceLift: {
    initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    hover: { 
      y: -8, 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },

  // Apple-style magnetic button interaction
  magneticButton: {
    initial: { 
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
        ease: AppleEasing.magnetic
      }
    },
    press: { 
      scale: 0.98,
      transition: { 
        duration: 0.1,
        ease: AppleEasing.snappy
      }
    },
    release: { 
      scale: 1.02,
      transition: { 
        duration: 0.2,
        ease: AppleEasing.magnetic
      }
    }
  },

  // Button press like starting an engine
  engineStart: {
    initial: { scale: 1 },
    press: { 
      scale: 0.95,
      transition: { duration: 0.1, ease: AppleEasing.snappy }
    },
    release: { 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: AppleEasing.magnetic
      }
    }
  },

  // Apple-style card hover with depth
  cardHover: {
    initial: { 
      y: 0, 
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      y: -12, 
      rotateX: 2,
      rotateY: 2,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: {
        duration: 0.4,
        ease: AppleEasing.reveal
      }
    }
  }
}

// Performance monitoring for animations
export const AnimationPerformanceMonitor = {
  frameRate: 0,
  lastTime: 0,
  frameCount: 0,
  isMonitoring: false,

  start() {
    if (this.isMonitoring) return
    this.isMonitoring = true
    this.lastTime = performance.now()
    this.frameCount = 0
    this.monitor()
  },

  stop() {
    this.isMonitoring = false
  },

  monitor() {
    if (!this.isMonitoring) return

    const currentTime = performance.now()
    this.frameCount++

    if (currentTime - this.lastTime >= 1000) {
      this.frameRate = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
      this.frameCount = 0
      this.lastTime = currentTime

      // Log performance warning if FPS drops below 45
      if (this.frameRate < 45) {
        console.warn(`Animation performance warning: ${this.frameRate}fps detected`)
      }
    }

    requestAnimationFrame(() => this.monitor())
  },

  getFrameRate() {
    return this.frameRate
  }
}

export default {
  useIntersectionObserver,
  useParallax,
  useScrollProgress,
  useCounterAnimation,
  useScrollVelocity,
  smoothScrollTo,
  prefersReducedMotion,
  AutomotiveAnimationPresets,
  AnimationPerformanceMonitor
}