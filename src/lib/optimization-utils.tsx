/**
 * Performance optimization utilities for production deployment
 */

import React from "react";
import { unstable_cache } from "next/cache";
import { db } from "./db";
import { CACHE_DURATIONS, CACHE_TAGS } from "./cache";

// Lazy loading utilities
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <React.Suspense
        fallback={fallback ? React.createElement(fallback) : null}
      >
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

// Code splitting for large components
export const LazyComponents = {
  AdminDashboard: createLazyComponent(
    () => import("@/components/admin/admin-analytics-dashboard")
  ),
  BlogEditor: createLazyComponent(
    () => import("@/components/admin/blog-editor")
  ),
  ProjectEditor: createLazyComponent(
    () => import("@/components/admin/project-editor")
  ),
  ThreeBackground: createLazyComponent(
    () => import("@/components/three/three-background")
  ),
  TestimonialCarousel: createLazyComponent(
    () => import("@/components/testimonials/testimonial-carousel")
  ),
};

// Database query optimization
export class QueryOptimizer {
  // Batch database queries to reduce round trips
  static async batchQueries<T extends Record<string, any>>(
    queries: Record<keyof T, () => Promise<any>>
  ): Promise<T> {
    const entries = Object.entries(queries);
    const promises = entries.map(([key, queryFn]) =>
      queryFn().then((result) => [key, result])
    );

    const results = await Promise.allSettled(promises);
    const data = {} as T;

    results.forEach((result, index) => {
      const [key] = entries[index];
      if (result.status === "fulfilled") {
        data[key as keyof T] = result.value[1];
      } else {
        console.error(`Query failed for ${key}:`, result.reason);
        data[key as keyof T] = null;
      }
    });

    return data;
  }

  // Optimized project queries with proper indexing
  static async getOptimizedProjects(
    filters: {
      featured?: boolean;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { featured, status, limit = 10, offset = 0 } = filters;

    return unstable_cache(
      async () => {
        const where: any = {};
        if (featured !== undefined) where.featured = featured;
        if (status) where.status = status;

        const [projects, total] = await Promise.all([
          db.project.findMany({
            where,
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              thumbnail: true,
              technologies: true,
              githubUrl: true,
              liveUrl: true,
              featured: true,
              viewCount: true,
              createdAt: true,
              publishedAt: true,
            },
            orderBy: [
              { featured: "desc" },
              { publishedAt: "desc" },
              { createdAt: "desc" },
            ],
            take: limit,
            skip: offset,
          }),
          db.project.count({ where }),
        ]);

        return { projects, total };
      },
      [`projects-${JSON.stringify(filters)}`],
      {
        tags: [CACHE_TAGS.PROJECTS],
        revalidate: CACHE_DURATIONS.MEDIUM,
      }
    )();
  }

  // Optimized blog queries
  static async getOptimizedBlogPosts(
    filters: {
      featured?: boolean;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { featured, status = "PUBLISHED", limit = 10, offset = 0 } = filters;

    return unstable_cache(
      async () => {
        const where: any = { status };
        if (featured !== undefined) where.featured = featured;

        const [posts, total] = await Promise.all([
          db.blogPost.findMany({
            where,
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              ogImage: true,
              featured: true,
              viewCount: true,
              readingTime: true,
              publishedAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
            take: limit,
            skip: offset,
          }),
          db.blogPost.count({ where }),
        ]);

        return { posts, total };
      },
      [`blog-posts-${JSON.stringify(filters)}`],
      {
        tags: [CACHE_TAGS.BLOG_POSTS],
        revalidate: CACHE_DURATIONS.MEDIUM,
      }
    )();
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static getOptimizedImageProps(
    src: string,
    alt: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      priority?: boolean;
      sizes?: string;
    } = {}
  ) {
    const {
      width = 800,
      height = 600,
      quality = 85,
      priority = false,
      sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    } = options;

    return {
      src,
      alt,
      width,
      height,
      quality,
      priority,
      sizes,
      placeholder: "blur" as const,
      blurDataURL:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
    };
  }

  static generateSrcSet(
    src: string,
    widths: number[] = [640, 750, 828, 1080, 1200, 1920]
  ) {
    return widths.map((width) => `${src}?w=${width}&q=75 ${width}w`).join(", ");
  }
}

// Bundle optimization utilities
export class BundleOptimizer {
  // Dynamic imports for heavy libraries
  static async loadThreeJS() {
    const [THREE, { Canvas }, { OrbitControls }] = await Promise.all([
      import("three"),
      import("@react-three/fiber"),
      import("@react-three/drei"),
    ]);

    return { THREE, Canvas, OrbitControls };
  }

