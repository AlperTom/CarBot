import { getOptimizedImageUrl } from './directus';

// Generate SEO-optimized metadata for CMS content
export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  language = 'de',
  siteName = 'KFZ Werkstatt',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  noIndex = false
}) {
  const metadata = {
    title,
    description,
  };

  // Add robots meta if needed
  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  // Open Graph metadata
  metadata.openGraph = {
    title,
    description,
    type,
    siteName,
    locale: language === 'de' ? 'de_DE' : language === 'en' ? 'en_US' : language,
  };

  if (url) {
    metadata.openGraph.url = url;
  }

  if (image) {
    const imageUrl = typeof image === 'string' 
      ? image.startsWith('http') 
        ? image 
        : getOptimizedImageUrl(image, 1200, 630)
      : getOptimizedImageUrl(image.id, 1200, 630);
    
    metadata.openGraph.images = [{
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: title,
    }];
  }

  if (publishedTime) {
    metadata.openGraph.publishedTime = publishedTime;
  }

  if (modifiedTime) {
    metadata.openGraph.modifiedTime = modifiedTime;
  }

  if (author) {
    metadata.openGraph.authors = [author];
  }

  // Twitter metadata
  metadata.twitter = {
    card: image ? 'summary_large_image' : 'summary',
    title,
    description,
  };

  if (image) {
    const imageUrl = typeof image === 'string' 
      ? image.startsWith('http') 
        ? image 
        : getOptimizedImageUrl(image, 1200, 630)
      : getOptimizedImageUrl(image.id, 1200, 630);
    
    metadata.twitter.images = [imageUrl];
  }

  // Keywords
  if (tags.length > 0) {
    metadata.keywords = tags.join(', ');
  }

  // Alternative languages
  metadata.alternates = {
    languages: {
      'de': url ? url.replace(/\/(en|tr|pl)\//, '/') : undefined,
      'en': url ? url.replace(/\/(de|tr|pl)\//, '/en/') : undefined,
      'tr': url ? url.replace(/\/(de|en|pl)\//, '/tr/') : undefined,
      'pl': url ? url.replace(/\/(de|en|tr)\//, '/pl/') : undefined,
    },
  };

  return metadata;
}

// Generate structured data for services
export function generateServiceStructuredData(service, language = 'de', contactInfo = null) {
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
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "serviceType": title,
    "category": service.category,
  };

  if (service.price_from) {
    structuredData.offers = {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": service.price_from,
    };

    if (service.price_to && service.price_to !== service.price_from) {
      structuredData.offers.priceRange = `${service.price_from}-${service.price_to}`;
    }
  }

  if (service.image) {
    const imageUrl = getOptimizedImageUrl(
      typeof service.image === 'string' ? service.image : service.image.id,
      800,
      600
    );
    structuredData.image = imageUrl;
  }

  if (contactInfo) {
    structuredData.provider = {
      "@type": "AutomotiveBusiness",
      "name": contactInfo.company_name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": contactInfo.address,
      },
      "telephone": contactInfo.phone,
      "email": contactInfo.email,
    };

    if (contactInfo.opening_hours) {
      const openingHours = [];
      Object.entries(contactInfo.opening_hours).forEach(([day, hours]) => {
        if (hours && hours !== 'Geschlossen') {
          const dayMapping = {
            monday: 'Mo',
            tuesday: 'Tu', 
            wednesday: 'We',
            thursday: 'Th',
            friday: 'Fr',
            saturday: 'Sa',
            sunday: 'Su'
          };
          openingHours.push(`${dayMapping[day]} ${hours}`);
        }
      });
      
      if (openingHours.length > 0) {
        structuredData.provider.openingHours = openingHours;
      }
    }
  }

  return structuredData;
}

// Generate structured data for blog articles
export function generateArticleStructuredData(article, language = 'de', author = null, organization = null) {
  const getTranslatedField = (field, fallback = '') => {
    if (article.translations && article.translations.length > 0) {
      const translation = article.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return article[field] || fallback;
  };

  const title = getTranslatedField('title');
  const excerpt = getTranslatedField('excerpt');
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "datePublished": article.date_created,
    "dateModified": article.date_updated || article.date_created,
    "inLanguage": language,
  };

  if (article.featured_image) {
    const imageUrl = getOptimizedImageUrl(
      typeof article.featured_image === 'string' ? article.featured_image : article.featured_image.id,
      1200,
      630
    );
    structuredData.image = imageUrl;
  }

  if (author || article.author) {
    structuredData.author = {
      "@type": "Person",
      "name": author?.name || article.author,
    };
  }

  if (organization) {
    structuredData.publisher = {
      "@type": "Organization",
      "name": organization.name,
      "logo": {
        "@type": "ImageObject",
        "url": organization.logo,
      },
    };
  }

  if (article.category) {
    structuredData.about = {
      "@type": "Thing",
      "name": article.category,
    };
  }

  if (article.tags && article.tags.length > 0) {
    structuredData.keywords = article.tags.join(", ");
  }

  return structuredData;
}

// Generate structured data for FAQ pages
export function generateFAQStructuredData(faqs, language = 'de') {
  const mainEntity = faqs.map(faq => {
    const getTranslatedField = (field, fallback = '') => {
      if (faq.translations && faq.translations.length > 0) {
        const translation = faq.translations.find(t => t.languages_code === language);
        if (translation && translation[field]) {
          return translation[field];
        }
      }
      return faq[field] || fallback;
    };

    return {
      "@type": "Question",
      "name": getTranslatedField('question'),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": getTranslatedField('answer'),
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainEntity,
  };
}

// Generate structured data for organization/business
export function generateOrganizationStructuredData(contactInfo, language = 'de') {
  const getTranslatedField = (field, fallback = '') => {
    if (contactInfo.translations && contactInfo.translations.length > 0) {
      const translation = contactInfo.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return contactInfo[field] || fallback;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": getTranslatedField('company_name'),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": getTranslatedField('address'),
    },
    "telephone": contactInfo.phone,
    "email": contactInfo.email,
  };

  if (contactInfo.opening_hours) {
    const openingHours = [];
    Object.entries(contactInfo.opening_hours).forEach(([day, hours]) => {
      if (hours && hours !== 'Geschlossen') {
        const dayMapping = {
          monday: 'Monday',
          tuesday: 'Tuesday', 
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday'
        };
        openingHours.push(`${dayMapping[day]} ${hours}`);
      }
    });
    
    if (openingHours.length > 0) {
      structuredData.openingHours = openingHours;
    }
  }

  if (contactInfo.social_media) {
    const sameAs = [];
    Object.values(contactInfo.social_media).forEach(url => {
      if (url) sameAs.push(url);
    });
    
    if (sameAs.length > 0) {
      structuredData.sameAs = sameAs;
    }
  }

  return structuredData;
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs) {
  const itemListElement = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement,
  };
}

// Generate product structured data for automotive services
export function generateAutomotiveServiceStructuredData(service, workshop, language = 'de') {
  const getTranslatedField = (field, fallback = '') => {
    if (service.translations && service.translations.length > 0) {
      const translation = service.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return service[field] || fallback;
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": getTranslatedField('title'),
    "description": getTranslatedField('description'),
    "category": "Automotive Service",
    "brand": {
      "@type": "Brand",
      "name": workshop.company_name,
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": service.price_from,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "AutomotiveBusiness",
        "name": workshop.company_name,
        "address": workshop.address,
        "telephone": workshop.phone,
      },
    },
  };
}

// SEO utility functions
export const SEOUtils = {
  // Clean and optimize title for SEO
  optimizeTitle: (title, maxLength = 60) => {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength - 3) + '...' : title;
  },

  // Clean and optimize description for SEO
  optimizeDescription: (description, maxLength = 160) => {
    if (!description) return '';
    // Strip HTML tags
    const plainText = description.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength - 3) + '...' : plainText;
  },

  // Generate canonical URL
  generateCanonicalUrl: (baseUrl, path, language = 'de') => {
    const langPrefix = language === 'de' ? '' : `/${language}`;
    return `${baseUrl}${langPrefix}${path}`;
  },

  // Generate hreflang attributes
  generateHreflangLinks: (baseUrl, path) => {
    const languages = ['de', 'en', 'tr', 'pl'];
    return languages.map(lang => ({
      hreflang: lang,
      href: lang === 'de' ? `${baseUrl}${path}` : `${baseUrl}/${lang}${path}`,
    }));
  },
};

export default {
  generateSEOMetadata,
  generateServiceStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData,
  generateAutomotiveServiceStructuredData,
  SEOUtils,
};