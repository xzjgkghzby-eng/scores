const CACHE = 'jeux-cartes-v2'; // On passe en v2 pour forcer la mise à jour
const FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting(); // Force l'installation immédiate
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim(); // Prend le contrôle tout de suite
});

// Mode "Network First" : Va chercher sur internet d'abord, sinon utilise le cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
