/**
 * Internationalization utilities for CarBot
 * Provides date formatting and translation utilities
 */

/**
 * Format date according to German/European standards
 */
export function formatDate(date, locale = 'de-DE') {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // German date format: DD.MM.YYYY
  if (locale === 'de-DE' || locale === 'de') {
    return dateObj.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // Default to German format
  return dateObj.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date, locale = 'de-DE') {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  if (locale === 'de-DE' || locale === 'de') {
    return dateObj.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return dateObj.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric', 
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get translated text with fallback
 */
export function getTranslation(translations, key, language = 'de', fallback = '') {
  if (!translations || !key) return fallback;
  
  // If translations is an array of translation objects
  if (Array.isArray(translations)) {
    const translation = translations.find(t => t.languages_code === language);
    return translation?.[key] || fallback;
  }
  
  // If translations is a direct object
  return translations[key] || fallback;
}

/**
 * Language codes mapping
 */
export const LANGUAGE_CODES = {
  'de': 'de-DE',
  'en': 'en-US', 
  'tr': 'tr-TR',
  'pl': 'pl-PL'
};

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = 'de';

/**
 * Format price according to German/European standards
 */
export function formatPrice(price, currency = 'EUR', locale = 'de-DE') {
  if (typeof price !== 'number' || isNaN(price)) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price);
}

/**
 * Format price range (e.g., "€50 - €150")
 */
export function formatPriceRange(minPrice, maxPrice, currency = 'EUR', locale = 'de-DE') {
  if (!minPrice && !maxPrice) return '';
  
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency, locale);
  }
  
  if (!minPrice) {
    return `bis ${formatPrice(maxPrice, currency, locale)}`;
  }
  
  if (!maxPrice) {
    return `ab ${formatPrice(minPrice, currency, locale)}`;
  }
  
  return `${formatPrice(minPrice, currency, locale)} - ${formatPrice(maxPrice, currency, locale)}`;
}

export default {
  formatDate,
  formatDateTime,
  formatPrice,
  formatPriceRange,
  getTranslation,
  LANGUAGE_CODES,
  DEFAULT_LANGUAGE
};