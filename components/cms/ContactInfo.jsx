'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function ContactInfo({ 
  contactInfo, 
  language = 'de', 
  showForm = true,
  className = '' 
}) {
  // Get translation or fallback to default
  const getTranslatedField = (field, fallback = '') => {
    if (contactInfo.translations && contactInfo.translations.length > 0) {
      const translation = contactInfo.translations.find(t => t.languages_code === language);
      if (translation && translation[field]) {
        return translation[field];
      }
    }
    return contactInfo[field] || fallback;
  };

  const companyName = getTranslatedField('company_name');
  const address = getTranslatedField('address');
  const openingHours = getTranslatedField('opening_hours', contactInfo.opening_hours);

  return (
    <div className={`bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kontakt & Anfahrt
          </h2>
          <p className="text-lg text-gray-600">
            Nehmen Sie Kontakt mit uns auf - wir freuen uns auf Sie!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Kontaktdaten
              </h3>

              {/* Company Name */}
              {companyName && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {companyName}
                  </h4>
                </div>
              )}

              {/* Address */}
              {address && (
                <div className="flex items-start mb-6">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-gray-600 whitespace-pre-line">{address}</p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {contactInfo.phone && (
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {contactInfo.email && (
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">E-Mail</p>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {contactInfo.emergency_contact && (
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Notfall-Hotline</p>
                    <a 
                      href={`tel:${contactInfo.emergency_contact}`}
                      className="text-red-600 hover:text-red-800 transition-colors font-semibold"
                    >
                      {contactInfo.emergency_contact}
                    </a>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {openingHours && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Öffnungszeiten
                  </h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(openingHours).map(([day, hours]) => {
                      const dayNames = {
                        monday: 'Montag',
                        tuesday: 'Dienstag',
                        wednesday: 'Mittwoch',
                        thursday: 'Donnerstag',
                        friday: 'Freitag',
                        saturday: 'Samstag',
                        sunday: 'Sonntag'
                      };
                      
                      return (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-600">{dayNames[day] || day}</span>
                          <span className="text-gray-900 font-medium">{hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {contactInfo.social_media && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Folgen Sie uns
                  </h4>
                  <div className="flex space-x-4">
                    {contactInfo.social_media.facebook && (
                      <a 
                        href={contactInfo.social_media.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Facebook"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    
                    {contactInfo.social_media.instagram && (
                      <a 
                        href={contactInfo.social_media.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800 transition-colors"
                        aria-label="Instagram"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.563-3.239-1.441-.791-.878-1.27-2.059-1.27-3.547s.479-2.669 1.27-3.547c.791-.878 1.942-1.441 3.239-1.441 1.297 0 2.448.563 3.239 1.441.791.878 1.27 2.059 1.27 3.547s-.479 2.669-1.27 3.547c-.791.878-1.942 1.441-3.239 1.441z"/>
                        </svg>
                      </a>
                    )}
                    
                    {contactInfo.social_media.youtube && (
                      <a 
                        href={contactInfo.social_media.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="YouTube"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          {showForm && (
            <div>
              <ContactForm language={language} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// GDPR-compliant contact form
function ContactForm({ language = 'de' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    vehicle: '',
    preferred_contact: 'email',
    privacy_accepted: false,
    newsletter_opt_in: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.privacy_accepted) {
      setError('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden der Nachricht');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        vehicle: '',
        preferred_contact: 'email',
        privacy_accepted: false,
        newsletter_opt_in: false
      });
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Vielen Dank für Ihre Nachricht!
        </h3>
        <p className="text-green-700">
          Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-green-600 hover:text-green-800 font-medium"
        >
          Neue Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Kontaktformular
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Phone and Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefon (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Betreff *
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Bitte wählen...</option>
              <option value="appointment">Terminanfrage</option>
              <option value="quote">Kostenvoranschlag</option>
              <option value="tuv">TÜV/HU Anfrage</option>
              <option value="repair">Reparatur</option>
              <option value="inspection">Inspektion</option>
              <option value="general">Allgemeine Anfrage</option>
              <option value="other">Sonstiges</option>
            </select>
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
            Fahrzeug (Marke, Modell, Baujahr)
          </label>
          <input
            type="text"
            id="vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleInputChange}
            placeholder="z.B. VW Golf, 2018"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Ihre Nachricht *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Beschreiben Sie bitte Ihr Anliegen..."
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bevorzugte Kontaktaufnahme
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="email"
                checked={formData.preferred_contact === 'email'}
                onChange={handleInputChange}
                className="mr-2"
              />
              E-Mail
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferred_contact"
                value="phone"
                checked={formData.preferred_contact === 'phone'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Telefon
            </label>
          </div>
        </div>

        {/* GDPR Compliance */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="privacy_accepted"
              name="privacy_accepted"
              checked={formData.privacy_accepted}
              onChange={handleInputChange}
              className="mt-1 mr-3"
              required
            />
            <label htmlFor="privacy_accepted" className="text-sm text-gray-700">
              Ich habe die{' '}
              <Link href="/legal/datenschutz" className="text-blue-600 hover:text-blue-800 underline">
                Datenschutzerklärung
              </Link>
              {' '}gelesen und akzeptiere die Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage. *
            </label>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="newsletter_opt_in"
              name="newsletter_opt_in"
              checked={formData.newsletter_opt_in}
              onChange={handleInputChange}
              className="mt-1 mr-3"
            />
            <label htmlFor="newsletter_opt_in" className="text-sm text-gray-700">
              Ich möchte gelegentlich Informationen über neue Services und Angebote erhalten. 
              (Diese Einwilligung kann ich jederzeit widerrufen)
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Quick contact widget
export function QuickContact({ contactInfo, language = 'de', className = '' }) {
  return (
    <div className={`bg-blue-600 text-white rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-bold mb-4">
        Schnell erreichen
      </h3>
      
      <div className="space-y-4">
        {contactInfo.phone && (
          <a 
            href={`tel:${contactInfo.phone}`}
            className="flex items-center hover:text-blue-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{contactInfo.phone}</span>
          </a>
        )}
        
        {contactInfo.email && (
          <a 
            href={`mailto:${contactInfo.email}`}
            className="flex items-center hover:text-blue-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="break-all">{contactInfo.email}</span>
          </a>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-blue-500">
        <Link 
          href="/appointment"
          className="block w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
        >
          Online Termin buchen
        </Link>
      </div>
    </div>
  );
}