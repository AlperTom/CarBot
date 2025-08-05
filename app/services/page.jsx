import { getWorkshopServices } from '../../lib/directus';
import { ServiceGrid } from '../../components/cms/ServiceCard';
import { SERVICE_CATEGORIES } from '../../types/directus';

// Generate metadata for SEO
export const metadata = {
  title: 'Unsere Services | KFZ Werkstatt',
  description: 'Alle Serviceleistungen unserer KFZ-Werkstatt im Überblick: TÜV, Inspektion, Reparaturen, Wartung und mehr.',
  openGraph: {
    title: 'Unsere Services | KFZ Werkstatt',
    description: 'Alle Serviceleistungen unserer KFZ-Werkstatt im Überblick: TÜV, Inspektion, Reparaturen, Wartung und mehr.',
    type: 'website',
  },
};

export default async function ServicesPage({ searchParams }) {
  const language = searchParams.lang || 'de';
  const category = searchParams.category || 'all';

  try {
    const allServices = await getWorkshopServices(language);
    
    // Filter services by category if specified
    const filteredServices = category === 'all' 
      ? allServices 
      : allServices.filter(service => service.category === category);

    // Group services by category
    const servicesByCategory = allServices.reduce((groups, service) => {
      const cat = service.category || 'other';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(service);
      return groups;
    }, {});

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Unsere Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Von der regelmäßigen Wartung bis zur komplexen Reparatur - 
              wir bieten Ihnen alle Serviceleistungen rund um Ihr Fahrzeug.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href="/services"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Alle Services
              </a>
              
              {Object.entries(SERVICE_CATEGORIES).map(([key, label]) => (
                <a
                  key={key}
                  href={`/services?category=${key}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Services Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {category === 'all' ? (
            // Show all services grouped by category
            <div className="space-y-16">
              {Object.entries(servicesByCategory).map(([cat, services]) => (
                <div key={cat}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {SERVICE_CATEGORIES[cat] || cat}
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                  </div>
                  
                  <ServiceGrid services={services} language={language} />
                </div>
              ))}
            </div>
          ) : (
            // Show filtered services
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {SERVICE_CATEGORIES[category] || category}
                </h2>
                <p className="text-lg text-gray-600">
                  {filteredServices.length} Service{filteredServices.length !== 1 ? 's' : ''} verfügbar
                </p>
              </div>
              
              <ServiceGrid services={filteredServices} language={language} />
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ihr Service nicht dabei?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Kontaktieren Sie uns - wir helfen Ihnen gerne bei allen Fragen rund um Ihr Fahrzeug.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Kontakt aufnehmen
              </a>
              <a 
                href="/appointment"
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Termin buchen
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading services:', error);
    
    return (
      <main className="min-h-screen">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Unsere Services
            </h1>
            <p className="text-xl text-blue-100">
              Entschuldigung, die Services konnten nicht geladen werden.
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">
              Services konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
            </p>
            <a 
              href="/contact"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </main>
    );
  }
}