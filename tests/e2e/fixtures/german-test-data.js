/**
 * German-specific Test Data Factory for UAT
 * Focus: Realistic German automotive workshop data
 */

class GermanTestDataFactory {
  constructor() {
    this.germanCities = [
      { name: 'Berlin', plz: '10115', state: 'Berlin' },
      { name: 'Hamburg', plz: '20095', state: 'Hamburg' },
      { name: 'München', plz: '80331', state: 'Bayern' },
      { name: 'Köln', plz: '50667', state: 'Nordrhein-Westfalen' },
      { name: 'Frankfurt am Main', plz: '60311', state: 'Hessen' },
      { name: 'Stuttgart', plz: '70173', state: 'Baden-Württemberg' },
      { name: 'Düsseldorf', plz: '40213', state: 'Nordrhein-Westfalen' },
      { name: 'Dortmund', plz: '44135', state: 'Nordrhein-Westfalen' },
      { name: 'Essen', plz: '45127', state: 'Nordrhein-Westfalen' },
      { name: 'Leipzig', plz: '04109', state: 'Sachsen' }
    ];

    this.germanWorkshopNames = [
      'Autowerkstatt Schmidt',
      'KFZ-Service Müller',
      'Auto Zentrum Weber',
      'Werkstatt Wagner',
      'Fahrzeug Service Klein',
      'Auto Reparatur Becker',
      'KFZ Meisterbetrieb Fischer',
      'Autowerkstatt Richter',
      'Service Station Neumann',
      'Auto Technik Hofmann'
    ];

    this.germanOwnerNames = [
      'Thomas Schmidt',
      'Hans Müller',
      'Michael Weber',
      'Klaus Wagner',
      'Andreas Klein',
      'Jürgen Becker',
      'Wolfgang Fischer',
      'Helmut Richter',
      'Manfred Neumann',
      'Rainer Hofmann'
    ];

    this.germanStreets = [
      'Hauptstraße',
      'Bahnhofstraße',
      'Kirchstraße',
      'Schulstraße',
      'Gartenstraße',
      'Lindenstraße',
      'Mühlenstraße',
      'Dorfstraße',
      'Bergstraße',
      'Waldstraße'
    ];

    this.automotiveServices = [
      'Wartung und Inspektion',
      'TÜV und Hauptuntersuchung',
      'Reparaturen aller Art',
      'Ölwechsel Service',
      'Bremsen Service',
      'Klimaanlagen Service',
      'Reifenwechsel',
      'Batterie Service',
      'Motordiagnose',
      'Getriebe Service'
    ];

    this.germanVehicleBrands = [
      'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Opel', 
      'Ford', 'Renault', 'Peugeot', 'Skoda', 'Seat',
      'Hyundai', 'Toyota', 'Nissan', 'Mazda', 'Honda'
    ];
  }

  generateVATNumber(country = 'DE') {
    const numbers = Math.random().toString().substr(2, 9);
    return `${country}${numbers}`;
  }

  generateIBAN(country = 'DE') {
    if (country === 'DE') {
      const bankCode = Math.random().toString().substr(2, 8);
      const accountNumber = Math.random().toString().substr(2, 10);
      return `DE89${bankCode}${accountNumber}`;
    }
    return `${country}${Math.random().toString().substr(2, 18)}`;
  }

  createGermanWorkshop(specialization = 'general', businessData = null) {
    const city = this.randomFromArray(this.germanCities);
    const workshopName = this.randomFromArray(this.germanWorkshopNames);
    const ownerName = this.randomFromArray(this.germanOwnerNames);
    const street = this.randomFromArray(this.germanStreets);
    const houseNumber = Math.floor(Math.random() * 200) + 1;
    
    const email = `${ownerName.toLowerCase().replace(' ', '.')}@${workshopName.toLowerCase().replace(/[^a-z]/g, '')}-test.de`;
    const timestamp = Date.now();
    
    const workshop = {
      id: `workshop_${timestamp}`,
      name: workshopName,
      email: email,
      password: 'TestWorkshop123!',
      owner: {
        name: ownerName,
        email: email,
        phone: this.generateGermanPhoneNumber()
      },
      address: {
        street: `${street} ${houseNumber}`,
        city: city.name,
        plz: city.plz,
        state: city.state,
        country: 'DE'
      },
      phone: this.generateGermanPhoneNumber(),
      website: `https://www.${workshopName.toLowerCase().replace(/[^a-z]/g, '')}.de`,
      vatNumber: businessData?.vatId || this.generateVATNumber('DE'),
      businessType: 'independent',
      specialization: specialization,
      services: this.generateServices(specialization),
      openingHours: this.generateGermanOpeningHours(),
      subscriptionPlan: 'basic',
      verified: false,
      createdAt: new Date().toISOString()
    };\

    return workshop;
  }

