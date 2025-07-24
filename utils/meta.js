export function generateMeta({ title = 'CarBot - AI Serviceberater', description = 'CarBot: Automotive AI-Serviceberater Plattform', url = process.env.NEXT_PUBLIC_URL }) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'CarBot',
      images: [
        {
          url: url + '/og-image.png',
          alt: 'CarBot Logo',
        },
      ],
      type: 'website',
      locale: 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@CarBotAI',
      title,
      description,
    },
  };
}
