/**
 * CarBot German Market Localization System
 * Comprehensive German automotive industry localization
 * Revenue Impact: €40K-80K monthly
 */

// German automotive industry terminology
export const germanTerminology = {
  // Workshop terminology
  werkstatt: "Werkstatt",
  autowerkstatt: "Autowerkstatt",
  kfzBetrieb: "KFZ-Betrieb",
  servicepartner: "Servicepartner",
  meisterbetrieb: "Meisterbetrieb",
  
  // Service types
  hauptuntersuchung: "Hauptuntersuchung (HU)",
  abgasuntersuchung: "Abgasuntersuchung (AU)",
  inspektion: "Inspektion",
  wartung: "Wartung",
  reparatur: "Reparatur",
  karosseriearbeit: "Karosseriearbeit",
  lackierung: "Lackierung",
  reifenservice: "Reifenservice",
  klimaanlagenservice: "Klimaanlagenservice",
  bremsenservice: "Bremsenservice",
  
  // Vehicle types
  pkw: "PKW",
  lkw: "LKW",
  nutzfahrzeug: "Nutzfahrzeug",
  motorrad: "Motorrad",
  elektrofahrzeug: "Elektrofahrzeug",
  hybridfahrzeug: "Hybridfahrzeug",
  
  // Business terms
  kostenvoranschlag: "Kostenvoranschlag",
  rechnung: "Rechnung",
  garantie: "Garantie",
  gewaehrleistung: "Gewährleistung",
  abholung: "Abholung",
  zustellung: "Zustellung",
  ersatzfahrzeug: "Ersatzfahrzeug",
  
  // Legal compliance terms
  dsgvo: "DSGVO",
  datenschutz: "Datenschutz",
  impressum: "Impressum",
  agb: "AGB",
  widerrufsrecht: "Widerrufsrecht",
  fernabsatzgesetz: "Fernabsatzgesetz"
};

// German UI translations
export const germanTranslations = {
  // Navigation
  dashboard: "Übersicht",
  customers: "Kunden",
  services: "Dienstleistungen",
  appointments: "Termine",
  analytics: "Auswertungen",
  settings: "Einstellungen",
  profile: "Profil",
  logout: "Abmelden",
  
  // Authentication
  login: "Anmelden",
  register: "Registrieren",
  email: "E-Mail",
  password: "Passwort",
  confirmPassword: "Passwort bestätigen",
  forgotPassword: "Passwort vergessen?",
  resetPassword: "Passwort zurücksetzen",
  rememberMe: "Angemeldet bleiben",
  
  // Workshop management
  workshopName: "Werkstattname",
  workshopAddress: "Werkstattadresse",
  businessHours: "Öffnungszeiten",
  contactInfo: "Kontaktdaten",
  services: "Angebotene Leistungen",
  specializations: "Spezialisierungen",
  certifications: "Zertifizierungen",
  
  // Customer management
  customerName: "Kundenname",
  customerAddress: "Kundenadresse",
  phoneNumber: "Telefonnummer",
  vehicleInfo: "Fahrzeugdaten",
  serviceHistory: "Servicehistorie",
  nextService: "Nächster Service",
  
  // Appointment system
  appointmentDate: "Terminzeit",
  appointmentType: "Terminart",
  estimatedDuration: "Geschätzte Dauer",
  serviceDescription: "Leistungsbeschreibung",
  customerNotes: "Kundenanmerkungen",
  
  // Invoicing
  invoice: "Rechnung",
  invoiceNumber: "Rechnungsnummer",
  invoiceDate: "Rechnungsdatum",
  dueDate: "Fälligkeitsdatum",
  grossAmount: "Bruttobetrag",
  netAmount: "Nettobetrag",
  vatAmount: "Mehrwertsteuer",
  vatRate: "MwSt.-Satz",
  
  // Chat system
  chatWithCustomer: "Chat mit Kunde",
  sendMessage: "Nachricht senden",
  customerQuery: "Kundenanfrage",
  aiAssistant: "KI-Assistent",
  suggestedResponse: "Antwortvorschlag",
  
  // Forms
  save: "Speichern",
  cancel: "Abbrechen",
  edit: "Bearbeiten",
  delete: "Löschen",
  add: "Hinzufügen",
  search: "Suchen",
  filter: "Filtern",
  export: "Exportieren",
  
  // Notifications
  success: "Erfolgreich",
  error: "Fehler",
  warning: "Warnung",
  info: "Information",
  
  // Status messages
  pending: "Ausstehend",
  completed: "Abgeschlossen",
  inProgress: "In Bearbeitung",
  cancelled: "Storniert",
  
  // GDPR compliance
  gdprNotice: "Datenschutzhinweis",
  gdprAccept: "Datenschutz akzeptieren",
  cookieConsent: "Cookie-Einstellungen",
  dataProcessing: "Datenverarbeitung",
  rightToWithdraw: "Recht auf Widerruf"
};

