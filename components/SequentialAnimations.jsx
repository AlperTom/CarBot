'use client'
import { useState, useEffect, useRef } from 'react'

// Sequential reveal animation system
export function useSequentialReveal(elements = [], delay = 100) {
  const [visibleElements, setVisibleElements] = useState(new Set())
  const observerRef = useRef()
  const elementRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = elementRefs.current.indexOf(entry.target)
            if (index !== -1) {
              // Reveal elements sequentially
              setTimeout(() => {
                setVisibleElements(prev => new Set([...prev, index]))
              }, index * delay)
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observerRef.current = observer
    
    return () => observer.disconnect()
  }, [delay])

  const registerElement = (index) => (el) => {
    if (el) {
      elementRefs.current[index] = el
      observerRef.current?.observe(el)
    }
  }

  return { visibleElements, registerElement }
}

// Sequential reveal component with proper timing
export function SequentialReveal({ 
  children, 
  delay = 100, 
  duration = 600,
  distance = 20,
  className = '',
  as = 'div'
}) {
  const Component = as
  const childrenArray = Array.isArray(children) ? children : [children]
  const { visibleElements, registerElement } = useSequentialReveal(childrenArray, delay)

  return (
    <Component className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          ref={registerElement(index)}
          style={{
            opacity: visibleElements.has(index) ? 1 : 0,
            transform: visibleElements.has(index) 
              ? 'translateY(0px) scale(1)' 
              : `translateY(${distance}px) scale(0.98)`,
            transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            willChange: 'transform, opacity'
          }}
        >
          {child}
        </div>
      ))}
    </Component>
  )
}

// Progressive text reveal (word by word or line by line)
export function ProgressiveTextReveal({ 
  text, 
  mode = 'words', // 'words' or 'lines'
  delay = 50,
  className = '',
  style = {}
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const ref = useRef()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const segments = mode === 'words' 
    ? text.split(' ')
    : text.split('\n')

  useEffect(() => {
    if (!isInView) return

    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < segments.length) {
          return prev + 1
        }
        clearInterval(timer)
        return prev
      })
    }, delay)

    return () => clearInterval(timer)
  }, [isInView, segments.length, delay])

  return (
    <div ref={ref} className={className} style={style}>
      {segments.map((segment, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleCount ? 1 : 0,
            transform: index < visibleCount ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: mode === 'lines' ? 'block' : 'inline',
            marginRight: mode === 'words' ? '0.25rem' : '0'
          }}
        >
          {segment}
          {mode === 'lines' && <br />}
        </span>
      ))}
    </div>
  )
}

// Content cascade effect (ensures no title appears before content)
export function ContentCascade({ children, className = '' }) {
  const [currentStep, setCurrentStep] = useState(0)
  const ref = useRef()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1
        if (nextStep >= children.length) {
          clearInterval(timer)
        }
        return nextStep
      })
    }, 200) // Increased delay for better sequencing

    return () => clearInterval(timer)
  }, [isInView, children.length])

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: index <= currentStep ? 1 : 0,
            transform: index <= currentStep 
              ? 'translateY(0px) scale(1)' 
              : 'translateY(20px) scale(0.98)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Blog post reveal animation
export function BlogPostReveal({ posts, className = '' }) {
  const { visibleElements, registerElement } = useSequentialReveal(posts, 150)

  return (
    <div className={className}>
      {posts.map((post, index) => (
        <div
          key={post.id || index}
          ref={registerElement(index)}
          style={{
            opacity: visibleElements.has(index) ? 1 : 0,
            transform: visibleElements.has(index) 
              ? 'translateY(0px) scale(1)' 
              : 'translateY(30px) scale(0.95)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity',
            marginBottom: '1.5rem'
          }}
        >
          {post}
        </div>
      ))}
    </div>
  )
}

export default {
  useSequentialReveal,
  SequentialReveal,
  ProgressiveTextReveal,
  ContentCascade,
  BlogPostReveal
}