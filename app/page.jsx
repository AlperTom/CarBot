// app/page.jsx

// Zwingt zu SSR und deaktiviert Static‑Prerendering
export const dynamic = 'force-dynamic';

import ClientHome from '../components/ClientHome';

export default function Home() {
  return <ClientHome />;
}
