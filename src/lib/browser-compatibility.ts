/**
 * Browser Compatibility and Feature Detection Utilities
 * Provides comprehensive cross-browser support and progressive enhancement
 */

// Browser detection and feature support
export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsModernFeatures: boolean;
}

// Feature detection results
export interface FeatureSupport {
  // CSS Features
  cssGrid: boolean;
  cssFlexbox: boolean;
  cssCustomProperties: boolean;
  cssClipPath: boolean;
  cssBackdropFilter: boolean;
  cssContainerQueries: boolean;
  cssSubgrid: boolean;
  cssAspectRatio: boolean;
  cssLogicalProperties: boolean;

  // JavaScript Features
  es6Modules: boolean;
  asyncAwait: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  webAnimations: boolean;
  serviceWorker: boolean;
  webGL: boolean;
  webGL2: boolean;

  // Media Features
  webp: boolean;
  avif: boolean;
  heif: boolean;

  // Interaction Features
  touchEvents: boolean;
  pointerEvents: boolean;
  hoverSupport: boolean;

  // Accessibility Features
  reducedMotion: boolean;
  highContrast: boolean;
  forcedColors: boolean;
}

/**
 * Comprehensive browser detection
 */
export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // Browser detection
  let name = "Unknown";
  let version = "0";
  let engine = "Unknown";

  // Chrome
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    name = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : "0";
    engine = "Blink";
  }
  // Firefox
  else if (userAgent.includes("Firefox")) {
    name = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : "0";
    engine = "Gecko";
  }
  // Safari
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    name = "Safari";
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : "0";
    engine = "WebKit";
  }
  // Edge
  else if (userAgent.includes("Edg")) {
    name = "Edge";
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : "0";
    engine = "Blink";
  }
  // Internet Explorer
  else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
    name = "Internet Explorer";
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match ? match[1] : "0";
    engine = "Trident";
  }

  // Device detection
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet =
    /iPad|Android(?=.*Mobile)/i.test(userAgent) && window.innerWidth >= 768;
  const isDesktop = !isMobile && !isTablet;

  // Modern browser support (rough heuristic)
  const supportsModernFeatures =
    (name === "Chrome" && parseInt(version) >= 90) ||
    (name === "Firefox" && parseInt(version) >= 88) ||
    (name === "Safari" && parseInt(version) >= 14) ||
    (name === "Edge" && parseInt(version) >= 90);

  return {
    name,
    version,
    engine,
    platform,
    isMobile,
    isTablet,
    isDesktop,
    supportsModernFeatures,
  };
}

/**
 * Comprehensive feature detection
 */
export function detectFeatureSupport(): FeatureSupport {
  const support: FeatureSupport = {
    // CSS Features
    cssGrid: CSS.supports("display", "grid"),
    cssFlexbox: CSS.supports("display", "flex"),
    cssCustomProperties: CSS.supports("--custom", "property"),
    cssClipPath: CSS.supports("clip-path", "circle()"),
    cssBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
    cssContainerQueries: CSS.supports("container-type", "inline-size"),
    cssSubgrid: CSS.supports("grid-template-rows", "subgrid"),
    cssAspectRatio: CSS.supports("aspect-ratio", "16/9"),
    cssLogicalProperties: CSS.supports("margin-inline-start", "1rem"),

    // JavaScript Features
    es6Modules: "noModule" in HTMLScriptElement.prototype,
    asyncAwait: (function () {
      try {
        return (
          function () {}.constructor("return (async () => {})")()
            .constructor === (async () => {}).constructor
        );
      } catch {
        return false;
      }
    })(),
    intersectionObserver: "IntersectionObserver" in window,
    resizeObserver: "ResizeObserver" in window,
    webAnimations: "animate" in document.createElement("div"),
    serviceWorker: "serviceWorker" in navigator,
    webGL: (() => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        );
      } catch {
        return false;
      }
    })(),
    webGL2: (() => {
      try {
        const canvas = document.createElement("canvas");
        return !!canvas.getContext("webgl2");
      } catch {
        return false;
      }
    })(),

    // Media Features
    webp: (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    })(),
    avif: (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      try {
        return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
      } catch {
        return false;
      }
    })(),
    heif: false, // Not widely supported in browsers yet

    // Interaction Features
    touchEvents: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    pointerEvents: "onpointerdown" in window,
    hoverSupport: window.matchMedia("(hover: hover)").matches,

    // Accessibility Features
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    highContrast: window.matchMedia("(prefers-contrast: high)").matches,
    forcedColors: window.matchMedia("(forced-colors: active)").matches,
  };

  return support;
}

