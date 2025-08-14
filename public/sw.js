/**
 * Advanced Service Worker for Portfolio Performance Optimization
 * Implements aggressive caching, offline support, and performance monitoring
 */

const CACHE_NAME = "brutalist-portfolio-v1.0.0";
const RUNTIME_CACHE = "runtime-cache-v1.0.0";
const IMAGE_CACHE = "image-cache-v1.0.0";
const API_CACHE = "api-cache-v1.0.0";

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  "/",
  "/manifest.json",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
  "/_next/static/chunks/pages/_app.js",
  "/images/hero-bg.webp",
  "/favicon.ico",
];

// API endpoints to cache
const CACHEABLE_APIS = ["/api/projects", "/api/blog", "/api/testimonials"];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
  NETWORK_ONLY: "network-only",
  CACHE_ONLY: "cache-only",
};

// Performance monitoring
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  offlineRequests: 0,
};

/**
 * Install event - cache critical resources
 */
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);

        // Cache critical resources with error handling
        const cachePromises = CRITICAL_RESOURCES.map(async (resource) => {
          try {
            const response = await fetch(resource);
            if (response.ok) {
              await cache.put(resource, response);
              console.log(`Cached: ${resource}`);
            }
          } catch (error) {
            console.warn(`Failed to cache ${resource}:`, error);
          }
        });

        await Promise.allSettled(cachePromises);

        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error("Service Worker installation failed:", error);
      }
    })()
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(
            (name) =>
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE &&
              name !== IMAGE_CACHE &&
              name !== API_CACHE
          )
          .map((name) => caches.delete(name));

        await Promise.all(deletePromises);

        // Take control of all clients
        await self.clients.claim();

        console.log("Service Worker activated");
      } catch (error) {
        console.error("Service Worker activation failed:", error);
      }
    })()
  );
});

/**
 * Fetch event - implement caching strategies
 */
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

  performanceMetrics.networkRequests++;

  // Route requests to appropriate cache strategy
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImage(url)) {
    event.respondWith(handleImage(request));
  } else if (isAPI(url)) {
    event.respondWith(handleAPI(request));
  } else if (isNavigation(request)) {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(handleDefault(request));
  }
});

/**
 * Handle static assets (CSS, JS, fonts)
 * Strategy: Cache First with fallback
 */
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      performanceMetrics.cacheHits++;

      // Update cache in background if resource is stale
      updateCacheInBackground(request, cache);

      return cachedResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }

    performanceMetrics.cacheMisses++;
    return networkResponse;
  } catch (error) {
    console.error("Static asset fetch failed:", error);
    performanceMetrics.offlineRequests++;

    // Return offline fallback if available
    return getOfflineFallback(request);
  }
}

/**
 * Handle images
 * Strategy: Cache First with WebP optimization
 */
async function handleImage(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      return cachedResponse;
    }

    // Fetch and optimize image
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache original response
      await cache.put(request, networkResponse.clone());

      // TODO: Implement WebP conversion for better compression
      // This would require additional processing
    }

    performanceMetrics.cacheMisses++;
    return networkResponse;
  } catch (error) {
    console.error("Image fetch failed:", error);
    performanceMetrics.offlineRequests++;

    // Return placeholder image
    return getImagePlaceholder();
  }
}

/**
 * Handle API requests
 * Strategy: Network First with cache fallback
 */
async function handleAPI(request) {
  try {
    const cache = await caches.open(API_CACHE);

    // Try network first
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        // Cache successful responses
        await cache.put(request, networkResponse.clone());
        return networkResponse;
      }
    } catch (networkError) {
      console.warn("Network request failed, trying cache:", networkError);
    }

    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      performanceMetrics.cacheHits++;

      // Add stale indicator header
      const response = cachedResponse.clone();
      response.headers.set("X-Cache-Status", "stale");

      return response;
    }

    performanceMetrics.cacheMisses++;
    throw new Error("No cache available");
  } catch (error) {
    console.error("API fetch failed:", error);
    performanceMetrics.offlineRequests++;

    // Return offline API response
    return getOfflineAPIResponse(request);
  }
}

/**
 * Handle navigation requests
 * Strategy: Network First with offline fallback
 */
