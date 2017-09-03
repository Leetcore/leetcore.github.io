var cacheName = 'WPA10';
var filesToCache = [
	'/index.html'
];

this.addEventListener('install', function(event) {
	console.log('[ServiceWorker] Install');
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

this.addEventListener('activate', function(event) {
	console.log('[ServiceWorker] Activate');
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return this.clients.claim();
});

this.addEventListener('fetch', function(event) {
	console.log('[ServiceWorker] Fetch', event.request.url);
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request).then(function(response) {
				return caches.open('v1').then(function(cache) {
					cache.put(event.request, response.clone());
					return response;
				});  
			})
		}).catch(function() {
			//return caches.match('g');
			console.log("error")
		})			
	);
});