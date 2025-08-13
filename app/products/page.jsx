'use client'
import Link from 'next/link'
import { useState } from 'react'
import ModernNavigation from '@/components/ModernNavigation'
import { 
  SmoothReveal,
  StaggeredReveal,
  FloatingElement,
  ScrollProgress 
} from '@/components/AppleStyleAnimations'

export const metadata = {
  title: 'Products | CarBot - AI Solutions for Auto Workshops',
  description: 'Discover CarBot\'s comprehensive AI-powered solutions: ChatBot for customer service and Website Creator for workshop websites.',
  openGraph: {
    title: 'Products | CarBot - AI Solutions for Auto Workshops',
    description: 'Comprehensive AI solutions for modern auto workshops. ChatBot and Website Creator in one platform.',
  },
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('chatbot')

  const products = [
    {
      id: 'chatbot',
      name: 'AI ChatBot',
      tagline: 'Intelligent Customer Service',
      description: 'AI-powered chatbot that handles customer inquiries, books appointments, and generates leads 24/7 in 4 languages.',
      icon: '🤖',
      gradient: 'from-blue-500 to-purple-600',
      features: [
        {
          title: 'Smart Appointment Booking',
          description: 'Automated scheduling with calendar integration and SMS reminders',
          icon: '📅'
        },
        {
          title: 'Multilingual Support',
          description: 'Serves customers in German, English, Turkish, and French',
          icon: '🌐'
        },
        {
          title: 'Lead Qualification',
          description: 'Intelligent lead scoring and automated follow-up sequences',
          icon: '🎯'
        },
        {
          title: 'Cost Estimation',
          description: 'Provides instant repair cost estimates based on vehicle symptoms',
          icon: '💰'
        },
        {
          title: 'Knowledge Base',
          description: 'Comprehensive automotive expertise built into every response',
          icon: '🧠'
        },
        {
          title: 'Analytics Dashboard',
          description: 'Track conversations, conversions, and customer satisfaction',
          icon: '📊'
        }
      ],
      useCases: [
        {
          title: 'After-Hours Support',
          description: 'Handle customer inquiries when your workshop is closed',
          scenario: 'A customer experiences a breakdown at 10 PM and needs immediate guidance'
        },
        {
          title: 'Appointment Management',
          description: 'Streamline booking process and reduce phone call volume',
          scenario: 'Busy workshop needs efficient way to manage 50+ weekly appointments'
        },
        {
          title: 'Lead Generation',
          description: 'Convert website visitors into qualified prospects',
          scenario: 'Turn casual browsers into scheduled service appointments'
        }
      ],
      pricing: {
        starter: '€49/month',
        professional: '€99/month',
        enterprise: 'Custom'
      }
    },
    {
      id: 'website',
      name: 'Website Creator',
      tagline: 'Professional Workshop Websites',
      description: 'Create stunning, mobile-optimized websites for your auto workshop with built-in SEO and conversion optimization.',
      icon: '🌐',
      gradient: 'from-orange-500 to-red-600',
      features: [
        {
          title: 'Template Library',
          description: 'Professional templates designed specifically for auto workshops',
          icon: '🎨'
        },
        {
          title: 'Mobile Optimization',
          description: 'Responsive designs that look perfect on all devices',
          icon: '📱'
        },
        {
          title: 'SEO Built-in',
          description: 'Optimized for local search and Google My Business integration',
          icon: '🔍'
        },
        {
          title: 'Service Showcase',
          description: 'Beautiful galleries and service descriptions that convert',
          icon: '🛠️'
        },
        {
          title: 'Contact Forms',
          description: 'Custom contact forms with automated lead notifications',
          icon: '📧'
        },
        {
          title: 'Integration Ready',
          description: 'Seamlessly connects with your ChatBot and existing tools',
          icon: '🔗'
        }
      ],
      useCases: [
        {
          title: 'Local SEO Domination',
          description: 'Rank higher in local search results and Google Maps',
          scenario: 'New workshop needs online presence to compete with established competitors'
        },
        {
          title: 'Professional Credibility',
          description: 'Build trust with modern, professional web presence',
          scenario: 'Family workshop wants to attract younger, tech-savvy customers'
        },
        {
          title: 'Service Marketing',
          description: 'Showcase specializations and attract premium service customers',
          scenario: 'Specialty shop wants to highlight high-end restoration services'
        }
      ],
      pricing: {
        starter: '€29/month',
        professional: '€59/month',
        enterprise: 'Custom'
      }
    }
  ]

  const integrationBenefits = [
    {
      title: 'Seamless Workflow',
      description: 'ChatBot and Website work together to create a unified customer experience',
      icon: '🔄'
    },
    {
      title: 'Data Synchronization',
      description: 'Customer data flows automatically between all platform components',
      icon: '📊'
    },
    {
      title: 'Unified Analytics',
      description: 'Single dashboard to track website performance and chatbot conversations',
      icon: '📈'
    },
    {
      title: 'Cost Efficiency',
      description: 'Bundle pricing saves up to 30% compared to separate solutions',
      icon: '💰'
    }
  ]

  const activeProduct = products.find(p => p.id === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ScrollProgress />
      <ModernNavigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <SmoothReveal delay={0.2}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full px-4 py-2 mb-8">
              <FloatingElement speed={0.8} amplitude={3}>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </FloatingElement>
              <span className="text-sm font-medium text-blue-700">
                Complete AI Solutions for Auto Workshops
              </span>
            </div>
          </SmoothReveal>
          
          <SmoothReveal delay={0.4}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Powerful Tools for</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Modern Workshops
              </span>
            </h1>
          </SmoothReveal>
          
          <SmoothReveal delay={0.6}>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your auto workshop with our comprehensive AI platform. From intelligent customer service 
              to professional websites, we provide everything you need to compete in the digital age.
            </p>
          </SmoothReveal>
          
          <SmoothReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/demo/workshop"
                className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-300 transition-all duration-300 hover:scale-105"
              >
                View Demo
              </Link>
            </div>
          </SmoothReveal>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SmoothReveal delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Solution
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each product is designed to solve specific challenges. Use them individually or together 
                for maximum impact.
              </p>
            </div>
          </SmoothReveal>

          {/* Tab Navigation */}
          <SmoothReveal delay={0.4}>
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 p-2 rounded-2xl inline-flex">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setActiveTab(product.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === product.id
                        ? `bg-gradient-to-r ${product.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{product.icon}</span>
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          </SmoothReveal>

          {/* Product Content */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Product Info */}
              <div className="p-12">
                <SmoothReveal delay={0.2}>
                  <div className="mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${activeProduct.gradient} text-white text-2xl mb-6`}>
                      {activeProduct.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {activeProduct.name}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      {activeProduct.tagline}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {activeProduct.description}
                    </p>
                  </div>
                </SmoothReveal>

                <SmoothReveal delay={0.4}>
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                    {activeProduct.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-lg">{feature.icon}</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">{feature.title}</h5>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SmoothReveal>

                <SmoothReveal delay={0.6}>
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Starting at</p>
                        <p className="text-2xl font-bold text-gray-900">{activeProduct.pricing.starter}</p>
                      </div>
                      <Link 
                        href="/pricing"
                        className={`bg-gradient-to-r ${activeProduct.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                      >
                        View Pricing
                      </Link>
                    </div>
                  </div>
                </SmoothReveal>
              </div>

              {/* Right Side - Features Grid */}
              <div className="bg-gray-50 p-12">
                <SmoothReveal delay={0.3}>
                  <h4 className="text-xl font-semibold text-gray-900 mb-8">All Features</h4>
                </SmoothReveal>
                
                <StaggeredReveal staggerDelay={100}>
                  {activeProduct.features.map((feature, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{feature.icon}</span>
                        <h5 className="font-semibold text-gray-900">{feature.title}</h5>
                      </div>
                      <p className="text-gray-600 text-sm pl-8">{feature.description}</p>
                    </div>
                  ))}
                </StaggeredReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SmoothReveal delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Real-World Applications
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how successful workshops are using CarBot to grow their business
              </p>
            </div>
          </SmoothReveal>

          <StaggeredReveal staggerDelay={200}>
            {activeProduct.useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow duration-300">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-sm text-gray-500 mb-2">Example Scenario:</p>
                      <p className="text-gray-700 italic">"{useCase.scenario}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SmoothReveal delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Better Together
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Combine ChatBot and Website Creator for a complete digital solution
              </p>
            </div>
          </SmoothReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggeredReveal staggerDelay={150}>
              {integrationBenefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </StaggeredReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <SmoothReveal delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workshop?
            </h2>
          </SmoothReveal>
          
          <SmoothReveal delay={0.4}>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join hundreds of successful auto workshops already using CarBot to automate customer service, 
              generate leads, and grow their business.
            </p>
          </SmoothReveal>
          
          <SmoothReveal delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start 30-Day Free Trial
              </Link>
              <Link 
                href="/pricing"
                className="bg-white/20 backdrop-blur text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                View All Pricing
              </Link>
            </div>
          </SmoothReveal>
        </div>
      </section>
    </div>
  )
}