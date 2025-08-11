"use client";

import { useEffect, useState, useCallback } from "react";

// Offline detection hook
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Trigger reconnection logic
        window.dispatchEvent(new CustomEvent("app:reconnected"));
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      // Trigger offline logic
      window.dispatchEvent(new CustomEvent("app:offline"));
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Additional connectivity check using fetch
    const checkConnectivity = async () => {
      try {
        const response = await fetch("/api/health", {
          method: "HEAD",
          cache: "no-cache",
        });

        if (response.ok) {
          if (!isOnline) {
            handleOnline();
          }
        } else {
          if (isOnline) {
            handleOffline();
          }
        }
      } catch {
        if (isOnline) {
          handleOffline();
        }
      }
    };

    // Check connectivity every 30 seconds
    const connectivityInterval = setInterval(checkConnectivity, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(connectivityInterval);
    };
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline };
}

// Network quality detection
export function useNetworkQuality() {
  const [networkQuality, setNetworkQuality] = useState<
    "fast" | "slow" | "offline"
  >("fast");
  const [connectionType, setConnectionType] = useState<string>("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Network Information API is available
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const updateConnectionInfo = () => {
        setConnectionType(connection.effectiveType || "unknown");

        // Determine network quality based on effective connection type
        switch (connection.effectiveType) {
          case "slow-2g":
          case "2g":
            setNetworkQuality("slow");
            break;
          case "3g":
            setNetworkQuality(connection.downlink > 1.5 ? "fast" : "slow");
            break;
          case "4g":
          default:
            setNetworkQuality("fast");
            break;
        }
      };

      updateConnectionInfo();
      connection.addEventListener("change", updateConnectionInfo);

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }

    // Fallback: measure connection speed
    const measureConnectionSpeed = async () => {
      try {
        const startTime = Date.now();
        await fetch("/api/health", { method: "HEAD", cache: "no-cache" });
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (duration > 2000) {
          setNetworkQuality("slow");
        } else {
          setNetworkQuality("fast");
        }
      } catch {
        setNetworkQuality("offline");
      }
    };

    measureConnectionSpeed();
    const speedInterval = setInterval(measureConnectionSpeed, 60000); // Check every minute

    return () => clearInterval(speedInterval);
  }, []);

  return { networkQuality, connectionType };
}

// Offline storage utilities
export class OfflineStorage {
  private static readonly STORAGE_KEY = "brutalist_portfolio_offline";
  private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB

  static save<T>(key: string, data: T): boolean {
    try {
      const storage = this.getStorage();
      storage[key] = {
        data,
        timestamp: Date.now(),
        size: JSON.stringify(data).length,
      };

      // Check storage size
      const totalSize = Object.values(storage).reduce(
        (sum, item: any) => sum + item.size,
        0
      );

      if (totalSize > this.MAX_STORAGE_SIZE) {
        this.cleanup();
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
      return true;
    } catch (error) {
      console.warn("Failed to save offline data:", error);
      return false;
    }
  }

  static load<T>(key: string, maxAge: number = 24 * 60 * 60 * 1000): T | null {
    try {
      const storage = this.getStorage();
      const item = storage[key];

      if (!item) return null;

      // Check if data is too old
      if (Date.now() - item.timestamp > maxAge) {
        delete storage[key];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.warn("Failed to load offline data:", error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      const storage = this.getStorage();
      delete storage[key];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.warn("Failed to remove offline data:", error);
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear offline storage:", error);
    }
  }

  private static getStorage(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static cleanup(): void {
    try {
      const storage = this.getStorage();
      const items = Object.entries(storage).map(
        ([key, value]: [string, any]) => ({
          key,
          timestamp: value.timestamp,
          size: value.size,
        })
      );

      // Sort by timestamp (oldest first) and remove oldest items
      items.sort((a, b) => a.timestamp - b.timestamp);

      let totalSize = items.reduce((sum, item) => sum + item.size, 0);
      const targetSize = this.MAX_STORAGE_SIZE * 0.8; // Clean up to 80% of max size

      while (totalSize > targetSize && items.length > 0) {
        const oldestItem = items.shift()!;
        delete storage[oldestItem.key];
        totalSize -= oldestItem.size;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.warn("Failed to cleanup offline storage:", error);
    }
  }
}

// Offline-aware fetch wrapper
export async function offlineFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  maxAge: number = 24 * 60 * 60 * 1000
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache successful responses
    if (cacheKey) {
      OfflineStorage.save(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.warn(`Fetch failed for ${url}:`, error);

    // Try to return cached data
    if (cacheKey) {
      const cachedData = OfflineStorage.load<T>(cacheKey, maxAge);
      if (cachedData) {
        console.log(`Using cached data for ${url}`);
        return cachedData;
      }
    }

    throw error;
  }
}

// Service worker registration for offline support
export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered:", registration);

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available
              window.dispatchEvent(new CustomEvent("app:update-available"));

              // Show update notification
              showUpdateNotification(registration);
            }
          });
        }
      });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("Message from Service Worker:", event.data);

        if (event.data.type === "CACHE_UPDATED") {
          window.dispatchEvent(new CustomEvent("app:cache-updated"));
        }
      });

      // Check for waiting service worker
      if (registration.waiting) {
        showUpdateNotification(registration);
      }
    } catch (error) {
      console.warn("Service Worker registration failed:", error);
    }
  });
}

