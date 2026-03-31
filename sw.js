// 1. Identificador de la versión (Subimos a v2.0 para el despegue oficial)
const CACHE_NAME = 'Space-Survival-Pro-v2.0';

// 2. Archivos Vitales del Juego (Asegúrate de que los nombres coincidan)
const INITIAL_ASSETS = [
  './',
  './index.html',
  './logo-app.png' // Usando el nombre que me dijiste
  // Si tienes un archivo .js aparte para el juego o un .css, agrégalos aquí
];

// --- FASE DE INSTALACIÓN ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🚀 [Space-Survival]: Sistemas de navegación instalados.');
      return cache.addAll(INITIAL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// --- FASE DE ACTIVACIÓN ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('🚀 [Space-Survival]: Limpiando basura espacial antigua:', key);
              return caches.delete(key);
            })
      );
    }).then(() => {
      console.log('🚀 [Space-Survival]: Nave lista para el hiperespacio (Modo Offline).');
      return self.clients.claim();
    })
  );
});

// --- ESTRATEGIA DE RED: NETWORK FIRST (Para actualizar récords si hay internet) ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // MODO OFFLINE: Si fallan los datos, el juego sigue corriendo desde el caché
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
