"use client";

interface ImagePerformanceMetrics {
  src: string;
  loadTime: number;
  renderTime: number;
  fileSize?: number;
  dimensions: {
    natural: { width: number; height: number };
    rendered: { width: number; height: number };
  };
  format: string;
  quality: number;
  isLazyLoaded: boolean;
  isAboveTheFold: boolean;
  cacheHit: boolean;
  errorCount: number;
  retryCount: number;
}

interface ImagePerformanceReport {
  totalImages: number;
  averageLoadTime: number;
  slowestImage: ImagePerformanceMetrics | null;
  fastestImage: ImagePerformanceMetrics | null;
  errorRate: number;
  cacheHitRate: number;
  lazyLoadedCount: number;
  aboveTheFoldCount: number;
  totalDataTransferred: number;
  recommendations: string[];
}

class ImagePerformanceMonitor {
  private metrics = new Map<string, ImagePerformanceMetrics>();
  private observers = new Map<string, PerformanceObserver>();
  private isEnabled = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.isEnabled = true;
      this.initializePerformanceObserver();
    }
  }

  /**
   * Start monitoring an image
   */
  startMonitoring(
    src: string,
    options: {
      isLazyLoaded?: boolean;
      isAboveTheFold?: boolean;
      quality?: number;
      format?: string;
    } = {}
  ): void {
    if (!this.isEnabled) return;

    const {
      isLazyLoaded = false,
      isAboveTheFold = false,
      quality = 85,
      format = "jpg",
    } = options;

    const startTime = performance.now();

    const metrics: ImagePerformanceMetrics = {
      src,
      loadTime: 0,
      renderTime: 0,
      dimensions: {
        natural: { width: 0, height: 0 },
        rendered: { width: 0, height: 0 },
      },
      format,
      quality,
      isLazyLoaded,
      isAboveTheFold,
      cacheHit: false,
      errorCount: 0,
      retryCount: 0,
    };

    this.metrics.set(src, metrics);

    // Monitor resource timing
    this.monitorResourceTiming(src, startTime);
  }

  /**
   * Record image load completion
   */
  recordImageLoad(
    src: string,
    img: HTMLImageElement,
    loadTime: number,
    fromCache: boolean = false
  ): void {
    if (!this.isEnabled) return;

    const metrics = this.metrics.get(src);
    if (!metrics) return;

    metrics.loadTime = loadTime;
    metrics.cacheHit = fromCache;
    metrics.dimensions.natural = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
    metrics.dimensions.rendered = {
      width: img.width,
      height: img.height,
    };

    this.metrics.set(src, metrics);
  }

  /**
   * Record image render completion
   */
  recordImageRender(src: string, renderTime: number): void {
    if (!this.isEnabled) return;

    const metrics = this.metrics.get(src);
    if (!metrics) return;

    metrics.renderTime = renderTime;
    this.metrics.set(src, metrics);
  }

  /**
   * Record image error
   */
  recordImageError(src: string): void {
    if (!this.isEnabled) return;

    const metrics = this.metrics.get(src);
    if (!metrics) return;

    metrics.errorCount++;
    this.metrics.set(src, metrics);
  }

  /**
   * Record image retry
   */
  recordImageRetry(src: string): void {
    if (!this.isEnabled) return;

    const metrics = this.metrics.get(src);
    if (!metrics) return;

    metrics.retryCount++;
    this.metrics.set(src, metrics);
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): ImagePerformanceReport {
    const metricsArray = Array.from(this.metrics.values());

    if (metricsArray.length === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        slowestImage: null,
        fastestImage: null,
        errorRate: 0,
        cacheHitRate: 0,
        lazyLoadedCount: 0,
        aboveTheFoldCount: 0,
        totalDataTransferred: 0,
        recommendations: [],
      };
    }

    const totalImages = metricsArray.length;
    const loadedImages = metricsArray.filter((m) => m.loadTime > 0);
    const averageLoadTime =
      loadedImages.length > 0
        ? loadedImages.reduce((sum, m) => sum + m.loadTime, 0) /
          loadedImages.length
        : 0;

    const slowestImage = loadedImages.reduce(
      (slowest, current) =>
        current.loadTime > (slowest?.loadTime || 0) ? current : slowest,
      null as ImagePerformanceMetrics | null
    );

    const fastestImage = loadedImages.reduce(
      (fastest, current) =>
        current.loadTime < (fastest?.loadTime || Infinity) ? current : fastest,
      null as ImagePerformanceMetrics | null
    );

    const errorCount = metricsArray.reduce((sum, m) => sum + m.errorCount, 0);
    const errorRate = totalImages > 0 ? errorCount / totalImages : 0;

    const cacheHits = metricsArray.filter((m) => m.cacheHit).length;
    const cacheHitRate = totalImages > 0 ? cacheHits / totalImages : 0;

    const lazyLoadedCount = metricsArray.filter((m) => m.isLazyLoaded).length;
    const aboveTheFoldCount = metricsArray.filter(
      (m) => m.isAboveTheFold
    ).length;

    const totalDataTransferred = metricsArray.reduce((sum, m) => {
      // Estimate file size based on dimensions and quality
      const pixelCount =
        m.dimensions.natural.width * m.dimensions.natural.height;
      const estimatedSize = this.estimateFileSize(
        pixelCount,
        m.format,
        m.quality
      );
      return sum + estimatedSize;
    }, 0);

    const recommendations = this.generateRecommendations(metricsArray);

    return {
      totalImages,
      averageLoadTime,
      slowestImage,
      fastestImage,
      errorRate,
      cacheHitRate,
      lazyLoadedCount,
      aboveTheFoldCount,
      totalDataTransferred,
      recommendations,
    };
  }

  /**
   * Get metrics for specific image
   */
  getImageMetrics(src: string): ImagePerformanceMetrics | null {
    return this.metrics.get(src) || null;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    const report = this.getPerformanceReport();
    const detailedMetrics = Array.from(this.metrics.entries()).map(
      ([, metrics]) => metrics
    );

    return JSON.stringify(
      {
        report,
        detailedMetrics,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
  }

  private initializePerformanceObserver(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (
            entry.entryType === "resource" &&
            entry.name.match(/\.(jpg|jpeg|png|webp|avif|svg)$/i)
          ) {
            this.processResourceEntry(entry as PerformanceResourceTiming);
          }
        });
      });

      observer.observe({ entryTypes: ["resource"] });
    } catch (error) {
      console.warn("Failed to initialize image performance observer:", error);
    }
  }

  private monitorResourceTiming(src: string, startTime: number): void {
    // Set up a timeout to check if the resource was loaded
    setTimeout(() => {
      const entries = performance.getEntriesByName(
        src,
        "resource"
      ) as PerformanceResourceTiming[];
      if (entries.length > 0) {
        this.processResourceEntry(entries[entries.length - 1]);
      }
    }, 100);
  }

  private processResourceEntry(entry: PerformanceResourceTiming): void {
    const metrics = this.metrics.get(entry.name);
    if (!metrics) return;

    // Update file size if available
    if (entry.transferSize) {
      metrics.fileSize = entry.transferSize;
    }

    // Determine if it was a cache hit
    if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
      metrics.cacheHit = true;
    }

    this.metrics.set(entry.name, metrics);
  }

  private estimateFileSize(
    pixelCount: number,
    format: string,
    quality: number
  ): number {
    // Rough estimates based on format and quality
    const baseSize = pixelCount * 3; // 3 bytes per pixel for RGB

    switch (format.toLowerCase()) {
      case "jpg":
      case "jpeg":
        return Math.round(baseSize * (quality / 100) * 0.1);
      case "png":
        return Math.round(baseSize * 0.5);
      case "webp":
        return Math.round(baseSize * (quality / 100) * 0.08);
      case "avif":
        return Math.round(baseSize * (quality / 100) * 0.05);
      default:
        return Math.round(baseSize * 0.2);
    }
  }

  private generateRecommendations(
    metrics: ImagePerformanceMetrics[]
  ): string[] {
    const recommendations: string[] = [];

    // Check average load time
    const loadedImages = metrics.filter((m) => m.loadTime > 0);
    if (loadedImages.length > 0) {
      const avgLoadTime =
        loadedImages.reduce((sum, m) => sum + m.loadTime, 0) /
        loadedImages.length;
      if (avgLoadTime > 1000) {
        recommendations.push(
          "Consider optimizing image sizes and formats to improve load times"
        );
      }
    }

    // Check for oversized images
    const oversizedImages = metrics.filter((m) => {
      const naturalPixels =
        m.dimensions.natural.width * m.dimensions.natural.height;
      const renderedPixels =
        m.dimensions.rendered.width * m.dimensions.rendered.height;
      return naturalPixels > renderedPixels * 2; // More than 2x the needed resolution
    });

    if (oversizedImages.length > 0) {
      recommendations.push(
        `${oversizedImages.length} images are larger than needed for their display size`
      );
    }

    // Check cache hit rate
    const cacheHitRate =
      metrics.filter((m) => m.cacheHit).length / metrics.length;
    if (cacheHitRate < 0.5) {
      recommendations.push(
        "Consider implementing better caching strategies for images"
      );
    }

    // Check error rate
    const errorRate =
      metrics.reduce((sum, m) => sum + m.errorCount, 0) / metrics.length;
    if (errorRate > 0.1) {
      recommendations.push(
        "High image error rate detected - check image URLs and server reliability"
      );
    }

    // Check lazy loading usage
    const lazyLoadedRate =
      metrics.filter((m) => m.isLazyLoaded).length / metrics.length;
    if (lazyLoadedRate < 0.7) {
      recommendations.push(
        "Consider lazy loading more images to improve initial page load"
      );
    }

    // Check format usage
    const modernFormats = metrics.filter((m) =>
      ["webp", "avif"].includes(m.format.toLowerCase())
    ).length;
    if (modernFormats / metrics.length < 0.5) {
      recommendations.push(
        "Consider using modern image formats (WebP, AVIF) for better compression"
      );
    }

    return recommendations;
  }
}

