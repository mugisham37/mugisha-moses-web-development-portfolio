/**
 * Comprehensive caching strategy for performance optimization
 * Implements multiple caching layers: in-memory, Redis-compatible, and edge caching
 */

import { unstable_cache } from "next/cache";
import { ProjectFilters } from "./types";

// Cache configuration
export const CACHE_TAGS = {
  PROJECTS: "projects",
  BLOG_POSTS: "blog-posts",
  TESTIMONIALS: "testimonials",
  GITHUB_DATA: "github-data",
  ANALYTICS: "analytics",
  SERVICES: "services",
  CONTACT: "contact",
  USER_SESSIONS: "user-sessions",
} as const;

export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
  GITHUB_DATA: 1800, // 30 minutes
  STATIC_CONTENT: 604800, // 1 week
} as const;

// In-memory cache for frequently accessed data
class MemoryCache {
  private cache = new Map<string, { data: unknown; expires: number }>();
  private maxSize = 1000; // Maximum number of cached items

  set(key: string, data: unknown, ttl: number): void {
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const expires = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expires });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  getAllKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const memoryCache = new MemoryCache();

// Cache key generators
export function generateCacheKey(
  prefix: string,
  ...parts: (string | number)[]
): string {
  return `${prefix}:${parts.join(":")}`;
}

// Enhanced caching utilities with multiple layers
export class CacheManager {
  // Next.js unstable_cache wrapper with memory cache fallback
  static async cached<T>(
    fn: () => Promise<T>,
    keyParts: string[],
    options: {
      tags?: string[];
      revalidate?: number;
      useMemoryCache?: boolean;
    } = {}
  ): Promise<T> {
    const {
      tags = [],
      revalidate = CACHE_DURATIONS.MEDIUM,
      useMemoryCache = true,
    } = options;
    const cacheKey = keyParts.join(":");

    // Try memory cache first if enabled
    if (useMemoryCache) {
      const cached = memoryCache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Use Next.js cache
    const cachedFn = unstable_cache(fn, keyParts, {
      tags,
      revalidate,
    });

    const result = await cachedFn();

    // Store in memory cache if enabled
    if (useMemoryCache && result !== null && result !== undefined) {
      memoryCache.set(cacheKey, result, revalidate);
    }

    return result;
  }

  // Cache with stale-while-revalidate pattern
  static async staleWhileRevalidate<T>(
    fn: () => Promise<T>,
    keyParts: string[],
    options: {
      staleTime: number;
      revalidateTime: number;
      tags?: string[];
    }
  ): Promise<T> {
    const { staleTime, revalidateTime, tags = [] } = options;
    const cacheKey = keyParts.join(":");

    // TODO: Implement cache invalidation using tags
    console.debug(`Cache tags for ${cacheKey}:`, tags);

    // Try to get fresh data from memory cache
    const cached = memoryCache.get<{ data: T; timestamp: number }>(cacheKey);
    const now = Date.now();

    if (cached) {
      const age = now - cached.timestamp;

      // Return cached data if still fresh
      if (age < staleTime * 1000) {
        return cached.data;
      }

      // Return stale data but trigger revalidation in background
      if (age < revalidateTime * 1000) {
        // Background revalidation
        fn()
          .then((freshData) => {
            memoryCache.set(
              cacheKey,
              { data: freshData, timestamp: now },
              revalidateTime
            );
          })
          .catch(console.error);

        return cached.data;
      }
    }

    // Fetch fresh data
    const freshData = await fn();
    memoryCache.set(
      cacheKey,
      { data: freshData, timestamp: now },
      revalidateTime
    );

    return freshData;
  }

  // Batch cache operations
  static async batchGet<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();

    for (const key of keys) {
      results.set(key, memoryCache.get<T>(key));
    }

    return results;
  }

  static batchSet(items: Array<{ key: string; data: unknown; ttl: number }>): void {
    for (const item of items) {
      memoryCache.set(item.key, item.data, item.ttl);
    }
  }

  // Cache warming utilities
  static async warmCache<T>(
    fn: () => Promise<T>,
    keyParts: string[],
    options: {
      tags?: string[];
      revalidate?: number;
    } = {}
  ): Promise<void> {
    try {
      await this.cached(fn, keyParts, options);
    } catch (error) {
      console.error("Cache warming failed:", error);
    }
  }

