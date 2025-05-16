/**
 * Service Worker for Fundamenta
 * 
 * This service worker provides caching and offline support to improve
 * performance and reliability of the application.
 */

const CACHE_NAME = 'fundamenta-cache-v1';
const STATIC_CACHE_NAME = 'fundamenta-static-v1';
const API_CACHE_NAME = 'fundamenta-api-v1';

// Assets that should be pre-cached for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add your main CSS and JS files here
];

// API endpoints that should be cached with a network-first strategy
const API_ROUTES = [
  '/api/learning-paths',
  '/api/modules',
  '/api/categories',
];

// Install event - pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate the service worker immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete outdated caches
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName.startsWith('fundamenta-')) {
              console.log('Service Worker: Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Claim clients to ensure SW controls all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (isApiRequest(event.request)) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (isStaticAsset(event.request)) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // Handle HTML navigation with network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Default to stale-while-revalidate for all other requests
  event.respondWith(staleWhileRevalidateStrategy(event.request));
});

/**
 * Determine if the request is for an API endpoint
 */
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         API_ROUTES.some(route => url.pathname.includes(route));
}

/**
 * Determine if the request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  
  // Check file extensions for common static assets
  const staticExtensions = [
    '.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
    '.woff', '.woff2', '.ttf', '.eot', '.ico', '.json'
  ];
  
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         STATIC_ASSETS.includes(url.pathname);
}

/**
 * Cache-first strategy:
 * 1. Try to serve from cache
 * 2. If not in cache, fetch from network and cache the response
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in the background (cache-first, background refresh)
    updateCache(request, STATIC_CACHE_NAME);
    return cachedResponse;
  }
  
  // Not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    // Clone the response before caching so it can be used by the browser
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Fetch failed for cache-first strategy', error);
    // Could return a fallback response for certain asset types here
    return new Response('Network error occurred', { status: 408 });
  }
}

/**
 * Network-first strategy:
 * 1. Try to get fresh data from network
 * 2. If network fails, fall back to cache
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    // Cache the successful response
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network request failed, falling back to cache');
    
    // If network fails, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If nothing in cache, return a custom offline response
    if (request.mode === 'navigate') {
      // Return offline page for navigation
      return caches.match('/offline.html')
        .then(response => response || new Response('You are offline', { 
          headers: { 'Content-Type': 'text/html' },
          status: 503
        }));
    }
    
    // Default error response
    return new Response('Network error occurred', { status: 408 });
  }
}

/**
 * Stale-while-revalidate strategy:
 * 1. Return cached response immediately (if available)
 * 2. Fetch updated response in the background
 * 3. Update the cache with the new response
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try to get from cache
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in the background
  const updatePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.error('Service worker: Background fetch failed', error);
  });
  
  // Return the cached response or wait for the network
  return cachedResponse || updatePromise;
}

/**
 * Helper function to update a cached resource in the background
 */
function updateCache(request, cacheName) {
  fetch(request).then(response => {
    if (response.ok) {
      caches.open(cacheName).then(cache => {
        cache.put(request, response);
      });
    }
  }).catch(error => {
    console.error('Service Worker: Background cache update failed', error);
  });
}

/**
 * Handle message events from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('Service Worker: Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        console.error('Service Worker: Cache clearing failed', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      })
    );
  }
});