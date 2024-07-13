const CACHE_NAME = 'gpa-cache-v2.2';
const urlsToCache = [
    '/GPA/',
    '/GPA/index.html?v=2.2',
    '/GPA/icons/icon-192x192.png',
    '/GPA/icons/icon-512x512.png',
    '/GPA/manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
