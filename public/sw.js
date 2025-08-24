/**
 * Service Worker for Performance Optimization and Caching
 * Implements caching strategies for better performance and offline functionality
 */

const CACHE_NAME = "brutalist-portfolio-v1";
const STATIC_CACHE = "static-cache-v1";
const DYNAMIC_CACHE = "dynamic-cache-v1";
const IMAGE_CACHE = "image-cache-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/icon.svg",
  "/apple-touch-icon.png",
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
  NETWORK_ONLY: "network-only",
  CACHE_ONLY: "cache-only",
};

// Route patterns and their cache strategies
const ROUTE_CACHE_CONFIG = [
  {
    pattern: /^https:\/\/fonts\.googleapis\.com/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
  {
    pattern: /^https:\/\/fonts\.gstatic\.com/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
  {
    pattern: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: IMAGE_CACHE,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  {
    pattern: /\.(js|css)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  {
    pattern: /^https:\/\/www\.googletagmanager\.com/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    maxAge: 60 * 60 * 24, // 1 day
  },
  {
    pattern: /^https:\/\/www\.google-analytics\.com/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    maxAge: 60 * 60 * 24, // 1 day
  },
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
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
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
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

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith("http")) {
    return;
  }

  // Find matching cache configuration
  const cacheConfig = ROUTE_CACHE_CONFIG.find((config) =>
    config.pattern.test(request.url)
  );

  if (cacheConfig) {
    event.respondWith(handleCacheStrategy(request, cacheConfig));
  } else {
    // Default strategy for unmatched routes
    event.respondWith(handleNetworkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache strategy implementations
async function handleCacheStrategy(request, config) {
  switch (config.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return handleCacheFirst(request, config.cacheName, config.maxAge);

    case CACHE_STRATEGIES.NETWORK_FIRST:
      return handleNetworkFirst(request, config.cacheName, config.maxAge);

    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return handleStaleWhileRevalidate(
        request,
        config.cacheName,
        config.maxAge
      );

    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);

    case CACHE_STRATEGIES.CACHE_ONLY:
      return handleCacheOnly(request, config.cacheName);

    default:
      return handleNetworkFirst(request, config.cacheName, config.maxAge);
  }
}

// Cache First Strategy
async function handleCacheFirst(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cache is still valid
      const cacheTime = new Date(
        cachedResponse.headers.get("sw-cache-time") || 0
      );
      const now = new Date();

      if (maxAge && (now - cacheTime) / 1000 > maxAge) {
        // Cache expired, fetch new version
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            responseToCache.headers.set("sw-cache-time", now.toISOString());
            await cache.put(request, responseToCache);
            return networkResponse;
          }
        } catch (error) {
          console.warn("Network failed, serving stale cache", error);
        }
      }

      return cachedResponse;
    }

    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set("sw-cache-time", new Date().toISOString());
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.error("Cache First strategy failed", error);
    return new Response("Network error", { status: 408 });
  }
}

// Network First Strategy
async function handleNetworkFirst(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set("sw-cache-time", new Date().toISOString());
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.warn("Network failed, trying cache", error);

    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Network error and no cache available", {
      status: 408,
    });
  }
}

// Stale While Revalidate Strategy
async function handleStaleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        responseToCache.headers.set("sw-cache-time", new Date().toISOString());
        await cache.put(request, responseToCache);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.warn("Background fetch failed", error);
    });

  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cache, wait for network
  return networkResponsePromise;
}

// Cache Only Strategy
async function handleCacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  return new Response("Not found in cache", { status: 404 });
}

// Background sync for analytics
self.addEventListener("sync", (event) => {
  if (event.tag === "analytics-sync") {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    // Get stored analytics data
    const cache = await caches.open(DYNAMIC_CACHE);
    const analyticsData = await cache.match("/analytics-queue");

    if (analyticsData) {
      const data = await analyticsData.json();

      // Send queued analytics events
      for (const event of data.events) {
        try {
          await fetch("https://www.google-analytics.com/mp/collect", {
            method: "POST",
            body: JSON.stringify(event),
          });
        } catch (error) {
          console.error("Failed to sync analytics event", error);
        }
      }

      // Clear the queue
      await cache.delete("/analytics-queue");
    }
  } catch (error) {
    console.error("Analytics sync failed", error);
  }
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/icon.svg",
      badge: "/icon.svg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
      actions: [
        {
          action: "explore",
          title: "View Portfolio",
          icon: "/icon.svg",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon.svg",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
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

// Performance monitoring
self.addEventListener("fetch", (event) => {
  const startTime = performance.now();

  event.respondWith(
    handleRequest(event.request).then((response) => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Log slow requests
      if (duration > 1000) {
        console.warn(`Slow request: ${event.request.url} took ${duration}ms`);
      }

      return response;
    })
  );
});

async function handleRequest(request) {
  // Implementation would go here - this is a placeholder
  return fetch(request);
}

console.log("Service Worker: Loaded and ready");
