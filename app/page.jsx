import dynamic from 'next/dynamic';

// Client-Komponenten dynamisch ohne SSR
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
