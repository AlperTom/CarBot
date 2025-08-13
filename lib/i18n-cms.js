// Enhanced i18n support for CMS content
// Base translations - simple fallback structure
const baseTranslations = {
  de: {},
  en: {},
  tr: {},
  pl: {}
};

// CMS-specific translations
export const cmsTranslations = {
  de: {
    ...baseTranslations.de,
    cms: {
      // General CMS terms
      read_more: "Weiterlesen",
      show_more: "Mehr anzeigen",
      show_less: "Weniger anzeigen",
      load_more: "Mehr laden",
      no_results: "Keine Ergebnisse gefunden",
      loading: "Lädt...",
      error: "Fehler beim Laden",
      
      // Navigation
      home: "Startseite",
      services: "Services",
      blog: "Blog",
      about: "Über uns",
      contact: "Kontakt",
      faq: "FAQ",
      legal: "Rechtliches",
      
      // Services
      services_title: "Unsere Services",
      services_subtitle: "Professionelle Fahrzeugwartung und -reparatur",
      all_services: "Alle Services",
      service_details: "Service Details",
      service_features: "Leistungen im Überblick",
      service_requirements: "Das sollten Sie mitbringen",
      related_services: "Weitere Services",
      book_appointment: "Termin buchen",
      request_quote: "Kostenvoranschlag anfragen",
      
      // Blog
      blog_title: "Blog & News",
      blog_subtitle: "Aktuelle Neuigkeiten und hilfreiche Tipps",
      all_articles: "Alle Artikel",
      featured_article: "Hauptartikel",
      recent_articles: "Aktuelle Artikel",
      popular_articles: "Beliebte Artikel",
      article_categories: "Kategorien",
      published_on: "Veröffentlicht am",
      written_by: "Geschrieben von",
      reading_time: "Lesezeit",
      
      // Testimonials
      testimonials_title: "Kundenbewertungen",
      testimonials_subtitle: "Das sagen unsere Kunden",
      customer_rating: "Kundenbewertung",
      verified_review: "Verifizierte Bewertung",
      all_reviews: "Alle Bewertungen",
      write_review: "Bewertung schreiben",
      
      // FAQ
      faq_title: "Häufig gestellte Fragen",
      faq_subtitle: "Antworten auf die wichtigsten Fragen",
      search_faq: "FAQs durchsuchen",
      faq_categories: "FAQ Kategorien",
      ask_question: "Frage stellen",
      
      // Contact
      contact_title: "Kontakt & Anfahrt",
      contact_subtitle: "Nehmen Sie Kontakt mit uns auf",
      contact_form: "Kontaktformular",
      contact_info: "Kontaktdaten",
      opening_hours: "Öffnungszeiten",
      emergency_contact: "Notfall-Hotline",
      get_directions: "Anfahrt",
      
      // Forms
      form_name: "Name",
      form_email: "E-Mail",
      form_phone: "Telefon",
      form_subject: "Betreff",
      form_message: "Nachricht",
      form_vehicle: "Fahrzeug",
      form_submit: "Absenden",
      form_required: "Pflichtfeld",
      form_success: "Nachricht erfolgreich gesendet",
      form_error: "Fehler beim Senden der Nachricht",
      
      // GDPR
      privacy_policy: "Datenschutzerklärung",
      terms_of_service: "AGB",
      impressum: "Impressum",
      cookie_consent: "Cookie-Einstellungen",
      data_processing_consent: "Ich stimme der Verarbeitung meiner Daten zu",
      newsletter_consent: "Newsletter abonnieren",
      privacy_required: "Bitte akzeptieren Sie die Datenschutzerklärung",
      
      // Common actions
      book_now: "Jetzt buchen",
      learn_more: "Mehr erfahren",
      get_quote: "Angebot anfordern",
      call_now: "Jetzt anrufen",
      email_us: "E-Mail senden",
      visit_us: "Besuchen Sie uns",
      
      // Time & Date
      today: "Heute",
      yesterday: "Gestern",
      days_ago: "vor {days} Tagen",
      weeks_ago: "vor {weeks} Wochen",
      months_ago: "vor {months} Monaten",
      
      // Categories
      categories: {
        tuv: "TÜV & HU",
        inspection: "Inspektion",
        repairs: "Reparaturen",
        maintenance: "Wartung",
        climate: "Klimaservice",
        tires: "Reifenservice",
        electrical: "Elektrik",
        bodywork: "Karosserie",
        news: "Neuigkeiten",
        tips: "Tipps & Tricks",
        regulations: "Vorschriften",
        technology: "Technik",
        seasonal: "Saisonales"
      }
    }
  },
  
  en: {
    ...baseTranslations.en,
    cms: {
      // General CMS terms
      read_more: "Read more",
      show_more: "Show more",
      show_less: "Show less",
      load_more: "Load more",
      no_results: "No results found",
      loading: "Loading...",
      error: "Error loading",
      
      // Navigation
      home: "Home",
      services: "Services",
      blog: "Blog",
      about: "About",
      contact: "Contact",
      faq: "FAQ",
      legal: "Legal",
      
      // Services
      services_title: "Our Services",
      services_subtitle: "Professional vehicle maintenance and repair",
      all_services: "All Services",
      service_details: "Service Details",
      service_features: "Features Overview",
      service_requirements: "What you should bring",
      related_services: "Related Services",
      book_appointment: "Book Appointment",
      request_quote: "Request Quote",
      
      // Blog
      blog_title: "Blog & News",
      blog_subtitle: "Latest news and helpful tips",
      all_articles: "All Articles",
      featured_article: "Featured Article",
      recent_articles: "Recent Articles",
      popular_articles: "Popular Articles",
      article_categories: "Categories",
      published_on: "Published on",
      written_by: "Written by",
      reading_time: "Reading time",
      
      // Testimonials
      testimonials_title: "Customer Reviews",
      testimonials_subtitle: "What our customers say",
      customer_rating: "Customer Rating",
      verified_review: "Verified Review",
      all_reviews: "All Reviews",
      write_review: "Write Review",
      
      // FAQ
      faq_title: "Frequently Asked Questions",
      faq_subtitle: "Answers to the most important questions",
      search_faq: "Search FAQs",
      faq_categories: "FAQ Categories",
      ask_question: "Ask Question",
      
      // Contact
      contact_title: "Contact & Directions",
      contact_subtitle: "Get in touch with us",
      contact_form: "Contact Form",
      contact_info: "Contact Information",
      opening_hours: "Opening Hours",
      emergency_contact: "Emergency Hotline",
      get_directions: "Get Directions",
      
      // Forms
      form_name: "Name",
      form_email: "Email",
      form_phone: "Phone",
      form_subject: "Subject",
      form_message: "Message",
      form_vehicle: "Vehicle",
      form_submit: "Submit",
      form_required: "Required field",
      form_success: "Message sent successfully",
      form_error: "Error sending message",
      
      // GDPR
      privacy_policy: "Privacy Policy",
      terms_of_service: "Terms of Service",
      impressum: "Legal Notice",
      cookie_consent: "Cookie Settings",
      data_processing_consent: "I agree to the processing of my data",
      newsletter_consent: "Subscribe to newsletter",
      privacy_required: "Please accept the privacy policy",
      
      // Common actions
      book_now: "Book Now",
      learn_more: "Learn More",
      get_quote: "Get Quote",
      call_now: "Call Now",
      email_us: "Email Us",
      visit_us: "Visit Us",
      
      // Time & Date
      today: "Today",
      yesterday: "Yesterday",
      days_ago: "{days} days ago",
      weeks_ago: "{weeks} weeks ago",
      months_ago: "{months} months ago",
      
      // Categories
      categories: {
        tuv: "MOT & Inspection",
        inspection: "Service",
        repairs: "Repairs",
        maintenance: "Maintenance",
        climate: "AC Service",
        tires: "Tire Service",
        electrical: "Electrical",
        bodywork: "Bodywork",
        news: "News",
        tips: "Tips & Tricks",
        regulations: "Regulations",
        technology: "Technology",
        seasonal: "Seasonal"
      }
    }
  },
  
  tr: {
    ...baseTranslations.tr,
    cms: {
      // General CMS terms
      read_more: "Devamını oku",
      show_more: "Daha fazla göster",
      show_less: "Daha az göster",
      load_more: "Daha fazla yükle",
      no_results: "Sonuç bulunamadı",
      loading: "Yükleniyor...",
      error: "Yükleme hatası",
      
      // Categories
      categories: {
        tuv: "Muayene",
        inspection: "Bakım",
        repairs: "Onarım",
        maintenance: "Servis",
        climate: "Klima Servisi",
        tires: "Lastik Servisi",
        electrical: "Elektrik",
        bodywork: "Kaportaj",
        news: "Haberler",
        tips: "İpuçları",
        regulations: "Düzenlemeler",
        technology: "Teknoloji",
        seasonal: "Mevsimsel"
      }
    }
  },
  
  pl: {
    ...baseTranslations.pl,
    cms: {
      // General CMS terms
      read_more: "Czytaj więcej",
      show_more: "Pokaż więcej",
      show_less: "Pokaż mniej",
      load_more: "Załaduj więcej",
      no_results: "Nie znaleziono wyników",
      loading: "Ładowanie...",
      error: "Błąd ładowania",
      
      // Categories
      categories: {
        tuv: "Przegląd techniczny",
        inspection: "Serwis",
        repairs: "Naprawy",
        maintenance: "Konserwacja",
        climate: "Serwis klimatyzacji",
        tires: "Serwis opon",
        electrical: "Elektryka",
        bodywork: "Karoseria",
        news: "Aktualności",
        tips: "Porady",
        regulations: "Przepisy",
        technology: "Technologia",
        seasonal: "Sezonowe"
      }
    }
  }
};

