'use client';
import dynamic from 'next/dynamic';

// Client‑Only: wird erst im Browser (nicht SSR) geladen
const Hero = dynamic(() => import('../components/Hero'), { ssr: false });
const FeatureGrid = dynamic(() => import('../components/FeatureGrid'), { ssr: false });
const LeadForm = dynamic(() => import('../components/LeadForm'), { ssr: false });

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <LeadForm />
    </>
  );
}