  createGermanBusiness() {
    const city = this.randomFromArray(this.germanCities);
    const ownerName = this.randomFromArray(this.germanOwnerNames);
    
    return {
      name: `${ownerName} Automotive GmbH`,
      ownerName: ownerName,
      vatId: this.generateVATNumber('DE'),
      iban: this.generateIBAN('DE'),
      address: {
        street: `${this.randomFromArray(this.germanStreets)} ${Math.floor(Math.random() * 200) + 1}`,
        city: city.name,
        plz: city.plz,
        state: city.state,
        country: 'DE'
      },
      legalForm: 'GmbH', // German limited liability company
      handelsregister: `HRB ${Math.floor(Math.random() * 900000) + 100000}`,
      ustIdNr: this.generateVATNumber('DE')
    };
  }

  generateGermanPhoneNumber() {
    const areaCodes = ['030', '040', '089', '0221', '069', '0711'];
    const areaCode = this.randomFromArray(areaCodes);
    const number = Math.floor(Math.random() * 90000000) + 10000000;
    return `+49 ${areaCode.substr(1)} ${number}`;
  }

  generateServices(specialization) {
    let services = [...this.automotiveServices];
    
    if (specialization === 'premium') {
      services = services.concat([
        'Premium Fahrzeugpflege',
        'Luxusfahrzeug Service',
        'Oldtimer Restauration',
        'Motorsport Service'
      ]);
    } else if (specialization === 'electric') {
      services = services.concat([
        'Elektrofahrzeug Service',
        'Ladestation Installation',
        'Hybrid Service',
        'Batteriewechsel'
      ]);
    }
    
    return services.sort();
  }

