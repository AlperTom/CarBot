import { useState } from 'react';
import { FAQ_CATEGORIES } from '../../types/directus';

export default function FAQ({ faqs, language = 'de', className = '', showCategories = true }) {
  const [openItems, setOpenItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get translation or fallback to default
  const getTranslatedField = (faq, field, fallback = '') => {
    if (faq.translations && faq.translations.length > 0) {
      const translation = faq.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return faq[field] || fallback;
  };

  // Toggle FAQ item
  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Filter FAQs by category
  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  // Group FAQs by category
  const groupedFAQs = faqs.reduce((groups, faq) => {
    const category = faq.category || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(faq);
    return groups;
  }, {});

  // Get available categories
  const availableCategories = Object.keys(groupedFAQs);

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">Keine FAQs verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Category Filter */}
      {showCategories && availableCategories.length > 1 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle Kategorien
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {FAQ_CATEGORIES[category] || category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => {
          const question = getTranslatedField(faq, 'question');
          const answer = getTranslatedField(faq, 'answer');
          const isOpen = openItems.has(faq.id);

          return (
            <div 
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <div 
                    className="text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// FAQ Section with Search
export function FAQSection({ faqs, language = 'de', className = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());

  // Get translation or fallback to default
  const getTranslatedField = (faq, field, fallback = '') => {
    if (faq.translations && faq.translations.length > 0) {
      const translation = faq.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return faq[field] || fallback;
  };

  // Filter FAQs by search term
  const filteredFAQs = faqs.filter(faq => {
    const question = getTranslatedField(faq, 'question').toLowerCase();
    const answer = getTranslatedField(faq, 'answer').toLowerCase();
    const term = searchTerm.toLowerCase();
    return question.includes(term) || answer.includes(term);
  });

  // Toggle FAQ item
  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Häufig gestellte Fragen
        </h2>
        <p className="text-gray-600 mb-6">
          Finden Sie schnell Antworten auf die wichtigsten Fragen zu unseren Services
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="FAQs durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* FAQ List */}
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm ? 'Keine passenden FAQs gefunden.' : 'Keine FAQs verfügbar.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => {
            const question = getTranslatedField(faq, 'question');
            const answer = getTranslatedField(faq, 'answer');
            const isOpen = openItems.has(faq.id);

            return (
              <div 
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Question */}
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {question}
                    </h3>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <div 
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Quick FAQ widget for sidebar
export function QuickFAQ({ faqs, language = 'de', className = '', maxItems = 5 }) {
  const [openItems, setOpenItems] = useState(new Set());

  // Get translation or fallback to default
  const getTranslatedField = (faq, field, fallback = '') => {
    if (faq.translations && faq.translations.length > 0) {
      const translation = faq.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return faq[field] || fallback;
  };

  // Toggle FAQ item
  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const displayFAQs = faqs.slice(0, maxItems);

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Häufige Fragen
      </h3>
      
      <div className="space-y-3">
        {displayFAQs.map((faq) => {
          const question = getTranslatedField(faq, 'question');
          const answer = getTranslatedField(faq, 'answer');
          const isOpen = openItems.has(faq.id);

          return (
            <div 
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 pr-2">
                    {question}
                  </h4>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 py-3 border-t border-gray-200">
                  <div 
                    className="text-gray-600 text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {faqs.length > maxItems && (
        <div className="mt-4 text-center">
          <a 
            href="/faq"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Alle FAQs anzeigen
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}