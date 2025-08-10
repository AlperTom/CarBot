/**
 * PWA Installer Component
 * Handles PWA installation prompt and provides native app-like experience
 */

'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Wifi, WifiOff } from 'lucide-react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after 30 seconds if not dismissed
      setTimeout(() => {
        const installDismissed = localStorage.getItem('pwa-install-dismissed');
        const lastShown = localStorage.getItem('pwa-install-last-shown');
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        
        if (!installDismissed && (!lastShown || parseInt(lastShown) < oneDayAgo)) {
          setShowInstallPrompt(true);
          localStorage.setItem('pwa-install-last-shown', Date.now().toString());
        }
      }, 30000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installation'
        });
      }
    };

    // Network status monitoring
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      
      // Hide offline banner after 5 seconds
      setTimeout(() => {
        setShowOfflineBanner(false);
      }, 5000);
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('🚀 Service Worker registered successfully:', registration);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 New service worker version available');
          });

        } catch (error) {
          console.error('❌ Service Worker registration failed:', error);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Register service worker
    registerServiceWorker();

    // Check initial network status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the PWA install prompt');
      } else {
        console.log('❌ User dismissed the PWA install prompt');
      }
      
      // Clean up
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      
    } catch (error) {
      console.error('Install prompt error:', error);
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Install prompt component
  const InstallPrompt = () => (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Smartphone className="h-8 w-8 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            CarBot als App installieren
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
            Installieren Sie CarBot für schnelleren Zugriff und Offline-Funktionalität
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors"
            >
              <Download className="h-3 w-3 mr-1" />
              Installieren
            </button>
            <button
              onClick={dismissInstallPrompt}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Später
            </button>
          </div>
        </div>
        <button
          onClick={dismissInstallPrompt}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  // Offline banner component
  const OfflineBanner = () => (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 z-50 text-center text-sm animate-slide-down">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>Offline-Modus - Begrenzte Funktionalität verfügbar</span>
      </div>
    </div>
  );

  // Network status indicator
  const NetworkStatus = () => (
    <div className="fixed top-4 right-4 z-40">
      {isOnline ? (
        <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs">
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Install prompt */}
      {showInstallPrompt && !isInstalled && <InstallPrompt />}
      
      {/* Offline banner */}
      {showOfflineBanner && <OfflineBanner />}
      
      {/* Network status indicator (only show in development or when offline) */}
      {(process.env.NODE_ENV === 'development' || !isOnline) && <NetworkStatus />}
    </>
  );
}

// Utility hook for PWA features
export function usePWAFeatures() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if PWA is installed
    const checkInstalled = () => {
      setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    };

    // Check network status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check if installation is available
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    checkInstalled();
    updateOnlineStatus();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return {
    isInstalled,
    isOnline,
    canInstall,
    isStandalone: isInstalled
  };
}