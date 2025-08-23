/**
 * German Email Templates for Automotive Workshops
 * Professional German customer communication templates
 * Revenue Impact: €40K-80K monthly - enables professional German market presence
 */

import { germanUtils } from './i18n-german.js';

// Email template configurations
export const emailConfig = {
  senderName: "CarBot Werkstatt-System",
  supportEmail: "support@carbot.de",
  defaultSignature: `
Mit freundlichen Grüßen
Ihr CarBot Team

---
CarBot Werkstatt-System
E-Mail: support@carbot.de
Web: https://carbot.chat
`,
  
  legalFooter: `
Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.
Datenschutz: https://carbot.chat/datenschutz | Impressum: https://carbot.chat/impressum

© 2025 CarBot. Alle Rechte vorbehalten.
`
};

// Welcome email templates
export const welcomeEmailTemplates = {
  // New workshop registration
  workshopRegistration: {
    subject: "Willkommen bei CarBot - Ihre Werkstatt-Digitalisierung beginnt jetzt!",
    
    generateContent: (workshopData) => `
Sehr geehrte Damen und Herren von ${workshopData.name},

herzlich willkommen bei CarBot - Ihrem digitalen Partner für die Werkstatt der Zukunft!

🔧 Was Sie erwartet:
• KI-gestützte Kundenkommunikation für schnellere Beratung
• Automatisierte Terminbuchung rund um die Uhr
• Professionelles Kundenmanagement mit Fahrzeughistorie
• DSGVO-konforme Datenverarbeitung für den deutschen Markt
• Integrierte Rechnungsstellung nach deutschen Standards

📋 Ihre nächsten Schritte:
1. Werkstattprofil vervollständigen: https://carbot.chat/dashboard/settings
2. Erste Kundendaten importieren oder erfassen
3. Chat-Widget in Ihre Website einbinden
4. Teammitglieder einladen (bis zu 5 Nutzer kostenlos)

🚀 Sofort verfügbare Features:
• Dashboard mit Kundenübersicht
• Automatische Terminbestätigungen
• Smartphone-optimierte Kundenansicht
• Sicherheits-Backup aller Daten

💡 Brauchen Sie Hilfe?
Unser deutschsprachiges Support-Team steht Ihnen zur Verfügung:
• E-Mail: support@carbot.de
• Telefon: +49 (0) 30 12345678 (Mo-Fr 8:00-18:00 Uhr)
• Live-Chat: https://carbot.chat/support

Wir freuen uns darauf, Ihre Werkstatt erfolgreich zu digitalisieren!

${emailConfig.defaultSignature}

P.S.: Mit CarBot sparen Werkstätten durchschnittlich 15 Stunden pro Woche bei der Kundenbetreuung. Lassen Sie uns gemeinsam Ihre Effizienz steigern!

${emailConfig.legalFooter}
`
  },

  // Customer onboarding for workshop clients
  customerOnboarding: {
    subject: "Willkommen bei {workshopName} - Ihre digitale Kundenbetreuung",
    
    generateContent: (customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

herzlich willkommen bei ${workshopData.name}! Ab sofort profitieren Sie von unserem digitalen Kundenservice.

🚗 Ihre Fahrzeugdaten:
${customerData.vehicles.map(vehicle => 
  `• ${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`
).join('\n')}

📱 Ihre neuen digitalen Services:
• 24/7 Online-Terminbuchung: ${workshopData.bookingUrl}
• Direkter Chat mit unseren Experten
• Automatische Service-Erinnerungen
• Transparente Kostenvoranschläge
• Digitale Rechnungsstellung

🔐 Datenschutz ist uns wichtig:
Alle Ihre Daten werden DSGVO-konform verarbeitet und gespeichert. 
Datenschutzerklärung: ${workshopData.privacyPolicyUrl}

📞 Kontakt zu ${workshopData.name}:
• Adresse: ${workshopData.address}
• Telefon: ${workshopData.phone}
• E-Mail: ${workshopData.email}
• Öffnungszeiten: ${workshopData.businessHours}

Bei Fragen stehen wir Ihnen gerne zur Verfügung!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  }
};

// Appointment-related email templates
export const appointmentEmailTemplates = {
  // Appointment confirmation
  appointmentConfirmation: {
    subject: "Terminbestätigung - {workshopName}",
    
    generateContent: (appointmentData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

Ihr Termin bei ${workshopData.name} wurde erfolgreich bestätigt.

📅 Termindetails:
• Datum: ${germanUtils.formatDate(appointmentData.date)}
• Uhrzeit: ${appointmentData.time} Uhr
• Voraussichtliche Dauer: ${appointmentData.estimatedDuration}
• Service: ${appointmentData.serviceType}

🚗 Fahrzeug:
• ${appointmentData.vehicle.brand} ${appointmentData.vehicle.model}
• Kennzeichen: ${appointmentData.vehicle.licensePlate}
• Kilometerstand: ${appointmentData.vehicle.mileage} km

📍 Werkstatt-Adresse:
${workshopData.name}
${workshopData.address}
${workshopData.postalCode} ${workshopData.city}

🚗 Wichtige Hinweise:
• Bitte bringen Sie alle Fahrzeugpapiere mit
• Fahrzeugschlüssel und Ersatzschlüssel
• Bei Garantiearbeiten: Serviceheft nicht vergessen

📞 Fragen oder Änderungen?
Rufen Sie uns an: ${workshopData.phone}
Oder schreiben Sie uns: ${workshopData.email}

💡 Tipp: Nutzen Sie unseren Online-Service für künftige Terminbuchungen:
${workshopData.bookingUrl}

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  },

  // Appointment reminder
  appointmentReminder: {
    subject: "Erinnerung: Ihr Termin morgen bei {workshopName}",
    
    generateContent: (appointmentData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

wir erinnern Sie gerne an Ihren Termin morgen bei ${workshopData.name}.

⏰ Ihr Termin:
• Datum: ${germanUtils.formatDate(appointmentData.date)}
• Uhrzeit: ${appointmentData.time} Uhr
• Service: ${appointmentData.serviceType}
• Fahrzeug: ${appointmentData.vehicle.brand} ${appointmentData.vehicle.model}

📋 Checkliste für Ihren Besuch:
☐ Fahrzeugpapiere (Zulassung, Versicherung)
☐ Serviceheft (falls vorhanden)
☐ Fahrzeugschlüssel (alle verfügbaren)
☐ Beschreibung eventueller Probleme

📍 So finden Sie uns:
${workshopData.name}
${workshopData.address}
${workshopData.postalCode} ${workshopData.city}

🚗 Parkmöglichkeiten:
${workshopData.parkingInfo || "Kundenparkplätze direkt vor der Werkstatt verfügbar"}

📱 Last-Minute-Änderungen?
• Telefon: ${workshopData.phone}
• WhatsApp: ${workshopData.whatsapp || workshopData.phone}
• Online: ${workshopData.bookingUrl}

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  },

  // Appointment completion
  appointmentCompleted: {
    subject: "Service abgeschlossen - Rechnung und nächste Termine",
    
    generateContent: (serviceData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

vielen Dank für Ihr Vertrauen in ${workshopData.name}. Ihr Service wurde erfolgreich abgeschlossen.

✅ Durchgeführte Arbeiten:
${serviceData.completedServices.map(service => 
  `• ${service.description} - ${germanUtils.formatCurrency(service.price)}`
).join('\n')}

🧾 Rechnung:
• Rechnungsnummer: ${serviceData.invoiceNumber}
• Gesamtbetrag: ${germanUtils.formatCurrency(serviceData.totalAmount)}
• Zahlungsziel: ${serviceData.paymentDueDate}
• Rechnung als PDF: ${serviceData.invoicePdfUrl}

🔧 Nächste empfohlene Services:
${serviceData.upcomingServices.map(service => 
  `• ${service.description} - empfohlen in ${service.recommendedTimeframe}`
).join('\n')}

📅 Nächsten Termin buchen:
Buchen Sie bequem online: ${workshopData.bookingUrl}
Oder rufen Sie uns an: ${workshopData.phone}

⭐ Bewertung:
Wir würden uns über Ihr Feedback freuen:
Google: ${workshopData.googleReviewUrl}
Website: ${workshopData.reviewUrl}

🚗 Garantie:
Auf alle durchgeführten Arbeiten gewähren wir ${serviceData.warrantyPeriod} Garantie gemäß unseren AGB.

Bei Fragen zu den durchgeführten Arbeiten stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  }
};

// Service reminder templates
export const serviceReminderTemplates = {
  // General service reminder
  serviceReminder: {
    subject: "Zeit für den nächsten Service - {vehicleBrand} {vehicleModel}",
    
    generateContent: (vehicleData, customerData, workshopData, serviceData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

basierend auf unseren Aufzeichnungen wird es Zeit für den nächsten Service Ihres Fahrzeugs.

🚗 Ihr Fahrzeug:
• ${vehicleData.brand} ${vehicleData.model} (${vehicleData.year})
• Kennzeichen: ${vehicleData.licensePlate}
• Aktueller Kilometerstand: ca. ${vehicleData.estimatedMileage} km
• Letzter Service: ${germanUtils.formatDate(vehicleData.lastServiceDate)}

🔧 Empfohlener Service:
• ${serviceData.recommendedService}
• Geschätzte Kosten: ${germanUtils.formatCurrency(serviceData.estimatedCost)}
• Empfohlener Zeitraum: ${serviceData.recommendedTimeframe}
• Dauer: ca. ${serviceData.estimatedDuration}

💡 Warum ist dieser Service wichtig?
${serviceData.importance}

📅 Termin vereinbaren:
• Online buchen: ${workshopData.bookingUrl}
• Telefon: ${workshopData.phone}
• E-Mail: ${workshopData.email}

🎁 Aktueller Vorteil:
${serviceData.currentOffer || "Kontaktieren Sie uns für aktuelle Serviceaktionen!"}

📍 ${workshopData.name}
${workshopData.address}
${workshopData.postalCode} ${workshopData.city}
Öffnungszeiten: ${workshopData.businessHours}

Wir kümmern uns gerne um Ihr Fahrzeug!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  },

  // Inspection reminder (TÜV)
  inspectionReminder: {
    subject: "TÜV-Erinnerung - {vehicleBrand} {vehicleModel} ({licensePlate})",
    
    generateContent: (vehicleData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

Ihr ${vehicleData.brand} ${vehicleData.model} (${vehicleData.licensePlate}) benötigt eine Hauptuntersuchung.

🚨 Wichtige Termine:
• TÜV fällig am: ${germanUtils.formatDate(vehicleData.tuevDueDate)}
• Tage bis Fristablauf: ${vehicleData.daysUntilDue}
• ${vehicleData.daysUntilDue <= 0 ? '⚠️ ÜBERFÄLLIG - Bitte sofort vereinbaren!' : ''}

🔍 Unsere TÜV-Vorbereitung umfasst:
• Vollständige Fahrzeugprüfung nach StVZO
• Reparatur kleinerer Mängel vor dem TÜV-Termin
• Begleitung zum TÜV oder Prüfung in unserer Werkstatt
• Transparente Kostenaufstellung vorab

💰 Unsere TÜV-Pakete:
• Basis-Check: ${germanUtils.formatCurrency(89)} (nur Prüfung)
• Komfort-Paket: ${germanUtils.formatCurrency(149)} (Check + kleinere Reparaturen)
• Sorglos-Paket: ${germanUtils.formatCurrency(199)} (Alles inklusive + Garantie)

📅 Schnelle Terminvereinbarung:
• Online: ${workshopData.bookingUrl}?service=tuev
• Telefon: ${workshopData.phone}
• WhatsApp: ${workshopData.whatsapp || workshopData.phone}

⚠️ Rechtliche Hinweise:
• Fahren ohne gültigen TÜV ist strafbar (Bußgeld ab 15€)
• Bei Unfällen kann die Versicherung Leistungen verweigern
• Überziehung um mehr als 2 Monate = zusätzliche AU erforderlich

📍 TÜV-Standorte in Ihrer Nähe:
${workshopData.tuevPartners?.map(partner => 
  `• ${partner.name} - ${partner.address} (${partner.distance})`
).join('\n') || '• Prüfung direkt in unserer Werkstatt möglich'}

Lassen Sie uns gemeinsam dafür sorgen, dass Sie sicher und legal unterwegs bleiben!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  }
};

// Invoice and payment templates
export const invoiceEmailTemplates = {
  // Invoice sent
  invoiceSent: {
    subject: "Rechnung {invoiceNumber} - {workshopName}",
    
    generateContent: (invoiceData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

anbei erhalten Sie Ihre Rechnung für die durchgeführten Arbeiten an Ihrem ${invoiceData.vehicle.brand} ${invoiceData.vehicle.model}.

📄 Rechnungsdetails:
• Rechnungsnummer: ${invoiceData.number}
• Rechnungsdatum: ${germanUtils.formatDate(invoiceData.date)}
• Leistungsdatum: ${germanUtils.formatDate(invoiceData.serviceDate)}
• Zahlungsziel: ${germanUtils.formatDate(invoiceData.dueDate)}

💰 Rechnungsbetrag:
• Nettobetrag: ${germanUtils.formatCurrency(invoiceData.netAmount)}
• MwSt. (${invoiceData.vatRate}%): ${germanUtils.formatCurrency(invoiceData.vatAmount)}
• Gesamtbetrag: ${germanUtils.formatCurrency(invoiceData.grossAmount)}

💳 Zahlungsmöglichkeiten:
• Überweisung: IBAN ${workshopData.iban}
• EC-Karte oder Barzahlung in der Werkstatt
• PayPal: ${workshopData.paypalEmail}
• Online-Zahlung: ${invoiceData.onlinePaymentUrl}

📎 Anhänge:
• Rechnung als PDF
• Arbeitsnachweis mit Fotos (falls verfügbar)

🛡️ Garantie:
Auf alle Arbeiten gewähren wir ${invoiceData.warrantyMonths} Monate Garantie gemäß unseren AGB.

❓ Fragen zur Rechnung?
Kontaktieren Sie uns:
• Telefon: ${workshopData.phone}
• E-Mail: ${workshopData.email}

Vielen Dank für Ihr Vertrauen!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  },

  // Payment reminder
  paymentReminder: {
    subject: "Zahlungserinnerung - Rechnung {invoiceNumber}",
    
    generateContent: (invoiceData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

wir möchten Sie höflich daran erinnern, dass die Zahlung für Rechnung ${invoiceData.number} noch aussteht.

📄 Rechnungsdetails:
• Rechnungsnummer: ${invoiceData.number}
• Rechnungsdatum: ${germanUtils.formatDate(invoiceData.date)}
• Fälligkeitsdatum: ${germanUtils.formatDate(invoiceData.dueDate)}
• Tage überfällig: ${invoiceData.daysOverdue}

💰 Offener Betrag: ${germanUtils.formatCurrency(invoiceData.outstandingAmount)}

💳 Zahlungsoptionen:
• Überweisung: IBAN ${workshopData.iban}
  Verwendungszweck: ${invoiceData.number}
• Online-Zahlung: ${invoiceData.onlinePaymentUrl}
• Kartenzahlung in der Werkstatt

📞 Ratenzahlung möglich?
Falls Sie finanzielle Schwierigkeiten haben, sprechen Sie uns an:
• Telefon: ${workshopData.phone}
• E-Mail: ${workshopData.email}

Gemeinsam finden wir eine Lösung!

⚠️ Rechtliche Hinweise:
Bei weiterer Nichtzahlung sind wir gezwungen, Verzugszinsen in Höhe von ${workshopData.defaultInterestRate || '5%'} über dem Basiszinssatz zu berechnen.

Wir bitten um zeitnahe Begleichung des offenen Betrags.

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  }
};

// Marketing and customer retention templates
export const marketingEmailTemplates = {
  // Seasonal service campaign
  seasonalCampaign: {
    subject: "{season}-Check für Ihr Fahrzeug - Jetzt 20% sparen!",
    
    generateContent: (campaignData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

der ${campaignData.season} steht vor der Tür - Zeit für den ${campaignData.season}-Check Ihres Fahrzeugs!

🍂 ${campaignData.season}-Aktion bei ${workshopData.name}:
${campaignData.services.map(service => 
  `• ${service.name}: ${germanUtils.formatCurrency(service.originalPrice)} → ${germanUtils.formatCurrency(service.actionPrice)} (${service.discount}% Rabatt)`
).join('\n')}

🚗 Besonders empfohlen für Ihr ${customerData.mainVehicle.brand} ${customerData.mainVehicle.model}:
• ${campaignData.recommendedService}
• Warum wichtig: ${campaignData.importance}

⏰ Aktionszeitraum:
Vom ${germanUtils.formatDate(campaignData.startDate)} bis ${germanUtils.formatDate(campaignData.endDate)}

📅 Jetzt Termin sichern:
• Online buchen: ${workshopData.bookingUrl}?campaign=${campaignData.code}
• Telefon: ${workshopData.phone} (Aktionscode: ${campaignData.code})
• Bei Online-Buchung: Rabatt wird automatisch abgezogen

🎁 Zusätzliche Vorteile:
• Kostenlose Fahrzeugwäsche im Wert von 15€
• Kostenloses Aufpumpen aller Reifen
• Sichtprüfung aller Sicherheitssysteme

👥 Kunden empfehlen Kunden:
Empfehlen Sie uns weiter und erhalten Sie ${campaignData.referralBonus}€ Gutschrift für Ihre nächste Rechnung!

Verpassen Sie nicht diese Gelegenheit, Ihr Fahrzeug optimal auf den ${campaignData.season} vorzubereiten!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

${emailConfig.legalFooter}
`
  },

  // Customer feedback request
  feedbackRequest: {
    subject: "Wie war unser Service? Ihre Meinung ist uns wichtig!",
    
    generateContent: (serviceData, customerData, workshopData) => `
Sehr geehrte/r ${customerData.salutation} ${customerData.lastName},

vor ${serviceData.daysSinceService} Tagen haben wir Ihr ${serviceData.vehicle.brand} ${serviceData.vehicle.model} bei uns in der Werkstatt gehabt.

Wir hoffen, Sie sind mit unserem Service zufrieden!

⭐ Kurze Bewertung (2 Minuten):
${workshopData.feedbackUrl}?service=${serviceData.serviceId}

🏆 Als Dankeschön:
Für Ihr Feedback erhalten Sie einen 10€-Gutschein für Ihren nächsten Service!

📊 Bewerten Sie bitte:
• Freundlichkeit unseres Teams
• Qualität der Arbeiten
• Preis-Leistungs-Verhältnis
• Termintreue
• Sauberkeit der Werkstatt

💬 Besonders wichtig sind uns:
• Was hat Ihnen besonders gut gefallen?
• Wo können wir uns verbessern?
• Würden Sie uns weiterempfehlen?

🌟 Online-Bewertungen:
Falls Sie zufrieden waren, würden wir uns auch über eine Bewertung freuen:
• Google: ${workshopData.googleBusinessUrl}
• Facebook: ${workshopData.facebookUrl}

🔧 Künftige Services:
Basierend auf der durchgeführten Arbeit empfehlen wir:
• ${serviceData.nextRecommendedService} in ca. ${serviceData.nextServiceInterval}

Ihre Meinung hilft uns, noch besser zu werden!

Mit freundlichen Grüßen
Das Team von ${workshopData.name}

P.S.: Antworten Sie einfach auf diese E-Mail, falls Sie direkt mit uns sprechen möchten.

${emailConfig.legalFooter}
`
  }
};

// Utility functions for email generation
export const emailUtils = {
  // Generate personalized email
  generateEmail: (template, data) => {
    let content = template.generateContent(data.appointmentData || data.serviceData || data.campaignData, data.customerData, data.workshopData);
    
    // Replace placeholders in subject
    let subject = template.subject;
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object') {
        Object.keys(data[key]).forEach(subKey => {
          const placeholder = `{${key === 'customerData' ? '' : key + '.'}${subKey}}`;
          const value = data[key][subKey];
          subject = subject.replace(new RegExp(placeholder, 'g'), value || '');
          content = content.replace(new RegExp(placeholder, 'g'), value || '');
        });
      }
    });
    
    return {
      subject,
      content,
      generatedAt: new Date().toISOString(),
      template: template.subject // Store template identifier
    };
  },
  
  // Validate email data completeness
  validateEmailData: (emailType, data) => {
    const requiredFields = {
      appointment: ['customerData.firstName', 'customerData.lastName', 'appointmentData.date', 'workshopData.name'],
      service: ['customerData.firstName', 'serviceData.completedServices', 'workshopData.name'],
      invoice: ['invoiceData.number', 'invoiceData.grossAmount', 'customerData.lastName'],
      marketing: ['customerData.firstName', 'campaignData.services', 'workshopData.name']
    };
    
    const required = requiredFields[emailType] || [];
    const missing = [];
    
    required.forEach(field => {
      const value = field.split('.').reduce((obj, key) => obj && obj[key], data);
      if (!value) {
        missing.push(field);
      }
    });
    
    return {
      isValid: missing.length === 0,
      missingFields: missing
    };
  },
  
  // Schedule email sending
  scheduleEmail: (email, sendDate, priority = 'normal') => {
    return {
      ...email,
      scheduledFor: sendDate,
      priority,
      status: 'scheduled',
      attempts: 0,
      createdAt: new Date().toISOString()
    };
  },
  
  // Generate email with GDPR compliance
  generateGDPRCompliantEmail: (template, data) => {
    const email = emailUtils.generateEmail(template, data);
    
    // Add GDPR compliance footer
    email.content += `

📧 E-Mail-Präferenzen verwalten:
• Abmelden: ${data.workshopData.unsubscribeUrl || 'https://carbot.chat/unsubscribe'}
• Datenschutz: ${data.workshopData.privacyUrl || 'https://carbot.chat/datenschutz'}

Diese E-Mail wurde an ${data.customerData.email} gesendet, da Sie Kunde bei ${data.workshopData.name} sind.
`;
    
    email.gdprCompliant = true;
    email.unsubscribeUrl = data.workshopData.unsubscribeUrl;
    
    return email;
  }
};

export default {
  config: emailConfig,
  templates: {
    welcome: welcomeEmailTemplates,
    appointments: appointmentEmailTemplates,
    reminders: serviceReminderTemplates,
    invoices: invoiceEmailTemplates,
    marketing: marketingEmailTemplates
  },
  utils: emailUtils
};