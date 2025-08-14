import './globals.css'
import UATBanner from '@/components/UATBanner'
import PWAInstaller from '@/components/PWAInstaller'

export const metadata = {
  title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten | 24/7 Chatbot',
  description: 'Automatisieren Sie Ihre Kundenberatung mit CarBot. Terminbuchung, Lead-Generierung und Kundenservice in 4 Sprachen. 30 Tage kostenlos testen.',
  keywords: 'KI Chatbot Autowerkstatt, Automatisierte Terminbuchung, Kundenberatung KFZ, Werkstatt Software, Lead Generierung, Automotive KI',
  manifest: '/manifest.json',
  themeColor: '#ea580c',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CarBot'
  },
  formatDetection: {
    telephone: false
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'CarBot',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#ea580c',
    'msapplication-tap-highlight': 'no'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        {/* Professional CarBot Favicon */}
        <link rel="icon" type="image/svg+xml" href="/CarBot_Logo_Favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CarBot" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased touch-manipulation">
        <UATBanner />
        {children}
        <PWAInstaller />
      </body>
    </html>
  )
}