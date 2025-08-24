interface PreloadImageOptions {
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

interface PreloadedImage {
  src: string;
  width?: number;
  height?: number;
  loaded: boolean;
  error: boolean;
}

class ImagePreloader {
  private cache = new Map<string, PreloadedImage>();
  private loadingPromises = new Map<string, Promise<PreloadedImage>>();

  /**
   * Preload a single image
   */
  async preloadImage(
    src: string,
    options: PreloadImageOptions = {}
  ): Promise<PreloadedImage> {
    // Check if already cached
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Start loading
    const loadPromise = this.loadImagePromise(src, options);
    this.loadingPromises.set(src, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(src, result);
      this.loadingPromises.delete(src);
      return result;
    } catch (error) {
      this.loadingPromises.delete(src);
      const errorResult: PreloadedImage = {
        src,
        loaded: false,
        error: true,
      };
      this.cache.set(src, errorResult);
      return errorResult;
    }
  }

  /**
   * Preload multiple images
   */
  async preloadImages(
    sources: Array<{ src: string; options?: PreloadImageOptions }>
  ): Promise<PreloadedImage[]> {
    const promises = sources.map(({ src, options }) =>
      this.preloadImage(src, options)
    );

    return Promise.all(promises);
  }

  /**
   * Preload images with priority queue
   */
  async preloadWithPriority(
    highPriority: string[],
    lowPriority: string[] = [],
    options: PreloadImageOptions = {}
  ): Promise<{
    highPriority: PreloadedImage[];
    lowPriority: PreloadedImage[];
  }> {
    // Load high priority images first
    const highPriorityResults = await this.preloadImages(
      highPriority.map((src) => ({
        src,
        options: { ...options, priority: true },
      }))
    );

    // Load low priority images after high priority ones
    const lowPriorityResults = await this.preloadImages(
      lowPriority.map((src) => ({
        src,
        options: { ...options, priority: false },
      }))
    );

    return {
      highPriority: highPriorityResults,
      lowPriority: lowPriorityResults,
    };
  }

  /**
   * Get cached image info
   */
  getCachedImage(src: string): PreloadedImage | null {
    return this.cache.get(src) || null;
  }

  /**
   * Check if image is loaded
   */
  isImageLoaded(src: string): boolean {
    const cached = this.cache.get(src);
    return cached ? cached.loaded : false;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Remove specific image from cache
   */
  removeFromCache(src: string): void {
    this.cache.delete(src);
    this.loadingPromises.delete(src);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalImages: number;
    loadedImages: number;
    errorImages: number;
    loadingImages: number;
  } {
    const totalImages = this.cache.size;
    let loadedImages = 0;
    let errorImages = 0;

    this.cache.forEach((image) => {
      if (image.loaded) loadedImages++;
      if (image.error) errorImages++;
    });

    return {
      totalImages,
      loadedImages,
      errorImages,
      loadingImages: this.loadingPromises.size,
    };
  }

  private loadImagePromise(
    src: string,
    options: PreloadImageOptions
  ): Promise<PreloadedImage> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          loaded: true,
          error: false,
        });
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Set loading attributes for better performance
      if (options.priority) {
        img.loading = "eager";
        img.fetchPriority = "high";
      } else {
        img.loading = "lazy";
        img.fetchPriority = "low";
      }

      // Start loading
      img.src = src;
    });
  }
}

// Create singleton instance
export const imagePreloader = new ImagePreloader();

// Utility functions
export const preloadImage = (src: string, options?: PreloadImageOptions) =>
  imagePreloader.preloadImage(src, options);

export const preloadImages = (
  sources: Array<{ src: string; options?: PreloadImageOptions }>
) => imagePreloader.preloadImages(sources);

export const preloadCriticalImages = (images: string[]) =>
  imagePreloader.preloadWithPriority(images);

export const isImageCached = (src: string) => imagePreloader.isImageLoaded(src);

export const getCachedImage = (src: string) =>
  imagePreloader.getCachedImage(src);

// Hook for using image preloader in components
export const useImagePreloader = () => {
  return {
    preloadImage: imagePreloader.preloadImage.bind(imagePreloader),
    preloadImages: imagePreloader.preloadImages.bind(imagePreloader),
    preloadWithPriority:
      imagePreloader.preloadWithPriority.bind(imagePreloader),
    getCachedImage: imagePreloader.getCachedImage.bind(imagePreloader),
    isImageLoaded: imagePreloader.isImageLoaded.bind(imagePreloader),
    clearCache: imagePreloader.clearCache.bind(imagePreloader),
    getCacheStats: imagePreloader.getCacheStats.bind(imagePreloader),
  };
};
