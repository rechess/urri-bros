// Service worker: guarda el joc al dispositiu perquè funcioni sense connexió.
// Primer prova la xarxa (així sempre hi ha la versió nova) i, si no n'hi ha, fa servir la còpia guardada.
// El rànquing (un altre domini) no passa per aquí.
const CACHE = 'urri-bros';
const FILES = [
  './', 'index.html', 'privacitat.html', 'game.js', 'ranking-config.js', 'manifest.webmanifest',
  'assets/font.js', 'assets/cover.jpg', 'assets/favicon.ico', 'assets/favicon.png', 'assets/apple-touch-icon.png',
  'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-maskable-512.png',
  'assets/ajuntament.png', 'assets/bassa.jpg', 'assets/saballuts.png', 'assets/sant-felix.png', 'assets/parc.png', 'assets/parc-tocs.jpg', 'assets/micro-gran.png', 'assets/busi.png', 'assets/promo.jpg',
  'assets/logo-tvsabadell.png', 'assets/logo-radio.png', 'assets/logo-arlequinat.png', 'assets/ferran.png', 'assets/var.png', 'assets/tv-sabadell.png', 'assets/estacio-rotol.png', 'assets/micro-radio.png', ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => `assets/ascens-${i}.png`), 'assets/ap7.png', 'assets/nca.png',
  ...['idle', 'walk', 'run', 'jump', 'win', 'side', 'crouch'].map(n => `assets/${n}.png`),
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
