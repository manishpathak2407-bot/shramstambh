/**
 * SHRAM STAMBH (श्रम स्तंभ) - Cache Purge & Decommission Service Worker
 * Ensures all previous cached assets are immediately cleared and clients receive live assets.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});
