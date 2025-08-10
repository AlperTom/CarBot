export const metadata = {
  title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten | 24/7 Chatbot',
  description: 'Automatisieren Sie Ihre Kundenberatung mit CarBot. Terminbuchung, Lead-Generierung und Kundenservice in 4 Sprachen. 30 Tage kostenlos testen.',
  keywords: 'KI Chatbot Autowerkstatt, Automatisierte Terminbuchung, Kundenberatung KFZ, Werkstatt Software, Lead Generierung, Automotive KI',
  openGraph: {
    title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten',
    description: 'Revolutionieren Sie Ihre Werkstatt mit KI-gestützter Kundenberatung. Automatische Terminbuchung, Lead-Generierung und 24/7 Service.',
    type: 'website',
    url: 'https://carbot.chat',
    siteName: 'CarBot',
    images: [{
      url: '/api/og?title=CarBot - KI für Autowerkstätten',
      width: 1200,
      height: 630,
      alt: 'CarBot KI-Chatbot für Autowerkstätten'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten',
    description: 'Automatisieren Sie Terminbuchung und Kundenservice mit KI. 30 Tage kostenlos testen.',
    images: ['/api/og?title=CarBot - KI für Autowerkstätten']
  },
  alternates: {
    canonical: 'https://carbot.chat'
  },
  robots: 'index, follow',
  authors: [{ name: 'CarBot Team' }],
  category: 'Automotive Software',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ea580c'
}

export default function HomeLayout({ children }) {
  return children
}