import { createDirectus, rest, readItems, readItem, staticToken } from '@directus/sdk';

// Directus client configuration
const directus = createDirectus(process.env.DIRECTUS_URL || 'http://localhost:8055')
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN));

// Cache configuration
const CACHE_TTL = 300; // 5 minutes in seconds
const cache = new Map();

// Cache helper functions
function getCacheKey(collection, params = {}) {
  return `${collection}_${JSON.stringify(params)}`;
}

function isExpired(timestamp) {
  return Date.now() - timestamp > CACHE_TTL * 1000;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached || isExpired(cached.timestamp)) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

// Generic fetch function with caching
async function fetchWithCache(collection, params = {}) {
  const cacheKey = getCacheKey(collection, params);
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const data = await directus.request(readItems(collection, params));
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw error;
  }
}

// Generic fetch single item function with caching
async function fetchItemWithCache(collection, id, params = {}) {
  const cacheKey = getCacheKey(`${collection}_item`, { id, ...params });
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const data = await directus.request(readItem(collection, id, params));
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${collection} item ${id}:`, error);
    throw error;
  }
}

// Workshop Services API
export async function getWorkshopServices(language = 'de') {
  return fetchWithCache('workshop_services', {
    filter: {
      status: { _eq: 'published' },
      languages: { _contains: language }
    },
    fields: [
      'id',
      'title',
      'description',
      'price_from',
      'price_to',
      'duration',
      'category',
      'image',
      'slug',
      'meta_title',
      'meta_description',
      'translations.*'
    ],
    sort: ['sort', 'title']
  });
}

export async function getWorkshopService(slug, language = 'de') {
  const services = await fetchWithCache('workshop_services', {
    filter: {
      slug: { _eq: slug },
      status: { _eq: 'published' }
    },
    fields: [
      'id',
      'title',
      'description',
      'long_description',
      'price_from',
      'price_to',
      'duration',
      'category',
      'image',
      'gallery',
      'features',
      'requirements',
      'slug',
      'meta_title',
      'meta_description',
      'translations.*'
    ]
  });
  
  return services[0] || null;
}

// Blog/News API
export async function getBlogPosts(language = 'de', limit = 10) {
  return fetchWithCache('blog_posts', {
    filter: {
      status: { _eq: 'published' },
      languages: { _contains: language }
    },
    fields: [
      'id',
      'title',
      'excerpt',
      'content',
      'featured_image',
      'author',
      'category',
      'tags',
      'slug',
      'date_created',
      'date_updated',
      'meta_title',
      'meta_description',
      'translations.*'
    ],
    sort: ['-date_created'],
    limit
  });
}

export async function getBlogPost(slug, language = 'de') {
  const posts = await fetchWithCache('blog_posts', {
    filter: {
      slug: { _eq: slug },
      status: { _eq: 'published' }
    },
    fields: [
      'id',
      'title',
      'excerpt',
      'content',
      'featured_image',
      'author',
      'category',
      'tags',
      'slug',
      'date_created',
      'date_updated',
      'meta_title',
      'meta_description',
      'translations.*'
    ]
  });
  
  return posts[0] || null;
}

// FAQ API
export async function getFAQs(language = 'de', category = null) {
  const filter = {
    status: { _eq: 'published' },
    languages: { _contains: language }
  };
  
  if (category) {
    filter.category = { _eq: category };
  }
  
  return fetchWithCache('faqs', {
    filter,
    fields: [
      'id',
      'question',
      'answer',
      'category',
      'sort',
      'translations.*'
    ],
    sort: ['category', 'sort', 'question']
  });
}

// Testimonials API
export async function getTestimonials(language = 'de', limit = 6) {
  return fetchWithCache('testimonials', {
    filter: {
      status: { _eq: 'published' },
      languages: { _contains: language }
    },
    fields: [
      'id',
      'customer_name',
      'customer_location',
      'rating',
      'review_text',
      'vehicle_info',
      'service_type',
      'date_created',
      'translations.*'
    ],
    sort: ['-date_created'],
    limit
  });
}

// Landing Pages API
export async function getLandingPage(slug, language = 'de') {
  const pages = await fetchWithCache('landing_pages', {
    filter: {
      slug: { _eq: slug },
      status: { _eq: 'published' }
    },
    fields: [
      'id',
      'title',
      'hero_title',
      'hero_subtitle',
      'hero_image',
      'content_blocks',
      'cta_text',
      'cta_link',
      'slug',
      'meta_title',
      'meta_description',
      'translations.*'
    ]
  });
  
  return pages[0] || null;
}

// About Pages API
export async function getAboutPage(type = 'company', language = 'de') {
  const pages = await fetchWithCache('about_pages', {
    filter: {
      type: { _eq: type },
      status: { _eq: 'published' }
    },
    fields: [
      'id',
      'title',
      'content',
      'images',
      'team_members',
      'type',
      'meta_title',
      'meta_description',
      'translations.*'
    ]
  });
  
  return pages[0] || null;
}

// Legal Pages API
export async function getLegalPage(type, language = 'de') {
  const pages = await fetchWithCache('legal_pages', {
    filter: {
      type: { _eq: type },
      status: { _eq: 'published' }
    },
    fields: [
      'id',
      'title',
      'content',
      'last_updated',
      'type',
      'translations.*'
    ]
  });
  
  return pages[0] || null;
}

// Contact Information API
export async function getContactInfo(language = 'de') {
  const contacts = await fetchWithCache('contact_info', {
    filter: {
      status: { _eq: 'published' }
    },
    fields: [
      'id',
      'company_name',
      'address',
      'phone',
      'email',
      'opening_hours',
      'emergency_contact',
      'social_media',
      'translations.*'
    ]
  });
  
  return contacts[0] || null;
}

// Site Settings API
export async function getSiteSettings(language = 'de') {
  const settings = await fetchWithCache('site_settings', {
    fields: [
      'id',
      'site_name',
      'site_description',
      'logo',
      'favicon',
      'default_meta_image',
      'google_analytics_id',
      'facebook_pixel_id',
      'translations.*'
    ]
  });
  
  return settings[0] || null;
}

// Image optimization helper
export function getOptimizedImageUrl(imageId, width = 800, height = 600, quality = 80) {
  if (!imageId) return null;
  
  const baseUrl = process.env.DIRECTUS_URL || 'http://localhost:8055';
  return `${baseUrl}/assets/${imageId}?width=${width}&height=${height}&quality=${quality}&fit=cover`;
}

// Clear cache function (useful for webhooks)
export function clearCache(pattern = null) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

export default directus;