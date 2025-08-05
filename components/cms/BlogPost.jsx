import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '../../lib/directus';
import { formatDate } from '../../lib/i18n';
import { BLOG_CATEGORIES } from '../../types/directus';

export default function BlogPost({ 
  post, 
  language = 'de', 
  variant = 'card', // 'card', 'list', 'full'
  className = '' 
}) {
  const [imageError, setImageError] = useState(false);

  // Get translation or fallback to default
  const getTranslatedField = (field, fallback = '') => {
    if (post.translations && post.translations.length > 0) {
      const translation = post.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return post[field] || fallback;
  };

  const title = getTranslatedField('title');
  const excerpt = getTranslatedField('excerpt');
  const content = getTranslatedField('content');

  // Get optimized image URL
  const imageUrl = post.featured_image 
    ? getOptimizedImageUrl(
        typeof post.featured_image === 'string' ? post.featured_image : post.featured_image.id, 
        variant === 'full' ? 1200 : 600, 
        variant === 'full' ? 600 : 300
      )
    : null;

  const categoryLabel = BLOG_CATEGORIES[post.category] || post.category;
  const formattedDate = formatDate(new Date(post.date_created), language);

  // Card variant (for blog listings)
  if (variant === 'card') {
    return (
      <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
        {/* Featured Image */}
        {imageUrl && !imageError && (
          <div className="relative h-48 overflow-hidden">
            <Link href={`/blog/${post.slug}`}>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            
            {/* Category Badge */}
            {post.category && (
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {categoryLabel}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category (if no image) */}
          {(!imageUrl || imageError) && post.category && (
            <div className="mb-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
              {title}
            </Link>
          </h2>

          {/* Meta Information */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
            
            {post.author && (
              <>
                <span className="mx-2">•</span>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Link */}
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Weiterlesen
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </article>
    );
  }

  // List variant (compact horizontal layout)
  if (variant === 'list') {
    return (
      <article className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300 ${className}`}>
        <div className="flex gap-4">
          {/* Featured Image */}
          {imageUrl && !imageError && (
            <div className="flex-shrink-0 w-24 h-24 relative overflow-hidden rounded-lg">
              <Link href={`/blog/${post.slug}`}>
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                  sizes="96px"
                />
              </Link>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            {post.category && (
              <div className="mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {categoryLabel}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                {title}
              </Link>
            </h3>

            {/* Meta */}
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <span>{formattedDate}</span>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Full variant (for single post display)
  if (variant === 'full') {
    return (
      <article className={`bg-white ${className}`}>
        {/* Featured Image */}
        {imageUrl && !imageError && (
          <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg mb-8">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="mr-4">{formattedDate}</span>
            
            {post.author && (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    );
  }

  return null;
}

// Blog grid component
export function BlogGrid({ posts, language = 'de', className = '' }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-lg">Keine Artikel verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {posts.map((post) => (
        <BlogPost 
          key={post.id} 
          post={post} 
          language={language}
          variant="card"
        />
      ))}
    </div>
  );
}

// Featured blog post banner
export function FeaturedBlogPost({ post, language = 'de', className = '' }) {
  const [imageError, setImageError] = useState(false);

  const getTranslatedField = (field, fallback = '') => {
    if (post.translations && post.translations.length > 0) {
      const translation = post.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return post[field] || fallback;
  };

  const title = getTranslatedField('title');
  const excerpt = getTranslatedField('excerpt');
  const imageUrl = post.featured_image 
    ? getOptimizedImageUrl(typeof post.featured_image === 'string' ? post.featured_image : post.featured_image.id, 1200, 600)
    : null;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {imageUrl && !imageError && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </Link>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {post.category && (
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                {BLOG_CATEGORIES[post.category] || post.category}
              </span>
            )}
            
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-200 transition-colors">
                {title}
              </Link>
            </h2>
            
            {excerpt && (
              <p className="text-gray-200 mb-4 line-clamp-2">
                {excerpt}
              </p>
            )}
            
            <div className="flex items-center text-gray-300 text-sm">
              <span>{formatDate(new Date(post.date_created), language)}</span>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {(!imageUrl || imageError) && (
        <div className="p-6">
          {post.category && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
              {BLOG_CATEGORIES[post.category] || post.category}
            </span>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
              {title}
            </Link>
          </h2>
          
          {excerpt && (
            <p className="text-gray-600 mb-4">
              {excerpt}
            </p>
          )}
          
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <span>{formatDate(new Date(post.date_created), language)}</span>
            {post.author && (
              <>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Artikel lesen
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}