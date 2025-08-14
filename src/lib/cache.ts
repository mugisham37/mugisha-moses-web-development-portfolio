// Simple in-memory cache implementation
interface CacheItem<T> {
  value: T;
  expiry: number;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
}

// Cache configuration constants
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 60 * 60 * 1000,      // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const CACHE_TAGS = {
  BLOG: 'blog',
  PROJECTS: 'projects',
  GITHUB: 'github',
  ANALYTICS: 'analytics',
  STATIC: 'static',
} as const;

class MemoryCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private maxSize: number;
  private stats: CacheStats;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.stats = {
      size: 0,
      maxSize,
      hits: 0,
      misses: 0,
    };
  }

  set<T>(key: string, value: T, ttlMs = 300000): void {
    // 5 minutes default
    // Remove expired items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    // If still full, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });

    this.stats.size = this.cache.size;
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      return false;
    }

    return true;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
    this.stats.size = this.cache.size;
  }
}

export const memoryCache = new MemoryCache(1000);

// Cache helper functions
export function cacheKey(...parts: (string | number)[]): string {
  return parts.join(":");
}

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs = 300000
): Promise<T> {
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const fresh = await fetchFn();
  memoryCache.set(key, fresh, ttlMs);
  return fresh;
}
