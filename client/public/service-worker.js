// Service Worker for Fundamenta Learning Platform
// Version: 1.0.0

const CACHE_NAME = 'fundamenta-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network as fallback
  CACHE_FIRST: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      // Cache successful responses
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Return cached offline page if available
      if (request.mode === 'navigate') {
        const cache = await caches.open(CACHE_NAME);
        return cache.match('/offline.html');
      }
      throw error;
    }
  },
  
  // Network first with cache fallback
  NETWORK_FIRST: async (request) => {
    try {
      const networkResponse = await fetch(request);
      // Cache successful responses
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return cached offline page if available for navigation requests
      if (request.mode === 'navigate') {
        const cache = await caches.open(CACHE_NAME);
        return cache.match('/offline.html');
      }
      throw error;
    }
  },
  
  // Cache with network update
  STALE_WHILE_REVALIDATE: async (request) => {
    const cachedResponse = await caches.match(request);
    
    // Asynchronously update the cache
    const updateCache = async () => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Network failed, but we return cached response below anyway
        console.error('Failed to update cache:', error);
      }
    };
    
    // Update cache in background
    const updatePromise = updateCache();
    
    // Return cached response immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Otherwise wait for network response
    return updatePromise;
  }
};

// Select strategy based on request type
function getStrategy(request) {
  const url = new URL(request.url);
  
  // Use different strategies based on the request type
  
  // For API requests, always use network first
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // For static assets, use cache first
  if (/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/.test(url.pathname)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // For HTML and navigation requests, use network first
  if (request.mode === 'navigate' || /\.(html)$/.test(url.pathname)) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // For everything else, use stale-while-revalidate
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

// Service Worker Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Pre-caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Skip waiting so the service worker activates immediately
        return self.skipWaiting();
      })
  );
});

// Service Worker Activation
self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients so the SW controls everything immediately
      return self.clients.claim();
    })
  );
});

// Fetch event handling
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle the fetch
  event.respondWith(getStrategy(event.request)(event.request));
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data.url;
      
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});