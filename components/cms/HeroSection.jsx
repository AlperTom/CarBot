'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '../../lib/directus';
import { ParallaxBackground, FadeInOnScroll, StaggeredFadeIn } from '../animations/ScrollAnimations';

export default function HeroSection({ 
  hero, 
  language = 'de', 
  variant = 'default', // 'default', 'split', 'overlay', 'minimal'
  className = '' 
}) {
  const [imageError, setImageError] = useState(false);

  // Get translation or fallback to default
  const getTranslatedField = (field, fallback = '') => {
    if (hero.translations && hero.translations.length > 0) {
      const translation = hero.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return hero[field] || fallback;
  };

  const title = getTranslatedField('hero_title') || getTranslatedField('title');
  const subtitle = getTranslatedField('hero_subtitle');
  const ctaText = getTranslatedField('cta_text', 'Mehr erfahren');

  // Get optimized image URL
  const imageUrl = hero.hero_image 
    ? getOptimizedImageUrl(
        typeof hero.hero_image === 'string' ? hero.hero_image : hero.hero_image.id, 
        1920, 
        1080
      )
    : null;

  // Default variant - centered content with background image and parallax
  if (variant === 'default') {
    return (
      <section className={`relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden ${className}`}>
        {/* Parallax Background Image */}
        {imageUrl && !imageError && (
          <ParallaxBackground speed={-0.3} className="absolute inset-0" enableMobile={false}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover scale-110"
              onError={() => setImageError(true)}
              priority
              sizes="100vw"
            />
            {/* Animated Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
          </ParallaxBackground>
        )}

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content with Staggered Animation */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInOnScroll direction="down" delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {title}
            </h1>
          </FadeInOnScroll>
          
          {subtitle && (
            <FadeInOnScroll direction="up" delay={400}>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
                {subtitle}
              </p>
            </FadeInOnScroll>
          )}

          {/* CTA Buttons with Staggered Animation */}
          <StaggeredFadeIn staggerDelay={200} className="flex flex-col sm:flex-row gap-4 justify-center">
            {hero.cta_link && (
              <Link 
                href={hero.cta_link}
                className="group bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg transform hover:scale-105 hover:shadow-xl"
              >
                <span className="inline-flex items-center">
                  {ctaText}
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )}
            
            <Link 
              href="/contact"
              className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold text-lg backdrop-blur-sm hover:scale-105 hover:shadow-xl"
            >
              <span className="inline-flex items-center">
                Kontakt aufnehmen
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </Link>
          </StaggeredFadeIn>
        </div>

        {/* Enhanced Scroll indicator */}
        <FadeInOnScroll direction="up" delay={800}>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-white/80">
              <span className="text-sm mb-2 font-medium">Scroll down</span>
              <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </section>
    );
  }

  // Split variant - content on left, image on right
  if (variant === 'split') {
    return (
      <section className={`bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px] py-12 lg:py-20">
            {/* Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h1>
              
              {subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {subtitle}
                </p>
              )}

              {/* Features/Benefits */}
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Meisterqualität</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Faire Preise</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Schnelle Termine</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Garantie</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {hero.cta_link && (
                  <Link 
                    href={hero.cta_link}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                  >
                    {ctaText}
                  </Link>
                )}
                
                <Link 
                  href="/appointment"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
                >
                  Termin buchen
                </Link>
              </div>
            </div>

            {/* Image */}
            {imageUrl && !imageError && (
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Overlay variant - content overlaid on image
  if (variant === 'overlay') {
    return (
      <section className={`relative min-h-[600px] md:min-h-[700px] flex items-center ${className}`}>
        {/* Background Image */}
        {imageUrl && !imageError && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                {subtitle}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm text-gray-300">Jahre Erfahrung</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-gray-300">Zufriedene Kunden</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-gray-300">Weiterempfehlung</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/services"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
              >
                Unsere Services
              </Link>
              
              <Link 
                href="/appointment"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold text-center"
              >
                Termin vereinbaren
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Minimal variant - clean, simple design
  if (variant === 'minimal') {
    return (
      <section className={`bg-white py-20 md:py-32 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hero.cta_link && (
              <Link 
                href={hero.cta_link}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {ctaText}
              </Link>
            )}
            
            <Link 
              href="/contact"
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Kontakt
            </Link>
          </div>

          {/* Image below content */}
          {imageUrl && !imageError && (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl mt-12">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}

// Service-specific hero section
export function ServiceHeroSection({ service, language = 'de', className = '' }) {
  const [imageError, setImageError] = useState(false);

  const getTranslatedField = (field, fallback = '') => {
    if (service.translations && service.translations.length > 0) {
      const translation = service.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return service[field] || fallback;
  };

  const title = getTranslatedField('title');
  const description = getTranslatedField('description');
  const imageUrl = service.image 
    ? getOptimizedImageUrl(typeof service.image === 'string' ? service.image : service.image.id, 1920, 600)
    : null;

  return (
    <section className={`relative bg-gradient-to-br from-blue-600 to-blue-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="mb-4">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                Service
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            
            <p className="text-xl text-blue-100 mb-8">
              {description}
            </p>

            {/* Service details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-blue-100">
              {service.duration && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Dauer: {service.duration}</span>
                </div>
              )}
              
              {service.price_from && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>
                    ab {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(service.price_from)}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/appointment?service=${service.slug}`}
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
              >
                Termin buchen
              </Link>
              
              <Link 
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-800 transition-colors font-semibold text-center"
              >
                Beratung anfragen
              </Link>
            </div>
          </div>

          {/* Image */}
          {imageUrl && !imageError && (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Workshop homepage hero
export function WorkshopHeroSection({ contactInfo, language = 'de', className = '' }) {
  return (
    <section className={`relative bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 ${className}`}>
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ihre KFZ-Werkstatt<br />für alle Fälle
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Professionelle Fahrzeugwartung und -reparatur mit modernster Technik 
            und jahrelanger Erfahrung. Ihr Auto ist bei uns in besten Händen.
          </p>

          {/* Key features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">TÜV & HU</h3>
              <p className="text-gray-300">Offizielle Prüfstelle für alle Fahrzeugtypen</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Schnelle Termine</h3>
              <p className="text-gray-300">Meist noch am selben oder nächsten Tag</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Persönlicher Service</h3>
              <p className="text-gray-300">Individuelle Beratung und faire Preise</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/appointment"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Termin buchen
            </Link>
            
            <Link 
              href="/services"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold text-lg"
            >
              Unsere Services
            </Link>
          </div>

          {/* Contact info */}
          {contactInfo && (
            <div className="mt-12 pt-8 border-t border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300">
                {contactInfo.phone && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-white">
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                
                {contactInfo.address && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}