/**
 * Browser-specific CSS class generator
 */
export function generateBrowserClasses(browserInfo: BrowserInfo): string[] {
  const classes: string[] = [];

  // Browser classes
  classes.push(
    `browser-${browserInfo.name.toLowerCase().replace(/\s+/g, "-")}`
  );
  classes.push(`browser-version-${browserInfo.version}`);
  classes.push(`engine-${browserInfo.engine.toLowerCase()}`);

  // Device classes
  if (browserInfo.isMobile) classes.push("device-mobile");
  if (browserInfo.isTablet) classes.push("device-tablet");
  if (browserInfo.isDesktop) classes.push("device-desktop");

  // Feature support classes
  if (browserInfo.supportsModernFeatures) {
    classes.push("modern-browser");
  } else {
    classes.push("legacy-browser");
  }

  return classes;
}

/**
 * Feature support CSS class generator
 */
export function generateFeatureClasses(features: FeatureSupport): string[] {
  const classes: string[] = [];

  Object.entries(features).forEach(([feature, supported]) => {
    if (supported) {
      classes.push(
        `supports-${feature.replace(/([A-Z])/g, "-$1").toLowerCase()}`
      );
    } else {
      classes.push(`no-${feature.replace(/([A-Z])/g, "-$1").toLowerCase()}`);
    }
  });

  return classes;
}

/**
 * Apply browser and feature classes to document
 */
export function applyCompatibilityClasses(): void {
  const browserInfo = detectBrowser();
  const featureSupport = detectFeatureSupport();

  const browserClasses = generateBrowserClasses(browserInfo);
  const featureClasses = generateFeatureClasses(featureSupport);

  const allClasses = [...browserClasses, ...featureClasses];

  // Apply classes to document element
  document.documentElement.classList.add(...allClasses);

  // Store browser info for later use
  (window as any).__BROWSER_INFO__ = browserInfo;
  (window as any).__FEATURE_SUPPORT__ = featureSupport;
}

/**
 * Polyfill loader for missing features
 */
export async function loadPolyfills(): Promise<void> {
  const features = detectFeatureSupport();
  const polyfills: Promise<void>[] = [];

  // IntersectionObserver polyfill
  if (!features.intersectionObserver) {
    polyfills.push(
      import("intersection-observer")
        .then(() => {
          console.log("IntersectionObserver polyfill loaded");
        })
        .catch(() => {
          console.warn("Failed to load IntersectionObserver polyfill");
        })
    );
  }

  // ResizeObserver polyfill
  if (!features.resizeObserver) {
    polyfills.push(
      import("@juggle/resize-observer")
        .then(({ ResizeObserver }) => {
          (window as any).ResizeObserver = ResizeObserver;
          console.log("ResizeObserver polyfill loaded");
        })
        .catch(() => {
          console.warn("Failed to load ResizeObserver polyfill");
        })
    );
  }

  // Web Animations API polyfill
  if (!features.webAnimations) {
    polyfills.push(
      import("web-animations-js")
        .then(() => {
          console.log("Web Animations API polyfill loaded");
        })
        .catch(() => {
          console.warn("Failed to load Web Animations API polyfill");
        })
    );
  }

  // CSS Custom Properties polyfill for IE
  const browserInfo = detectBrowser();
  if (browserInfo.name === "Internet Explorer") {
    polyfills.push(
      import("css-vars-ponyfill")
        .then(({ default: cssVars }) => {
          cssVars({
            include: 'style,link[rel="stylesheet"]',
            onlyLegacy: false,
            watch: true,
          });
          console.log("CSS Custom Properties polyfill loaded");
        })
        .catch(() => {
          console.warn("Failed to load CSS Custom Properties polyfill");
        })
    );
  }

  await Promise.all(polyfills);
}

