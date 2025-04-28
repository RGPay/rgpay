// Basic service worker for RGPay
// This is a minimal implementation that will be expanded in section 5.1

const CACHE_NAME = "rgpay-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json", "/favicon.ico"];

// Install service worker and cache initial assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
