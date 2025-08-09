// Very small, safe cache for static assets
const CACHE = 'fsm-cache-v1';
const STATIC_ASSETS = [
  '/technician-app/',
  '/technician-app/index.html',
  '/technician-app/login.html',
  '/technician-app/logout.html',
  '/technician-app/manifest.json',
  '/technician-app/auth.js'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC_ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', (e)=>{
  const { request } = e;
  // Cache-first for same-origin GETs
  if(request.method === 'GET' && request.url.startsWith(self.location.origin)){
    e.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(request, copy));
        return res;
      }).catch(()=> hit))
    );
  }
});
