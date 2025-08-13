'use client'
import { useEffect, useRef, useState } from 'react'

// Apple.com-style smooth scroll and parallax animations
export function useAppleScrollEffects() {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setIsScrolling(true)
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    // Smooth scroll behavior
    const smoothScroll = (e) => {
      e.preventDefault()
      const target = document.querySelector(e.target.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Add smooth scrolling to internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', smoothScroll)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.removeEventListener('click', smoothScroll)
      })
    }
  }, [])

  return { scrollY, isScrolling }
}

// Intersection Observer for reveal animations
export function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Apple-style parallax background component
export function ParallaxBackground({ children, speed = 0.5, className = '' }) {
  const { scrollY } = useAppleScrollEffects()
  const ref = useRef()

  return (
    <div 
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${scrollY * speed}px)`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  )
}

// Smooth reveal component with Apple-style easing
export function SmoothReveal({ 
  children, 
  delay = 0, 
  duration = 0.8,
  distance = 30,
  className = ''
}) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? 'translateY(0px) scale(1)' 
          : `translateY(${distance}px) scale(0.95)`,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  )
}

// Apple-style magnetic button effect
export function MagneticButton({ 
  children, 
  className = '', 
  magnetStrength = 0.3,
  ...props 
}) {
  const ref = useRef()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const button = ref.current
    if (!button || typeof window === 'undefined') return

    // Only enable magnetic effect on desktop devices
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
    if (isMobile) return

    let isReady = false
    
    // Delay magnetic effect to prevent loading issues
    const readyTimeout = setTimeout(() => {
      isReady = true
    }, 100)

    const handleMouseMove = (e) => {
      if (!isReady || !isHovered) return
      
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * magnetStrength
      const deltaY = (e.clientY - centerY) * magnetStrength

      requestAnimationFrame(() => {
        button.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.02)`
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      requestAnimationFrame(() => {
        button.style.transform = 'translate3d(0px, 0px, 0) scale(1)'
      })
    }

    const handleMouseEnter = () => {
      if (!isReady) return
      setIsHovered(true)
    }

    button.addEventListener('mousemove', handleMouseMove, { passive: true })
    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(readyTimeout)
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [magnetStrength, isHovered])

  return (
    <button
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// Apple-style floating elements
export function FloatingElement({ 
  children, 
  speed = 1, 
  amplitude = 10, 
  direction = 'vertical',
  className = ''
}) {
  const ref = useRef()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let animationId
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const offset = Math.sin(elapsed * speed) * amplitude

      if (direction === 'vertical') {
        element.style.transform = `translateY(${offset}px)`
      } else {
        element.style.transform = `translateX(${offset}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [speed, amplitude, direction])

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

// Staggered reveal for multiple elements (like blog posts)
export function StaggeredReveal({ 
  children, 
  staggerDelay = 150, 
  initialDelay = 0,
  className = ''
}) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <SmoothReveal 
              key={index}
              delay={(index * staggerDelay + initialDelay) / 1000}
              duration={0.6}
              distance={40}
            >
              {child}
            </SmoothReveal>
          ))
        : children
      }
    </div>
  )
}

// Scroll progress indicator (Apple style)
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setProgress(Math.min(currentProgress, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #ea580c, #9333ea, #2563eb)',
          transition: 'width 0.1s ease-out',
          willChange: 'width'
        }}
      />
    </div>
  )
}

export default {
  useAppleScrollEffects,
  useScrollReveal,
  ParallaxBackground,
  SmoothReveal,
  StaggeredReveal,
  MagneticButton,
  FloatingElement,
  ScrollProgress
}