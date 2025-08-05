import { useState } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '../../lib/directus';

export default function ImageGallery({ 
  images, 
  title,
  className = '',
  variant = 'grid', // 'grid', 'masonry', 'slider', 'lightbox'
  columns = 3
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  // Open image in lightbox
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  // Navigate in lightbox
  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Grid variant (default)
  if (variant === 'grid') {
    const gridCols = {
      2: 'grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 lg:grid-cols-4'
    };

    return (
      <div className={className}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}
        
        <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4`}>
          {images.map((image, index) => {
            const imageUrl = getOptimizedImageUrl(
              typeof image === 'string' ? image : image.id,
              400,
              300
            );
            
            if (!imageUrl) return null;

            return (
              <div 
                key={index}
                className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => openLightbox(image, index)}
              >
                <Image
                  src={imageUrl}
                  alt={typeof image === 'object' && image.title ? image.title : `Galerie Bild ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes={`(max-width: 768px) 50vw, ${100 / columns}vw`}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {lightboxOpen && selectedImage && (
          <Lightbox 
            image={selectedImage}
            images={images}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        )}
      </div>
    );
  }

  // Masonry variant
  if (variant === 'masonry') {
    return (
      <div className={className}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {images.map((image, index) => {
            const imageUrl = getOptimizedImageUrl(
              typeof image === 'string' ? image : image.id,
              400,
              600
            );
            
            if (!imageUrl) return null;

            return (
              <div 
                key={index}
                className="relative mb-4 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group break-inside-avoid"
                onClick={() => openLightbox(image, index)}
              >
                <Image
                  src={imageUrl}
                  alt={typeof image === 'object' && image.title ? image.title : `Galerie Bild ${index + 1}`}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {lightboxOpen && selectedImage && (
          <Lightbox 
            image={selectedImage}
            images={images}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        )}
      </div>
    );
  }

  // Slider variant
  if (variant === 'slider') {
    return (
      <div className={`relative ${className}`}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}
        
        {/* Main image */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-4">
          <Image
            src={getOptimizedImageUrl(
              typeof images[currentIndex] === 'string' ? images[currentIndex] : images[currentIndex].id,
              800,
              600
            )}
            alt={typeof images[currentIndex] === 'object' && images[currentIndex].title 
              ? images[currentIndex].title 
              : `Galerie Bild ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Vorheriges Bild"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Nächstes Bild"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumbnailUrl = getOptimizedImageUrl(
              typeof image === 'string' ? image : image.id,
              100,
              80
            );
            
            if (!thumbnailUrl) return null;

            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 relative w-20 h-16 rounded overflow-hidden ${
                  index === currentIndex ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Image
                  src={thumbnailUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

// Lightbox component
function Lightbox({ image, images, currentIndex, onClose, onNavigate }) {
  const imageUrl = getOptimizedImageUrl(
    typeof image === 'string' ? image : image.id,
    1200,
    800
  );

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Schließen"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Vorheriges Bild"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Nächstes Bild"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main image */}
      <div className="relative max-w-4xl max-h-full">
        <Image
          src={imageUrl}
          alt={typeof image === 'object' && image.title ? image.title : `Bild ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        
        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="text-white">
            {typeof image === 'object' && image.title && (
              <h3 className="text-lg font-medium">{image.title}</h3>
            )}
            {typeof image === 'object' && image.description && (
              <p className="text-sm text-gray-300 mt-1">{image.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {currentIndex + 1} von {images.length}
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}

// Before/After comparison gallery
export function BeforeAfterGallery({ comparisons, title, className = '' }) {
  const [activeComparison, setActiveComparison] = useState(0);

  if (!comparisons || comparisons.length === 0) return null;

  return (
    <div className={className}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Main comparison */}
        <div className="relative mb-8">
          <BeforeAfterSlider comparison={comparisons[activeComparison]} />
        </div>

        {/* Comparison selector */}
        {comparisons.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {comparisons.map((comparison, index) => (
              <button
                key={index}
                onClick={() => setActiveComparison(index)}
                className={`relative h-24 rounded-lg overflow-hidden ${
                  index === activeComparison ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Image
                  src={getOptimizedImageUrl(
                    typeof comparison.before === 'string' ? comparison.before : comparison.before.id,
                    200,
                    100
                  )}
                  alt={`Vergleich ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {comparison.title || `Vergleich ${index + 1}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Before/After slider component
function BeforeAfterSlider({ comparison }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const beforeImageUrl = getOptimizedImageUrl(
    typeof comparison.before === 'string' ? comparison.before : comparison.before.id,
    800,
    600
  );

  const afterImageUrl = getOptimizedImageUrl(
    typeof comparison.after === 'string' ? comparison.after : comparison.after.id,
    800,
    600
  );

  if (!beforeImageUrl || !afterImageUrl) return null;

  return (
    <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
      {/* Before image */}
      <div className="absolute inset-0">
        <Image
          src={beforeImageUrl}
          alt="Vorher"
          fill
          className="object-cover"
          sizes="800px"
        />
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Vorher
        </div>
      </div>

      {/* After image */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={afterImageUrl}
          alt="Nachher"
          fill
          className="object-cover"
          sizes="800px"
        />
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Nachher
        </div>
      </div>

      {/* Slider */}
      <div className="absolute inset-y-0 flex items-center" style={{ left: `${sliderPosition}%` }}>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transform -translate-x-1/2" />
          
          {/* Slider handle */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(e.target.value)}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 opacity-0 cursor-ew-resize"
          />
          
          <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      {comparison.title && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-center">
          {comparison.title}
        </div>
      )}
    </div>
  );
}