'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '../../lib/directus';
import { ServiceGrid } from './ServiceCard';
import { TestimonialGrid } from './Testimonial';

export default function ContentBlock({ 
  block, 
  language = 'de', 
  className = '' 
}) {
  const [imageError, setImageError] = useState(false);

  // Get translation or fallback to default
  const getTranslatedField = (field, fallback = '') => {
    if (block.translations && block.translations.length > 0) {
      const translation = block.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return block[field] || fallback;
  };

  const title = getTranslatedField('title');
  const content = getTranslatedField('content');
  const buttonText = getTranslatedField('button_text');

  // Text content block
  if (block.type === 'text') {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
        )}
        
        {content && (
          <div 
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {block.button_link && buttonText && (
          <div className="mt-8">
            <Link 
              href={block.button_link}
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {buttonText}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Image content block
  if (block.type === 'image') {
    const imageUrl = block.image 
      ? getOptimizedImageUrl(typeof block.image === 'string' ? block.image : block.image.id, 1200, 600)
      : null;

    if (!imageUrl || imageError) return null;

    return (
      <div className={`${className}`}>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={title || 'Werkstatt Bild'}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          
          {/* Overlay content */}
          {(title || content) && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                {title && (
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {title}
                  </h2>
                )}
                {content && (
                  <div 
                    className="text-lg opacity-90"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Gallery content block
  if (block.type === 'gallery') {
    if (!block.images || block.images.length === 0) return null;

    return (
      <div className={`${className}`}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {block.images.map((image, index) => {
            const imageUrl = getOptimizedImageUrl(
              typeof image === 'string' ? image : image.id, 
              400, 
              300
            );
            
            return imageUrl ? (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={imageUrl}
                  alt={`Galerie Bild ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  }

  // Services content block
  if (block.type === 'services') {
    if (!block.services || block.services.length === 0) return null;

    return (
      <div className={`${className}`}>
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {content && (
              <div 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        )}

        <ServiceGrid services={block.services} language={language} />

        {block.button_link && buttonText && (
          <div className="text-center mt-12">
            <Link 
              href={block.button_link}
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              {buttonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Testimonials content block
  if (block.type === 'testimonials') {
    if (!block.testimonials || block.testimonials.length === 0) return null;

    return (
      <div className={`bg-gray-50 py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              {content && (
                <div 
                  className="text-lg text-gray-600 max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
          )}

          <TestimonialGrid testimonials={block.testimonials} language={language} />
        </div>
      </div>
    );
  }

  // Call-to-action content block
  if (block.type === 'cta') {
    const backgroundColor = block.background_color || 'bg-blue-600';
    const textColor = block.text_color || 'text-white';

    return (
      <div className={`${backgroundColor} py-16 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {title && (
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${textColor}`}>
              {title}
            </h2>
          )}
          
          {content && (
            <div 
              className={`text-lg mb-8 ${textColor} opacity-90`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {block.button_link && buttonText && (
            <Link 
              href={block.button_link}
              className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
            >
              {buttonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Features content block
  if (block.type === 'features') {
    if (!block.features || block.features.length === 0) return null;

    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              {content && (
                <div 
                  className="text-lg text-gray-600 max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {block.features.map((feature, index) => {
              const featureImageUrl = feature.image 
                ? getOptimizedImageUrl(
                    typeof feature.image === 'string' ? feature.image : feature.image.id, 
                    300, 
                    200
                  )
                : null;

              return (
                <div key={index} className="text-center">
                  {/* Feature Image or Icon */}
                  {featureImageUrl ? (
                    <div className="relative h-32 w-32 mx-auto mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={featureImageUrl}
                        alt={feature.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  ) : feature.icon ? (
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">{feature.icon}</span>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}

                  {/* Feature Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Feature Description */}
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Split content block (text + image side by side)
  if (block.type === 'split') {
    const imageUrl = block.image 
      ? getOptimizedImageUrl(typeof block.image === 'string' ? block.image : block.image.id, 600, 400)
      : null;

    const isImageRight = block.alignment === 'right';

    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isImageRight ? 'lg:grid-flow-col-dense' : ''}`}>
            {/* Content */}
            <div className={isImageRight ? 'lg:col-start-1' : ''}>
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {title}
                </h2>
              )}
              
              {content && (
                <div 
                  className="prose prose-lg text-gray-700 mb-8"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              {block.button_link && buttonText && (
                <Link 
                  href={block.button_link}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {buttonText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Image */}
            {imageUrl && !imageError && (
              <div className={`relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg ${isImageRight ? 'lg:col-start-2' : ''}`}>
                <Image
                  src={imageUrl}
                  alt={title || 'Content Bild'}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
}

// ContentBlocks renderer - renders multiple content blocks
export function ContentBlocks({ blocks, language = 'de', className = '' }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <ContentBlock 
          key={block.id || index} 
          block={block} 
          language={language}
          className={index > 0 ? 'mt-16' : ''}
        />
      ))}
    </div>
  );
}

// Two-column layout content block
export function TwoColumnContent({ 
  leftContent, 
  rightContent, 
  language = 'de', 
  className = '',
  reverseOnMobile = false 
}) {
  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${reverseOnMobile ? 'flex-col-reverse lg:flex-row' : ''}`}>
          <div>
            <ContentBlock block={leftContent} language={language} />
          </div>
          <div>
            <ContentBlock block={rightContent} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats content block
export function StatsBlock({ stats, title, description, language = 'de', className = '' }) {
  return (
    <div className={`bg-blue-600 py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {title}
          </h2>
        )}
        
        {description && (
          <p className="text-lg text-blue-100 mb-12 max-w-3xl mx-auto">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}