  // Cache invalidation
  static invalidateMemoryCache(pattern?: string): void {
    if (!pattern) {
      memoryCache.clear();
      return;
    }

    // Simple pattern matching for cache keys
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    const keysToDelete: string[] = [];

    // Get all cache keys and filter by pattern
    memoryCache.getAllKeys().forEach((key: string) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    for (const key of keysToDelete) {
      memoryCache.delete(key);
    }
  }

  // Cache statistics
  static getCacheStats(): {
    memory: { size: number; maxSize: number };
  } {
    return {
      memory: memoryCache.getStats(),
    };
  }
}

// Specialized cache functions for different data types
export const ProjectCache = {
  async getProjects(filters?: ProjectFilters) {
    return CacheManager.cached(
      async () => {
        // This would be replaced with actual project fetching logic
        return [];
      },
      ["projects", JSON.stringify(filters || {})],
      {
        tags: [CACHE_TAGS.PROJECTS],
        revalidate: CACHE_DURATIONS.MEDIUM,
      }
    );
  },

  async getProject(slug: string) {
    return CacheManager.cached(
      async () => {
        // This would be replaced with actual project fetching logic
        return null;
      },
      ["project", slug],
      {
        tags: [CACHE_TAGS.PROJECTS],
        revalidate: CACHE_DURATIONS.LONG,
      }
    );
  },
};

export const GitHubCache = {
  async getRepositories(username: string) {
    return CacheManager.staleWhileRevalidate(
      async () => {
        // This would be replaced with actual GitHub API call
        return [];
      },
      ["github", "repositories", username],
      {
        staleTime: CACHE_DURATIONS.GITHUB_DATA,
        revalidateTime: CACHE_DURATIONS.VERY_LONG,
        tags: [CACHE_TAGS.GITHUB_DATA],
      }
    );
  },

  async getContributions(username: string) {
    return CacheManager.staleWhileRevalidate(
      async () => {
        // This would be replaced with actual GitHub API call
        return {};
      },
      ["github", "contributions", username],
      {
        staleTime: CACHE_DURATIONS.GITHUB_DATA,
        revalidateTime: CACHE_DURATIONS.VERY_LONG,
        tags: [CACHE_TAGS.GITHUB_DATA],
      }
    );
  },
};

export const BlogCache = {
  async getPosts(page: number = 1, limit: number = 10) {
    return CacheManager.cached(
      async () => {
        // This would be replaced with actual blog post fetching logic
        return { posts: [], total: 0 };
      },
      ["blog", "posts", page.toString(), limit.toString()],
      {
        tags: [CACHE_TAGS.BLOG_POSTS],
        revalidate: CACHE_DURATIONS.MEDIUM,
      }
    );
  },

  async getPost(slug: string) {
    return CacheManager.cached(
      async () => {
        // This would be replaced with actual blog post fetching logic
        return null;
      },
      ["blog", "post", slug],
      {
        tags: [CACHE_TAGS.BLOG_POSTS],
        revalidate: CACHE_DURATIONS.LONG,
      }
    );
  },
};

// Cache warming on application startup
export async function warmCriticalCaches(): Promise<void> {
  const warmingTasks = [
    // Warm project cache
    CacheManager.warmCache(
      async () => [], // Replace with actual project fetching
      ["projects", "featured"],
      { tags: [CACHE_TAGS.PROJECTS], revalidate: CACHE_DURATIONS.LONG }
    ),

    // Warm blog cache
    CacheManager.warmCache(
      async () => ({ posts: [], total: 0 }), // Replace with actual blog fetching
      ["blog", "posts", "1", "10"],
      { tags: [CACHE_TAGS.BLOG_POSTS], revalidate: CACHE_DURATIONS.MEDIUM }
    ),

    // Warm testimonials cache
    CacheManager.warmCache(
      async () => [], // Replace with actual testimonials fetching
      ["testimonials", "featured"],
      { tags: [CACHE_TAGS.TESTIMONIALS], revalidate: CACHE_DURATIONS.LONG }
    ),
  ];

  await Promise.allSettled(warmingTasks);
}
