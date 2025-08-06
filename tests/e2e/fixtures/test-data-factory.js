/**
 * Test Data Factory for CarBot E2E Tests
 * Creates realistic test data for German automotive workshops
 */

const crypto = require('crypto');

class TestDataFactory {
  constructor() {
    this.testWorkshops = [];
    this.testLeads = [];
  }

  /**
   * Creates test workshops for different package types
   */
  async createTestWorkshops() {
    const workshops = [
      await this.createWorkshop('basic'),
      await this.createWorkshop('professional'),
      await this.createWorkshop('enterprise')
    ];

    this.testWorkshops = workshops;
    return workshops;
  }

  /**
   * Creates a single test workshop
   */
  async createWorkshop(packageType = 'basic') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    
    const workshops = {
      basic: {
        type: 'basic',
        email: `test-basic-${timestamp}@carbot-e2e.de`,
        password: 'TestBasic123!',
        name: 'Test Autowerkstatt Schmidt',
        phone: '+49 30 12345678',
        address: 'Teststraße 123',
        city: 'Berlin',
        plz: '12345',
        businessType: 'independent',
        plan: 'basic'
      },
      professional: {
        type: 'professional',
        email: `test-pro-${timestamp}@carbot-e2e.de`,
        password: 'TestPro123!',
        name: 'ProWerkstatt Berlin GmbH',
        phone: '+49 30 87654321',
        address: 'Profigasse 456',
        city: 'Berlin',
        plz: '10115',
        businessType: 'chain',
        plan: 'professional'
      },
      enterprise: {
        type: 'enterprise',
        email: `test-enterprise-${timestamp}@carbot-e2e.de`,
        password: 'TestEnterprise123!',
        name: 'Enterprise AutoService AG',
        phone: '+49 30 11223344',
        address: 'Unternehmensweg 789',
        city: 'München',
        plz: '80331',
        businessType: 'franchise',
        plan: 'enterprise'
      }
    };

    const workshop = workshops[packageType];
    workshop.id = `test-workshop-${packageType}-${random}`;
    workshop.createdAt = new Date().toISOString();

    return workshop;
  }

  /**
   * Creates test lead data for chat widget testing
   */
  createTestLead() {
    const leads = [
      {
        name: 'Max Mustermann',
        email: 'max.mustermann@example.de',
        phone: '+49 173 1234567',
        anliegen: 'BMW Inspektion benötigt',
        fahrzeug: 'BMW 320i, Baujahr 2018',
        kmStand: '85000',
        priority: 'medium'
      },
      {
        name: 'Anna Weber',
        email: 'anna.weber@gmail.de',
        phone: '+49 160 9876543',
        anliegen: 'TÜV für Mercedes',
        fahrzeug: 'Mercedes C200, Baujahr 2019',
        kmStand: '45000',
        priority: 'high'
      },
      {
        name: 'Thomas Schmidt',
        email: 'thomas.schmidt@web.de',
        phone: '+49 151 5555555',
        anliegen: 'Bremsen quietschen',
        fahrzeug: 'VW Golf, Baujahr 2020',
        kmStand: '32000',
        priority: 'urgent'
      }
    ];

    return leads[Math.floor(Math.random() * leads.length)];
  }

  /**
   * Creates chat conversation scenarios
   */
  getChatScenarios() {
    return {
      german: {
        language: 'de',
        messages: [
          'Hallo, ich brauche einen neuen TÜV für mein Auto',
          'Es ist ein BMW 3er von 2018',
          'Wann haben Sie einen Termin frei?',
          'Was kostet eine Inspektion?'
        ],
        expectedResponses: [
          'TÜV',
          'BMW',
          'Termin',
          'Inspektion',
          'Kosten'
        ]
      },
      english: {
        language: 'en',
        messages: [
          'Hello, I need car inspection',
          'My car is making strange noises',
          'When can I schedule an appointment?',
          'What are your prices?'
        ],
        expectedResponses: [
          'inspection',
          'appointment',
          'schedule',
          'prices'
        ]
      },
      turkish: {
        language: 'tr',
        messages: [
          'Merhaba, arabamı muayene ettirmek istiyorum',
          'BMW 320i var, 2019 model',
          'Ne zaman randevu alabilirim?'
        ],
        expectedResponses: [
          'muayene',
          'randevu',
          'BMW'
        ]
      },
      polish: {
        language: 'pl',
        messages: [
          'Dzień dobry, potrzebuję przeglądu samochodu',
          'To jest Volkswagen Golf z 2020 roku',
          'Kiedy mogę umówić wizytę?'
        ],
        expectedResponses: [
          'przegląd',
          'Volkswagen',
          'wizyta'
        ]
      }
    };
  }

  /**
   * Creates test payment data for Stripe testing
   */
  getStripeTestData() {
    return {
      validCard: {
        number: '4242424242424242',
        expiry: '12/25',
        cvc: '123',
        name: 'Test Workshop Owner',
        country: 'DE',
        postalCode: '12345'
      },
      declinedCard: {
        number: '4000000000000002',
        expiry: '12/25',
        cvc: '123',
        name: 'Declined Card Test',
        country: 'DE',
        postalCode: '12345'
      },
      requiresAuthenticationCard: {
        number: '4000002760003184',
        expiry: '12/25',
        cvc: '123',
        name: '3D Secure Test',
        country: 'DE',
        postalCode: '12345'
      }
    };
  }

  /**
   * Creates German-specific test data
   */
  getGermanTestData() {
    return {
      phoneNumbers: [
        '+49 30 12345678',
        '+49 89 87654321',
        '+49 221 1112233',
        '+49 40 9988776'
      ],
      plzCodes: [
        '10115', '80331', '50667', '20095',
        '01067', '70173', '30159', '76133'
      ],
      businessTypes: [
        'independent',
        'chain',
        'franchise',
        'authorized_dealer'
      ],
      vehicleBrands: [
        'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi',
        'Porsche', 'Opel', 'Ford', 'Toyota'
      ]
    };
  }

  /**
   * Generates realistic workshop opening hours
   */
  getWorkshopOpeningHours() {
    return {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      wednesday: '08:00-17:00',
      thursday: '08:00-17:00',
      friday: '08:00-16:00',
      saturday: '09:00-13:00',
      sunday: 'closed'
    };
  }

  /**
   * Gets test service categories for workshops
   */
  getServiceCategories() {
    return [
      {
        name: 'Inspektion',
        description: 'Regelmäßige Fahrzeuginspektion nach Herstellervorgaben',
        price: 'ab 150€'
      },
      {
        name: 'TÜV/HU',
        description: 'Hauptuntersuchung und Abgasuntersuchung',
        price: 'ab 120€'
      },
      {
        name: 'Reparaturen',
        description: 'Professionelle KFZ-Reparaturen aller Art',
        price: 'nach Aufwand'
      },
      {
        name: 'Reifenwechsel',
        description: 'Sommer-/Winterreifen wechseln und einlagern',
        price: 'ab 50€'
      }
    ];
  }

  /**
   * Cleans up test data (to be implemented with actual database cleanup)
   */
  async cleanup() {
    // This would typically clean up test data from the database
    console.log('🧹 Cleaning up test workshops and leads...');
    this.testWorkshops = [];
    this.testLeads = [];
  }

  /**
   * Generates unique test identifiers
   */
  generateTestId(prefix = 'test') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}-${timestamp}-${random}`;
  }
}

module.exports = { TestDataFactory };