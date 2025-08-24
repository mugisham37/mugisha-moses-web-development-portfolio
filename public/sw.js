// Service Worker for Brutalist Portfolio
const CACHE_NAME = "brutalist-portfolio-v1";
const STATIC_CACHE_NAME = "brutalist-static-v1";
const DYNAMIC_CACHE_NAME = "brutalist-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/hero-portrait.jpg",
  "/hero-portrait.svg",
  "/_next/static/css/app/layout.css",
  "/_next/static/css/app/page.css",
];

// Assets to cache on demand
const CACHE_STRATEGIES = {
  images: {
    strategy: "cacheFirst",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    maxEntries: 100,
  },
  api: {
    strategy: "networkFirst",
    maxAge: 5 * 60, // 5 minutes
    maxEntries: 50,
  },
  pages: {
    strategy: "staleWhileRevalidate",
    maxAge: 24 * 60 * 60, // 24 hours
    maxEntries: 20,
  },
  static: {
    strategy: "cacheFirst",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    maxEntries: 200,
  },
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] Service worker activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Determine caching strategy based on request type
    if (pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i)) {
      return handleImageRequest(request);
    } else if (pathname.startsWith("/_next/static/")) {
      return handleStaticRequest(request);
    } else if (pathname.startsWith("/api/")) {
      return handleApiRequest(request);
    } else if (pathname === "/" || pathname.startsWith("/")) {
      return handlePageRequest(request);
    } else {
      return fetch(request);
    }
  } catch (error) {
    console.error("[SW] Request handling error:", error);
    return handleOfflineRequest(request);
  }
}

// Cache-first strategy for images
async function handleImageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Clone response before caching
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);

      // Clean up old entries
      await cleanupCache(cache, CACHE_STRATEGIES.images.maxEntries);
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] Image fetch failed:", error);
    return new Response("Image not available", { status: 404 });
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] Static asset fetch failed:", error);
    return new Response("Asset not available", { status: 404 });
  }
}

// Network-first strategy for API requests
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] API fetch failed, trying cache:", error);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(JSON.stringify({ error: "Network unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Stale-while-revalidate strategy for pages
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Fetch from network in background
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        cache.put(request, responseClone);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error("[SW] Page fetch failed:", error);
      return null;
    });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise wait for network
  return networkPromise || handleOfflineRequest(request);
}

// Offline fallback
async function handleOfflineRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedPage = await cache.match("/");

    if (cachedPage) {
      return cachedPage;
    }
  }

  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Offline - Brutalist Portfolio</title>
        <style>
          body {
            font-family: 'Space Mono', monospace;
            background: #000;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .offline-message {
            border: 8px solid #ffff00;
            padding: 2rem;
            background: #000;
            box-shadow: 8px 8px 0 #fff;
          }
          h1 { color: #ffff00; margin: 0 0 1rem 0; }
          p { margin: 0; }
        </style>
      </head>
      <body>
        <div class="offline-message">
          <h1>CONNECTION LOST</h1>
          <p>You're currently offline. Please check your connection.</p>
        </div>
      </body>
    </html>
    `,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}

// Cache cleanup utility
async function cleanupCache(cache, maxEntries) {
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    const keysToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }
}

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form-sync") {
    event.waitUntil(syncContactForm());
  }

  if (event.tag === "newsletter-sync") {
    event.waitUntil(syncNewsletterForm());
  }
});

async function syncContactForm() {
  // Handle offline form submissions
  console.log("[SW] Syncing contact form submissions...");
  // Implementation would depend on your form handling strategy
}

async function syncNewsletterForm() {
  // Handle offline newsletter subscriptions
  console.log("[SW] Syncing newsletter subscriptions...");
  // Implementation would depend on your newsletter handling strategy
}

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/hero-portrait.svg",
    badge: "/hero-portrait.svg",
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: "view",
        title: "View Portfolio",
        icon: "/hero-portrait.svg",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"));
  }
});

console.log("[SW] Service worker script loaded");
