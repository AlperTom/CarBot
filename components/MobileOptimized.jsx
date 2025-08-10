/**
 * Mobile Optimized Components
 * Provides mobile-first responsive components for better UX
 */

'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Bell } from 'lucide-react';
import { usePWAFeatures } from './PWAInstaller';

// Mobile Navigation Bar
export function MobileNavbar({ user, notifications = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isStandalone, isOnline } = usePWAFeatures();

  return (
    <>
      {/* Mobile Header */}
      <header className={`lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${
        isStandalone ? 'pt-safe-top' : ''
      }`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">CarBot</h1>
                {user?.workshop && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {user.workshop.name}
                  </p>
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Network Status */}
              {!isOnline && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>

              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menü</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Menu Content */}
            <nav className="p-4">
              <div className="space-y-2">
                <a href="/dashboard" className="block px-4 py-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                  Dashboard
                </a>
                <a href="/dashboard/chat" className="block px-4 py-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                  Chat
                </a>
                <a href="/dashboard/analytics" className="block px-4 py-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                  Analytics
                </a>
                <a href="/dashboard/settings" className="block px-4 py-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                  Einstellungen
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

// Mobile Card Component
export function MobileCard({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

// Mobile Stats Grid
export function MobileStatsGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <MobileCard key={index} className="p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
          {stat.change && (
            <div className={`text-xs mt-1 ${
              stat.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </div>
          )}
        </MobileCard>
      ))}
    </div>
  );
}

// Mobile Search Bar
export function MobileSearchBar({ placeholder = "Suchen...", onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-600 focus:bg-white dark:focus:bg-gray-700"
        />
      </div>
    </form>
  );
}

// Mobile Action Sheet
export function MobileActionSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {title}
          </h3>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mobile Bottom Navigation
export function MobileBottomNav({ activeTab, onTabChange }) {
  const { isStandalone } = usePWAFeatures();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${
      isStandalone ? 'pb-safe-bottom' : ''
    }`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-3 px-1 text-xs ${
              activeTab === tab.id
                ? 'text-orange-600 dark:text-orange-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-lg mb-1">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Mobile Swipe Handler
export function useMobileSwipe(onSwipeLeft, onSwipeRight, threshold = 50) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

// Mobile Responsive Container
export function MobileContainer({ children, className = '' }) {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
}

// Mobile Safe Area Component
export function MobileSafeArea({ children, top = true, bottom = true }) {
  const { isStandalone } = usePWAFeatures();
  
  return (
    <div className={`${
      isStandalone ? [
        top ? 'pt-safe-top' : '',
        bottom ? 'pb-safe-bottom' : ''
      ].filter(Boolean).join(' ') : ''
    }`}>
      {children}
    </div>
  );
}