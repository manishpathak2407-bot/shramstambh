/**
 * SHRAM STAMBH (श्रम स्तंभ) - Offline Service Worker v5.0 (Shramik Ledger Edition)
 * Network-First Strategy with Cache Fallback for offline resilience.
 * Purges outdated caches and serves fresh Shramik Ledger assets.
 */

const CACHE_NAME = 'shramstambh-v5.0-ledger';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './css/style.css',
  './script.js',
  './guide.html',
  './manifest.json'
];

// 1. Install Event: Cache critical shell and force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate Event: Aggressively purge all old versioned caches and claim open clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
