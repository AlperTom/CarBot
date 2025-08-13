'use client'

import { useEffect, useState } from 'react';
import { ScrollProgressBar, ScrollToTop } from '../animations/ScrollProgress';
import { FadeInOnScroll } from '../animations/ScrollAnimations';

/**
 * AnimatedLayout - Enhanced layout wrapper with scroll effects
 * Provides scroll progress, smooth scrolling, and section transitions
 */
export default function AnimatedLayout({ 
  children, 
  showScrollProgress = true,
  showScrollToTop = true,
  sections = [],
  className = '' 
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Smooth scroll behavior for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      e.preventDefault();
      const targetId = target.getAttribute('href').slice(1);
      const element = document.getElementById(targetId);
      
      if (element) {
        const headerHeight = 80; // Adjust based on your header height
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Page transition wrapper
  const PageTransition = ({ children }) => (
    <div
      className={`transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Scroll Progress Bar */}
      {showScrollProgress && (
        <ScrollProgressBar 
          className="z-50"
          color="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          height={3}
          showPercentage={false}
        />
      )}

      {/* Main Content with Page Transition */}
      <PageTransition>
        <main className="relative">
          {children}
        </main>
      </PageTransition>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <ScrollToTop 
          showAfter={400}
          size="md"
          className="z-40"
        />
      )}

      {/* Background Effects */}
      <BackgroundEffects />
    </div>
  );
}

// Background effects component
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-float" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-float-reverse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-indigo-400/20 rounded-full animate-float-reverse" style={{ animationDelay: '3s' }} />
      
      {/* Gradient orbs */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-scale-pulse" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl animate-scale-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}

// Section wrapper with animation
export function AnimatedSection({ 
  children, 
  id,
  className = '',
  background = 'transparent',
  spacing = 'py-16',
  animation = 'fade-up',
  delay = 0
}) {
  const animationProps = {
    direction: animation.includes('up') ? 'up' : 
              animation.includes('down') ? 'down' :
              animation.includes('left') ? 'left' : 'right',
    delay
  };

  return (
    <section 
      id={id}
      className={`relative ${background} ${spacing} ${className}`}
      style={{ scrollMarginTop: '80px' }} // Offset for fixed header
    >
      <FadeInOnScroll {...animationProps}>
        {children}
      </FadeInOnScroll>
    </section>
  );
}

// Container with max-width and padding
export function AnimatedContainer({ 
  children, 
  size = 'max-w-7xl',
  className = '' 
}) {
  return (
    <div className={`${size} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

// Grid component with staggered animations
export function AnimatedGrid({ 
  children, 
  cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-6',
  className = '',
  staggerDelay = 100
}) {
  return (
    <div className={`grid ${cols} ${gap} ${className}`}>
      {Array.isArray(children) ? children.map((child, index) => (
        <FadeInOnScroll 
          key={index}
          direction="up" 
          delay={index * staggerDelay}
        >
          {child}
        </FadeInOnScroll>
      )) : children}
    </div>
  );
}

// Parallax section wrapper
export function ParallaxSection({ 
  children, 
  backgroundImage,
  height = 'min-h-screen',
  overlay = 'bg-black/50',
  className = '' 
}) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden ${className}`}>
      {/* Parallax Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: 'translateZ(0)', // Hardware acceleration
          }}
        />
      )}
      
      {/* Overlay */}
      {overlay && (
        <div className={`absolute inset-0 ${overlay}`} />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

// Hero section with enhanced animations
export function AnimatedHero({ 
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className = ''
}) {
  return (
    <ParallaxSection
      backgroundImage={backgroundImage}
      className={className}
    >
      <AnimatedContainer className="text-center text-white">
        <FadeInOnScroll direction="down" delay={200}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
            {title}
          </h1>
        </FadeInOnScroll>
        
        {subtitle && (
          <FadeInOnScroll direction="up" delay={400}>
            <p className="text-xl md:text-2xl mb-4 drop-shadow-lg">
              {subtitle}
            </p>
          </FadeInOnScroll>
        )}
        
        {description && (
          <FadeInOnScroll direction="up" delay={600}>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90 drop-shadow-lg">
              {description}
            </p>
          </FadeInOnScroll>
        )}
        
        <FadeInOnScroll direction="up" delay={800}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryCta && (
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                {primaryCta.text}
              </button>
            )}
            
            {secondaryCta && (
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-900 backdrop-blur-sm hover:scale-105">
                {secondaryCta.text}
              </button>
            )}
          </div>
        </FadeInOnScroll>
      </AnimatedContainer>
    </ParallaxSection>
  );
}

// Call-to-action section with animations
export function AnimatedCTA({ 
  title,
  description,
  buttonText,
  buttonAction,
  background = 'bg-gradient-to-r from-blue-600 to-purple-600',
  className = ''
}) {
  return (
    <AnimatedSection 
      className={`${background} text-white ${className}`}
      animation="fade-up"
    >
      <AnimatedContainer className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
          {description}
        </p>
        <button 
          onClick={buttonAction}
          className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          {buttonText}
        </button>
      </AnimatedContainer>
    </AnimatedSection>
  );
}