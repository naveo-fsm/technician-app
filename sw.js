
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('fsm-app-v1').then(cache => {
      return cache.addAll([
        '/login.html',
        '/technician.html',
        '/checklist.html',
        '/dashboard.html',
        '/planner.html',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
