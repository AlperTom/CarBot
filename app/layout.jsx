import './globals.css'
import UATBanner from '@/components/UATBanner'
import PWAInstaller from '@/components/PWAInstaller'

export const metadata = {
  title: 'CarBot - KI-Kundenberatung für Autowerkstätten',
  description: 'Intelligente KI-powered Kundenberatung und Terminbuchung für deutsche Autowerkstätten',
  manifest: '/manifest.json',
  themeColor: '#ea580c',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
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