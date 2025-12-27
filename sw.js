const CACHE_NAME = 'node-blank-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './styles/main.css',
    './styles/base/variables.css',
    './assets/logo/favicon.ico',
    './assets/logo/apple-touch-icon.png',
    './assets/logo/icon-192.png',
    './assets/logo/icon-512.png'
];

// External CDNs to cache
const CDN_URLS = [
    'esm.sh',
    'jsdelivr.net',
    'cdnjs.cloudflare.com'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Strategy: Stale-While-Revalidate for JS, CSS, and CDN assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Check if we should cache this response
                const isLocal = url.origin === self.location.origin;
                const isCDN = CDN_URLS.some(cdn => url.hostname.includes(cdn));

                if (networkResponse && networkResponse.status === 200 && (isLocal || isCDN)) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If network fails and we have no cache, we might want to return a fallback
                // for some specific routes, but for now we just let it fail.
            });

            return cachedResponse || fetchPromise;
        })
    );
});