  static async loadFramerMotion() {
    const { motion, AnimatePresence, useAnimation } = await import(
      "framer-motion"
    );
    return { motion, AnimatePresence, useAnimation };
  }

  static async loadChartLibrary() {
    const {
      ResponsiveContainer,
      LineChart,
      Line,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip,
    } = await import("recharts");

    return {
      ResponsiveContainer,
      LineChart,
      Line,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip,
    };
  }

  // Preload critical resources
  static preloadCriticalResources() {
    if (typeof window !== "undefined") {
      // Preload critical fonts
      const fontLink = document.createElement("link");
      fontLink.rel = "preload";
      fontLink.href = "/fonts/space-mono.woff2";
      fontLink.as = "font";
      fontLink.type = "font/woff2";
      fontLink.crossOrigin = "anonymous";
      document.head.appendChild(fontLink);

      // Preload critical images
      const heroImage = new Image();
      heroImage.src = "/images/hero-background.webp";

      // DNS prefetch for external resources
      const dnsPrefetchLinks = [
        "https://api.github.com",
        "https://utfs.io",
        "https://vercel.live",
      ];

      dnsPrefetchLinks.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "dns-prefetch";
        link.href = href;
        document.head.appendChild(link);
      });
    }
  }
}

// Performance monitoring utilities
export class PerformanceOptimizer {
  // Measure and optimize component render times
  static measureRenderTime<T extends React.ComponentType<any>>(
    Component: T,
    displayName: string
  ): T {
    const MeasuredComponent = React.forwardRef<any, React.ComponentProps<T>>(
      (props, ref) => {
        const renderStart = React.useRef<number>();

        React.useLayoutEffect(() => {
          renderStart.current = performance.now();
        });

        React.useEffect(() => {
          if (renderStart.current) {
            const renderTime = performance.now() - renderStart.current;
            if (renderTime > 16) {
              // More than one frame at 60fps
              console.warn(
                `Slow render detected for ${displayName}: ${renderTime.toFixed(2)}ms`
              );
            }
          }
        });

        return React.createElement(Component, { ...props, ref });
      }
    );

    MeasuredComponent.displayName = `Measured(${displayName})`;
    return MeasuredComponent as T;
  }

  // Optimize scroll performance
  static useOptimizedScroll(callback: () => void, deps: React.DependencyList) {
    const ticking = React.useRef(false);

    const optimizedCallback = React.useCallback(() => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          callback();
          ticking.current = false;
        });
        ticking.current = true;
      }
    }, deps);

    React.useEffect(() => {
      window.addEventListener("scroll", optimizedCallback, { passive: true });
      return () => window.removeEventListener("scroll", optimizedCallback);
    }, [optimizedCallback]);
  }

  // Intersection Observer for lazy loading
  static useIntersectionObserver(
    ref: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
  ) {
    const [isIntersecting, setIsIntersecting] = React.useState(false);

    React.useEffect(() => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
          ...options,
        }
      );

      observer.observe(ref.current);

      return () => observer.disconnect();
    }, [ref, options]);

    return isIntersecting;
  }
}

// Initialize optimizations
if (typeof window !== "undefined") {
  // Preload critical resources on page load
  BundleOptimizer.preloadCriticalResources();

  // Report performance metrics
  window.addEventListener("load", () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      console.log("Performance Metrics:", {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime,
        firstContentfulPaint: paint.find(
          (p) => p.name === "first-contentful-paint"
        )?.startTime,
      });
    }, 0);
  });
}
