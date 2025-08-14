"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CodeSplitter } from "@/lib/performance-optimization";

/**
 * Dynamic Component Loader
 * Provides advanced code splitting with preloading and error boundaries
 */
interface DynamicComponentProps<T = Record<string, unknown>> {
  loader: () => Promise<{ default: React.ComponentType<T> }>;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
  preloadDelay?: number;
  props?: T;
  className?: string;
}

export function DynamicComponent<T extends React.JSX.IntrinsicAttributes = Record<string, unknown>>({
  loader,
  fallback: Fallback,
  errorFallback: ErrorFallback,
  preload = false,
  preloadDelay = 0,
  props,
  className,
}: DynamicComponentProps<T>) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const componentModule = await loader();
      setComponent(() => componentModule.default);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to load component:", err);
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (preload) {
      const timer = setTimeout(loadComponent, preloadDelay);
      return () => clearTimeout(timer);
    }
  }, [preload, preloadDelay, loadComponent]);

  useEffect(() => {
    if (!preload) {
      loadComponent();
    }
  }, [preload, loadComponent]);

  if (error && ErrorFallback) {
    return <ErrorFallback error={error} retry={loadComponent} />;
  }

  if (error) {
    return (
      <div
        className={`border-4 border-red-500 bg-red-900 p-4 text-white ${className}`}
      >
        <h3 className="mb-2 font-mono font-bold uppercase">Component Error</h3>
        <p className="mb-4 text-sm">{error.message}</p>
        <button
          onClick={loadComponent}
          className="border-2 border-white bg-red-500 px-4 py-2 font-mono font-bold text-white uppercase transition-colors hover:bg-red-400"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    if (Fallback) {
      return <Fallback />;
    }

    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center justify-center border-4 border-gray-600 bg-gray-800 p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!Component) {
    return null;
  }

  return <Component {...(props as T)} />;
}

/**
 * Lazy Section Component
 * Loads sections only when they come into view
 */
interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  preload?: boolean;
}

export function LazySection({
  children,
  fallback: Fallback,
  rootMargin = "100px",
  threshold = 0.1,
  className = "",
  preload = false,
}: LazySectionProps) {
  const [shouldRender, setShouldRender] = useState(preload);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preload) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          // Small delay to improve performance
          setTimeout(() => setShouldRender(true), 50);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, preload]);

  return (
    <div ref={ref} className={className}>
      {shouldRender ? (
        children
      ) : (
        <div className="flex min-h-[200px] items-center justify-center">
          {Fallback ? (
            <Fallback />
          ) : (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Route Preloader Component
 * Preloads routes on hover or intersection
 */
interface RoutePreloaderProps {
  href: string;
  children: React.ReactNode;
  preloadOn?: "hover" | "visible" | "immediate";
  className?: string;
}

export function RoutePreloader({
  href,
  children,
  preloadOn = "hover",
  className = "",
}: RoutePreloaderProps) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const preloadRoute = useCallback(() => {
    if (isPreloaded) return;

    // Preload the route
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);

    setIsPreloaded(true);
  }, [isPreloaded, href]);

  useEffect(() => {
    if (preloadOn === "immediate") {
      preloadRoute();
    } else if (preloadOn === "visible") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            preloadRoute();
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }
  }, [preloadOn, href, preloadRoute]);

  const handleMouseEnter = () => {
    if (preloadOn === "hover") {
      preloadRoute();
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
    >
      {children}
    </div>
  );
}

/**
 * Bundle Splitter Component
 * Splits large components into smaller chunks
 */
interface BundleSplitterProps {
  components: Array<{
    name: string;
    loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>;
    props?: Record<string, unknown>;
    priority?: number;
  }>;
  fallback?: React.ComponentType;
  className?: string;
}

export function BundleSplitter({
  components,
  fallback: Fallback,
  className = "",
}: BundleSplitterProps) {
  const [loadedComponents, setLoadedComponents] = useState<
    Map<string, React.ComponentType<Record<string, unknown>>>
  >(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(
    new Map()
  );

  // Sort components by priority
  const sortedComponents = [...components].sort(
    (a, b) => (b.priority || 0) - (a.priority || 0)
  );

  useEffect(() => {
    const loadComponents = async () => {
      for (const component of sortedComponents) {
        try {
          setLoadingStates((prev) => new Map(prev).set(component.name, true));

          const componentModule = await component.loader();

          setLoadedComponents((prev) =>
            new Map(prev).set(component.name, componentModule.default)
          );
          setLoadingStates((prev) => {
            const newMap = new Map(prev);
            newMap.delete(component.name);
            return newMap;
          });

          // Small delay between loads to prevent blocking
          await new Promise((resolve) => setTimeout(resolve, 10));
        } catch (error) {
          console.error(`Failed to load component ${component.name}:`, error);
          setLoadingStates((prev) => {
            const newMap = new Map(prev);
            newMap.delete(component.name);
            return newMap;
          });
        }
      }
    };

    loadComponents();
  }, [sortedComponents]);

  return (
    <div className={className}>
      {sortedComponents.map((component) => {
        const Component = loadedComponents.get(component.name);
        const isLoading = loadingStates.get(component.name);

        if (isLoading) {
          return (
            <div key={component.name} className="animate-pulse">
              {Fallback ? (
                <Fallback />
              ) : (
                <div className="mb-4 border-4 border-gray-600 bg-gray-800 p-4">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
                </div>
              )}
            </div>
          );
        }

        if (Component) {
          return <Component key={component.name} {...component.props} />;
        }

        return null;
      })}
    </div>
  );
}

/**
 * Performance Monitor Component
 * Monitors and displays component loading performance
 */
interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  showMetrics?: boolean;
}

export function PerformanceMonitor({
  componentName,
  children,
  showMetrics = process.env.NODE_ENV === "development",
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    renderTime: number;
  } | null>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const endTime = Date.now();
    const loadTime = endTime - startTime.current;

    // Measure render time
    const renderStart = performance.now();
    requestAnimationFrame(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;

      setMetrics({ loadTime, renderTime });

      // Log performance metrics
      if (showMetrics) {
        console.log(`Component ${componentName} metrics:`, {
          loadTime: `${loadTime}ms`,
          renderTime: `${renderTime.toFixed(2)}ms`,
        });
      }
    });
  }, [componentName, showMetrics]);

  return (
    <div className="relative">
      {children}
      {showMetrics && metrics && (
        <div className="bg-opacity-75 absolute top-2 right-2 rounded bg-black px-2 py-1 font-mono text-xs text-white">
          L: {metrics.loadTime}ms | R: {metrics.renderTime.toFixed(1)}ms
        </div>
      )}
    </div>
  );
}

// Export lazy loading utilities
export const createLazyComponent = CodeSplitter.createLazyComponent;
export const preloadComponent = CodeSplitter.preloadComponent;
