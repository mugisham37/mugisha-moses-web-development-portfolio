"use client";

import React from "react";

// Cache busting utilities for development
export class CacheBuster {
  private static instance: CacheBuster;
  private cacheBustParam: string;

  constructor() {
    this.cacheBustParam = Date.now().toString();
  }

  static getInstance(): CacheBuster {
    if (!CacheBuster.instance) {
      CacheBuster.instance = new CacheBuster();
    }
    return CacheBuster.instance;
  }

  // Add cache busting parameter to URLs in development
  bustUrl(url: string): string {
    if (process.env.NODE_ENV !== "development") {
      return url;
    }

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}_cb=${this.cacheBustParam}`;
  }

  // Clear browser caches programmatically
  async clearCaches(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Clear service worker caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        console.log("Service worker caches cleared");
      }

      // Clear localStorage
      if ("localStorage" in window) {
        localStorage.clear();
        console.log("localStorage cleared");
      }

      // Clear sessionStorage
      if ("sessionStorage" in window) {
        sessionStorage.clear();
        console.log("sessionStorage cleared");
      }

      // Force reload without cache
      if ("location" in window) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to clear caches:", error);
    }
  }

  // Add development cache headers
  getDevHeaders(): Record<string, string> {
    if (process.env.NODE_ENV !== "development") {
      return {};
    }

    return {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ETag: this.cacheBustParam,
    };
  }

  // Refresh cache buster parameter
  refresh(): void {
    this.cacheBustParam = Date.now().toString();
  }
}

export const cacheBuster = CacheBuster.getInstance();

// React hook for cache busting
export function useCacheBuster() {
  const [bustParam, setBustParam] = React.useState(Date.now().toString());

  const refresh = React.useCallback(() => {
    const newParam = Date.now().toString();
    setBustParam(newParam);
    cacheBuster.refresh();
  }, []);

  const bustUrl = React.useCallback(
    (url: string) => {
      if (process.env.NODE_ENV !== "development") {
        return url;
      }
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}_cb=${bustParam}`;
    },
    [bustParam]
  );

  return { bustUrl, refresh, clearCaches: cacheBuster.clearCaches };
}

// Development cache clearing component
export function DevCacheClearer() {
  const { clearCaches } = useCacheBuster();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={clearCaches}
        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
        title="Clear all caches and reload"
      >
        Clear Cache
      </button>
    </div>
  );
}

export default cacheBuster;
