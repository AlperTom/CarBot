import { useState } from 'react';
import { formatDate } from '../../lib/i18n';

export default function Testimonial({ 
  testimonial, 
  language = 'de', 
  variant = 'card', // 'card', 'compact', 'featured'
  className = '' 
}) {
  // Get translation or fallback to default
  const getTranslatedField = (field, fallback = '') => {
    if (testimonial.translations && testimonial.translations.length > 0) {
      const translation = testimonial.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return testimonial[field] || fallback;
  };

  const reviewText = getTranslatedField('review_text');
  const vehicleInfo = getTranslatedField('vehicle_info');
  const serviceType = getTranslatedField('service_type');

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Card variant (default)
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {testimonial.customer_name}
            </h3>
            {testimonial.customer_location && (
              <p className="text-gray-600 text-sm">
                {testimonial.customer_location}
              </p>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex">
              {renderStars(testimonial.rating)}
            </div>
            <span className="ml-2 text-gray-600 text-sm">
              {testimonial.rating}/5
            </span>
          </div>
        </div>

        {/* Review Text */}
        <blockquote className="text-gray-700 mb-4 relative">
          <svg className="absolute -top-2 -left-2 w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 4 .496 8.048.496 13.056c0 5.84 3.904 9.952 8.832 9.952 1.216 0 2.368-.256 3.456-.736-.096 5.312-2.432 8.064-5.984 8.064v.448c.768 0 3.84-.112 6.592-3.072C16.96 24.16 18.016 20.224 18.016 15.968V4H9.352zm14.592 0c-4.896 0-8.856 4.048-8.856 9.056 0 5.84 3.904 9.952 8.832 9.952 1.216 0 2.368-.256 3.456-.736-.096 5.312-2.432 8.064-5.984 8.064v.448c.768 0 3.84-.112 6.592-3.072C31.552 24.16 32.608 20.224 32.608 15.968V4h-8.664z" />
          </svg>
          <div className="pl-6">
            {reviewText}
          </div>
        </blockquote>

        {/* Service Information */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {serviceType && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Service: {serviceType}</span>
              </div>
            )}
            
            {vehicleInfo && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                <span>Fahrzeug: {vehicleInfo}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(new Date(testimonial.date_created), language)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (for sidebars or smaller spaces)
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {renderStars(testimonial.rating)}
          </div>
          <span className="ml-2 text-gray-600 text-sm">
            {testimonial.rating}/5
          </span>
        </div>

        {/* Review Text */}
        <blockquote className="text-gray-700 text-sm mb-3 line-clamp-3">
          "{reviewText}"
        </blockquote>

        {/* Customer Info */}
        <div className="border-t border-gray-200 pt-3">
          <p className="font-medium text-gray-900 text-sm">
            {testimonial.customer_name}
          </p>
          {testimonial.customer_location && (
            <p className="text-gray-600 text-xs">
              {testimonial.customer_location}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Featured variant (larger, more prominent)
  if (variant === 'featured') {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 ${className}`}>
        {/* Quote Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 4 .496 8.048.496 13.056c0 5.84 3.904 9.952 8.832 9.952 1.216 0 2.368-.256 3.456-.736-.096 5.312-2.432 8.064-5.984 8.064v.448c.768 0 3.84-.112 6.592-3.072C16.96 24.16 18.016 20.224 18.016 15.968V4H9.352zm14.592 0c-4.896 0-8.856 4.048-8.856 9.056 0 5.84 3.904 9.952 8.832 9.952 1.216 0 2.368-.256 3.456-.736-.096 5.312-2.432 8.064-5.984 8.064v.448c.768 0 3.84-.112 6.592-3.072C31.552 24.16 32.608 20.224 32.608 15.968V4h-8.664z" />
          </svg>
        </div>

        {/* Review Text */}
        <blockquote className="text-gray-800 text-lg text-center mb-6 leading-relaxed">
          "{reviewText}"
        </blockquote>

        {/* Rating */}
        <div className="flex justify-center mb-4">
          <div className="flex">
            {renderStars(testimonial.rating)}
          </div>
        </div>

        {/* Customer Info */}
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-lg">
            {testimonial.customer_name}
          </h3>
          {testimonial.customer_location && (
            <p className="text-gray-600 mb-2">
              {testimonial.customer_location}
            </p>
          )}
          
          {/* Service Details */}
          <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
            {serviceType && (
              <span className="bg-white px-3 py-1 rounded-full">
                {serviceType}
              </span>
            )}
            {vehicleInfo && (
              <span className="bg-white px-3 py-1 rounded-full">
                {vehicleInfo}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Testimonials grid component
export function TestimonialGrid({ testimonials, language = 'de', className = '' }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <p className="text-lg">Keine Bewertungen verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {testimonials.map((testimonial) => (
        <Testimonial 
          key={testimonial.id} 
          testimonial={testimonial} 
          language={language}
          variant="card"
        />
      ))}
    </div>
  );
}

// Testimonials slider/carousel component
export function TestimonialSlider({ testimonials, language = 'de', className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Main testimonial */}
      <div className="overflow-hidden">
        <Testimonial 
          testimonial={currentTestimonial}
          language={language}
          variant="featured"
        />
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <>
          {/* Previous/Next buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Vorherige Bewertung"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Nächste Bewertung"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Zur Bewertung ${index + 1} wechseln`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Stats summary component
export function TestimonialStats({ testimonials, className = '' }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Calculate average rating
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  const averageRating = totalRating / testimonials.length;

  // Count ratings by star
  const ratingCounts = testimonials.reduce((counts, testimonial) => {
    counts[testimonial.rating] = (counts[testimonial.rating] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Kundenbewertungen
      </h3>
      
      <div className="flex items-center mb-4">
        <div className="text-3xl font-bold text-gray-900 mr-3">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <div className="flex mb-1">
            {Array.from({ length: 5 }, (_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 ${
                  index < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Basierend auf {testimonials.length} Bewertungen
          </div>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating] || 0;
          const percentage = testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center text-sm">
              <span className="w-3 text-gray-600">{rating}</span>
              <svg className="w-4 h-4 text-yellow-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-gray-600 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}