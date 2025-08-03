import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ChatWidget from '../../components/ChatWidget'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { kunde } = params
  
  try {
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('slug', kunde)
      .single()

    if (!customer) {
      return {
        title: 'Kunde nicht gefunden - CarBot',
        description: 'Die angeforderte Kundenseite konnte nicht gefunden werden.'
      }
    }

    const title = `${customer.name} - KFZ Service & Beratung | CarBot`
    const description = `${customer.name} in ${customer.city}: ${customer.services.join(', ')}. Professionelle KFZ-Beratung und Service. Jetzt chatten!`

    return {
      title,
      description,
      keywords: [
        customer.name,
        customer.city,
        'KFZ Werkstatt',
        'Auto Service',
        'Reparatur',
        'TÜV',
        'Wartung',
        ...customer.services
      ].join(', '),
      authors: [{ name: customer.name }],
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'de_DE',
        siteName: 'CarBot',
        images: customer.logo ? [
          {
            url: customer.logo,
            width: 800,
            height: 600,
            alt: `${customer.name} Logo`
          }
        ] : []
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description
      },
      other: {
        'og:business:contact_data:street_address': customer.address,
        'og:business:contact_data:locality': customer.city,
        'og:business:contact_data:postal_code': customer.postal_code,
        'og:business:contact_data:phone_number': customer.phone,
        'og:business:hours': customer.opening_hours
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'CarBot - KFZ Service Beratung',
      description: 'Professionelle KFZ-Beratung per Chat'
    }
  }
}

async function getCustomerData(slug) {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        services,
        opening_hours,
        google_reviews_link,
        partners (
          name,
          slug,
          city,
          specialization
        )
      `)
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) throw error
    return customer
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

export default async function CustomerLandingPage({ params }) {
  const { kunde } = params
  const customer = await getCustomerData(kunde)

  if (!customer) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": customer.name,
    "description": `${customer.name} - Professionelle KFZ-Services in ${customer.city}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": customer.address,
      "addressLocality": customer.city,
      "postalCode": customer.postal_code,
      "addressCountry": "DE"
    },
    "telephone": customer.phone,
    "url": `https://carbot.chat/${customer.slug}`,
    "openingHours": customer.opening_hours,
    "serviceArea": {
      "@type": "City",
      "name": customer.city
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "KFZ Services",
      "itemListElement": customer.services.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "name": service
      }))
    },
    "aggregateRating": customer.rating ? {
      "@type": "AggregateRating",
      "ratingValue": customer.rating,
      "reviewCount": customer.review_count || 1
    } : undefined
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div style={{
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc'
      }}>
        {/* Header Section */}
        <header style={{
          background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          {customer.logo && (
            <img 
              src={customer.logo} 
              alt={`${customer.name} Logo`}
              style={{
                maxHeight: '80px',
                marginBottom: '20px',
                objectFit: 'contain'
              }}
            />
          )}
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            {customer.name}
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            margin: 0,
            opacity: 0.9
          }}>
            Professionelle KFZ-Services in {customer.city}
          </p>
        </header>

        {/* Main Content */}
        <main style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '40px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {/* Services Section */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#1a202c',
              marginBottom: '20px',
              fontSize: '1.5rem'
            }}>
              🔧 Unsere Services
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {customer.services.map((service, index) => (
                <li key={index} style={{
                  padding: '10px 0',
                  borderBottom: index < customer.services.length - 1 ? '1px solid #e2e8f0' : 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#0070f3', marginRight: '10px' }}>✓</span>
                  {service}
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Information */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#1a202c',
              marginBottom: '20px',
              fontSize: '1.5rem'
            }}>
              📍 Kontakt & Öffnungszeiten
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#4a5568' }}>
                Adresse:
              </h3>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {customer.address}<br/>
                {customer.postal_code} {customer.city}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#4a5568' }}>
                Telefon:
              </h3>
              <a href={`tel:${customer.phone}`} style={{
                color: '#0070f3',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                {customer.phone}
              </a>
            </div>

            {customer.opening_hours && (
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#4a5568' }}>
                  Öffnungszeiten:
                </h3>
                <div style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
                  {customer.opening_hours.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Google Reviews */}
          {customer.google_reviews_link && (
            <section style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h2 style={{ 
                color: '#1a202c',
                marginBottom: '20px',
                fontSize: '1.5rem'
              }}>
                ⭐ Kundenbewertungen
              </h2>
              {customer.rating && (
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '2rem', color: '#fbbf24' }}>
                    {'★'.repeat(Math.floor(customer.rating))}
                    {'☆'.repeat(5 - Math.floor(customer.rating))}
                  </span>
                  <p style={{ margin: '5px 0', color: '#6b7280' }}>
                    {customer.rating}/5 Sterne ({customer.review_count || 0} Bewertungen)
                  </p>
                </div>
              )}
              <a 
                href={customer.google_reviews_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#4285f4',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Bewertungen bei Google ansehen
              </a>
            </section>
          )}

          {/* Partner Network */}
          {customer.partners && customer.partners.length > 0 && (
            <section style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              gridColumn: '1 / -1'
            }}>
              <h2 style={{ 
                color: '#1a202c',
                marginBottom: '20px',
                fontSize: '1.5rem'
              }}>
                🤝 Unser Partnernetzwerk
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {customer.partners.map((partner, index) => (
                  <a
                    key={index}
                    href={`/${partner.slug}`}
                    style={{
                      display: 'block',
                      padding: '15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#1a202c',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#0070f3'
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.transform = 'translateY(0)'
                    }}
                  >
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>
                      {partner.name}
                    </h3>
                    <p style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '0.9rem' }}>
                      {partner.city}
                    </p>
                    <p style={{ margin: 0, color: '#0070f3', fontSize: '0.85rem' }}>
                      {partner.specialization}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          background: '#1a202c',
          color: 'white',
          padding: '30px 20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
            © 2024 {customer.name}. Alle Rechte vorbehalten.
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
            Powered by <a href="https://carbot.chat" style={{ color: '#0070f3' }}>CarBot</a> - 
            Intelligente KFZ-Beratung für moderne Werkstätten
          </p>
        </footer>

        {/* Embedded ChatWidget */}
        <ChatWidget 
          clientKey={customer.slug}
          isEmbedded={false}
        />
      </div>
    </>
  )
}