// German date/time formatting
export const germanDateTimeFormat = {
  dateFormat: "dd.MM.yyyy",
  timeFormat: "HH:mm",
  dateTimeFormat: "dd.MM.yyyy HH:mm",
  currency: "EUR",
  currencySymbol: "€",
  thousandsSeparator: ".",
  decimalSeparator: ",",
  
  // German business days
  businessDays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
  weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  months: [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ],
  
  // German holidays (affecting business operations)
  germanHolidays: {
    "01-01": "Neujahr",
    "01-06": "Heilige Drei Könige",
    "05-01": "Tag der Arbeit",
    "10-03": "Tag der Deutschen Einheit",
    "12-25": "1. Weihnachtsfeiertag",
    "12-26": "2. Weihnachtsfeiertag"
    // Note: Easter dates are calculated dynamically
  }
};

// German automotive regulations compliance
export const germanAutomotiveCompliance = {
  // Required certifications
  requiredCertifications: [
    "Meisterbrief",
    "IHK-Zertifizierung",
    "TÜV-Berechtigung",
    "Umweltmanagement ISO 14001"
  ],
  
  // Legal requirements
  legalRequirements: {
    businessRegistration: "Gewerbeanmeldung erforderlich",
    craftTradeCard: "Handwerkskarte für bestimmte Tätigkeiten",
    environmentalLicense: "Umweltrechtliche Genehmigungen",
    wasteDisposalLicense: "Entsorgungsfachbetrieb-Zertifizierung"
  },
  
  // VAT regulations
  vatRules: {
    standardRate: 19, // 19% standard VAT rate in Germany
    reducedRate: 7,   // 7% reduced rate for certain services
    smallBusinessThreshold: 22000, // Kleinunternehmerregelung threshold
    reverseChargeServices: ["Bauleistungen", "Metallverarbeitung"]
  },
  
  // Invoicing requirements
  invoicingRequirements: {
    mustInclude: [
      "Vollständiger Name und Anschrift des Unternehmens",
      "Steuernummer oder Umsatzsteuer-Identifikationsnummer",
      "Datum der Rechnung",
      "Fortlaufende Rechnungsnummer",
      "Menge und Art der gelieferten Gegenstände",
      "Zeitpunkt der Lieferung",
      "Entgelt und darauf entfallender Steuerbetrag",
      "Steuersatz"
    ],
    retentionPeriod: "10 Jahre", // Legal retention requirement
    electronicInvoicing: "Nach EU-Richtlinie 2014/55/EU"
  }
};

