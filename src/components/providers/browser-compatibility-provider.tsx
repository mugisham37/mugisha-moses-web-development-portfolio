"use client";

import { useEffect, useState } from "react";
import { initializeBrowserCompatibility } from "@/lib/browser-compatibility";
import { initializePolyfills } from "@/lib/polyfills";

interface BrowserCompatibilityProviderProps {
  children: React.ReactNode;
}

/**
 * Browser Compatibility Provider
 * Initializes browser compatibility features and polyfills
 */
export function BrowserCompatibilityProvider({
  children,
}: BrowserCompatibilityProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeCompatibility = async () => {
      try {
        // Initialize browser compatibility detection
        initializeBrowserCompatibility();

        // Initialize polyfills
        await initializePolyfills();

        // Add browser-specific optimizations
        addBrowserOptimizations();

        // Add performance monitoring
        addPerformanceMonitoring();

        if (mounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Browser compatibility initialization failed:", error);
        if (mounted) {
          setHasError(true);
          setIsInitialized(true); // Still render children even if initialization fails
        }
      }
    };

    initializeCompatibility();

    return () => {
      mounted = false;
    };
  }, []);

  // Don't block rendering while initializing
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="loading-placeholder mx-auto mb-4 h-16 w-16 rounded-full"></div>
          <p className="font-mono text-sm text-white">Initializing...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    console.warn(
      "Browser compatibility provider encountered errors but continuing..."
    );
  }

  return <>{children}</>;
}

/**
 * Add browser-specific optimizations
 */
function addBrowserOptimizations(): void {
  // Safari-specific optimizations
  if (
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome")
  ) {
    // Fix Safari flexbox bugs
    const style = document.createElement("style");
    style.textContent = `
      .safari-flex-fix {
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // iOS-specific optimizations
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    // Prevent zoom on input focus
    const viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (viewport) {
      viewport.content = viewport.content + ", user-scalable=no";
    }

    // Add iOS-specific styles
    const style = document.createElement("style");
    style.textContent = `
      /* Fix iOS viewport issues */
      body {
        -webkit-overflow-scrolling: touch;
      }
      
      /* Fix iOS input styling */
      input, textarea, select {
        -webkit-appearance: none;
        border-radius: 0;
      }
      
      /* Fix iOS button styling */
      button {
        -webkit-appearance: none;
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // Chrome-specific optimizations
  if (navigator.userAgent.includes("Chrome")) {
    // Fix Chrome autofill styles
    const style = document.createElement("style");
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px #000000 inset;
        -webkit-text-fill-color: #ffffff;
        transition: background-color 5000s ease-in-out 0s;
      }
    `;
    document.head.appendChild(style);
  }

  // Firefox-specific optimizations
  if (navigator.userAgent.includes("Firefox")) {
    // Fix Firefox outline styles
    const style = document.createElement("style");
    style.textContent = `
      button::-moz-focus-inner {
        border: 0;
        padding: 0;
      }
      
      /* Fix Firefox flexbox bugs */
      .firefox-flex-fix {
        -moz-flex-shrink: 0;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // Edge-specific optimizations
  if (navigator.userAgent.includes("Edg")) {
    const style = document.createElement("style");
    style.textContent = `
      /* Fix Edge flexbox bugs */
      .edge-flex-fix {
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // Internet Explorer specific (if still needed)
  if (
    navigator.userAgent.includes("Trident") ||
    navigator.userAgent.includes("MSIE")
  ) {
    const style = document.createElement("style");
    style.textContent = `
      /* IE11 specific fixes */
      .ie-flex-fix {
        display: -ms-flexbox;
        -ms-flex-negative: 0;
      }
      
      /* IE11 grid fallback */
      .ie-grid-fallback {
        display: -ms-grid;
      }
      
      /* IE11 object-fit fallback */
      .ie-object-fit {
        object-fit: cover;
        font-family: 'object-fit: cover;';
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Add performance monitoring
 */
function addPerformanceMonitoring(): void {
  // Core Web Vitals monitoring
  if ("PerformanceObserver" in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const entryWithProcessing = entry as PerformanceEntry & { processingStart?: number; startTime: number };
          if (entryWithProcessing.processingStart) {
            const fid = entryWithProcessing.processingStart - entryWithProcessing.startTime;
            console.log("FID:", fid);
          }
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const entryWithLayout = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!entryWithLayout.hadRecentInput && entryWithLayout.value) {
            clsValue += entryWithLayout.value;
          }
        }
        console.log("CLS:", clsValue);
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            console.log("FCP:", entry.startTime);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
    } catch (error) {
      console.warn("Performance monitoring setup failed:", error);
    }
  }

  // Memory usage monitoring (Chrome only)
  if ("memory" in performance) {
    const logMemoryUsage = () => {
      const perfWithMemory = performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      const memory = perfWithMemory.memory;
      if (memory) {
        console.log("Memory usage:", {
          used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
          total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
        });
      }
    };

    // Log memory usage every 30 seconds
    setInterval(logMemoryUsage, 30000);
  }

  // Network information monitoring
  if ("connection" in navigator) {
    const navWithConnection = navigator as Navigator & {
      connection?: {
        effectiveType: string;
        downlink: number;
        rtt: number;
        saveData: boolean;
        addEventListener: (type: string, listener: EventListener) => void;
      };
    };
    const connection = navWithConnection.connection;
    if (connection) {
      console.log("Network info:", {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });

      // Monitor network changes
      connection.addEventListener("change", () => {
        console.log("Network changed:", {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        });
      });
    }
  }

  // Page visibility monitoring
  if ("visibilityState" in document) {
    document.addEventListener("visibilitychange", () => {
      console.log("Page visibility:", document.visibilityState);
    });
  }

  // Long task monitoring
  if ("PerformanceObserver" in window) {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn("Long task detected:", entry.duration + "ms");
        }
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    } catch {
      // Long task API not supported
    }
  }
}

/**
 * Error boundary for browser compatibility issues
 */
export class BrowserCompatibilityErrorBoundary extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "BrowserCompatibilityError";
  }
}
