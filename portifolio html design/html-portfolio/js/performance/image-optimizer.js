/* ==========================================================================
   IMAGE OPTIMIZER
   WebP format with JPEG fallbacks and lazy loading system
   ========================================================================== */

/**
 * Image Optimizer Module
 * Handles WebP format detection, fallbacks, and lazy loading
 */
class ImageOptimizer {
  constructor() {
    this.supportsWebP = false;
    this.lazyImages = [];
    this.imageObserver = null;
    this.initialized = false;
  }

  /**
   * Initialize the image optimizer
   */
  async init() {
    if (this.initialized) return;

    try {
      // Detect WebP support
      await this.detectWebPSupport();

      // Initialize lazy loading
      this.initLazyLoading();

      // Process existing images
      this.processExistingImages();

      this.initialized = true;
      console.log(
        `Image optimizer initialized. WebP support: ${this.supportsWebP}`
      );
    } catch (error) {
      console.error("Failed to initialize image optimizer:", error);
    }
  }

  /**
   * Detect WebP support using canvas
   */
  async detectWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.supportsWebP = webP.height === 2;
        resolve(this.supportsWebP);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }

  /**
   * Initialize lazy loading with Intersection Observer
   */
  initLazyLoading() {
    // Check if Intersection Observer is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }

    // Create intersection observer
    const observerOptions = {
      root: null,
      rootMargin: "50px 0px",
      threshold: 0.01,
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Find and observe lazy images
    this.observeLazyImages();
  }

  /**
   * Find and observe images for lazy loading
   */
  observeLazyImages() {
    const lazyImages = document.querySelectorAll(
      'img[data-src], img[loading="lazy"]'
    );

    lazyImages.forEach((img) => {
      this.lazyImages.push(img);
      this.imageObserver.observe(img);
    });
  }

  /**
   * Process existing images for optimization
   */
  processExistingImages() {
    const images = document.querySelectorAll(
      'img:not([data-src]):not([loading="lazy"])'
    );

    images.forEach((img) => {
      this.optimizeImage(img);
    });
  }

  /**
   * Load a single image with optimization
   */
  loadImage(img) {
    // Add loading class
    img.classList.add("image-loading");

    // Get the source URL
    const src = img.dataset.src || img.src;

    // Create optimized image
    const optimizedImg = this.createOptimizedImage(src, img);

    // Handle load success
    optimizedImg.onload = () => {
      img.src = optimizedImg.src;
      img.classList.remove("image-loading");
      img.classList.add("image-loaded");

      // Remove data-src attribute
      if (img.dataset.src) {
        delete img.dataset.src;
      }

      // Trigger fade-in animation
      requestAnimationFrame(() => {
        img.classList.add("fade-in");
      });
    };

    // Handle load error
    optimizedImg.onerror = () => {
      img.classList.remove("image-loading");
      img.classList.add("image-error");

      // Try fallback image
      this.handleImageError(img, src);
    };

    // Start loading
    optimizedImg.src = this.getOptimizedSrc(src);
  }

  /**
   * Create optimized image element
   */
  createOptimizedImage(src, originalImg) {
    const img = new Image();

    // Copy important attributes
    if (originalImg.alt) img.alt = originalImg.alt;
    if (originalImg.title) img.title = originalImg.title;

    return img;
  }

  /**
   * Get optimized source URL
   */
  getOptimizedSrc(src) {
    if (!this.supportsWebP) {
      return src;
    }

    // Convert to WebP if supported
    const webpSrc = this.convertToWebP(src);
    return webpSrc || src;
  }

  /**
   * Convert image source to WebP format
   */
  convertToWebP(src) {
    // Check if already WebP
    if (src.includes(".webp")) {
      return src;
    }

    // Convert common formats to WebP
    const webpSrc = src
      .replace(/\.(jpg|jpeg|png)$/i, ".webp")
      .replace(/\.(jpg|jpeg|png)\?/i, ".webp?");

    return webpSrc !== src ? webpSrc : null;
  }

  /**
   * Handle image loading errors
   */
  handleImageError(img, originalSrc) {
    // Try JPEG fallback if WebP failed
    if (this.supportsWebP && originalSrc.includes(".webp")) {
      const fallbackSrc = originalSrc.replace(".webp", ".jpg");

      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        img.src = fallbackSrc;
        img.classList.add("image-loaded");
      };
      fallbackImg.onerror = () => {
        this.showImagePlaceholder(img);
      };
      fallbackImg.src = fallbackSrc;
    } else {
      this.showImagePlaceholder(img);
    }
  }

  /**
   * Show placeholder for failed images
   */
  showImagePlaceholder(img) {
    img.src =
      "data:image/svg+xml;base64," +
      btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#333333"/>
        <text x="200" y="150" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="14">
          IMAGE UNAVAILABLE
        </text>
      </svg>
    `);
    img.classList.add("image-placeholder");
  }

  /**
   * Optimize existing image
   */
  optimizeImage(img) {
    // Add responsive attributes if missing
    if (!img.loading) {
      img.loading = "lazy";
    }

    // Add decoding attribute for better performance
    if (!img.decoding) {
      img.decoding = "async";
    }

    // Add fetchpriority for above-the-fold images
    if (this.isAboveFold(img)) {
      img.fetchPriority = "high";
      img.loading = "eager";
    }
  }

  /**
   * Check if image is above the fold
   */
  isAboveFold(img) {
    const rect = img.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return rect.top < viewportHeight;
  }

  /**
   * Load all images immediately (fallback)
   */
  loadAllImages() {
    const lazyImages = document.querySelectorAll("img[data-src]");

    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      delete img.dataset.src;
      img.classList.add("image-loaded");
    });
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages(imageSources) {
    imageSources.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = this.getOptimizedSrc(src);
      link.fetchPriority = "high";

      document.head.appendChild(link);
    });
  }

  /**
   * Create responsive image with multiple sources
   */
  createResponsiveImage(config) {
    const picture = document.createElement("picture");

    // Add WebP sources if supported
    if (this.supportsWebP && config.webp) {
      Object.entries(config.webp).forEach(([breakpoint, src]) => {
        const source = document.createElement("source");
        source.media = `(min-width: ${breakpoint}px)`;
        source.srcset = src;
        source.type = "image/webp";
        picture.appendChild(source);
      });
    }

    // Add fallback sources
    if (config.fallback) {
      Object.entries(config.fallback).forEach(([breakpoint, src]) => {
        const source = document.createElement("source");
        source.media = `(min-width: ${breakpoint}px)`;
        source.srcset = src;
        picture.appendChild(source);
      });
    }

    // Add img element
    const img = document.createElement("img");
    img.src = config.src;
    img.alt = config.alt || "";
    img.loading = config.loading || "lazy";
    img.decoding = "async";

    if (config.class) {
      img.className = config.class;
    }

    picture.appendChild(img);

    return picture;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }

    this.lazyImages = [];
    this.initialized = false;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ImageOptimizer;
} else {
  window.ImageOptimizer = ImageOptimizer;
}
