/**
 * Progressive Enhancement Utilities
 * Provides feature detection and graceful degradation for modern web features
 */

import {
  detectBrowser,
  detectFeatureSupport,
  type BrowserInfo,
  type FeatureSupport,
} from "./browser-compatibility";

/**
 * Progressive enhancement manager
 */
export class ProgressiveEnhancement {
  private static browserInfo: BrowserInfo | null = null;
  private static featureSupport: FeatureSupport | null = null;
  private static initialized = false;

  /**
   * Initialize progressive enhancement
   */
  static initialize(): void {
    if (this.initialized) return;

    this.browserInfo = detectBrowser();
    this.featureSupport = detectFeatureSupport();
    this.initialized = true;

    // Apply enhancement classes
    this.applyEnhancementClasses();

    console.log("Progressive enhancement initialized:", {
      browser: this.browserInfo,
      features: this.featureSupport,
    });
  }

  /**
   * Get browser information
   */
  static getBrowserInfo(): BrowserInfo | null {
    if (!this.initialized) this.initialize();
    return this.browserInfo;
  }

  /**
   * Get feature support information
   */
  static getFeatureSupport(): FeatureSupport | null {
    if (!this.initialized) this.initialize();
    return this.featureSupport;
  }

  /**
   * Check if a specific feature is supported
   */
  static isFeatureSupported(feature: keyof FeatureSupport): boolean {
    const support = this.getFeatureSupport();
    return support ? support[feature] : false;
  }

  /**
   * Check if browser supports modern features
   */
  static isModernBrowser(): boolean {
    const browser = this.getBrowserInfo();
    return browser ? browser.supportsModernFeatures : false;
  }

  /**
   * Apply enhancement classes to document
   */
  private static applyEnhancementClasses(): void {
    if (!this.browserInfo || !this.featureSupport) return;

    const classes: string[] = [];

    // Browser classes
    classes.push(
      `browser-${this.browserInfo.name.toLowerCase().replace(/\s+/g, "-")}`
    );
    classes.push(`engine-${this.browserInfo.engine.toLowerCase()}`);

    // Device classes
    if (this.browserInfo.isMobile) classes.push("device-mobile");
    if (this.browserInfo.isTablet) classes.push("device-tablet");
    if (this.browserInfo.isDesktop) classes.push("device-desktop");

    // Feature classes
    Object.entries(this.featureSupport).forEach(([feature, supported]) => {
      const className = feature.replace(/([A-Z])/g, "-$1").toLowerCase();
      classes.push(supported ? `supports-${className}` : `no-${className}`);
    });

    // Modern/legacy browser classes
    classes.push(
      this.browserInfo.supportsModernFeatures
        ? "modern-browser"
        : "legacy-browser"
    );

    // Apply classes
    document.documentElement.classList.add(...classes);
  }

  /**
   * Enhance element with modern features if supported
   */
  static enhance(
    element: HTMLElement,
    modernFeatures: () => void,
    fallback?: () => void
  ): void {
    if (this.isModernBrowser()) {
      try {
        modernFeatures();
      } catch (error) {
        console.warn("Modern feature enhancement failed:", error);
        if (fallback) fallback();
      }
    } else if (fallback) {
      fallback();
    }
  }

  /**
   * Conditionally apply styles based on feature support
   */
  static applyConditionalStyles(
    element: HTMLElement,
    feature: keyof FeatureSupport,
    styles: Partial<CSSStyleDeclaration>,
    fallbackStyles?: Partial<CSSStyleDeclaration>
  ): void {
    if (this.isFeatureSupported(feature)) {
      Object.assign(element.style, styles);
    } else if (fallbackStyles) {
      Object.assign(element.style, fallbackStyles);
    }
  }

