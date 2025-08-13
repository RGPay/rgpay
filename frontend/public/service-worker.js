// Basic service worker for RGPay
// Keep HTML always fresh to avoid stale hashed assets after deploys

const CACHE_NAME = "rgpay-cache-v3";
const urlsToCache = ["/manifest.json", "/vite.svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // For navigations (HTML), use network-first to always get the latest index.html
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          // Fallback to a minimal offline page
          return new Response("<h1>Offline</h1>", {
            headers: { "Content-Type": "text/html" },
          });
        }
      })()
    );
    return;
  }

  // For other requests, use cache-first and fallback to network
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        return response;
      } catch {
        return new Response(null, { status: 504 });
      }
    })()
  );
});
