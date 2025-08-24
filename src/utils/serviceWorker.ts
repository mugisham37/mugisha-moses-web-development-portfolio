"use client";

// Service Worker registration and management
export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

const isLocalhost = Boolean(
  typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "[::1]" ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      ))
);

export function registerServiceWorker(config?: ServiceWorkerConfig) {
  if (typeof window === "undefined") {
    return;
  }

  if ("serviceWorker" in navigator) {
    const publicUrl = new URL(
      process.env.PUBLIC_URL || "",
      window.location.href
    );

    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = "/sw.js";

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "[SW] This web app is being served cache-first by a service worker."
          );
        });
      } else {
        registerValidServiceWorker(swUrl, config);
      }
    });
  }
}

function registerValidServiceWorker(
  swUrl: string,
  config?: ServiceWorkerConfig
) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("[SW] Service worker registered successfully");

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;

        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log("[SW] New content is available; please refresh.");

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log("[SW] Content is cached for offline use.");

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("[SW] Service worker registration failed:", error);

      if (config && config.onError) {
        config.onError(error);
      }
    });
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");

      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidServiceWorker(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "[SW] No internet connection found. App is running in offline mode."
      );
    });
}

export function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log("[SW] Service worker unregistered");
      })
      .catch((error) => {
        console.error("[SW] Service worker unregistration failed:", error);
      });
  }
}

// Service Worker update notification
export function showUpdateAvailableNotification() {
  if (typeof window === "undefined") return;

  const notification = document.createElement("div");
  notification.className = "sw-update-notification";
  notification.innerHTML = `
    <div class="sw-update-content">
      <h3>UPDATE AVAILABLE</h3>
      <p>A new version of the portfolio is available.</p>
      <div class="sw-update-actions">
        <button id="sw-update-btn" class="brutal-button brutal-button--primary">
          UPDATE NOW
        </button>
        <button id="sw-dismiss-btn" class="brutal-button brutal-button--secondary">
          DISMISS
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Handle update button click
  const updateBtn = document.getElementById("sw-update-btn");
  const dismissBtn = document.getElementById("sw-dismiss-btn");

  updateBtn?.addEventListener("click", () => {
    window.location.reload();
  });

  dismissBtn?.addEventListener("click", () => {
    document.body.removeChild(notification);
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 10000);
}

// Background sync for offline form submissions
export function registerBackgroundSync(tag: string, data?: any) {
  if (
    "serviceWorker" in navigator &&
    "sync" in window.ServiceWorkerRegistration.prototype
  ) {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.sync.register(tag);
      })
      .catch((error) => {
        console.error("[SW] Background sync registration failed:", error);
      });
  }
}

// Push notification subscription
export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("[SW] Push notifications not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    console.log("[SW] Push notification subscription successful");
    return subscription;
  } catch (error) {
    console.error("[SW] Push notification subscription failed:", error);
    return null;
  }
}

// Cache management utilities
export async function clearCache() {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log("[SW] All caches cleared");
  }
}

export async function getCacheSize() {
  if (
    "caches" in window &&
    "storage" in navigator &&
    "estimate" in navigator.storage
  ) {
    const estimate = await navigator.storage.estimate();
    return {
      quota: estimate.quota,
      usage: estimate.usage,
      usageDetails: estimate.usageDetails,
    };
  }
  return null;
}

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  showUpdateAvailableNotification,
  registerBackgroundSync,
  subscribeToPushNotifications,
  clearCache,
  getCacheSize,
};
