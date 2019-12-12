var api_url = "https://api.football-data.org/v2/";
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
	console.log(`Yay! Workbox is loaded 🎉`);
} else {
	console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([
	{ url: './', revision: '1'},
	{ url: './icon.png', revision: '1'},
	{ url: './icons/icon-128x128.png', revision: '1'},
	{ url: './icons/icon-144x144.png', revision: '1'},
	{ url: './icons/icon-152x152.png', revision: '1'},
	{ url: './icons/icon-192x192.png', revision: '1'},
	{ url: './icons/icon-384x384.png', revision: '1'},
	{ url: './icons/icon-512x512.png', revision: '1'},
	{ url: './icons/icon-72x72.png', revision: '1'},
	{ url: './icons/icon-96x96.png', revision: '1'},
	{ url: './manifest.json', revision: '1'},
	{ url: './index.html', revision: '2'},
	{ url: './nav.html', revision: '1'},
	{ url: './teamView.html', revision: '2'},
	{ url: './pages/about.html', revision: '1'},
	{ url: './pages/home.html', revision: '1'},
	{ url: './pages/matches.html', revision: '1'},
	{ url: './pages/profile.html', revision: '1'},
	{ url: './pages/support.html', revision: '1'},
	{ url: './css/materialize.min.css', revision: '1'},
	{ url: './css/style.css', revision: '1'},
	{ url: './js/addButtonDb.js', revision: '1'},
	{ url: './js/api.js', revision: '2'},
	{ url: './js/database.js', revision: '1'},
	{ url: './js/idb.js', revision: '1'},
	{ url: './js/materialize.min.js', revision: '1'},
	{ url: './js/nav.js', revision: '1'},
	{ url: './js/registrar.js', revision: '1'},
]);

workbox.routing.registerRoute(
	new RegExp('./css/'),
	workbox.strategies.cacheFirst({
		cacheName: 'css-cache'
	})
);
workbox.routing.registerRoute(
	new RegExp('./js/'),
	workbox.strategies.cacheFirst({
		cacheName: 'js-cache'
	})
);
workbox.routing.registerRoute(
	new RegExp('./pages/'),
	workbox.strategies.cacheFirst({
		cacheName: 'pages-cache'
	})
);

workbox.routing.registerRoute(
	new RegExp(api_url),
	workbox.strategies.staleWhileRevalidate()
);
workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	workbox.strategies.cacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60,
			}),
		],
	}),
);
workbox.routing.registerRoute(
	/^https:\/\/fonts\.googleapis\.com/,
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets',
	})
);
workbox.routing.registerRoute(
	/^https:\/\/fonts\.gstatic\.com/,
	workbox.strategies.cacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200],
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30,
			}),
		],
	})
);
self.addEventListener('push', function(event){
	var dataPayload;
	if (event.data){
		dataPayload = event.data.text();
	} else {
		dataPayload = "Not having a payload";
	}
	var options = {
		body: dataPayload,
		icon: './icon.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};
	event.waitUntil(
		self.registration.showNotification('Push Notification', options)
	);
})