// Service Worker for Offline Support
const CACHE_NAME = "brutalist-portfolio-v1";
const STATIC_CACHE_NAME = "brutalist-portfolio-static-v1";
const DYNAMIC_CACHE_NAME = "brutalist-portfolio-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  // Add other critical assets
];

// Routes to cache dynamically
const CACHEABLE_ROUTES = [
  "/projects",
  "/blog",
  "/services",
  "/contact",
  "/about",
];

// API endpoints to cache
const CACHEABLE_APIS = ["/api/projects", "/api/blog", "/api/github"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

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
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(url.pathname)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isPageRequest(url.pathname)) {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Check if request is for a static asset
function isStaticAsset(pathname) {
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/static/") ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  );
}

// Check if request is for an API endpoint
function isAPIRequest(pathname) {
  return pathname.startsWith("/api/");
}

// Check if request is for a page
function isPageRequest(pathname) {
  return (
    CACHEABLE_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/"
  );
}

// Handle static assets - cache first strategy
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Static asset fetch failed", error);

    // Return cached version if available
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback
    return new Response("Asset unavailable offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Handle API requests - network first with cache fallback
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: API network failed, trying cache", error);

    // Try to serve from cache
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Add header to indicate cached response
      const response = cachedResponse.clone();
      response.headers.set("X-Served-By", "ServiceWorker");
      return response;
    }

    // Return offline API response
    return new Response(
      JSON.stringify({
        error: "API unavailable offline",
        cached: false,
        offline: true,
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
          "Content-Type": "application/json",
          "X-Served-By": "ServiceWorker",
        },
      }
    );
  }
}

// Handle page requests - network first with cache fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Page network failed, trying cache", error);

    // Try to serve from cache
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return (
      caches.match("/offline") ||
      new Response(
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
              min-height: 100vh;
              margin: 0;
              text-align: center;
            }
            .container {
              max-width: 600px;
              padding: 2rem;
              border: 4px solid #fff;
            }
            h1 {
              font-size: 3rem;
              color: #ffff00;
              margin: 0 0 1rem 0;
              text-transform: uppercase;
            }
            p {
              font-size: 1rem;
              line-height: 1.5;
              margin: 0 0 2rem 0;
            }
            button {
              background: #000;
              color: #fff;
              border: 4px solid #fff;
              padding: 0.75rem 1.5rem;
              font-family: inherit;
              font-weight: 700;
              text-transform: uppercase;
              cursor: pointer;
            }
            button:hover {
              transform: translate(-2px, -2px);
              box-shadow: 4px 4px 0px 0px #fff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>OFFLINE</h1>
            <p>You're currently offline. Some features may be limited, but you can still browse cached content.</p>
            <button onclick="window.location.reload()">TRY AGAIN</button>
          </div>
        </body>
      </html>
      `,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
            "X-Served-By": "ServiceWorker",
          },
        }
      )
    );
  }
}

// Handle generic requests
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log("Service Worker: Generic request failed", error);

    // Try cache
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Request failed and no cache available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log("Service Worker: Performing background sync");

  // Retry failed requests, sync offline data, etc.
  // This would typically involve checking IndexedDB for queued requests
  // and attempting to send them when back online
}

// Push notifications (if needed)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received", event);

  const options = {
    body: event.data ? event.data.text() : "New update available",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Update",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Brutalist Portfolio", options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log("Service Worker: Script loaded");
