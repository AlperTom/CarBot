import Link from 'next/link'
import ModernNavigation from '@/components/ModernNavigation'

// Generate metadata for SEO
export const metadata = {
  title: 'Blog & Insights | CarBot',
  description: 'Neueste Artikel über KI-gestützte Kundenberatung, Werkstatt-Digitalisierung und Automotive-Trends.',
  openGraph: {
    title: 'Blog & Insights | CarBot',
    description: 'Neueste Artikel über KI-gestützte Kundenberatung, Werkstatt-Digitalisierung und Automotive-Trends.',
    type: 'website',
  },
  themeColor: '#ea580c',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'
};

export default function BlogPage({ searchParams }) {
  // Static blog posts for production
  const staticPosts = [
    {
      id: 1,
      title: 'KI-gestützte Kundenberatung: Die Zukunft der Autowerkstatt',
      slug: 'ki-chatbot-autowerkstatt',
      excerpt: 'Erfahren Sie, wie KI-Chatbots Ihre Werkstatt revolutionieren und 24/7 Kundenbetreuung ermöglichen.',
      date: '2024-12-15',
      category: 'KI & Technologie',
      readTime: '5 Min',
      image: '/blog-placeholder.jpg'
    },
    {
      id: 2, 
      title: 'Automatisierte Terminbuchung für Werkstätten',
      slug: 'automatisierte-terminbuchung-werkstatt',
      excerpt: 'Steigern Sie Ihre Effizienz mit automatisierter Terminbuchung und reduzieren Sie Ausfallzeiten.',
      date: '2024-12-10',
      category: 'Workflow',
      readTime: '7 Min',
      image: '/blog-placeholder.jpg'
    },
    {
      id: 3,
      title: 'Kundenbindung in der Autowerkstatt: 10 bewährte Strategien',
      slug: 'kundenbindung-autowerkstatt-strategien', 
      excerpt: 'Lernen Sie praxiserprobte Strategien für langfristige Kundenbeziehungen kennen.',
      date: '2024-12-05',
      category: 'Marketing',
      readTime: '6 Min',
      image: '/blog-placeholder.jpg'
    },
    {
      id: 4,
      title: 'Werkstatt-Digitalisierung 2025: Trends und Chancen',
      slug: 'werkstatt-digitalisierung-2025',
      excerpt: 'Die wichtigsten Digitalisierungs-Trends für Autowerkstätten im Jahr 2025.',
      date: '2024-11-30',
      category: 'Trends',
      readTime: '8 Min',
      image: '/blog-placeholder.jpg'
    },
    {
      id: 5,
      title: 'Lead-Generierung für KFZ-Betriebe',
      slug: 'lead-generierung-kfz-betriebe',
      excerpt: 'Effektive Strategien zur Neukundengewinnung für Ihre Werkstatt.',
      date: '2024-11-25',
      category: 'Marketing',
      readTime: '6 Min',
      image: '/blog-placeholder.jpg'
    },
    {
      id: 6,
      title: 'DSGVO-konforme Kundenkommunikation',
      slug: 'dsgvo-konforme-kundenkommunikation',
      excerpt: 'So bleiben Sie bei der digitalen Kundenkommunikation datenschutzkonform.',
      date: '2024-11-20',
      category: 'Recht',
      readTime: '7 Min',
      image: '/blog-placeholder.jpg'
    }
  ];

  const categories = ['Alle', 'KI & Technologie', 'Workflow', 'Marketing', 'Trends', 'Recht'];
  const selectedCategory = searchParams.category || 'Alle';
  
  const filteredPosts = selectedCategory === 'Alle' 
    ? staticPosts 
    : staticPosts.filter(post => post.category === selectedCategory);

  const featuredPost = staticPosts[0];

  return (
    <>
      <style jsx>{`
        @keyframes blogFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes titleSequence {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .blog-title {
          animation: titleSequence 0.8s ease-out;
        }
        
        .blog-subtitle {
          animation: titleSequence 0.8s ease-out 0.2s both;
        }
        
        .blog-description {
          animation: titleSequence 0.8s ease-out 0.4s both;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
        color: 'white'
      }}>
      {/* Modern Navigation */}
      <ModernNavigation variant="blog" />
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
        padding: '6rem 1.5rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h1 className="blog-title" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #f97316, #a855f7, #3b82f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0
          }}>
            CarBot Blog & Insights
          </h1>
          <p className="blog-description" style={{
            fontSize: '1.25rem',
            color: '#e2e8f0',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto',
            opacity: 0
          }}>
            Entdecken Sie die neuesten Trends in der Werkstatt-Digitalisierung und KI-gestützten Kundenberatung
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Featured Article */}
        {featuredPost && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ padding: '2rem' }}>
                <div style={{ 
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  ⭐ Featured Article
                </div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: 'white'
                }}>
                  {featuredPost.title}
                </h2>
                <p style={{
                  color: '#d1d5db',
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {featuredPost.excerpt}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '2rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {featuredPost.category}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    📅 {featuredPost.date}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    ⏱️ {featuredPost.readTime}
                  </span>
                </div>
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'transform 0.2s ease',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                  Artikel lesen →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: 'white'
          }}>
            Kategorien
          </h3>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            {categories.map(category => (
              <Link
                key={category}
                href={`/blog?category=${category}`}
                style={{
                  background: selectedCategory === category 
                    ? 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  border: selectedCategory === category ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={e => {
                  if (selectedCategory !== category) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedCategory !== category) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts - Vertical Layout */}
        <section>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem',
            color: 'white'
          }}>
            {selectedCategory === 'Alle' ? 'Neueste Artikel' : `${selectedCategory} Artikel`}
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {filteredPosts.slice(1).map((post, index) => (
              <article
                key={post.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: `blogFadeIn 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${getCategoryColor(post.category)} 0%, ${getCategoryColor(post.category)}80 100%)`,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'inline-block'
                }}>
                  {post.category}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: 'white',
                  lineHeight: '1.4'
                }}>
                  {post.title}
                </h3>
                <p style={{
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '1rem'
                }}>
                  {post.excerpt}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  <span>📅 {post.date}</span>
                  <span>⏱️ {post.readTime}</span>
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Weiterlesen →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Bereit für KI-gestützte Kundenberatung?
          </h3>
          <p style={{
            color: '#d1d5db',
            fontSize: '1.125rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Starten Sie noch heute mit CarBot und revolutionieren Sie Ihre Kundenkommunikation.
          </p>
          <Link 
            href="/auth/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'transform 0.2s ease',
              fontSize: '1.125rem'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            🚀 Kostenlos starten
          </Link>
        </section>
      </div>
    </div>
    </>
  );
}

function getCategoryColor(category) {
  const colors = {
    'KI & Technologie': '#3b82f6',
    'Workflow': '#10b981', 
    'Marketing': '#f59e0b',
    'Trends': '#8b5cf6',
    'Recht': '#ef4444'
  };
  return colors[category] || '#6b7280';
}