/* Minimaler Service-Worker: erst das Netz, dann der Zwischenspeicher.
   So sind Änderungen sofort sichtbar und die App funktioniert trotzdem offline. */
const CACHE = 'ns-vorlagen-v1';
const CORE = [
  './', './index.html',
  './assets/fonts.css', './assets/brand-fonts.css', './assets/brand-tokens.css',
  './assets/app.css', './assets/templates.css',
  './js/app.js'
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  ev.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
