const CACHE_NAME = 'naveo-fsm-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/logout.html',
  '/planner/planner.html',
  '/technician/assigned-jobs.html',
  '/assets/js/auth.js',
  // Add more static assets, module screens, icons as needed
];

// Install Service Worker & Cache Files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate and Clean Up Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
