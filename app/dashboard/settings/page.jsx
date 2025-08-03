'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [settings, setSettings] = useState({
    // General settings
    workshopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    website: '',
    
    // Business hours
    businessHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    },
    
    // Services
    services: [],
    specializations: [],
    
    // Bot settings
    responseStyle: 'professional',
    language: 'de',
    leadNotifications: true,
    appointmentReminders: true,
    autoResponse: true,
    
    // Integration settings
    widgetEnabled: true,
    widgetColor: '#3B82F6',
    whatsappEnabled: false,
    whatsappNumber: '',
    gmtIntegration: false,
    facebookIntegration: false
  });

  const tabs = [
    { id: 'general', name: 'Allgemein', icon: '🏢' },
    { id: 'hours', name: 'Öffnungszeiten', icon: '🕒' },
    { id: 'services', name: 'Services', icon: '🔧' },
    { id: 'bot', name: 'Bot-Einstellungen', icon: '🤖' },
    { id: 'integrations', name: 'Integrationen', icon: '🔗' },
    { id: 'notifications', name: 'Benachrichtigungen', icon: '📢' }
  ];

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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaveMessage('Einstellungen erfolgreich gespeichert!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Fehler beim Speichern der Einstellungen.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Fehler beim Speichern der Einstellungen.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBusinessHours = (day, field, value) => {
    setSettings(prev => ({
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
    setSettings(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleSpecialization = (spec) => {
    setSettings(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const generateWidgetCode = () => {
    const widgetCode = `
<!-- CarBot Widget -->
<script>
  window.CarBotConfig = {
    workshopId: '${settings.workshopName?.toLowerCase().replace(/\s+/g, '-')}',
    color: '${settings.widgetColor}',
    language: '${settings.language}'
  };
</script>
<script src="https://widget.carbot.de/widget.js" async></script>
    `.trim();

    navigator.clipboard.writeText(widgetCode);
    setSaveMessage('Widget-Code in die Zwischenablage kopiert!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Werkstattname
          </label>
          <input
            type="text"
            value={settings.workshopName}
            onChange={(e) => updateSetting('workshopName', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inhaber/Geschäftsführer
          </label>
          <input
            type="text"
            value={settings.ownerName}
            onChange={(e) => updateSetting('ownerName', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail-Adresse
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => updateSetting('email', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => updateSetting('phone', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PLZ
          </label>
          <input
            type="text"
            value={settings.postalCode}
            onChange={(e) => updateSetting('postalCode', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stadt
          </label>
          <input
            type="text"
            value={settings.city}
            onChange={(e) => updateSetting('city', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website (optional)
          </label>
          <input
            type="url"
            value={settings.website}
            onChange={(e) => updateSetting('website', e.target.value)}
            placeholder="https://ihre-werkstatt.de"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderHoursTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Öffnungszeiten</h3>
      <div className="space-y-3">
        {Object.entries(settings.businessHours).map(([day, hours]) => (
          <div key={day} className="flex items-center space-x-4">
            <div className="w-24 text-sm font-medium text-gray-700 capitalize">
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
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Angebotene Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {services.map((service) => (
            <label key={service} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.services.includes(service)}
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
                checked={settings.specializations.includes(spec)}
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

  const renderBotTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kommunikationsstil
          </label>
          <select
            value={settings.responseStyle}
            onChange={(e) => updateSetting('responseStyle', e.target.value)}
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
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={settings.autoResponse}
            onChange={(e) => updateSetting('autoResponse', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Automatische Antworten</span>
            <p className="text-sm text-gray-500">CarBot antwortet automatisch auf Kundenanfragen</p>
          </div>
        </label>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Website Widget</h4>
            <p className="text-sm text-gray-500">Chat-Widget für Ihre Website</p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.widgetEnabled}
              onChange={(e) => updateSetting('widgetEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Aktiviert</span>
          </label>
        </div>

        {settings.widgetEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Widget-Farbe
              </label>
              <input
                type="color"
                value={settings.widgetColor}
                onChange={(e) => updateSetting('widgetColor', e.target.value)}
                className="block w-20 h-10 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={generateWidgetCode}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Widget-Code kopieren
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">WhatsApp Business</h4>
            <p className="text-sm text-gray-500">Integration mit WhatsApp Business API</p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.whatsappEnabled}
              onChange={(e) => updateSetting('whatsappEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Aktiviert</span>
          </label>
        </div>

        {settings.whatsappEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Business Nummer
            </label>
            <input
              type="tel"
              value={settings.whatsappNumber}
              onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
              placeholder="+49 123 456789"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={settings.leadNotifications}
          onChange={(e) => updateSetting('leadNotifications', e.target.checked)}
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
          checked={settings.appointmentReminders}
          onChange={(e) => updateSetting('appointmentReminders', e.target.checked)}
          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div>
          <span className="text-sm font-medium text-gray-700">Termin-Erinnerungen</span>
          <p className="text-sm text-gray-500">Automatische Erinnerungen an Kunden vor Terminen</p>
        </div>
      </label>
    </div>
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Einstellungen werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-gray-600 mt-1">Verwalten Sie Ihre Werkstatt-Konfiguration</p>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800">{saveMessage}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'hours' && renderHoursTab()}
            {activeTab === 'services' && renderServicesTab()}
            {activeTab === 'bot' && renderBotTab()}
            {activeTab === 'integrations' && renderIntegrationsTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}

            {/* Save button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSaving ? 'Speichern...' : 'Einstellungen speichern'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}