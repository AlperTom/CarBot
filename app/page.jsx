'use client';
export const dynamic = 'force-dynamic';

import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import LeadForm from '../components/LeadForm';

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <LeadForm />
    </>
  );
}
