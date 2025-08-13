/**
 * Performance Monitor for Apple-Style Animations
 * Tracks FPS, memory usage, and animation performance in real-time
 */

'use client'

import { useState, useEffect, useRef } from 'react'

export function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  className = '' 
}) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    activeAnimations: 0,
    totalFrames: 0,
    droppedFrames: 0
  })

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const animationFrame = useRef(null)
  const frameTimeHistory = useRef([])
  const droppedFrameCount = useRef(0)

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  useEffect(() => {
    if (!enabled) return

    const measurePerformance = (currentTime) => {
      frameCount.current++
      const deltaTime = currentTime - lastTime.current

      // Calculate FPS every second
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / deltaTime)
        const avgFrameTime = deltaTime / frameCount.current

        // Track frame times for dropped frame detection
        frameTimeHistory.current.push(avgFrameTime)
        if (frameTimeHistory.current.length > 60) {
          frameTimeHistory.current.shift()
        }

        // Detect dropped frames (frame time > 16.67ms for 60fps)
        const droppedFrames = frameTimeHistory.current.filter(time => time > 16.67).length
        if (droppedFrames > droppedFrameCount.current) {
          droppedFrameCount.current = droppedFrames
        }

        // Get memory usage (if available)
        let memoryUsage = 0
        if (performance.memory) {
          memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        }

        // Count active animations (approximation based on will-change elements)
        const activeAnimations = document.querySelectorAll('[style*="will-change"]').length

        setMetrics({
          fps,
          frameTime: Math.round(avgFrameTime * 100) / 100,
          memoryUsage,
          activeAnimations,
          totalFrames: frameCount.current,
          droppedFrames: droppedFrameCount.current
        })

        frameCount.current = 0
        lastTime.current = currentTime
      }

      animationFrame.current = requestAnimationFrame(measurePerformance)
    }

    animationFrame.current = requestAnimationFrame(measurePerformance)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [enabled])

  if (!enabled) return null

  const getPerformanceStatus = () => {
    if (metrics.fps >= 55) return { status: 'excellent', color: 'text-green-400' }
    if (metrics.fps >= 45) return { status: 'good', color: 'text-yellow-400' }
    if (metrics.fps >= 30) return { status: 'fair', color: 'text-orange-400' }
    return { status: 'poor', color: 'text-red-400' }
  }

  const performance = getPerformanceStatus()

  return (
    <div className={`
      fixed z-[9999] 
      ${positionClasses[position]} 
      bg-black/80 backdrop-blur-sm 
      text-white text-xs 
      p-3 rounded-lg 
      border border-white/20
      font-mono
      min-w-[200px]
      ${className}
    `}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Performance</span>
        <div className={`w-2 h-2 rounded-full ${
          performance.status === 'excellent' ? 'bg-green-400' :
          performance.status === 'good' ? 'bg-yellow-400' :
          performance.status === 'fair' ? 'bg-orange-400' : 'bg-red-400'
        }`} />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={performance.color}>{metrics.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span className="text-white/80">{metrics.frameTime}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>Animations:</span>
          <span className="text-blue-400">{metrics.activeAnimations}</span>
        </div>
        
        {metrics.memoryUsage > 0 && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-purple-400">{metrics.memoryUsage}MB</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Dropped:</span>
          <span className={metrics.droppedFrames > 5 ? 'text-red-400' : 'text-white/80'}>
            {metrics.droppedFrames}
          </span>
        </div>
        
        <div className="flex justify-between text-[10px] text-white/60 mt-2 pt-2 border-t border-white/20">
          <span>Total Frames:</span>
          <span>{metrics.totalFrames}</span>
        </div>
      </div>
    </div>
  )
}

// Hook for getting performance metrics in components
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    isPerformant: true,
    shouldReduceAnimations: false
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationFrame = null

    const measureFPS = (currentTime) => {
      frameCount++
      const deltaTime = currentTime - lastTime

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime)
        const isPerformant = fps >= 45
        const shouldReduceAnimations = fps < 30

        setMetrics({
          fps,
          isPerformant,
          shouldReduceAnimations
        })

        frameCount = 0
        lastTime = currentTime
      }

      animationFrame = requestAnimationFrame(measureFPS)
    }

    animationFrame = requestAnimationFrame(measureFPS)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return metrics
}

// Component that automatically adjusts animation complexity based on performance
export function AdaptiveAnimationWrapper({ children, fallback = null }) {
  const { shouldReduceAnimations } = usePerformanceMetrics()

  if (shouldReduceAnimations && fallback) {
    return fallback
  }

  return children
}

export default {
  PerformanceMonitor,
  usePerformanceMetrics,
  AdaptiveAnimationWrapper
}