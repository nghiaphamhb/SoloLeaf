const CACHE_OFFLINE  = "cache-offline-v1";  // need version to prevent stale cache when update code sw
const OFFLINE_URL = "/offline.html"; // offline page 

const CACHE_ASSETS = "cache-assets-v1"; // font caching

const CACHE_HOMEPAGE = "cache-homepage-v1"; // homepage data caching

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_OFFLINE).then((cache) => cache.add(OFFLINE_URL))  // update cache storage
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) =>
        [CACHE_OFFLINE, CACHE_ASSETS, CACHE_HOMEPAGE].includes(k) ? null : caches.delete(k) // remove stale cache by version
      )
    );  
      await self.clients.claim(); // sw has control of all tabs in its scope
    })()
  );
});

self.addEventListener("fetch", (e) => { // catch all request (by fetch events)
  const req = e.request;
  const url = new URL(req.url);

  // offline page
  if (req.mode === "navigate") {  // stragery : network-first
    e.respondWith( 
      fetch(req).catch(() => caches.match(OFFLINE_URL)) // catch fetch's error by offline page
    );
    return;
  }

  // cache-first for (static) assets/fonts
  const isAsset = url.origin === self.location.origin && url.pathname.startsWith("/assets/");
  const isFont = /\.(woff2?|ttf|otf)$/i.test(url.pathname);

  if (req.method === "GET" && (isAsset || isFont)) {
    e.respondWith(cacheFirst(req, CACHE_ASSETS)); // using helper function
    return;
  }

  // apply SWR for GET /api/restaurant
  if (req.method === "GET" && url.origin === self.location.origin && url.pathname === "/api/restaurant") {
    e.respondWith(staleWhileRevalidate(req, CACHE_HOMEPAGE));
    return;
  }
});

// helpers
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);

  const cached = await cache.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  // only cache response OK
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);

  const cached = await cache.match(req);

  const networkPromise = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);

  return cached || (await networkPromise) || new Response(JSON.stringify({ error: "offline" }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}