  /**
   * Load resources conditionally based on browser capabilities
   */
  static async loadConditionalResource<T>(
    condition: boolean | (() => boolean),
    loader: () => Promise<T>
  ): Promise<T | null> {
    const shouldLoad =
      typeof condition === "function" ? condition() : condition;

    if (shouldLoad) {
      try {
        return await loader();
      } catch (error) {
        console.warn("Failed to load conditional resource:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Create enhanced component with fallback
   */
  static createEnhancedComponent<T extends HTMLElement>(
    tagName: string,
    enhancer: (element: T) => void,
    fallbackEnhancer?: (element: T) => void
  ): T {
    const element = document.createElement(tagName) as T;

    this.enhance(
      element,
      () => enhancer(element),
      fallbackEnhancer ? () => fallbackEnhancer(element) : undefined
    );

    return element;
  }
}

/**
 * Image format detection and optimization
 */
export class ImageOptimization {
  private static supportCache = new Map<string, boolean>();

  /**
   * Check if image format is supported
   */
  static async isFormatSupported(
    format: "webp" | "avif" | "heif"
  ): Promise<boolean> {
    if (this.supportCache.has(format)) {
      return this.supportCache.get(format)!;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    try {
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const supported = dataUrl.indexOf(`data:image/${format}`) === 0;
      this.supportCache.set(format, supported);
      return supported;
    } catch {
      this.supportCache.set(format, false);
      return false;
    }
  }

  /**
   * Get optimal image format for current browser
   */
  static async getOptimalFormat(): Promise<"avif" | "webp" | "jpeg"> {
    if (await this.isFormatSupported("avif")) return "avif";
    if (await this.isFormatSupported("webp")) return "webp";
    return "jpeg";
  }

  /**
   * Create optimized image element
   */
  static async createOptimizedImage(
    src: string,
    alt: string,
    options: {
      webpSrc?: string;
      avifSrc?: string;
      loading?: "lazy" | "eager";
      className?: string;
    } = {}
  ): Promise<HTMLImageElement | HTMLPictureElement> {
    const supportsWebp = await this.isFormatSupported("webp");
    const supportsAvif = await this.isFormatSupported("avif");

    // Use picture element for format selection if modern formats are available
    if (
      (supportsWebp && options.webpSrc) ||
      (supportsAvif && options.avifSrc)
    ) {
      const picture = document.createElement("picture");

      // AVIF source
      if (supportsAvif && options.avifSrc) {
        const avifSource = document.createElement("source");
        avifSource.srcset = options.avifSrc;
        avifSource.type = "image/avif";
        picture.appendChild(avifSource);
      }

      // WebP source
      if (supportsWebp && options.webpSrc) {
        const webpSource = document.createElement("source");
        webpSource.srcset = options.webpSrc;
        webpSource.type = "image/webp";
        picture.appendChild(webpSource);
      }

      // Fallback image
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      if (options.loading) img.loading = options.loading;
      if (options.className) img.className = options.className;

      picture.appendChild(img);
      return picture;
    }

    // Fallback to regular img element
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    if (options.loading) img.loading = options.loading;
    if (options.className) img.className = options.className;

    return img;
  }
}

/**
 * Animation enhancement utilities
 */
export class AnimationEnhancement {
  /**
   * Check if user prefers reduced motion
   */
  static prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Create animation with reduced motion fallback
   */
  static createAnimation(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
    reducedMotionFallback?: () => void
  ): Animation | null {
    if (this.prefersReducedMotion()) {
      if (reducedMotionFallback) {
        reducedMotionFallback();
      }
      return null;
    }

    if (ProgressiveEnhancement.isFeatureSupported("webAnimations")) {
      return element.animate(keyframes, options);
    }

    // Fallback to CSS transitions
    this.applyCSSTransition(element, keyframes, options);
    return null;
  }

  /**
   * Apply CSS transition as fallback for Web Animations API
   */
  private static applyCSSTransition(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ): void {
    const duration =
      typeof options.duration === "number" ? options.duration : 300;
    const easing = options.easing || "ease";

    element.style.transition = `all ${duration}ms ${easing}`;

    // Apply final keyframe styles
    if (keyframes.length > 0) {
      const finalFrame = keyframes[keyframes.length - 1];
      Object.assign(element.style, finalFrame);
    }
  }

  /**
   * Create intersection observer with fallback
   */
  static createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
    fallback?: () => void
  ): IntersectionObserver | null {
    if (ProgressiveEnhancement.isFeatureSupported("intersectionObserver")) {
      return new IntersectionObserver(callback, options);
    }

    // Fallback: trigger callback immediately
    if (fallback) {
      fallback();
    }

    return null;
  }
}

/**
 * Touch and interaction enhancement
 */
export class InteractionEnhancement {
  /**
   * Check if device supports touch
   */
  static supportsTouch(): boolean {
    return ProgressiveEnhancement.isFeatureSupported("touchEvents");
  }

  /**
   * Check if device supports hover
   */
  static supportsHover(): boolean {
    return ProgressiveEnhancement.isFeatureSupported("hoverSupport");
  }

  /**
   * Add touch-friendly event listeners
   */
  static addTouchFriendlyListener(
    element: HTMLElement,
    callback: (event: Event) => void,
    options: {
      preventDefault?: boolean;
      passive?: boolean;
    } = {}
  ): void {
    const { preventDefault = false, passive = true } = options;

    if (this.supportsTouch()) {
      // Touch events
      element.addEventListener("touchstart", callback, { passive });
      if (preventDefault) {
        element.addEventListener("touchstart", (e) => e.preventDefault(), {
          passive: false,
        });
      }
    } else {
      // Mouse events
      element.addEventListener("click", callback);
      if (this.supportsHover()) {
        element.addEventListener("mouseenter", callback);
      }
    }
  }

  /**
   * Create touch-optimized button
   */
  static createTouchOptimizedButton(
    text: string,
    onClick: () => void,
    className?: string
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.type = "button";

    // Base styles
    button.style.minHeight = "44px";
    button.style.minWidth = "44px";
    button.style.padding = "12px 16px";
    button.style.cursor = "pointer";

    if (className) {
      button.className = className;
    }

    // Touch-friendly interaction
    this.addTouchFriendlyListener(button, onClick);

    // Accessibility
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");

    return button;
  }
}

/**
 * Performance enhancement utilities
 */
export class PerformanceEnhancement {
  /**
   * Lazy load resources with intersection observer
   */
  static lazyLoad(
    elements: NodeListOf<HTMLElement> | HTMLElement[],
    callback: (element: HTMLElement) => void,
    options: IntersectionObserverInit = {}
  ): void {
    const defaultOptions = {
      rootMargin: "50px 0px",
      threshold: 0.1,
      ...options,
    };

    const observer = AnimationEnhancement.createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          }
        });
      },
      defaultOptions,
      () => {
        // Fallback: load all elements immediately
        Array.from(elements).forEach(callback);
      }
    );

    if (observer) {
      Array.from(elements).forEach((element) => {
        observer.observe(element);
      });
    }
  }

  /**
   * Preload critical resources
   */
  static preloadCriticalResources(
    resources: Array<{
      href: string;
      as: string;
      type?: string;
      crossorigin?: string;
    }>
  ): void {
    resources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource.href;
      link.as = resource.as;

      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;

      document.head.appendChild(link);
    });
  }

  /**
   * Defer non-critical JavaScript
   */
  static deferNonCriticalJS(callback: () => void, delay = 0): void {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(callback, { timeout: 5000 });
    } else {
      setTimeout(callback, delay);
    }
  }
}

// Auto-initialize progressive enhancement
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      ProgressiveEnhancement.initialize();
    });
  } else {
    ProgressiveEnhancement.initialize();
  }
}
