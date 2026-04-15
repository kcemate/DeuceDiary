// Self-unregister: previous SW was caching stale HTML and breaking deploys.
// This script unregisters itself on install, clearing the cache for all users.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Delete all caches
  caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  // Unregister this service worker
  self.registration.unregister();
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through — never intercept
  event.respondWith(fetch(event.request));
});