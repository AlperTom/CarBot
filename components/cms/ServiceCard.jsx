import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '../../lib/directus';
import { formatPrice } from '../../lib/i18n';
import { SERVICE_CATEGORIES } from '../../types/directus';

export default function ServiceCard({ 
  service, 
  language = 'de', 
  className = '',
  showDetailLink = true,
  compact = false 
}) {
  const [imageError, setImageError] = useState(false);

  // Get translation or fallback to default
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
  const features = getTranslatedField('features', []);

  // Format price display
  const formatPriceRange = () => {
    if (!service.price_from) return null;
    
    if (service.price_to && service.price_to !== service.price_from) {
      return `${formatPrice(service.price_from, language)} - ${formatPrice(service.price_to, language)}`;
    }
    
    return `ab ${formatPrice(service.price_from, language)}`;
  };

  const priceDisplay = formatPriceRange();
  const categoryLabel = SERVICE_CATEGORIES[service.category] || service.category;
  
  // Get optimized image URL
  const imageUrl = service.image 
    ? getOptimizedImageUrl(typeof service.image === 'string' ? service.image : service.image.id, 400, 300)
    : null;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Service Image */}
      {imageUrl && !imageError && (
        <div className={`relative ${compact ? 'h-32' : 'h-48'} overflow-hidden`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {categoryLabel}
            </span>
          </div>
          
          {/* Price Badge */}
          {priceDisplay && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                {priceDisplay}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Service Content */}
      <div className={`p-${compact ? '4' : '6'}`}>
        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
          {title}
        </h3>

        {/* Category (if no image) */}
        {(!imageUrl || imageError) && (
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {categoryLabel}
            </span>
            {priceDisplay && (
              <span className="text-green-600 font-bold text-sm">
                {priceDisplay}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className={`text-gray-600 mb-4 ${compact ? 'text-sm line-clamp-2' : 'line-clamp-3'}`}>
          {description}
        </p>

        {/* Duration */}
        {service.duration && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dauer: {service.duration}</span>
          </div>
        )}

        {/* Features */}
        {!compact && features && features.length > 0 && (
          <div className="mb-4">
            <ul className="text-sm text-gray-600">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center mb-1">
                  <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {showDetailLink && (
            <Link 
              href={`/services/${service.slug}`}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
            >
              Details anzeigen
            </Link>
          )}
          
          <Link 
            href={`/appointment?service=${service.slug}`}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
          >
            Termin buchen
          </Link>
        </div>
      </div>
    </div>
  );
}

// Compact variant for lists
export function ServiceCardCompact({ service, language, className }) {
  return (
    <ServiceCard 
      service={service} 
      language={language} 
      className={className}
      compact={true}
      showDetailLink={false}
    />
  );
}

// Service grid component
export function ServiceGrid({ services, language = 'de', className = '' }) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg">Keine Services verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {services.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          language={language}
        />
      ))}
    </div>
  );
}

// Featured service banner
export function FeaturedServiceBanner({ service, language = 'de', className = '' }) {
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
    ? getOptimizedImageUrl(typeof service.image === 'string' ? service.image : service.image.id, 800, 400)
    : null;

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Content */}
        <div className="flex-1 p-8 text-white">
          <div className="mb-4">
            <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
              {SERVICE_CATEGORIES[service.category] || service.category}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          <p className="text-blue-100 mb-6 text-lg">{description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={`/services/${service.slug}`}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
            >
              Mehr erfahren
            </Link>
            <Link 
              href={`/appointment?service=${service.slug}`}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              Jetzt buchen
            </Link>
          </div>
        </div>

        {/* Image */}
        {imageUrl && !imageError && (
          <div className="md:w-96 h-64 md:h-auto relative">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
      </div>
    </div>
  );
}