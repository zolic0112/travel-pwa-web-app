const VERSION = 'v6';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const SHELL_URLS = ['./', './index.html', './trip.js', './styles.css', './app.js', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== ASSETS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isShell = url => url.pathname.endsWith('/') || /\.(html|css|js|webmanifest)$/.test(url.pathname);

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Shell goes network-first so a deploy is visible on the next load; the cache
  // is the offline fallback, not the source of truth. Cache-first here is what
  // made an earlier deploy invisible to anyone who had already opened the app.
  if (isShell(url)) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' })
        .then(res => {
          // Never store a 404 or a 5xx. A deployment window that briefly serves
          // an error page would otherwise persist as the offline fallback.
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Icons and the like never change under the same name.
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(ASSETS).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
