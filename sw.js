const cacheName = 'space-surviving-v1';
const assets = [
  './',
  './index.html',
  './logo-app.jpg',
  './manifest.json'
];

// Instalar y cachear archivos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Responder desde el caché si no hay internet
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
