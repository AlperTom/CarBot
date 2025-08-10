/**
 * Service Worker for CarBot PWA
 * Implements caching, offline functionality, and push notifications
 */

const CACHE_NAME = 'carbot-v2.0.0';
const STATIC_CACHE = 'carbot-static-v2.0.0';
const DYNAMIC_CACHE = 'carbot-dynamic-v2.0.0';
const API_CACHE = 'carbot-api-v2.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/pricing',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/_next/static/chunks/main.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/analytics',
  '/api/packages',
  '/api/client-keys'
];

// Cache-first resources
const CACHE_FIRST_PATTERNS = [
  /\/_next\/static\//,
  /\/icons\//,
  /\/images\//,
  /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/,
  /\.(?:css|js)$/
];

// Network-first resources
const NETWORK_FIRST_PATTERNS = [
  /\/api\/chat/,
  /\/api\/auth/,
  /\/api\/stripe/,
  /\/api\/leads/
];

// Cache timeouts
const CACHE_TIMEOUT = 5000; // 5 seconds
const API_CACHE_TTL = 300000; // 5 minutes
const STATIC_CACHE_TTL = 86400000; // 24 hours

self.addEventListener('install', (event) => {
  console.log('🔧 CarBot Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ CarBot Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('carbot-') && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

/**
 * Check if request is for static asset
 */
function isStaticAsset(request) {
  return CACHE_FIRST_PATTERNS.some(pattern => 
    pattern.test(request.url)
  );
}

/**
 * Check if request is for API
 */
function isApiRequest(request) {
  return request.url.includes('/api/');
}

/**
 * Check if request is navigation
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

/**
 * Handle static assets with cache-first strategy
 */
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still fresh
      const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
      const isExpired = Date.now() - cacheTime.getTime() > STATIC_CACHE_TTL;
      
      if (!isExpired) {
        return cachedResponse;
      }
    }
    
    // Try network with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), CACHE_TIMEOUT)
      )
    ]);
    
    if (networkResponse.ok) {
      // Clone response and add cache timestamp
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cache-time', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse.clone());
      return modifiedResponse;
    }
    
    // Return cached version if network fails
    return cachedResponse || new Response('Asset not available offline', { status: 404 });
    
  } catch (error) {
    console.error('Static asset error:', error);
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Asset not available offline', { status: 404 });
  }
}

/**
 * Handle API requests with intelligent caching
 */
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Network-first for real-time APIs
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
    return handleNetworkFirst(request);
  }
  
  // Cache-first for analytics and package data
  if (API_CACHE_PATTERNS.some(pattern => request.url.includes(pattern))) {
    return handleApiCache(request);
  }
  
  // Default to network-only
  return fetch(request);
}

/**
 * Handle network-first requests with cache fallback
 */
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), CACHE_TIMEOUT)
      )
    ]);
    
    return networkResponse;
  } catch (error) {
    console.warn('Network request failed, trying cache:', request.url);
    
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for failed API calls
    return new Response(JSON.stringify({
      error: 'Offline mode - limited functionality available',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle cacheable API requests
 */
async function handleApiCache(request) {
  try {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
      const isExpired = Date.now() - cacheTime.getTime() > API_CACHE_TTL;
      
      if (!isExpired) {
        return cachedResponse;
      }
    }
    
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cache-time', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseToCache.json(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse.clone());
      return modifiedResponse;
    }
    
    return cachedResponse || networkResponse;
    
  } catch (error) {
    console.error('API cache error:', error);
    return new Response(JSON.stringify({
      error: 'Service temporarily unavailable',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle navigation requests
 */
async function handleNavigation(request) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), CACHE_TIMEOUT)
      )
    ]);
    
    // Cache successful navigations
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.warn('Navigation failed, serving offline page:', error);
    
    // Try to serve cached version
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page
    const offlineResponse = await cache.match('/offline');
    return offlineResponse || new Response('Offline - please check your connection', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

/**
 * Handle dynamic requests
 */
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Resource not available offline', { status: 404 });
  }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    data: data,
    actions: [
      {
        action: 'open',
        title: 'Öffnen',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Schließen',
        icon: '/icons/action-close.png'
      }
    ],
    tag: data.tag || 'carbot-notification',
    requireInteraction: data.urgent || false,
    silent: false,
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * Handle background sync
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'carbot-sync') {
    event.waitUntil(backgroundSync());
  }
});

/**
 * Background sync function
 */
async function backgroundSync() {
  try {
    // Sync pending data when back online
    const cache = await caches.open(API_CACHE);
    const pendingRequests = await cache.keys();
    
    for (const request of pendingRequests) {
      if (request.url.includes('pending-sync')) {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.error('Background sync failed for:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

/**
 * Periodic background sync
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'carbot-periodic-sync') {
    event.waitUntil(periodicSync());
  }
});

async function periodicSync() {
  // Perform periodic tasks like cache cleanup
  console.log('🔄 Performing periodic sync');
  
  // Clean up old cache entries
  const caches_to_clean = [DYNAMIC_CACHE, API_CACHE];
  
  for (const cacheName of caches_to_clean) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const cacheTime = new Date(response.headers.get('sw-cache-time') || 0);
      const isExpired = Date.now() - cacheTime.getTime() > API_CACHE_TTL;
      
      if (isExpired) {
        await cache.delete(request);
      }
    }
  }
}

console.log('🚀 CarBot Service Worker loaded and ready!');