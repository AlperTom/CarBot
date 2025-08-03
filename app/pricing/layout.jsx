export const metadata = {
  title: 'CarBot Preise - KI-Serviceberater für Autowerkstätten | Ab €49/Monat',
  description: 'Transparente Preise für CarBot, den führenden KI-Serviceberater für deutsche Autowerkstätten. Starter ab €49/Monat, Professional €99/Monat, Enterprise €199/Monat. 14 Tage kostenlos testen. 40% mehr Terminbuchungen garantiert.',
  keywords: 'CarBot Preise, KI Autowerkstatt, Serviceberater Software, Werkstatt Management, DSGVO konform, Automotive AI, Werkstatt Software, Terminbuchung, Kundenservice',
  openGraph: {
    title: 'CarBot Preise - KI-Serviceberater für Autowerkstätten | Ab €49/Monat',
    description: 'Transparente Preise für CarBot. Steigern Sie Ihre Effizienz mit Deutschlands führendem KI-Serviceberater. 40% mehr Terminbuchungen und zufriedenere Kunden.',
    type: 'website',
    locale: 'de_DE',
    images: [
      {
        url: '/images/carbot-pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CarBot Preise - KI-Serviceberater für Autowerkstätten',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarBot Preise - Ab €49/Monat | KI-Serviceberater',
    description: 'Transparente Preise für den führenden KI-Serviceberater. 14 Tage kostenlos testen.',
    images: ['/images/carbot-pricing-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://carbot.de/pricing',
  },
};

export default function PricingLayout({ children }) {
  return children;
}