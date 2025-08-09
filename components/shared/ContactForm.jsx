/**
 * ContactForm - GDPR Compliant Contact Form
 * Professional contact form with German legal compliance and automotive context
 */

import { useState } from 'react'

export default function ContactForm({ 
  config,
  type = 'general', // 'general', 'appointment', 'quote'
  onSubmit,
  className = ''
}) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Message/Request
    subject: '',
    message: '',
    
    // Automotive Specific Fields
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    mileage: '',
    
    // Service Type (for appointments/quotes)
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'normal',
    
    // GDPR Compliance
    gdprConsent: false,
    marketingConsent: false,
    
    // Spam Protection
    honeypot: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error'

  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    email: "info@musterwerkstatt.de",
    phone: "+49 30 123456789",
    privacyPolicyUrl: "/datenschutz",
    theme: {
      primary: '#007bff',
      success: '#28a745',
      error: '#dc3545'
    },
    ...config
  }

  // Service type options for automotive workshops
  const serviceTypes = [
    { value: '', label: 'Bitte wählen...' },
    { value: 'inspection', label: '🔍 Inspektion / Wartung' },
    { value: 'repair', label: '🔧 Reparatur' },
    { value: 'hu-au', label: '📋 HU / AU (TÜV)' },
    { value: 'tires', label: '🛞 Reifen / Räder' },
    { value: 'brakes', label: '🛑 Bremsen' },
    { value: 'engine', label: '⚙️ Motor' },
    { value: 'transmission', label: '🔄 Getriebe' },
    { value: 'electrical', label: '⚡ Elektronik' },
    { value: 'bodywork', label: '🚗 Karosserie / Lackierung' },
    { value: 'other', label: '❓ Sonstiges' }
  ]

  // Vehicle makes (common German market)
  const vehicleMakes = [
    '', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Opel', 'Ford',
    'Renault', 'Peugeot', 'Skoda', 'Seat', 'Fiat', 'Toyota', 'Nissan',
    'Hyundai', 'Kia', 'Mazda', 'Honda', 'Volvo', 'Porsche', 'Mini', 'Sonstiges'
  ]

  // Time slots for appointments
  const timeSlots = [
    '', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'Vorname ist erforderlich'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nachname ist erforderlich'
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }
    if (!formData.message.trim()) newErrors.message = 'Nachricht ist erforderlich'

    // Service-specific validation
    if (type === 'appointment' || type === 'quote') {
      if (!formData.serviceType) newErrors.serviceType = 'Bitte wählen Sie einen Service'
      if (!formData.vehicleMake) newErrors.vehicleMake = 'Fahrzeugmarke ist erforderlich'
    }

    if (type === 'appointment') {
      if (!formData.preferredDate) newErrors.preferredDate = 'Wunschtermin ist erforderlich'
      if (!formData.preferredTime) newErrors.preferredTime = 'Uhrzeit ist erforderlich'
    }

    // GDPR consent validation
    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'Zustimmung zur Datenverarbeitung ist erforderlich'
    }

    // Spam protection (honeypot should be empty)
    if (formData.honeypot) {
      newErrors.spam = 'Spam detected'
    }

    // Phone validation (if provided)
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein'
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        formType: type,
        timestamp: new Date().toISOString(),
        source: 'carbot_contact_form',
        workshop: defaultConfig.businessName
      }

      // Call the onSubmit handler or default API
      if (onSubmit) {
        await onSubmit(submissionData)
      } else {
        // Default API call
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        })

        if (!response.ok) {
          throw new Error('Submission failed')
        }
      }

      setSubmitStatus('success')
      // Reset form after successful submission
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        subject: '', message: '', vehicleMake: '', vehicleModel: '',
        vehicleYear: '', licensePlate: '', mileage: '', serviceType: '',
        preferredDate: '', preferredTime: '', urgency: 'normal',
        gdprConsent: false, marketingConsent: false, honeypot: ''
      })

    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get form title based on type
  const getFormTitle = () => {
    switch (type) {
      case 'appointment': return '📅 Termin vereinbaren'
      case 'quote': return '💰 Kostenvoranschlag anfordern'
      default: return '📩 Kontakt aufnehmen'
    }
  }

  // Success message
  if (submitStatus === 'success') {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vielen Dank für Ihre Anfrage!
          </h3>
          <p className="text-gray-600 mb-6">
            Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.
          </p>
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Antwortzeit:</strong> In der Regel innerhalb von 2 Stunden</p>
            <p><strong>Notfall:</strong> <a href={`tel:${defaultConfig.phone}`} className="text-blue-600">{defaultConfig.phone}</a></p>
          </div>
          <button 
            onClick={() => setSubmitStatus(null)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Neue Anfrage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-gray-600">
          Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
        </p>
      </div>

      {/* Error message */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span className="text-red-800">
              Es gab einen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut oder rufen Sie uns an.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot for spam protection */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
        />

        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vorname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ihr Vorname"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nachname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ihr Nachname"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ihre.email@beispiel.de"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefonnummer
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+49 30 123456789"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {/* Service Type and Vehicle Information (for appointments/quotes) */}
        {(type === 'appointment' || type === 'quote') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service-Art <span className="text-red-500">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                  errors.serviceType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {serviceTypes.map(service => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
              {errors.serviceType && <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fahrzeugmarke <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                    errors.vehicleMake ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {vehicleMakes.map(make => (
                    <option key={make} value={make}>
                      {make || 'Bitte wählen...'}
                    </option>
                  ))}
                </select>
                {errors.vehicleMake && <p className="mt-1 text-sm text-red-600">{errors.vehicleMake}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modell
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="z.B. Golf, A4, 3er"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baujahr
                </label>
                <input
                  type="number"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  min="1980"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  placeholder="2020"
                />
              </div>
            </div>
          </>
        )}

        {/* Appointment Specific Fields */}
        {type === 'appointment' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wunschtermin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                  errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.preferredDate && <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uhrzeit <span className="text-red-500">*</span>
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                  errors.preferredTime ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time || 'Bitte wählen...'}
                  </option>
                ))}
              </select>
              {errors.preferredTime && <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>}
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'quote' ? 'Beschreibung des Problems' : 'Nachricht'} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors resize-none ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={
              type === 'quote' 
                ? "Beschreiben Sie das Problem so detailliert wie möglich..."
                : type === 'appointment'
                ? "Beschreiben Sie kurz, welche Arbeiten durchgeführt werden sollen..."
                : "Ihre Nachricht an uns..."
            }
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        {/* GDPR Compliance */}
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="gdprConsent"
              checked={formData.gdprConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
            />
            <label className="ml-3 text-sm text-gray-700">
              <span className="text-red-500">*</span> Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
              <a 
                href={defaultConfig.privacyPolicyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:no-underline"
              >
                Datenschutzerklärung
              </a>{' '}
              zu. Meine Daten werden nur zur Bearbeitung meiner Anfrage verwendet.
            </label>
          </div>
          {errors.gdprConsent && <p className="text-sm text-red-600">{errors.gdprConsent}</p>}

          <div className="flex items-start">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
            />
            <label className="ml-3 text-sm text-gray-600">
              Ich möchte gelegentlich Informationen über neue Services und Angebote erhalten. 
              Diese Einwilligung kann ich jederzeit widerrufen.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            style={{ backgroundColor: isSubmitting ? undefined : defaultConfig.theme.primary }}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
              </span>
            ) : (
              `📩 ${
                type === 'appointment' ? 'Termin anfragen' :
                type === 'quote' ? 'Kostenvoranschlag anfordern' :
                'Nachricht senden'
              }`
            )}
          </button>
        </div>

        {/* Contact Info */}
        <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Schnelle Hilfe?</strong> Rufen Sie uns direkt an:
          </p>
          <a 
            href={`tel:${defaultConfig.phone}`}
            className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors"
          >
            {defaultConfig.phone}
          </a>
          <p className="mt-2 text-xs text-gray-500">
            Öffnungszeiten: Mo-Fr 07:00-18:00, Sa 08:00-14:00
          </p>
        </div>
      </form>
    </div>
  )
}