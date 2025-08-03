// Multi-language support system for CarBot
export const languages = {
  de: 'Deutsch',
  en: 'English', 
  tr: 'Türkçe',
  pl: 'Polski'
}

export const translations = {
  de: {
    greeting: "Hallo! Wie kann ich dir bei automotive Fragen helfen?",
    consent: {
      title: "Datenschutz & Einwilligung",
      description: "Bevor wir starten, benötigen wir Ihre Einwilligung:",
      required: "Erforderlich: Verarbeitung von Chat-Nachrichten zur Bereitstellung des Services",
      optional_communication: "Optional: Kontaktaufnahme für Serviceverbesserungen",
      optional_analytics: "Optional: Anonyme Nutzungsstatistiken zur Verbesserung des Services",
      start_chat: "Chat starten",
      decline: "Ablehnen"
    },
    lead_form: {
      title: "Kontaktdaten für persönliche Beratung",
      description: "Gerne setzen wir uns persönlich mit Ihnen in Verbindung, um Ihr Anliegen optimal zu bearbeiten.",
      name: "Name",
      phone: "Telefonnummer", 
      request: "Ihr Anliegen",
      vehicle: "Fahrzeug (optional)",
      submit: "Rückruf anfordern",
      later: "Später"
    },
    common: {
      loading: "Denke nach...",
      send: "Senden",
      placeholder: "Deine Frage...",
      error: "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
      close: "Schließen"
    }
  },
  
  en: {
    greeting: "Hello! How can I help you with automotive questions?",
    consent: {
      title: "Privacy & Consent",
      description: "Before we start, we need your consent:",
      required: "Required: Processing of chat messages to provide the service",
      optional_communication: "Optional: Contact for service improvements",
      optional_analytics: "Optional: Anonymous usage statistics for service improvement",
      start_chat: "Start Chat",
      decline: "Decline"
    },
    lead_form: {
      title: "Contact Details for Personal Consultation",
      description: "We would be happy to contact you personally to handle your request optimally.",
      name: "Name",
      phone: "Phone Number",
      request: "Your Request", 
      vehicle: "Vehicle (optional)",
      submit: "Request Callback",
      later: "Later"
    },
    common: {
      loading: "Thinking...",
      send: "Send",
      placeholder: "Your question...",
      error: "Sorry, there was an error. Please try again.",
      close: "Close"
    }
  },

  tr: {
    greeting: "Merhaba! Otomotiv sorularınızda size nasıl yardımcı olabilirim?",
    consent: {
      title: "Gizlilik ve Onay",
      description: "Başlamadan önce onayınıza ihtiyacımız var:",
      required: "Gerekli: Hizmeti sağlamak için sohbet mesajlarının işlenmesi",
      optional_communication: "İsteğe bağlı: Hizmet iyileştirmeleri için iletişim",
      optional_analytics: "İsteğe bağlı: Hizmet iyileştirmesi için anonim kullanım istatistikleri",
      start_chat: "Sohbeti Başlat",
      decline: "Reddet"
    },
    lead_form: {
      title: "Kişisel Danışmanlık için İletişim Bilgileri",
      description: "Talebinizi en iyi şekilde işlemek için sizinle kişisel olarak iletişime geçmekten memnuniyet duyarız.",
      name: "İsim",
      phone: "Telefon Numarası",
      request: "Talebiniz",
      vehicle: "Araç (isteğe bağlı)",
      submit: "Geri Arama Talep Et",
      later: "Sonra"
    },
    common: {
      loading: "Düşünüyor...",
      send: "Gönder", 
      placeholder: "Sorunuz...",
      error: "Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.",
      close: "Kapat"
    }
  },

  pl: {
    greeting: "Cześć! Jak mogę pomóc w kwestiach motoryzacyjnych?",
    consent: {
      title: "Prywatność i Zgoda",
      description: "Zanim zaczniemy, potrzebujemy Twojej zgody:",
      required: "Wymagane: Przetwarzanie wiadomości czatu w celu świadczenia usługi",
      optional_communication: "Opcjonalne: Kontakt w celu ulepszenia usług",
      optional_analytics: "Opcjonalne: Anonimowe statystyki użytkowania w celu ulepszenia usługi",
      start_chat: "Rozpocznij Czat",
      decline: "Odrzuć"
    },
    lead_form: {
      title: "Dane Kontaktowe do Osobistej Konsultacji",
      description: "Z przyjemnością skontaktujemy się z Tobą osobiście, aby optymalnie obsłużyć Twoją prośbę.",
      name: "Imię",
      phone: "Numer Telefonu",
      request: "Twoja Prośba",
      vehicle: "Pojazd (opcjonalnie)",
      submit: "Poproś o Oddzwonienie",
      later: "Później"
    },
    common: {
      loading: "Myślę...",
      send: "Wyślij",
      placeholder: "Twoje pytanie...",
      error: "Przepraszamy, wystąpił błąd. Spróbuj ponownie.",
      close: "Zamknij"
    }
  }
}

