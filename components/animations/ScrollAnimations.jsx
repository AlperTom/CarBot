'use client'

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Enhanced Scroll Animations for CarBot
 * Provides high-performance parallax and scroll-triggered animations
 * Optimized for mobile devices with respect for user preferences
 */

// Custom hook for scroll position tracking with throttling
export function useScrollPosition(throttleMs = 16) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  const updateScrollPosition = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
    setScrollY(currentScrollY);
    setIsScrolling(true);
    
    lastScrollY.current = currentScrollY;

    // Clear existing timeout and set new one
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    let timeoutId = null;
    
    const throttledScrollHandler = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          updateScrollPosition();
          timeoutId = null;
        }, throttleMs);
      }
    };

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    updateScrollPosition(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [throttleMs, updateScrollPosition]);

  return { scrollY, scrollDirection, isScrolling };
}

// Custom hook for intersection observer animations
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
}

// Parallax Background Component
export function ParallaxBackground({ 
  children, 
  speed = 0.5, 
  className = '',
  enableMobile = true 
}) {
  const { scrollY } = useScrollPosition();
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Disable parallax on mobile if not enabled
  const shouldUseParallax = enableMobile || !isMobile;
  const transform = shouldUseParallax ? `translateY(${scrollY * speed}px)` : 'none';

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        willChange: shouldUseParallax ? 'transform' : 'auto'
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform,
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Scroll-triggered fade in animation
export function FadeInOnScroll({ 
  children, 
  delay = 0, 
  direction = 'up', 
  distance = 30,
  className = '' 
}) {
  const { ref, hasIntersected } = useIntersectionObserver();
  
  const getTransform = () => {
    if (hasIntersected) return 'translateY(0) translateX(0)';
    
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'left': return `translateX(${distance}px)`;
      case 'right': return `translateX(-${distance}px)`;
      default: return `translateY(${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hasIntersected ? 1 : 0,
        transform: getTransform(),
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: hasIntersected ? 'auto' : 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}

// Stagger animation for multiple items
export function StaggeredFadeIn({ 
  children, 
  staggerDelay = 100, 
  className = '' 
}) {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: hasIntersected ? 1 : 0,
            transform: hasIntersected ? 'translateY(0)' : 'translateY(30px)',
            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * staggerDelay}ms`,
            willChange: hasIntersected ? 'auto' : 'opacity, transform'
          }}
        >
          {child}
        </div>
      )) : children}
    </div>
  );
}

// Scale on scroll animation
export function ScaleOnScroll({ 
  children, 
  scale = 1.05, 
  className = '' 
}) {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: isIntersecting ? `scale(${scale})` : 'scale(1)',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

// Rotating elements on scroll
export function RotateOnScroll({ 
  children, 
  maxRotation = 360, 
  className = '' 
}) {
  const { scrollY } = useScrollPosition();
  const containerRef = useRef();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate rotation based on scroll position relative to element
      const scrollProgress = Math.max(0, Math.min(1, 
        (scrollY - elementTop + windowHeight) / (windowHeight + elementHeight)
      ));
      
      setRotation(scrollProgress * maxRotation);
    }
  }, [scrollY, maxRotation]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

// Smooth scroll to element utility
export function smoothScrollTo(elementId, offset = 0) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Performance monitoring hook
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = Date.now();
      const elapsed = currentTime - startTime.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        frameCount.current = 0;
        startTime.current = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return fps;
}