// Create singleton instance
export const imagePerformanceMonitor = new ImagePerformanceMonitor();

// Utility functions
export const startImageMonitoring = (
  src: string,
  options?: Parameters<ImagePerformanceMonitor["startMonitoring"]>[1]
) => imagePerformanceMonitor.startMonitoring(src, options);

export const recordImageLoad = (
  src: string,
  img: HTMLImageElement,
  loadTime: number,
  fromCache?: boolean
) => imagePerformanceMonitor.recordImageLoad(src, img, loadTime, fromCache);

export const recordImageRender = (src: string, renderTime: number) =>
  imagePerformanceMonitor.recordImageRender(src, renderTime);

export const recordImageError = (src: string) =>
  imagePerformanceMonitor.recordImageError(src);

export const recordImageRetry = (src: string) =>
  imagePerformanceMonitor.recordImageRetry(src);

export const getImagePerformanceReport = () =>
  imagePerformanceMonitor.getPerformanceReport();

export const getImageMetrics = (src: string) =>
  imagePerformanceMonitor.getImageMetrics(src);

export const clearImageMetrics = () => imagePerformanceMonitor.clearMetrics();

export const exportImageMetrics = () => imagePerformanceMonitor.exportMetrics();

// Hook for using image performance monitoring in components
export const useImagePerformanceMonitor = () => {
  return {
    startMonitoring: imagePerformanceMonitor.startMonitoring.bind(
      imagePerformanceMonitor
    ),
    recordLoad: imagePerformanceMonitor.recordImageLoad.bind(
      imagePerformanceMonitor
    ),
    recordRender: imagePerformanceMonitor.recordImageRender.bind(
      imagePerformanceMonitor
    ),
    recordError: imagePerformanceMonitor.recordImageError.bind(
      imagePerformanceMonitor
    ),
    recordImageRetry: imagePerformanceMonitor.recordImageRetry.bind(
      imagePerformanceMonitor
    ),
    getReport: imagePerformanceMonitor.getPerformanceReport.bind(
      imagePerformanceMonitor
    ),
    getMetrics: imagePerformanceMonitor.getImageMetrics.bind(
      imagePerformanceMonitor
    ),
    clearMetrics: imagePerformanceMonitor.clearMetrics.bind(
      imagePerformanceMonitor
    ),
    exportMetrics: imagePerformanceMonitor.exportMetrics.bind(
      imagePerformanceMonitor
    ),
  };
};