  generateGermanOpeningHours() {
    return {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: null, close: null, closed: true }
    };
  }

  createGermanCustomerLead() {
    const city = this.randomFromArray(this.germanCities);
    const firstNames = ['Hans', 'Klaus', 'Wolfgang', 'Helmut', 'Günter', 'Maria', 'Petra', 'Andrea', 'Sabine', 'Monika'];
    const lastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'];
    
    const firstName = this.randomFromArray(firstNames);
    const lastName = this.randomFromArray(lastNames);
    const fullName = `${firstName} ${lastName}`;
    
    const inquiries = [
      'Mein Auto braucht TÜV. Was kostet eine Hauptuntersuchung?',
      'Ich möchte einen Ölwechsel für meinen BMW vereinbaren.',
      'Die Bremsen quietschen. Können Sie das reparieren?',
      'Ich brauche neue Winterreifen für meinen Mercedes.',
      'Die Klimaanlage funktioniert nicht mehr richtig.',
      'Mein Auto springt morgens schlecht an. Können Sie helfen?',
      'Ich möchte eine große Inspektion machen lassen.',
      'Die Batterie ist leer. Brauche ich eine neue?',
      'Können Sie einen Kostenvoranschlag für die Reparatur machen?',
      'Wann haben Sie den nächsten freien Termin für eine Wartung?'
    ];
    
    const vehicles = [
      { make: 'BMW', model: '320d', year: '2018' },
      { make: 'Mercedes-Benz', model: 'C 200', year: '2019' },
      { make: 'Audi', model: 'A4', year: '2017' },
      { make: 'Volkswagen', model: 'Golf', year: '2020' },
      { make: 'Opel', model: 'Astra', year: '2016' },
      { make: 'Ford', model: 'Focus', year: '2018' }
    ];
    
    const vehicle = this.randomFromArray(vehicles);
    
    return {
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email-test.de`,
      phone: this.generateGermanPhoneNumber(),
      address: {
        city: city.name,
        plz: city.plz,
        state: city.state
      },
      inquiry: this.randomFromArray(inquiries),
      vehicle: {
        ...vehicle,
        kilometers: `${Math.floor(Math.random() * 150000) + 20000}`
      },
      preferredContactMethod: this.randomFromArray(['phone', 'email', 'whatsapp']),
      urgency: this.randomFromArray(['low', 'medium', 'high']),
      source: 'website_chat',
      language: 'de',
      consent: {
        gdpr: true,
        marketing: Math.random() > 0.5,
        timestamp: new Date().toISOString()
      }
    };
  }

  createMultiLanguageTestData() {
    const languages = {
      de: {
        greeting: 'Hallo, ich brauche Hilfe mit meinem Auto.',
        service_request: 'Was kostet eine Inspektion für BMW?',
        appointment: 'Können Sie mir einen Termin geben?',
        thanks: 'Vielen Dank für Ihre Hilfe!'
      },
      en: {
        greeting: 'Hello, I need help with my car.',
        service_request: 'How much does a BMW inspection cost?',
        appointment: 'Can you give me an appointment?',
        thanks: 'Thank you for your help!'
      },
      tr: {
        greeting: 'Merhaba, arabamla ilgili yardıma ihtiyacım var.',
        service_request: 'BMW muayenesi ne kadar?',
        appointment: 'Bana randevu verebilir misiniz?',
        thanks: 'Yardımınız için teşekkür ederim!'
      },
      pl: {
        greeting: 'Cześć, potrzebuję pomocy z moim samochodem.',
        service_request: 'Ile kosztuje przegląd BMW?',
        appointment: 'Czy możesz dać mi termin?',
        thanks: 'Dziękuję za pomoc!'
      }
    };
    
    return languages;
  }

  createPerformanceTestData() {
    const messages = [];
    const baseMessages = [
      'Was kostet eine Inspektion?',
      'Haben Sie Zeit für TÜV?',
      'Können Sie Bremsen reparieren?',
      'Wann haben Sie einen Termin?',
      'Was kostet ein Ölwechsel?',
      'Können Sie auch Klimaanlagen reparieren?',
      'Brauche ich neue Reifen?',
      'Wie lange dauert eine Wartung?',
      'Machen Sie auch Getriebe Service?',
      'Was kostet eine Motordiagnose?'
    ];

    // Generate 50 variations for performance testing
    for (let i = 0; i < 50; i++) {
      const baseMessage = this.randomFromArray(baseMessages);
      messages.push(`${baseMessage} [Test ${i + 1}]`);
    }

    return messages;
  }

  createUATTestScenarios() {
    return {
      criticalPath: {
        name: 'German Workshop MVP Journey',
        steps: [
          'Workshop Registration',
          'Email Verification',
          'Dashboard Access',
          'Client Key Generation',
          'Landing Page Creation',
          'Chat Widget Integration',
          'German Customer Interaction',
          'Lead Capture',
          'Database Verification',
          'Email Notification'
        ]
      },
      integration: {
        name: 'ChatBot Snippet Integration',
        scenarios: [
          'WordPress Integration',
          'Shopify Integration',
          'Custom HTML Integration',
          'React Component Integration',
          'Vue.js Integration'
        ]
      },
      performance: {
        name: 'Load and Performance Testing',
        tests: [
          'Concurrent Chat Sessions',
          'Rapid Message Sending',
          'Database Load Testing',
          'API Response Times',
          'Memory Usage Testing'
        ]
      },
      compliance: {
        name: 'GDPR and Legal Compliance',
        checks: [
          'Cookie Consent',
          'Data Retention',
          'Right to Erasure',
          'Data Portability',
          'Consent Withdrawal'
        ]
      }
    };
  }

  randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generate realistic conversation flows
  createConversationFlow(scenario = 'tuv_inquiry') {
    const flows = {
      tuv_inquiry: [
        { role: 'user', message: 'Hallo, mein Auto braucht TÜV. Was kostet das bei Ihnen?' },
        { role: 'assistant', message: 'Hallo! Gerne helfe ich Ihnen. Eine Hauptuntersuchung kostet bei uns 65€. Welches Fahrzeug fahren Sie denn?' },
        { role: 'user', message: 'Ich habe einen BMW 320d, Baujahr 2018.' },
        { role: 'assistant', message: 'Perfekt! Für Ihren BMW 320d können wir gerne einen Termin vereinbaren. Wann würde Ihnen passen?' },
        { role: 'user', message: 'Nächste Woche wäre gut. Haben Sie Mittwoch Zeit?' },
        { role: 'assistant', message: 'Ja, Mittwoch haben wir noch freie Termine. Kann ich Ihre Kontaktdaten aufnehmen?' }
      ],
      service_inquiry: [
        { role: 'user', message: 'Guten Tag, ich brauche eine große Inspektion für meinen Audi.' },
        { role: 'assistant', message: 'Guten Tag! Sehr gerne. Welches Audi-Modell fahren Sie und wie viele Kilometer hat das Fahrzeug?' },
        { role: 'user', message: 'Es ist ein A4 von 2019 mit 75.000 km.' },
        { role: 'assistant', message: 'Bei 75.000 km ist eine große Inspektion definitiv sinnvoll. Das kostet etwa 350-450€ je nach Umfang. Soll ich einen Termin für Sie reservieren?' }
      ],
      repair_inquiry: [
        { role: 'user', message: 'Hilfe! Mein Auto macht komische Geräusche beim Bremsen.' },
        { role: 'assistant', message: 'Das hört sich nach einem Bremsenproblem an. Bitte fahren Sie vorsichtig! Können Sie das Geräusch genauer beschreiben?' },
        { role: 'user', message: 'Es quietscht sehr laut, besonders beim starken Bremsen.' },
        { role: 'assistant', message: 'Das sind wahrscheinlich die Bremsbeläge. Sie sollten schnellstmöglich vorbeikommen. Haben Sie heute noch Zeit?' }
      ]
    };
    
    return flows[scenario] || flows.tuv_inquiry;
  }
}

module.exports = { GermanTestDataFactory };