async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (networkError) {
    console.warn("Navigation network request failed:", networkError);
  }

  // Fallback to cache
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      return cachedResponse;
    }
  } catch (cacheError) {
    console.error("Cache lookup failed:", cacheError);
  }

  // Final fallback to offline page
  performanceMetrics.offlineRequests++;
  return getOfflinePage();
}

/**
 * Handle default requests
 * Strategy: Stale While Revalidate
 */
async function handleDefault(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);

    // Return cached response immediately if available
    if (cachedResponse) {
      performanceMetrics.cacheHits++;

      // Update cache in background
      updateCacheInBackground(request, cache);

      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }

    performanceMetrics.cacheMisses++;
    return networkResponse;
  } catch (error) {
    console.error("Default fetch failed:", error);
    performanceMetrics.offlineRequests++;

    return new Response("Offline", { status: 503 });
  }
}

/**
 * Update cache in background
 */
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    console.warn("Background cache update failed:", error);
  }
}

/**
 * Utility functions
 */
function isStaticAsset(url) {
  return (
    url.pathname.includes("/_next/static/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".ttf")
  );
}

function isImage(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i);
}

function isAPI(url) {
  return (
    url.pathname.startsWith("/api/") ||
    CACHEABLE_APIS.some((api) => url.pathname.startsWith(api))
  );
}

function isNavigation(request) {
  return request.mode === "navigate";
}

function getOfflineFallback(request) {
  if (request.destination === "document") {
    return getOfflinePage();
  } else if (request.destination === "image") {
    return getImagePlaceholder();
  }

  return new Response("Offline", { status: 503 });
}

function getOfflinePage() {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        .offline-container {
          border: 4px solid #fff;
          padding: 2rem;
          max-width: 400px;
        }
        h1 {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
        .accent {
          color: #ffff00;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>You're <span class="accent">Offline</span></h1>
        <p>This page isn't available offline. Please check your connection and try again.</p>
        <button onclick="window.location.reload()" style="
          background: #ffff00;
          color: #000;
          border: 4px solid #fff;
          padding: 1rem 2rem;
          font-family: inherit;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 1rem;
        ">Retry</button>
      </div>
    </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}

function getImagePlaceholder() {
  // Return a simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#fff" font-family="monospace">
        Image Unavailable
      </text>
    </svg>
  `;

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}

function getOfflineAPIResponse(request) {
  const url = new URL(request.url);

  // Return appropriate offline responses for different APIs
  if (url.pathname.includes("/projects")) {
    return new Response(
      JSON.stringify({
        projects: [],
        message: "Projects unavailable offline",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (url.pathname.includes("/blog")) {
    return new Response(
      JSON.stringify({
        posts: [],
        message: "Blog posts unavailable offline",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: "Service unavailable offline",
    }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Message handling for cache management
 */
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "GET_PERFORMANCE_METRICS":
      event.ports[0].postMessage(performanceMetrics);
      break;

    case "CLEAR_CACHE":
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case "PRELOAD_ROUTES":
      preloadRoutes(payload.routes).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log("All caches cleared");
  } catch (error) {
    console.error("Failed to clear caches:", error);
  }
}

/**
 * Preload routes
 */
async function preloadRoutes(routes) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const preloadPromises = routes.map(async (route) => {
      try {
        const response = await fetch(route);
        if (response.ok) {
          await cache.put(route, response);
        }
      } catch (error) {
        console.warn(`Failed to preload ${route}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log("Routes preloaded:", routes);
  } catch (error) {
    console.error("Failed to preload routes:", error);
  }
}

/**
 * Periodic cache cleanup
 */
setInterval(
  async () => {
    try {
      // Clean up old runtime cache entries
      const cache = await caches.open(RUNTIME_CACHE);
      const requests = await cache.keys();

      // Remove entries older than 24 hours
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get("date");
          if (dateHeader && new Date(dateHeader).getTime() < cutoff) {
            await cache.delete(request);
          }
        }
      }
    } catch (error) {
      console.error("Cache cleanup failed:", error);
    }
  },
  60 * 60 * 1000
); // Run every hour

console.log("Service Worker loaded successfully");
