const CACHE_NAME = 'gpa-cache-v2.3';
const urlsToCache = [
    '/GPA/',
    '/GPA/index.html?v=2.3',
    '/GPA/style.css?v=2.3',
    '/GPA/script.js?v=2.3',
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

self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
            .then(function(response) {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                var responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(function() {
                return caches.match(event.request).then(function(response) {
                    if (response) {
                        return response;
                    }
                    // Optionally, show a fallback page when offline
                    return caches.match('/GPA/index.html?v=2.3');
                });
            })
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});