// Enhanced translation function for CMS content
export function getCMSTranslation(language, key, variables = {}) {
  const keys = key.split('.');
  let value = cmsTranslations[language] || cmsTranslations.de;
  
  for (const k of keys) {
    value = value[k];
    if (!value) break;
  }
  
  if (!value) {
    // Fallback to German
    value = cmsTranslations.de;
    for (const k of keys) {
      value = value[k];
      if (!value) break;
    }
  }
  
  if (!value) return key;
  
  // Replace variables in the translation
  let result = value;
  Object.keys(variables).forEach(variable => {
    result = result.replace(`{${variable}}`, variables[variable]);
  });
  
  return result;
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date, language = 'de') {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffDays === 0) {
    return getCMSTranslation(language, 'cms.today');
  } else if (diffDays === 1) {
    return getCMSTranslation(language, 'cms.yesterday');
  } else if (diffDays < 7) {
    return getCMSTranslation(language, 'cms.days_ago', { days: diffDays });
  } else if (diffWeeks < 4) {
    return getCMSTranslation(language, 'cms.weeks_ago', { weeks: diffWeeks });
  } else {
    return getCMSTranslation(language, 'cms.months_ago', { months: diffMonths });
  }
}

// Get category label
export function getCategoryLabel(category, language = 'de') {
  return getCMSTranslation(language, `cms.categories.${category}`) || category;
}

