// Base-path aware service worker for GH Pages (user site or /<repo> project site).
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const p = (x) => `${SCOPE_PATH}${x}`;

const CACHE = 'naveo-fsm-v1';
const ASSETS = [
  p('/'), p('/index.html'), p('/login.html'), p('/logout.html'), p('/access/role.html'),
  p('/assets/js/noco.js'), p('/assets/js/auth-lite.js'),
  p('/planner/planner-jobs.html'), p('/planner/assign-job-enhanced.html'),
  p('/planner/dashboard.html'), p('/planner/realtime-map.html'),
  p('/planner/admin-intervention-master.html'), p('/planner/admin-tech-master.html'),
  p('/planner/assign-inventory-selector.html'), p('/planner/planner-inventory.html'),
  p('/planner/history.html'), p('/planner/reports.html'),
  p('/technician/home.html'),
  p('/icons/icon-192.png'), p('/icons/icon-512.png'), p('/icons/maskable-192.png'), p('/icons/maskable-512.png')
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});

// Network-first for HTML, cache-first for static
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const isHTML = req.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match(p('/index.html')))));
  } else {
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
