// File: app/page.jsx
// Erzwinge dynamisches Rendering (keine statische Vorab-Generierung)
export const dynamic = 'force-dynamic';

import ClientHome from '../components/ClientHome';

export default function Home() {
  return <ClientHome />;
}