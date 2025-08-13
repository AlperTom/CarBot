/**
 * Animation Showcase Dashboard
 * Interactive testing and demonstration of all CarBot animations
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import ScrollReveal, { ServiceCardReveal, StatsCounterReveal, HeroElementReveal, FeatureListReveal, TypewriterReveal } from './ScrollReveal'
import ParallaxSection, { WorkshopParallaxHero, ServiceShowcaseParallax, TestimonialsParallax } from './ParallaxSection'
import { EngineStartButton, ServiceCard, AnimatedCounter, MagneticButton, AutomotiveSpinner, AnimatedIcon, ProgressRing } from './MicroInteractions'
import { ScrollProgressBar, ScrollProgressCircle, SectionNavigation, ReadingProgress, SpeedometerProgress } from './ScrollProgress'
import { AnimationPerformanceMonitor } from '@/lib/scroll-animations'

const AnimationShowcase = () => {
  const [activeTab, setActiveTab] = useState('reveal')
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [frameRate, setFrameRate] = useState(60)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Demo states
  const [counterValue, setCounterValue] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Performance monitoring
    if (isMonitoring) {
      AnimationPerformanceMonitor.start()
      const interval = setInterval(() => {
        setFrameRate(AnimationPerformanceMonitor.getFrameRate())
      }, 1000)
      return () => {
        clearInterval(interval)
        AnimationPerformanceMonitor.stop()
      }
    }
  }, [isMonitoring])

  // Demo functions
  const triggerCounter = () => {
    setCounterValue(Math.floor(Math.random() * 10000) + 1000)
  }

  const triggerProgress = () => {
    setProgressValue(0)
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const triggerLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  const sections = [
    { label: 'Scroll Reveals', element: '#reveal-section' },
    { label: 'Parallax Effects', element: '#parallax-section' },
    { label: 'Micro Interactions', element: '#interactions-section' },
    { label: 'Progress Indicators', element: '#progress-section' }
  ]

  const tabs = [
    { id: 'reveal', label: 'Scroll Reveals', icon: '🎭' },
    { id: 'parallax', label: 'Parallax Effects', icon: '🏔️' },
    { id: 'micro', label: 'Micro Interactions', icon: '🎯' },
    { id: 'progress', label: 'Progress Indicators', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '⚡' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Performance Monitoring */}
      <ScrollProgressBar />
      
      {/* Fixed Navigation */}
      <SectionNavigation sections={sections} />

      {/* Header */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <HeroElementReveal>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              CarBot Animation System
            </h1>
            <TypewriterReveal
              text="Sophisticated scroll interactions and micro-animations for automotive workshops"
              className="text-xl text-gray-300 max-w-4xl mx-auto"
              speed={30}
            />
          </HeroElementReveal>

          {/* Performance Monitor */}
          <div className="mt-8 flex justify-center">
            <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center space-x-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-4 py-2 rounded-lg ${isMonitoring ? 'bg-green-600' : 'bg-gray-600'} transition-colors`}
              >
                {isMonitoring ? 'Stop' : 'Start'} Performance Monitor
              </button>
              {isMonitoring && (
                <div className="text-sm">
                  <span className={`font-semibold ${frameRate < 45 ? 'text-red-400' : frameRate < 55 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {frameRate} FPS
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-30 bg-gray-900 bg-opacity-90 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-1 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Scroll Reveals Section */}
        {activeTab === 'reveal' && (
          <div id="reveal-section" className="space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Scroll Reveal Animations</h2>
              <p className="text-gray-400">Elements animate into view as you scroll</p>
            </div>

            {/* Service Cards Demo */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Service Cards</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <ServiceCardReveal delay={0.1}>
                  <ServiceCard>
                    <div className="text-4xl mb-4">🔧</div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">Engine Repair</h4>
                    <p className="text-gray-600">Professional engine diagnostics and repair services</p>
                  </ServiceCard>
                </ServiceCardReveal>
                
                <ServiceCardReveal delay={0.3}>
                  <ServiceCard>
                    <div className="text-4xl mb-4">🛞</div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">Tire Service</h4>
                    <p className="text-gray-600">Complete tire installation and maintenance</p>
                  </ServiceCard>
                </ServiceCardReveal>
                
                <ServiceCardReveal delay={0.5}>
                  <ServiceCard>
                    <div className="text-4xl mb-4">⚡</div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">Electrical</h4>
                    <p className="text-gray-600">Modern vehicle electrical system repair</p>
                  </ServiceCard>
                </ServiceCardReveal>
              </div>
            </div>

            {/* Stats Counter Demo */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Animated Statistics</h3>
              <StatsCounterReveal>
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <AnimatedCounter value={15} suffix="+" className="text-3xl text-orange-500" />
                    <p className="text-gray-400 mt-2">Years Experience</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <AnimatedCounter value={5000} suffix="+" className="text-3xl text-blue-500" />
                    <p className="text-gray-400 mt-2">Happy Customers</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <AnimatedCounter value={98} suffix="%" className="text-3xl text-green-500" />
                    <p className="text-gray-400 mt-2">Satisfaction Rate</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6">
                    <AnimatedCounter value={24} suffix="/7" className="text-3xl text-purple-500" />
                    <p className="text-gray-400 mt-2">Support Available</p>
                  </div>
                </div>
              </StatsCounterReveal>
            </div>

            {/* Feature List Demo */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Feature Reveals</h3>
              <FeatureListReveal>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    'Advanced Diagnostic Tools',
                    'Certified Master Technicians',
                    'Warranty on All Repairs',
                    'Free Vehicle Inspections',
                    '24/7 Emergency Service',
                    'Eco-Friendly Practices'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-800 rounded-lg p-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </FeatureListReveal>
            </div>
          </div>
        )}

        {/* Parallax Section */}
        {activeTab === 'parallax' && (
          <div id="parallax-section" className="space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Parallax Effects</h2>
              <p className="text-gray-400">Background elements move at different speeds</p>
            </div>

            {/* Workshop Hero Parallax */}
            <WorkshopParallaxHero backgroundImage="/api/placeholder/1920/1080">
              <h3 className="text-4xl font-bold mb-6">Workshop Hero Section</h3>
              <p className="text-xl mb-8">Experience immersive parallax backgrounds with automotive particles</p>
              <EngineStartButton>Book Service Now</EngineStartButton>
            </WorkshopParallaxHero>

            {/* Service Showcase Parallax */}
            <ServiceShowcaseParallax backgroundImage="/api/placeholder/1920/800">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6 text-white">Premium Services</h3>
                  <p className="text-xl text-gray-200 mb-8">
                    Experience our top-tier automotive services with cutting-edge technology
                  </p>
                  <EngineStartButton variant="secondary">Learn More</EngineStartButton>
                </div>
                <div className="text-center">
                  <SpeedometerProgress 
                    progress={85} 
                    size={200} 
                    unit="%" 
                    label="Customer Satisfaction" 
                  />
                </div>
              </div>
            </ServiceShowcaseParallax>
          </div>
        )}

        {/* Micro Interactions Section */}
        {activeTab === 'micro' && (
          <div id="interactions-section" className="space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Micro Interactions</h2>
              <p className="text-gray-400">Subtle animations that enhance user experience</p>
            </div>

            {/* Button Showcase */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Interactive Buttons</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <h4 className="text-xl font-semibold mb-4">Engine Start Button</h4>
                  <div className="space-y-4">
                    <EngineStartButton variant="primary" size="lg">
                      🚗 Start Engine
                    </EngineStartButton>
                    <EngineStartButton variant="secondary" size="md">
                      🔧 Book Service
                    </EngineStartButton>
                    <EngineStartButton variant="outline" size="sm">
                      📞 Call Now
                    </EngineStartButton>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <h4 className="text-xl font-semibold mb-4">Magnetic Button</h4>
                  <MagneticButton 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold"
                    strength={0.6}
                  >
                    Hover & Move Mouse
                  </MagneticButton>
                </div>
              </div>
            </div>

            {/* Counter and Progress Demo */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Dynamic Counters</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-semibold mb-4">Animated Counter</h4>
                  <div className="mb-4">
                    <AnimatedCounter 
                      value={counterValue} 
                      className="text-3xl text-orange-500"
                      trigger={counterValue > 0}
                    />
                  </div>
                  <button 
                    onClick={triggerCounter}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Trigger Counter
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-semibold mb-4">Progress Ring</h4>
                  <div className="mb-4 flex justify-center">
                    <ProgressRing progress={progressValue} />
                  </div>
                  <button 
                    onClick={triggerProgress}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Progress
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-semibold mb-4">Loading Spinner</h4>
                  <div className="mb-4 flex justify-center">
                    {isLoading ? (
                      <AutomotiveSpinner size="lg" color="orange" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✓</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={triggerLoading}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Start Loading'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicators Section */}
        {activeTab === 'progress' && (
          <div id="progress-section" className="space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Progress Indicators</h2>
              <p className="text-gray-400">Visual feedback for scroll position and reading progress</p>
            </div>

            {/* Speedometer Progress */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Automotive Speedometer</h3>
                <p className="text-gray-400 mb-8">
                  A speedometer-style progress indicator perfect for showing completion rates,
                  performance metrics, or any automotive-themed progress.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Engine Performance</span>
                    <span className="text-orange-500 font-semibold">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="text-green-500 font-semibold">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service Efficiency</span>
                    <span className="text-blue-500 font-semibold">87%</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-8">
                <SpeedometerProgress 
                  progress={95} 
                  size={180} 
                  unit="%" 
                  label="Engine Performance"
                  color="#f97316"
                />
                <SpeedometerProgress 
                  progress={98} 
                  size={150} 
                  unit="%" 
                  label="Customer Satisfaction"
                  color="#22c55e"
                />
              </div>
            </div>

            {/* Scroll Progress Circle */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">Scroll Progress Circle</h3>
              <p className="text-gray-400 mb-8">Fixed position scroll indicator (check bottom-right)</p>
              <div className="bg-gray-800 rounded-lg p-8 inline-block">
                <ScrollProgressCircle 
                  size={80} 
                  showOnScroll={false}
                  className="relative"
                />
              </div>
            </div>
          </div>
        )}

        {/* Performance Section */}
        {activeTab === 'performance' && (
          <div className="space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Performance Monitoring</h2>
              <p className="text-gray-400">Real-time animation performance tracking</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-800 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-6">Frame Rate Monitor</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current FPS:</span>
                    <span className={`text-2xl font-bold ${
                      frameRate < 45 ? 'text-red-400' : 
                      frameRate < 55 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {frameRate}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-300 ${
                        frameRate < 45 ? 'bg-red-500' :
                        frameRate < 55 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${frameRate}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    Target: 60 FPS for optimal performance
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-6">Optimization Tips</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>GPU acceleration enabled with transform3d</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Reduced motion support for accessibility</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Intersection Observer for efficient scrolling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>RequestAnimationFrame for smooth animations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Passive event listeners for better performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">CarBot Animation System</h3>
          <p className="text-gray-400 mb-6">
            Advanced scroll interactions and micro-animations for automotive workshop platforms
          </p>
          <div className="flex justify-center space-x-4">
            <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm">60fps Optimized</span>
            <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm">Accessibility Ready</span>
            <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm">Mobile Responsive</span>
          </div>
        </div>
      </footer>

      {/* Fixed Scroll Progress Circle */}
      <div className="fixed bottom-8 right-8 z-50">
        <ScrollProgressCircle size={60} />
      </div>
    </div>
  )
}

export default AnimationShowcase