// Show update notification when new service worker is available
function showUpdateNotification(registration: ServiceWorkerRegistration): void {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 z-50 max-w-sm p-4 bg-green-900 border border-green-500 rounded";
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="text-green-400 font-bold text-sm uppercase">UPDATE AVAILABLE</h4>
        <p class="text-green-200 text-sm mt-1">A new version of the site is available.</p>
        <div class="mt-3 flex gap-2">
          <button id="update-btn" class="bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase border border-green-400 hover:bg-green-500">
            UPDATE NOW
          </button>
          <button id="dismiss-btn" class="bg-transparent text-green-400 px-3 py-1 text-xs font-bold uppercase border border-green-400 hover:bg-green-900">
            DISMISS
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Handle update button click
  const updateBtn = notification.querySelector("#update-btn");
  const dismissBtn = notification.querySelector("#dismiss-btn");

  updateBtn?.addEventListener("click", () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  });

  dismissBtn?.addEventListener("click", () => {
    notification.remove();
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
}

// Initialize service worker registration
export function initializeOfflineSupport(): void {
  registerServiceWorker();

  // Listen for app events
  window.addEventListener("app:update-available", () => {
    console.log("App update available");
  });

  window.addEventListener("app:cache-updated", () => {
    console.log("App cache updated");
  });

  window.addEventListener("app:offline", () => {
    console.log("App went offline");
  });

  window.addEventListener("app:reconnected", () => {
    console.log("App reconnected");
  });
}

// Offline notification component hook
export function useOfflineNotification() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<
    "offline" | "online"
  >("offline");

  useEffect(() => {
    if (!isOnline) {
      setNotificationType("offline");
      setShowNotification(true);
    } else if (wasOffline) {
      setNotificationType("online");
      setShowNotification(true);

      // Auto-hide online notification after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const hideNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return {
    showNotification,
    notificationType,
    isOnline,
    hideNotification,
  };
}

// Graceful degradation utilities
export const gracefulDegradation = {
  // Reduce image quality for slow connections
  getImageQuality: (networkQuality: "fast" | "slow" | "offline"): number => {
    switch (networkQuality) {
      case "slow":
        return 60;
      case "offline":
        return 0;
      default:
        return 85;
    }
  },

  // Disable animations for slow connections
  shouldUseAnimations: (
    networkQuality: "fast" | "slow" | "offline"
  ): boolean => {
    return networkQuality === "fast";
  },

  // Reduce polling frequency for slow connections
  getPollingInterval: (networkQuality: "fast" | "slow" | "offline"): number => {
    switch (networkQuality) {
      case "slow":
        return 60000; // 1 minute
      case "offline":
        return 0; // No polling
      default:
        return 30000; // 30 seconds
    }
  },

  // Lazy load content based on connection
  shouldLazyLoad: (networkQuality: "fast" | "slow" | "offline"): boolean => {
    return networkQuality !== "fast";
  },
};
