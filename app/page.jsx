// app/page.jsx

import dynamic from 'next/dynamic';

// Verhindert Static‑Prerendering – zwingt zu SSR
export const dynamic = 'force-dynamic';

// Wir laden nur eine Client‑Wrapper‑Komponente
const ClientHome = dynamic(() => import('../components/ClientHome'), {
  ssr: false,  // dynamischer Import im Browser
});

export default function Home() {
  return <ClientHome />;
}
