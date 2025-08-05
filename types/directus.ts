// TypeScript definitions for Directus CMS content types

export interface DirectusFile {
  id: string;
  title?: string;
  filename_disk: string;
  filename_download: string;
  description?: string;
  type: string;
  width?: number;
  height?: number;
  filesize: number;
  uploaded_on: string;
}

export interface WorkshopService {
  id: number;
  status: 'draft' | 'published' | 'archived';
  sort?: number;
  title: string;
  slug: string;
  category: 'tuv' | 'inspection' | 'repairs' | 'maintenance' | 'climate' | 'tires' | 'electrical' | 'bodywork';
  description: string;
  long_description?: string;
  price_from?: number;
  price_to?: number;
  duration?: string;
  image?: DirectusFile | string;
  gallery?: DirectusFile[] | string[];
  features?: string[];
  requirements?: string[];
  languages?: ('de' | 'en' | 'tr' | 'pl')[];
  meta_title?: string;
  meta_description?: string;
  translations?: ServiceTranslation[];
}

export interface ServiceTranslation {
  id: number;
  languages_code: string;
  workshop_services_id: number;
  title?: string;
  description?: string;
  long_description?: string;
  features?: string[];
  requirements?: string[];
  meta_title?: string;
  meta_description?: string;
}

export interface BlogPost {
  id: number;
  status: 'draft' | 'published' | 'archived';
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: DirectusFile | string;
  author?: string;
  category?: string;
  tags?: string[];
  date_created: string;
  date_updated: string;
  languages?: ('de' | 'en' | 'tr' | 'pl')[];
  meta_title?: string;
  meta_description?: string;
  translations?: BlogPostTranslation[];
}

export interface BlogPostTranslation {
  id: number;
  languages_code: string;
  blog_posts_id: number;
  title?: string;
  excerpt?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface FAQ {
  id: number;
  status: 'draft' | 'published' | 'archived';
  question: string;
  answer: string;
  category?: string;
  sort?: number;
  languages?: ('de' | 'en' | 'tr' | 'pl')[];
  translations?: FAQTranslation[];
}

export interface FAQTranslation {
  id: number;
  languages_code: string;
  faqs_id: number;
  question?: string;
  answer?: string;
}

export interface Testimonial {
  id: number;
  status: 'draft' | 'published' | 'archived';
  customer_name: string;
  customer_location?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  review_text: string;
  vehicle_info?: string;
  service_type?: string;
  date_created: string;
  languages?: ('de' | 'en' | 'tr' | 'pl')[];
  translations?: TestimonialTranslation[];
}

export interface TestimonialTranslation {
  id: number;
  languages_code: string;
  testimonials_id: number;
  review_text?: string;
  vehicle_info?: string;
  service_type?: string;
}

export interface LandingPage {
  id: number;
  status: 'draft' | 'published' | 'archived';
  title: string;
  slug: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: DirectusFile | string;
  content_blocks?: ContentBlock[];
  cta_text?: string;
  cta_link?: string;
  meta_title?: string;
  meta_description?: string;
  translations?: LandingPageTranslation[];
}

export interface LandingPageTranslation {
  id: number;
  languages_code: string;
  landing_pages_id: number;
  title?: string;
  hero_title?: string;
  hero_subtitle?: string;
  content_blocks?: ContentBlock[];
  cta_text?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'services' | 'testimonials' | 'cta' | 'features';
  title?: string;
  content?: string;
  image?: DirectusFile | string;
  images?: (DirectusFile | string)[];
  alignment?: 'left' | 'center' | 'right';
  background_color?: string;
  text_color?: string;
  button_text?: string;
  button_link?: string;
  services?: WorkshopService[];
  testimonials?: Testimonial[];
  features?: Feature[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: DirectusFile | string;
}

export interface AboutPage {
  id: number;
  status: 'draft' | 'published' | 'archived';
  title: string;
  type: 'company' | 'team' | 'history';
  content: string;
  images?: (DirectusFile | string)[];
  team_members?: TeamMember[];
  meta_title?: string;
  meta_description?: string;
  translations?: AboutPageTranslation[];
}

export interface AboutPageTranslation {
  id: number;
  languages_code: string;
  about_pages_id: number;
  title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  photo?: DirectusFile | string;
  certifications?: string[];
  experience_years?: number;
}

export interface LegalPage {
  id: number;
  status: 'draft' | 'published' | 'archived';
  title: string;
  type: 'impressum' | 'datenschutz' | 'agb';
  content: string;
  last_updated: string;
  translations?: LegalPageTranslation[];
}

export interface LegalPageTranslation {
  id: number;
  languages_code: string;
  legal_pages_id: number;
  title?: string;
  content?: string;
}

export interface ContactInfo {
  id: number;
  status: 'draft' | 'published';
  company_name: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: OpeningHours;
  emergency_contact?: string;
  social_media?: SocialMedia;
  translations?: ContactInfoTranslation[];
}

export interface ContactInfoTranslation {
  id: number;
  languages_code: string;
  contact_info_id: number;
  company_name?: string;
  address?: string;
  opening_hours?: OpeningHours;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string;
  logo?: DirectusFile | string;
  favicon?: DirectusFile | string;
  default_meta_image?: DirectusFile | string;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  translations?: SiteSettingsTranslation[];
}

export interface SiteSettingsTranslation {
  id: number;
  languages_code: string;
  site_settings_id: number;
  site_name?: string;
  site_description?: string;
}

// API Response types
export interface DirectusResponse<T> {
  data: T;
}

export interface DirectusListResponse<T> {
  data: T[];
  meta?: {
    filter_count: number;
    total_count: number;
  };
}

// Category mappings for German automotive services
export const SERVICE_CATEGORIES = {
  tuv: 'TÜV & HU',
  inspection: 'Inspektion',
  repairs: 'Reparaturen',
  maintenance: 'Wartung',
  climate: 'Klimaservice',
  tires: 'Reifenservice',
  electrical: 'Elektrik',
  bodywork: 'Karosserie'
} as const;

export const FAQ_CATEGORIES = {
  general: 'Allgemein',
  services: 'Serviceleistungen',
  pricing: 'Preise & Kosten',
  appointment: 'Terminbuchung',
  tuv: 'TÜV & HU',
  warranty: 'Garantie'
} as const;

export const BLOG_CATEGORIES = {
  news: 'Neuigkeiten',
  tips: 'Tipps & Tricks',
  regulations: 'Vorschriften',
  technology: 'Technik',
  seasonal: 'Saisonales'
} as const;