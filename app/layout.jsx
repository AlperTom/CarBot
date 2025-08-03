import './globals.css'

export const metadata = {
  title: 'CarBot Serviceberater',
  description: 'AI-gestützter Serviceberater für KFZ-Werkstätten'
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  )
}