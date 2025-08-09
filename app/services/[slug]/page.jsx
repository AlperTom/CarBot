import { notFound } from 'next/navigation';
import { getWorkshopService, getWorkshopServices } from '../../../lib/directus';
import { ServiceHeroSection } from '../../../components/cms/HeroSection';
import { ContentBlocks } from '../../../components/cms/ContentBlock';
import ImageGallery from '../../../components/cms/ImageGallery';
import { QuickContact } from '../../../components/cms/ContactInfo';

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }) {
  const { slug } = params;
  const language = searchParams.lang || 'de';
  
  try {
    const service = await getWorkshopService(slug, language);
    
    if (!service) {
      return {
        title: 'Service nicht gefunden',
        description: 'Der angeforderte Service konnte nicht gefunden werden.'
      };
    }

    const getTranslatedField = (field, fallback = '') => {
      if (service.translations && service.translations.length > 0) {
        const translation = service.translations.find(t => t.languages_code === language);
        if (translation && translation[field]) {
          return translation[field];
        }
      }
      return service[field] || fallback;
    };

    const title = getTranslatedField('meta_title') || getTranslatedField('title');
    const description = getTranslatedField('meta_description') || getTranslatedField('description');

    return {
      title: `${title} | KFZ Werkstatt`,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        images: service.image ? [{
          url: `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${typeof service.image === 'string' ? service.image : service.image.id}?width=1200&height=600`,
          width: 1200,
          height: 600,
          alt: title
        }] : []
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: service.image ? [`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${typeof service.image === 'string' ? service.image : service.image.id}?width=1200&height=600`] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Service | KFZ Werkstatt',
      description: 'Professionelle KFZ Services für Ihr Fahrzeug'
    };
  }
}

// Generate static params for all services
export async function generateStaticParams() {
  try {
    const services = await getWorkshopServices('de');
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ServicePage({ params, searchParams }) {
  const { slug } = params;
  const language = searchParams.lang || 'de';

  try {
    const service = await getWorkshopService(slug, language);
    
    if (!service) {
      notFound();
    }

    // Get translation helper
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
    const longDescription = getTranslatedField('long_description');
    const features = getTranslatedField('features', []);
    const requirements = getTranslatedField('requirements', []);

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <ServiceHeroSection service={service} language={language} />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Description */}
              {longDescription && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Service Details
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: longDescription }}
                  />
                </div>
              )}

              {/* Features */}
              {features && features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Leistungen im Überblick
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {requirements && requirements.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Was Sie mitbringen sollten
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <ul className="space-y-2">
                      {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {service.gallery && service.gallery.length > 0 && (
                <div className="mb-12">
                  <ImageGallery 
                    images={service.gallery}
                    title="Eindrücke aus unserer Werkstatt"
                    variant="grid"
                    columns={2}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Service Details Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Service Informationen
                </h3>
                
                <div className="space-y-4">
                  {service.duration && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">
                        <strong>Dauer:</strong> {service.duration}
                      </span>
                    </div>
                  )}
                  
                  {service.price_from && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-gray-700">
                        <strong>Preis:</strong> ab {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(service.price_from)}
                        {service.price_to && service.price_to !== service.price_from && (
                          ` - ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(service.price_to)}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a 
                    href={`/appointment?service=${service.slug}`}
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  >
                    Termin buchen
                  </a>
                </div>
              </div>

              {/* Quick Contact would go here if contactInfo was available */}
              {/* <QuickContact contactInfo={contactInfo} language={language} /> */}
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RelatedServices currentService={service} language={language} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading service:', error);
    notFound();
  }
}

// Related Services Component
async function RelatedServices({ currentService, language = 'de' }) {
  try {
    const allServices = await getWorkshopServices(language);
    const relatedServices = allServices
      .filter(service => service.id !== currentService.id && service.category === currentService.category)
      .slice(0, 3);

    if (relatedServices.length === 0) return null;

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Weitere Services aus dieser Kategorie
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedServices.map((service) => {
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

            return (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-gray-900 mb-3">
                  <a href={`/services/${service.slug}`} className="hover:text-blue-600 transition-colors">
                    {title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {description}
                </p>
                <a 
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Mehr erfahren
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading related services:', error);
    return null;
  }
}