// Language detection utilities
export function detectLanguage(text, userAgent = '', acceptLanguage = '') {
  // Simple keyword-based detection
  const languageKeywords = {
    tr: ['merhaba', 'araç', 'otomobil', 'tamirci', 'servis', 'fiyat', 'kaç', 'nerede'],
    pl: ['cześć', 'samochód', 'warsztat', 'naprawa', 'serwis', 'cena', 'ile', 'gdzie'],
    en: ['hello', 'car', 'repair', 'service', 'price', 'how', 'where', 'workshop']
  }

  // Check text content for language indicators
  for (const [lang, keywords] of Object.entries(languageKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return lang
    }
  }

  // Check browser Accept-Language header
  if (acceptLanguage) {
    if (acceptLanguage.includes('tr')) return 'tr'
    if (acceptLanguage.includes('pl')) return 'pl' 
    if (acceptLanguage.includes('en')) return 'en'
  }

  // Default to German
  return 'de'
}

export function getTranslation(language, key) {
  const keys = key.split('.')
  let value = translations[language] || translations.de
  
  for (const k of keys) {
    value = value[k]
    if (!value) break
  }
  
  return value || translations.de[key] || key
}

// AI System prompts for different languages
export function getSystemPrompt(language, customerContext) {
  const prompts = {
    de: `Du bist CarBot, ein professioneller KFZ-Service-Chatbot. Antworte direkt, höflich und sachlich auf Deutsch.`,
    en: `You are CarBot, a professional automotive service chatbot. Respond directly, politely and factually in English.`,
    tr: `CarBot'sın, profesyonel bir otomotiv servis chatbotu. Türkçe olarak doğrudan, kibar ve gerçekçi cevaplar ver.`,
    pl: `Jesteś CarBot, profesjonalnym chatbotem serwisu motoryzacyjnego. Odpowiadaj bezpośrednio, grzecznie i rzeczowo po polsku.`
  }

  let basePrompt = prompts[language] || prompts.de

  // Add customer context if available
  if (customerContext?.customer) {
    const contextPrompts = {
      de: `\n\nDu berätst für: ${customerContext.customer.name} in ${customerContext.customer.city}`,
      en: `\n\nYou are advising for: ${customerContext.customer.name} in ${customerContext.customer.city}`,
      tr: `\n\n${customerContext.customer.city}'deki ${customerContext.customer.name} için danışmanlık veriyorsun`,
      pl: `\n\nDoradza dla: ${customerContext.customer.name} w ${customerContext.customer.city}`
    }
    basePrompt += contextPrompts[language] || contextPrompts.de
  }

  return basePrompt
}

// Currency and number formatting for different locales
export function formatPrice(amount, language) {
  const formatters = {
    de: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    en: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }),
    tr: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR' }),
    pl: new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'EUR' })
  }
  
  return formatters[language]?.format(amount) || formatters.de.format(amount)
}

// Date formatting for different locales
export function formatDate(date, language) {
  const formatters = {
    de: new Intl.DateTimeFormat('de-DE'),
    en: new Intl.DateTimeFormat('en-US'),
    tr: new Intl.DateTimeFormat('tr-TR'), 
    pl: new Intl.DateTimeFormat('pl-PL')
  }
  
  return formatters[language]?.format(date) || formatters.de.format(date)
}