
let CACHE_NAME = 'arink-store-v1_20220315_08';
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      '/cs/',
      '/cs/index.html',
      '/cs/viewer.html',
      '/cs/mapviewer.html',
      '/cs/assets/1.png',
      '/cs/assets/2.png',
      '/cs/assets/3.png',
      '/cs/assets/4.png',
      '/cs/assets/5.png',
      '/cs/assets/6.png',
      '/cs/assets/7.png',
      '/cs/assets/8.png',
      '/cs/assets/9.png',
      '/cs/assets/map_icon.png',      
      '/cs/assets/arink.png',
      '/cs/assets/back.png',
      '/cs/assets/logo_google.png',
      '/cs/assets/logo_kakao.png',
      '/cs/assets/favicon.ico',
      '/cs/assets/bootstrap.min.css',
      '/cs/assets/dropzone.min.css',
      '/cs/assets/index.css',
      '/cs/assets/ol.css',
      '/cs/assets/dog.glb',
      '/cs/js/aframe.min.js',
      '/cs/js/aframe-ar.js',
      '/cs/js/aframe-ar.min.js',
      '/cs/js/aframe-ar-nft.js',
      '/cs/js/aframe-draw-component.js',
      '/cs/js/aframe-extras.loaders.min.js',
      '/cs/js/bootstrap.min.js',
      '/cs/js/dropzone.min.js',
      '/cs/js/jquery.min.js',
      '/cs/js/jquery.twbsPagination.js',
      '/cs/js/ol.js',
      '/cs/js/login.js',
      '/cs/js/script.js',
      '/cs/js/three.js',
      '/cs/js/util.js',
      '/cs/js/viewer.js',      
      '/cs/js/mapviewer.js',
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
      caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
              if (key !== CACHE_NAME) {
                  console.log('[ServiceWorker] Removing old cache', key);
                  return caches.delete(key);
              }
          }));
      })
  );

  self.clients.claim();
});
