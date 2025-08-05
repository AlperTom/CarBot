import { getBlogPosts } from '../../lib/directus';
import { BlogGrid, FeaturedBlogPost } from '../../components/cms/BlogPost';
import { BLOG_CATEGORIES } from '../../types/directus';

// Generate metadata for SEO
export const metadata = {
  title: 'Blog & News | KFZ Werkstatt',
  description: 'Aktuelle Neuigkeiten, Tipps und Tricks rund um Ihr Fahrzeug. Bleiben Sie informiert über Wartung, Reparaturen und Automobiltrends.',
  openGraph: {
    title: 'Blog & News | KFZ Werkstatt',
    description: 'Aktuelle Neuigkeiten, Tipps und Tricks rund um Ihr Fahrzeug. Bleiben Sie informiert über Wartung, Reparaturen und Automobiltrends.',
    type: 'website',
  },
};

export default async function BlogPage({ searchParams }) {
  const language = searchParams.lang || 'de';
  const category = searchParams.category || 'all';
  const page = parseInt(searchParams.page) || 1;
  const limit = 9;

  try {
    const allPosts = await getBlogPosts(language, 50); // Get more posts for filtering
    
    // Filter posts by category if specified
    const filteredPosts = category === 'all' 
      ? allPosts 
      : allPosts.filter(post => post.category === category);

    // Pagination
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + limit);
    
    // Featured post (first post if on page 1)
    const featuredPost = page === 1 && category === 'all' ? allPosts[0] : null;
    const displayPosts = featuredPost ? currentPosts.slice(1) : currentPosts;

    // Get available categories
    const availableCategories = [...new Set(allPosts.map(post => post.category).filter(Boolean))];

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog & News
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Bleiben Sie informiert über aktuelle Entwicklungen, hilfreiche Tipps 
              und wichtige Neuigkeiten rund um Ihr Fahrzeug.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href="/blog"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Alle Artikel
              </a>
              
              {availableCategories.map((cat) => (
                <a
                  key={cat}
                  href={`/blog?category=${cat}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {BLOG_CATEGORIES[cat] || cat}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <FeaturedBlogPost post={featuredPost} language={language} />
            </div>
          )}

          {/* Posts Grid */}
          {displayPosts.length > 0 ? (
            <div className="mb-12">
              {category !== 'all' && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {BLOG_CATEGORIES[category] || category}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {totalPosts} Artikel{totalPosts !== 1 ? '' : ''} gefunden
                  </p>
                </div>
              )}
              
              <BlogGrid posts={displayPosts} language={language} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-lg">
                  {category === 'all' ? 'Keine Artikel verfügbar' : `Keine Artikel in der Kategorie "${BLOG_CATEGORIES[category] || category}" gefunden`}
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Page */}
              {page > 1 && (
                <a
                  href={`/blog?${new URLSearchParams({ 
                    ...(category !== 'all' && { category }), 
                    page: (page - 1).toString() 
                  })}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Vorherige
                </a>
              )}

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 2 && pageNum <= page + 2)
                ) {
                  return (
                    <a
                      key={pageNum}
                      href={`/blog?${new URLSearchParams({ 
                        ...(category !== 'all' && { category }), 
                        page: pageNum.toString() 
                      })}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === page
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                } else if (
                  pageNum === page - 3 ||
                  pageNum === page + 3
                ) {
                  return <span key={pageNum} className="px-2">...</span>;
                }
                return null;
              })}

              {/* Next Page */}
              {page < totalPages && (
                <a
                  href={`/blog?${new URLSearchParams({ 
                    ...(category !== 'all' && { category }), 
                    page: (page + 1).toString() 
                  })}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nächste
                </a>
              )}
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-green-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Verpassen Sie keine Neuigkeiten!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Abonnieren Sie unseren Newsletter und bleiben Sie immer auf dem neuesten Stand.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ihre E-Mail Adresse"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Anmelden
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    
    return (
      <main className="min-h-screen">
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog & News
            </h1>
            <p className="text-xl text-green-100">
              Entschuldigung, die Artikel konnten nicht geladen werden.
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">
              Artikel konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
            </p>
          </div>
        </div>
      </main>
    );
  }
}