// German customer communication patterns
export const germanCommunicationPatterns = {
  // Formal business communication
  formalGreeting: "Sehr geehrte Damen und Herren",
  personalGreeting: "Sehr geehrte/r Frau/Herr",
  closingFormal: "Mit freundlichen Grüßen",
  closingPersonal: "Beste Grüße",
  
  // Email templates
  emailTemplates: {
    appointmentConfirmation: {
      subject: "Terminbestätigung - {workshopName}",
      greeting: "Sehr geehrte/r {customerTitle} {customerName},",
      body: `vielen Dank für Ihre Terminbuchung bei {workshopName}.

Ihre Termindetails:
- Datum: {appointmentDate}
- Uhrzeit: {appointmentTime}
- Service: {serviceType}
- Fahrzeug: {vehicleInfo}

Bei Fragen erreichen Sie uns unter {contactPhone} oder {contactEmail}.

Mit freundlichen Grüßen
Ihr {workshopName} Team`
    },
    
    serviceReminder: {
      subject: "Erinnerung: Anstehender Service für Ihr {vehicleBrand} {vehicleModel}",
      body: `Sehr geehrte/r {customerTitle} {customerName},

basierend auf unseren Aufzeichnungen steht für Ihr Fahrzeug ({vehicleBrand} {vehicleModel}, Kennzeichen: {licensePlate}) der nächste Service an.

Empfohlener Service: {recommendedService}
Empfohlener Zeitraum: {recommendedDate}

Gerne vereinbaren wir einen Termin mit Ihnen. Kontaktieren Sie uns unter {contactPhone} oder buchen Sie online unter {bookingUrl}.

Mit freundlichen Grüßen
Ihr {workshopName} Team`
    }
  },
  
  // Phone conversation patterns
  phoneGreeting: "Guten Tag, {workshopName}, mein Name ist {employeeName}. Wie kann ich Ihnen helfen?",
  phoneClosing: "Vielen Dank für Ihren Anruf. Haben Sie noch weitere Fragen?"
};

// German payment preferences
export const germanPaymentMethods = {
  preferred: [
    {
      id: "sepa",
      name: "SEPA-Lastschrift",
      description: "Automatischer Bankeinzug",
      icon: "bank",
      processingTime: "1-3 Werktage"
    },
    {
      id: "sofort",
      name: "Sofortüberweisung",
      description: "Sofortige Überweisung",
      icon: "instant",
      processingTime: "Sofort"
    },
    {
      id: "giropay",
      name: "giropay",
      description: "Online-Banking",
      icon: "online-banking",
      processingTime: "Sofort"
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "PayPal Zahlung",
      icon: "paypal",
      processingTime: "Sofort"
    }
  ],
  
  // Banking details format
  bankingFormat: {
    iban: "DE89 3704 0044 0532 0130 00",
    bic: "COBADEFFXXX",
    accountHolder: "Musterwerkstatt GmbH"
  }
};

// Utility functions for German localization
export const germanUtils = {
  // Format German currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  },
  
  // Format German date
  formatDate: (date) => {
    return new Intl.DateTimeFormat('de-DE').format(new Date(date));
  },
  
  // Format German date and time
  formatDateTime: (date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },
  
  // Validate German postal code
  validatePostalCode: (postalCode) => {
    const germanPostalCodeRegex = /^[0-9]{5}$/;
    return germanPostalCodeRegex.test(postalCode);
  },
  
  // Validate German phone number
  validatePhoneNumber: (phoneNumber) => {
    const germanPhoneRegex = /^(\+49|0)[1-9][0-9]{1,14}$/;
    return germanPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  },
  
  // Format German VAT ID
  formatVatId: (vatId) => {
    // German VAT ID format: DE + 9 digits
    return vatId.replace(/[^0-9]/g, '').replace(/^/, 'DE');
  },
  
  // Calculate German VAT
  calculateVAT: (netAmount, rate = 19) => {
    const vatAmount = (netAmount * rate) / 100;
    const grossAmount = netAmount + vatAmount;
    
    return {
      net: parseFloat(netAmount.toFixed(2)),
      vat: parseFloat(vatAmount.toFixed(2)),
      gross: parseFloat(grossAmount.toFixed(2)),
      rate: rate
    };
  },
  
  // Generate German invoice number
  generateInvoiceNumber: (workshopId, year) => {
    const timestamp = Date.now().toString().slice(-6);
    return `${year}-${workshopId}-${timestamp}`;
  },
  
  // Check German business hours
  isBusinessHours: (date = new Date()) => {
    const hour = date.getHours();
    const day = date.getDay();
    
    // Monday to Friday, 8:00 to 18:00
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  }
};

export default {
  terminology: germanTerminology,
  translations: germanTranslations,
  dateTime: germanDateTimeFormat,
  compliance: germanAutomotiveCompliance,
  communication: germanCommunicationPatterns,
  payments: germanPaymentMethods,
  utils: germanUtils
};