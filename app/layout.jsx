import './globals.css'
import UATBanner from '@/components/UATBanner'

export const metadata = {
  title: 'CarBot Serviceberater',
  description: 'AI-gestützter Serviceberater für KFZ-Werkstätten'
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="antialiased">
        <UATBanner />
        {children}
      </body>
    </html>
  )
}