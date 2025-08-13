'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  AppleHeroSection, 
  MagneticButton, 
  ContentReveal, 
  StaggeredReveal, 
  DepthCard,
  ScrollProgressIndicator 
} from '@/components/animations/AppleStyleAnimations'
import { useScrollProgress } from '@/lib/scroll-animations'

export default function AnimationDemo() {
  const [isClient, setIsClient] = useState(false)
  const scrollProgress = useScrollProgress()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Animation Demo...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ScrollProgressIndicator />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-white hover:text-orange-400 transition-colors">
              CarBot Demo
            </Link>
            <div className="text-sm text-white/70">
              Scroll Progress: {Math.round(scrollProgress * 100)}%
            </div>
          </div>
        </div>
      </nav>

      {/* Apple-Style Hero Section */}
      <AppleHeroSection enableParticles={true}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <ContentReveal direction="up" delay={200}>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm">Apple.com-Style Animations Live Demo</span>
            </div>
          </ContentReveal>

          <ContentReveal direction="up" delay={400}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-white mb-2">Sophisticated</span>
              <span className="block bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Animation System
              </span>
              <span className="block text-2xl md:text-3xl text-white/80 font-light mt-4">
                for CarBot Platform
              </span>
            </h1>
          </ContentReveal>

          <ContentReveal direction="up" delay={600}>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience buttery-smooth 60fps animations with advanced parallax effects, 
              magnetic interactions, and sophisticated easing curves inspired by Apple's design language.
            </p>
          </ContentReveal>

          <StaggeredReveal staggerDelay={200}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton 
                strength={1.5}
                className="px-8 py-4 text-lg font-semibold"
              >
                🚀 Experience Magic
              </MagneticButton>
              
              <MagneticButton 
                strength={1}
                className="px-8 py-4 text-lg font-semibold !bg-white/10 backdrop-blur-lg border border-white/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                📱 View Source Code
              </MagneticButton>
            </div>
          </StaggeredReveal>
        </div>
      </AppleHeroSection>

      {/* Animation Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <ContentReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Animation Features</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore the sophisticated animation components that bring your interface to life
            </p>
          </div>
        </ContentReveal>

        <StaggeredReveal staggerDelay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Parallax Demo */}
            <DepthCard 
              hoverStrength={1.2}
              className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Multi-Layer Parallax</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Advanced parallax system with depth-based layering and perspective transforms 
                that create immersive 3D-like experiences.
              </p>
              <div className="text-sm text-orange-400 font-semibold">
                3D Transforms • GPU Accelerated
              </div>
            </DepthCard>

            {/* Magnetic Interactions */}
            <DepthCard 
              hoverStrength={1.2}
              className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🧲</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Magnetic Elements</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Elements that respond to cursor movement with smooth magnetic attraction, 
                creating delightful micro-interactions.
              </p>
              <div className="text-sm text-purple-400 font-semibold">
                Mouse Tracking • Smooth Physics
              </div>
            </DepthCard>

            {/* Scroll Reveals */}
            <DepthCard 
              hoverStrength={1.2}
              className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Scroll Reveals</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Content elegantly reveals as you scroll with sophisticated timing 
                and Apple-inspired easing curves.
              </p>
              <div className="text-sm text-green-400 font-semibold">
                Intersection Observer • Performance Optimized
              </div>
            </DepthCard>

            {/* Performance Monitor */}
            <DepthCard 
              hoverStrength={1.2}
              className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">60fps Performance</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                All animations are optimized for 60fps with GPU acceleration, 
                reduced motion support, and performance monitoring.
              </p>
              <div className="text-sm text-yellow-400 font-semibold">
                GPU Acceleration • Frame Rate Monitoring
              </div>
            </DepthCard>

            {/* Depth Effects */}
            <DepthCard 
              hoverStrength={1.2}
              className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">3D Depth Cards</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Cards with sophisticated 3D hover effects that tilt and elevate, 
                creating impressive depth illusions.
              </p>
              <div className="text-sm text-pink-400 font-semibold">
                3D Transforms • Perspective Effects
              </div>
            </DepthCard>

            {/* Staggered Animations */}
            <DepthCard 
              hoverStrength={1.2}
              className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Staggered Reveals</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Multiple elements animate in sequence with configurable delays, 
                creating choreographed animation sequences.
              </p>
              <div className="text-sm text-indigo-400 font-semibold">
                Sequence Control • Timing Management
              </div>
            </DepthCard>
          </div>
        </StaggeredReveal>
      </section>

      {/* Interactive Demo Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <ContentReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interactive Demo</h2>
            <p className="text-xl text-white/70">
              Try out the magnetic interactions and depth effects
            </p>
          </div>
        </ContentReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ContentReveal direction="left" delay={200}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Magnetic Buttons</h3>
              <p className="text-white/70 mb-6">
                Hover over these buttons to experience the magnetic attraction effect:
              </p>
              
              <div className="space-y-4">
                <MagneticButton strength={1} className="w-full">
                  Subtle Magnetism (Strength: 1)
                </MagneticButton>
                
                <MagneticButton strength={1.5} className="w-full">
                  Medium Magnetism (Strength: 1.5)
                </MagneticButton>
                
                <MagneticButton strength={2} className="w-full">
                  Strong Magnetism (Strength: 2)
                </MagneticButton>
              </div>
            </div>
          </ContentReveal>

          <ContentReveal direction="right" delay={400}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Depth Cards</h3>
              <p className="text-white/70 mb-6">
                Hover over these cards to see the 3D tilt effect:
              </p>
              
              <div className="space-y-4">
                <DepthCard 
                  hoverStrength={0.5}
                  className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌟</div>
                    <div className="font-semibold">Subtle Depth</div>
                  </div>
                </DepthCard>
                
                <DepthCard 
                  hoverStrength={1}
                  className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="font-semibold">Medium Depth</div>
                  </div>
                </DepthCard>
                
                <DepthCard 
                  hoverStrength={1.5}
                  className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="font-semibold">Strong Depth</div>
                  </div>
                </DepthCard>
              </div>
            </div>
          </ContentReveal>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <ContentReveal direction="up">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Technical Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Performance</h4>
                <ul className="space-y-2 text-white/70">
                  <li>• 60fps target frame rate</li>
                  <li>• GPU hardware acceleration</li>
                  <li>• Optimized for mobile devices</li>
                  <li>• Reduced motion support</li>
                  <li>• Performance monitoring</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-purple-400">Features</h4>
                <ul className="space-y-2 text-white/70">
                  <li>• Multi-layer parallax scrolling</li>
                  <li>• Magnetic cursor interactions</li>
                  <li>• Sophisticated easing curves</li>
                  <li>• 3D depth transformations</li>
                  <li>• Staggered reveal animations</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Apple-Style Easing Curves</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-mono text-white/90">signature</div>
                  <div className="text-white/60">cubic-bezier(0.25, 0.46, 0.45, 0.94)</div>
                </div>
                <div>
                  <div className="font-mono text-white/90">reveal</div>
                  <div className="text-white/60">cubic-bezier(0.16, 1, 0.3, 1)</div>
                </div>
                <div>
                  <div className="font-mono text-white/90">magnetic</div>
                  <div className="text-white/60">cubic-bezier(0.68, -0.55, 0.265, 1.55)</div>
                </div>
              </div>
            </div>
          </div>
        </ContentReveal>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ContentReveal direction="scale" delay={200}>
          <DepthCard 
            hoverStrength={1}
            className="p-12 bg-gradient-to-r from-orange-500/10 to-purple-600/10 backdrop-blur-lg border border-white/20 rounded-3xl"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Implement?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto">
              Integrate these sophisticated animations into your CarBot project and create 
              unforgettable user experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton 
                strength={1.2}
                onClick={() => window.location.href = '/'}
              >
                🏠 Back to Homepage
              </MagneticButton>
              
              <MagneticButton 
                strength={1}
                className="!bg-white/10 backdrop-blur-lg border border-white/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onClick={() => window.open('https://github.com/yourusername/carbot', '_blank')}
              >
                📚 View Documentation
              </MagneticButton>
            </div>
          </DepthCard>
        </ContentReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-white/60">
            Built with Next.js, Tailwind CSS, and love for smooth animations 
            <span className="text-red-400">♥</span>
          </p>
        </div>
      </footer>
    </div>
  )
}