/**
 * Progressive enhancement utilities
 */
export class ProgressiveEnhancement {
  /**
   * Enhance element with modern features if supported
   */
  static enhance(
    element: HTMLElement,
    modernFeatures: () => void,
    fallback?: () => void
  ): void {
    const browserInfo = (window as any).__BROWSER_INFO__;

    if (browserInfo?.supportsModernFeatures) {
      modernFeatures();
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
    styles: Partial<CSSStyleDeclaration>
  ): void {
    const featureSupport = (window as any).__FEATURE_SUPPORT__;

    if (featureSupport?.[feature]) {
      Object.assign(element.style, styles);
    }
  }

  /**
   * Load resources conditionally based on browser capabilities
   */
  static async loadConditionalResource(
    condition: boolean,
    loader: () => Promise<any>
  ): Promise<any> {
    if (condition) {
      try {
        return await loader();
      } catch (error) {
        console.warn("Failed to load conditional resource:", error);
        return null;
      }
    }
    return null;
  }
}

/**
 * Cross-browser event handling
 */
export class CrossBrowserEvents {
  /**
   * Add event listener with cross-browser support
   */
  static addEventListener(
    element: Element,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    // Modern browsers
    if (element.addEventListener) {
      element.addEventListener(event, handler, options);
    }
    // Legacy IE support
    else if ((element as any).attachEvent) {
      (element as any).attachEvent(`on${event}`, handler);
    }
  }

  /**
   * Remove event listener with cross-browser support
   */
  static removeEventListener(
    element: Element,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions
  ): void {
    // Modern browsers
    if (element.removeEventListener) {
      element.removeEventListener(event, handler, options);
    }
    // Legacy IE support
    else if ((element as any).detachEvent) {
      (element as any).detachEvent(`on${event}`, handler);
    }
  }

  /**
   * Get event target with cross-browser support
   */
  static getEventTarget(event: Event): Element | null {
    return (event.target as Element) || (event as any).srcElement || null;
  }

  /**
   * Prevent default with cross-browser support
   */
  static preventDefault(event: Event): void {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      (event as any).returnValue = false;
    }
  }

  /**
   * Stop propagation with cross-browser support
   */
  static stopPropagation(event: Event): void {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      (event as any).cancelBubble = true;
    }
  }
}

/**
 * Initialize browser compatibility on page load
 */
export function initializeBrowserCompatibility(): void {
  // Apply compatibility classes immediately
  applyCompatibilityClasses();

  // Load polyfills asynchronously
  loadPolyfills().catch((error) => {
    console.warn("Some polyfills failed to load:", error);
  });

  // Add browser-specific meta tags
  const browserInfo = detectBrowser();

  // IE compatibility mode
  if (browserInfo.name === "Internet Explorer") {
    const meta = document.createElement("meta");
    meta.httpEquiv = "X-UA-Compatible";
    meta.content = "IE=edge";
    document.head.appendChild(meta);
  }

  // Mobile viewport optimization
  if (browserInfo.isMobile) {
    let viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.name = "viewport";
      document.head.appendChild(viewport);
    }
    viewport.content =
      "width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover";
  }

  console.log("Browser compatibility initialized:", {
    browser: browserInfo,
    features: (window as any).__FEATURE_SUPPORT__,
  });
}
