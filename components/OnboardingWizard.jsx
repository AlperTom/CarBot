'use client';

import { useState } from 'react';

const OnboardingWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    workshopName: '',
    ownerName: '',
    email: '',
    phone: '',
    
    // Step 2: Location & Hours
    address: '',
    city: '',
    postalCode: '',
    businessHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    },
    
    // Step 3: Services
    services: [],
    specializations: [],
    
    // Step 4: Preferences
    language: 'de',
    responseStyle: 'professional',
    leadNotifications: true,
    appointmentReminders: true
  });

  const totalSteps = 4;

  const services = [
    'Inspektion', 'Ölwechsel', 'Reifenwechsel', 'Bremsenservice',
    'Klimaanlagenservice', 'Zahnriemenwechsel', 'Batterieservice',
    'Abgasuntersuchung', 'Hauptuntersuchung', 'Lackierarbeiten',
    'Unfallreparatur', 'Elektrik/Elektronik', 'Motor-/Getriebeschäden'
  ];

  const specializations = [
    'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Opel',
    'Ford', 'Toyota', 'Honda', 'Nissan', 'Hyundai',
    'Nutzfahrzeuge', 'Oldtimer', 'Elektrofahrzeuge'
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBusinessHours = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleSpecialization = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onComplete(formData);
      } else {
        console.error('Onboarding failed');
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Grundinformationen</h2>
        <p className="text-gray-600 mt-2">Erzählen Sie uns etwas über Ihre Werkstatt</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Werkstattname *
          </label>
          <input
            type="text"
            value={formData.workshopName}
            onChange={(e) => updateFormData('workshopName', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="z.B. Mustermann KFZ-Service"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ihr Name *
          </label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => updateFormData('ownerName', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Max Mustermann"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="info@ihre-werkstatt.de"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="+49 123 456789"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Standort & Öffnungszeiten</h2>
        <p className="text-gray-600 mt-2">Wo finden Kunden Ihre Werkstatt?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Musterstraße 123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PLZ *
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => updateFormData('postalCode', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="12345"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stadt *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Musterstadt"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Öffnungszeiten</h3>
        <div className="space-y-3">
          {Object.entries(formData.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-700 capitalize">
                {day === 'monday' && 'Montag'}
                {day === 'tuesday' && 'Dienstag'}
                {day === 'wednesday' && 'Mittwoch'}
                {day === 'thursday' && 'Donnerstag'}
                {day === 'friday' && 'Freitag'}
                {day === 'saturday' && 'Samstag'}
                {day === 'sunday' && 'Sonntag'}
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hours.closed}
                  onChange={(e) => updateBusinessHours(day, 'closed', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Geschlossen</span>
              </label>

              {!hours.closed && (
                <>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">bis</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Services & Spezialisierungen</h2>
        <p className="text-gray-600 mt-2">Welche Dienstleistungen bieten Sie an?</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Angebotene Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {services.map((service) => (
            <label key={service} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => toggleService(service)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Marken-Spezialisierungen</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {specializations.map((spec) => (
            <label key={spec} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.specializations.includes(spec)}
                onChange={() => toggleSpecialization(spec)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{spec}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Einstellungen & Vorlieben</h2>
        <p className="text-gray-600 mt-2">Wie soll CarBot für Sie arbeiten?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kommunikationsstil
          </label>
          <select
            value={formData.responseStyle}
            onChange={(e) => updateFormData('responseStyle', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="professional">Professionell und formal</option>
            <option value="friendly">Freundlich und persönlich</option>
            <option value="casual">Locker und entspannt</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sprache
          </label>
          <select
            value={formData.language}
            onChange={(e) => updateFormData('language', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Benachrichtigungen</h3>
        
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.leadNotifications}
            onChange={(e) => updateFormData('leadNotifications', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Lead-Benachrichtigungen</span>
            <p className="text-sm text-gray-500">Erhalten Sie sofort eine E-Mail bei neuen Kundenanfragen</p>
          </div>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.appointmentReminders}
            onChange={(e) => updateFormData('appointmentReminders', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Termin-Erinnerungen</span>
            <p className="text-sm text-gray-500">Automatische Erinnerungen an Kunden vor Terminen</p>
          </div>
        </label>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-900 mb-2">🎉 Fast geschafft!</h4>
        <p className="text-blue-800 text-sm">
          Nach dem Abschluss wird Ihr CarBot automatisch konfiguriert und ist sofort einsatzbereit. 
          Sie erhalten außerdem den Code für das Website-Widget per E-Mail.
        </p>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.workshopName && formData.ownerName && formData.email && formData.phone;
      case 2:
        return formData.address && formData.city && formData.postalCode;
      case 3:
        return formData.services.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Fortschritt</span>
          <span className="text-sm text-gray-500">{currentStep} von {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Zurück
        </button>

        {currentStep < totalSteps ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Weiter
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              canProceed()
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Einrichtung abschließen
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;