// Reading time estimation
export function estimateReadingTime(content, language = 'de') {
  if (!content) return '';
  
  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.split(/\s+/).length;
  
  // Average reading speed: 200 words per minute for German, 250 for English
  const wordsPerMinute = language === 'de' ? 200 : 250;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} Min.`;
}

// Enhanced date formatting for CMS
export function formatCMSDate(date, language = 'de', options = {}) {
  const formatters = {
    de: new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }),
    en: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }),
    tr: new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }),
    pl: new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    })
  };
  
  return formatters[language]?.format(new Date(date)) || formatters.de.format(new Date(date));
}

// URL-safe slug generation
export function createSlug(text, language = 'de') {
  if (!text) return '';
  
  // Character replacements for different languages
  const replacements = {
    de: { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' },
    tr: { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ş': 's', 'ü': 'u', 'ö': 'o' },
    pl: { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' }
  };
  
  let slug = text.toLowerCase();
  
  // Apply language-specific replacements
  if (replacements[language]) {
    Object.entries(replacements[language]).forEach(([char, replacement]) => {
      slug = slug.replace(new RegExp(char, 'g'), replacement);
    });
  }
  
  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  return slug;
}

export default {
  translations: cmsTranslations,
  getCMSTranslation,
  formatRelativeTime,
  getCategoryLabel,
  estimateReadingTime,
  formatCMSDate,
  createSlug
};