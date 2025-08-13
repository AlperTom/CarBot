/**
 * ScrollProgress Components
 * Progress indicators and scroll-based navigation
 */

'use client'

import { useScrollProgress, smoothScrollTo, prefersReducedMotion } from '@/lib/scroll-animations'
import { useState, useEffect, useRef } from 'react'

// Main Scroll Progress Bar
export const ScrollProgressBar = ({
  height = 4,
  color = '#f97316',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  position = 'top', // 'top', 'bottom'
  className = '',
  showPercentage = false
}) => {
  const progress = useScrollProgress()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (prefersReducedMotion()) {
    return null
  }

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  return (
    <div
      className={`fixed left-0 right-0 z-50 transition-opacity duration-300 ${positionClasses[position]} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        height: `${height}px`,
        backgroundColor
      }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress * 100}%`,
          backgroundColor: color,
          transformOrigin: 'left center'
        }}
      />
      
      {showPercentage && isVisible && (
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded bg-black bg-opacity-75 text-white"
        >
          {Math.round(progress * 100)}%
        </div>
      )}
    </div>
  )
}

// Circular Progress Indicator
export const ScrollProgressCircle = ({
  size = 60,
  strokeWidth = 4,
  color = '#f97316',
  backgroundColor = '#e5e7eb',
  showOnScroll = true,
  className = '',
  children
}) => {
  const progress = useScrollProgress()
  const [isVisible, setIsVisible] = useState(!showOnScroll)

  useEffect(() => {
    if (!showOnScroll) return

    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showOnScroll])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress * circumference)

  const handleClick = () => {
    smoothScrollTo(0, 800)
  }

  if (prefersReducedMotion()) {
    return (
      <div className={`${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)'
      }}
      onClick={handleClick}
    >
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
          className="transition-all duration-150 ease-out"
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
      </div>
    </div>
  )
}

// Section Navigation Dots
export const SectionNavigation = ({
  sections = [],
  activeSection = 0,
  onSectionChange,
  position = 'right', // 'left', 'right'
  className = ''
}) => {
  const [currentSection, setCurrentSection] = useState(activeSection)

  useEffect(() => {
    if (sections.length === 0) return

    const observers = sections.map((section, index) => {
      const element = typeof section === 'string' ? document.querySelector(section) : section.element
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setCurrentSection(index)
            onSectionChange?.(index, section)
          }
        },
        {
          threshold: 0.5,
          rootMargin: '-20% 0px -20% 0px'
        }
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [sections, onSectionChange])

  const handleDotClick = (index) => {
    const section = sections[index]
    const element = typeof section === 'string' ? document.querySelector(section) : section.element
    
    if (element) {
      smoothScrollTo(element, 800, 100)
    }
    
    setCurrentSection(index)
    onSectionChange?.(index, section)
  }

  if (prefersReducedMotion() || sections.length === 0) {
    return null
  }

  const positionClasses = {
    left: 'left-8',
    right: 'right-8'
  }

  return (
    <div
      className={`fixed top-1/2 transform -translate-y-1/2 z-40 ${positionClasses[position]} ${className}`}
    >
      <div className="flex flex-col space-y-4">
        {sections.map((section, index) => {
          const isActive = index === currentSection
          const label = typeof section === 'string' ? section : section.label || `Section ${index + 1}`
          
          return (
            <button
              key={index}
              className="group relative flex items-center"
              onClick={() => handleDotClick(index)}
            >
              {/* Dot */}
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-500 border-orange-500 scale-110'
                    : 'bg-transparent border-gray-400 hover:border-orange-400 hover:scale-105'
                }`}
              />
              
              {/* Label */}
              <span
                className={`ml-4 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  position === 'right' ? 'transform -translate-x-2' : ''
                } ${
                  isActive
                    ? 'bg-orange-500 text-white opacity-100 scale-100'
                    : 'bg-gray-800 bg-opacity-75 text-gray-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Reading Progress for Blog Posts
export const ReadingProgress = ({
  target,
  className = '',
  showTimeEstimate = true,
  wordsPerMinute = 200
}) => {
  const progress = useScrollProgress(target)
  const [timeEstimate, setTimeEstimate] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target
    if (!targetElement || !showTimeEstimate) return

    // Calculate reading time estimate
    const text = targetElement.textContent || ''
    const wordCount = text.split(/\s+/).length
    const estimatedMinutes = Math.ceil(wordCount / wordsPerMinute)
    setTimeEstimate(estimatedMinutes)
  }, [target, showTimeEstimate, wordsPerMinute])

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (prefersReducedMotion()) {
    return null
  }

  const remainingTime = Math.ceil(timeEstimate * (1 - progress))

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg border p-4 transition-all duration-300 z-40 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)'
      }}
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Progress Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{Math.round(progress * 100)}% gelesen</span>
        {showTimeEstimate && (
          <span>
            {remainingTime > 0 ? `${remainingTime} Min. verbleibend` : 'Fertig gelesen!'}
          </span>
        )}
      </div>
    </div>
  )
}

// Automotive-themed Progress Indicator
export const SpeedometerProgress = ({
  progress = 0,
  size = 120,
  maxValue = 100,
  unit = '',
  label = '',
  color = '#f97316',
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setAnimatedProgress(progress)
      return
    }

    const animate = () => {
      setAnimatedProgress(current => {
        const difference = progress - current
        if (Math.abs(difference) < 0.1) return progress
        return current + difference * 0.1
      })
    }

    const intervalId = setInterval(animate, 16) // 60fps
    return () => clearInterval(intervalId)
  }, [progress])

  // Calculate angle for speedometer (180 degrees range)
  const angle = (animatedProgress / maxValue) * 180 - 90

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size / 2 + 20 }}>
      {/* Speedometer Arc */}
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
        className="absolute inset-0"
      >
        {/* Background Arc */}
        <path
          d={`M 10 ${size / 2} A ${size / 2 - 10} ${size / 2 - 10} 0 0 1 ${size - 10} ${size / 2}`}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Progress Arc */}
        <path
          d={`M 10 ${size / 2} A ${size / 2 - 10} ${size / 2 - 10} 0 0 1 ${size - 10} ${size / 2}`}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(animatedProgress / maxValue) * Math.PI * (size / 2 - 10)} ${Math.PI * (size / 2 - 10)}`}
          className="transition-all duration-500"
        />

        {/* Needle */}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2 + Math.cos((angle * Math.PI) / 180) * (size / 2 - 25)}
          y2={size / 2 + Math.sin((angle * Math.PI) / 180) * (size / 2 - 25)}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-500"
        />

        {/* Center Dot */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="6"
          fill={color}
        />
      </svg>

      {/* Value Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <div className="text-2xl font-bold" style={{ color }}>
          {Math.round(animatedProgress)}{unit}
        </div>
        {label && (
          <div className="text-sm text-gray-600 mt-1">
            {label}
          </div>
        )}
      </div>
    </div>
  )
}

export default {
  ScrollProgressBar,
  ScrollProgressCircle,
  SectionNavigation,
  ReadingProgress,
  SpeedometerProgress
}