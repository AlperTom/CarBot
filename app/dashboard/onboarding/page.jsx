'use client';

import { useRouter } from 'next/navigation';
import OnboardingWizard from '../../../components/OnboardingWizard';

export default function OnboardingPage() {
  const router = useRouter();

  const handleOnboardingComplete = async (formData) => {
    try {
      // Show success message
      console.log('Onboarding completed with data:', formData);
      
      // Redirect to dashboard
      router.push('/dashboard?onboarding=completed');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Willkommen bei CarBot! 🚗
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Lassen Sie uns Ihre Werkstatt in wenigen Minuten einrichten
          </p>
          <p className="text-gray-500">
            Die Einrichtung dauert nur etwa 5 Minuten und Ihr CarBot ist sofort einsatzbereit.
          </p>
        </div>

        {/* Onboarding Wizard */}
        <OnboardingWizard onComplete={handleOnboardingComplete} />

        {/* Help section */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Benötigen Sie Hilfe bei der Einrichtung?
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:support@carbot.de"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              📧 E-Mail Support
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              💬 Live-Chat
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              📞 Telefon: +49 (0) 123 456789
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}