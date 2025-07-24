export const metadata = {
  title: 'CarBot – Digitaler Serviceberater',
  description: 'Der AI-Agent für moderne Werkstätten.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
