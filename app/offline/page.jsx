/**
 * Offline Page - Displayed when user is offline and page isn't cached
 */

'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* CarBot Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CarBot</h1>
        </div>

        {/* Offline Status */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sie sind offline
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Diese Seite ist nicht für die Offline-Nutzung verfügbar. 
            Bitte überprüfen Sie Ihre Internetverbindung.
          </p>

          {/* Online Status Indicator */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isOnline 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {isOnline ? 'Verbindung wiederhergestellt' : 'Keine Internetverbindung'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
              isOnline
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Seite neu laden
          </button>

          <div className="flex space-x-3">
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Startseite
            </Link>
            
            <Link 
              href="/dashboard"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Offline Features Available */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Offline verfügbare Funktionen:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Bereits geladene Dashboard-Daten</li>
            <li>• Gespeicherte Chat-Verläufe</li>
            <li>• Zwischengespeicherte Seiten</li>
            <li>• Lokale Einstellungen</li>
          </ul>
        </div>

        {/* Tips */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            <strong>Tipp:</strong> Installieren Sie CarBot als App für eine bessere Offline-Erfahrung.
          </p>
          <p>
            Die Verbindung wird automatisch wiederhergestellt, sobald Sie wieder online sind.
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Offline - CarBot',
  description: 'CarBot ist momentan offline. Bitte überprüfen Sie Ihre Internetverbindung.',
};