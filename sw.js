const CACHE_NAME = 'fsm-app-v3';
const APP_SHELL = [
  '/',                  // for index.html
  '/index.html',
  '/login.html',
  '/logout.html',
  '/manifest.json',
  // Planner screens
  '/planner/planner.html',
  '/planner/planner-jobs.html',
  '/planner/planner-inventory.html',
  '/planner/assign-job-enhanced.html',
  '/planner/assign-inventory-selector.html',
  '/planner/dashboard.html',
  '/planner/realtime-map.html',
  '/planner/admin-tech-master.html',
  '/planner/admin-intervention-master.html',
  // Technician screens
  '/technician/technician.html',
  '/technician/checklist.html',
  // Assets
  '/assets/css/style.css',
  '/assets/js/auth.js',
  '/sw.js'
];

// Install: cache the app shell
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(oldKey => caches.delete(oldKey))
      )
    )
  );
});

// Fetch: serve from cache, then network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(cachedResp => {
        if (cachedResp) return cachedResp;
        return fetch(event.request)
          .then(networkResp => {
            // Optionally dynamically cache new requests:
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResp.clone());
              return networkResp;
            });
          });
      })
      .catch(() => {
        // Fallback offline page if you like:
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
