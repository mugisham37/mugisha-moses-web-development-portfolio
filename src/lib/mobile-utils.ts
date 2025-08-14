/**
 * Mobile optimization utilities for brutalist portfolio
 * Handles viewport, touch targets, and mobile-specific features
 */

/**
 * Viewport configuration for optimal mobile experience
 */
export const MOBILE_VIEWPORT_CONFIG = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
} as const;

/**
 * Touch target size constants following WCAG guidelines
 */
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // WCAG minimum touch target size in pixels
  recommended: 48, // Recommended size for better UX
  large: 56, // Large touch targets for primary actions
} as const;

/**
 * Mobile breakpoints matching Tailwind CSS defaults
 */
export const MOBILE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280,
  xl: 1536,
} as const;

/**
 * Check if the current device is mobile based on user agent
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

/**
 * Check if the current device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - legacy support for older browsers
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get the current screen size category
 */
export function getScreenSize(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;

  if (width < MOBILE_BREAKPOINTS.tablet) return "mobile";
  if (width < MOBILE_BREAKPOINTS.desktop) return "tablet";
  return "desktop";
}

/**
 * Check if the device is in portrait orientation
 */
export function isPortraitOrientation(): boolean {
  if (typeof window === "undefined") return true;

  return window.innerHeight > window.innerWidth;
}

/**
 * Prevent zoom on double tap for iOS devices
 */
export function preventIOSZoom(element: HTMLElement): () => void {
  let lastTouchEnd = 0;

  const preventZoom = (event: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };

  element.addEventListener("touchend", preventZoom, { passive: false });

  return () => {
    element.removeEventListener("touchend", preventZoom);
  };
}

/**
 * Add safe area padding for devices with notches
 */
export function getSafeAreaPadding(): {
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
} {
  return {
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "env(safe-area-inset-bottom)",
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)",
  };
}

/**
 * Optimize touch target size for accessibility
 */
export function optimizeTouchTarget(
  size: "minimum" | "recommended" | "large" = "recommended"
): {
  minWidth: string;
  minHeight: string;
  padding: string;
} {
  const targetSize = TOUCH_TARGET_SIZES[size];

  return {
    minWidth: `${targetSize}px`,
    minHeight: `${targetSize}px`,
    padding: "8px",
  };
}

/**
 * Handle mobile-specific scroll behavior
 */
export function handleMobileScroll(
  options: {
    preventBounce?: boolean;
    preventOverscroll?: boolean;
  } = {}
): void {
  if (typeof document === "undefined") return;

  const { preventBounce = true, preventOverscroll = true } = options;

  if (preventBounce) {
    // Prevent bounce scrolling on iOS
    document.body.style.overscrollBehavior = "none";
  }

  if (preventOverscroll) {
    // Prevent overscroll effects
    document.documentElement.style.overscrollBehavior = "none";
  }
}

/**
 * Add mobile-specific CSS classes based on device detection
 */
export function getMobileClasses(): string {
  if (typeof window === "undefined") return "";

  const classes: string[] = [];

  if (isMobileDevice()) classes.push("is-mobile");
  if (isTouchDevice()) classes.push("is-touch");
  if (isPortraitOrientation()) classes.push("is-portrait");

  const screenSize = getScreenSize();
  classes.push(`is-${screenSize}`);

  return classes.join(" ");
}

/**
 * Enhanced mobile animation configuration with performance optimization
 */
export function getMobileAnimationConfig(): {
  reducedMotion: boolean;
  duration: number;
  easing: string;
  useGPU: boolean;
  frameRate: number;
} {
  if (typeof window === "undefined") {
    return {
      reducedMotion: false,
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      useGPU: true,
      frameRate: 60,
    };
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = isMobileDevice();

  // Detect device performance capabilities
  const isLowEndDevice =
    navigator.hardwareConcurrency <= 2 || (navigator as any).deviceMemory <= 2;

  // Detect connection speed
  const connection = (navigator as any).connection;
  const isSlowConnection =
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g");

  return {
    reducedMotion: prefersReducedMotion,
    duration: prefersReducedMotion
      ? 0
      : isLowEndDevice || isSlowConnection
        ? 150
        : isMobile
          ? 200
          : 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    useGPU: !isLowEndDevice,
    frameRate: isLowEndDevice ? 30 : 60,
  };
}

/**
 * Enhanced mobile performance optimization
 */
export function optimizeMobilePerformance(): {
  enableGPUAcceleration: () => void;
  disableGPUAcceleration: () => void;
  optimizeImages: () => void;
  preloadCriticalResources: () => void;
  enableServiceWorker: () => Promise<void>;
} {
  const enableGPUAcceleration = () => {
    const style = document.createElement("style");
    style.textContent = `
      .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      .smooth-scroll {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
  };

  const disableGPUAcceleration = () => {
    const elements = document.querySelectorAll(".gpu-accelerated");
    elements.forEach((el) => {
      (el as HTMLElement).style.transform = "";
      (el as HTMLElement).style.willChange = "";
    });
  };

  const optimizeImages = () => {
    // Add intersection observer for lazy loading
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  };

  const preloadCriticalResources = () => {
    // Preload critical fonts
    const fontPreloads = [
      "/fonts/SpaceMono-Regular.woff2",
      "/fonts/SpaceMono-Bold.woff2",
      "/fonts/Inter-Regular.woff2",
      "/fonts/Inter-Bold.woff2",
    ];

    fontPreloads.forEach((font) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = font;
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    // Preload critical images
    const criticalImages = ["/images/hero-bg.webp", "/images/logo.svg"];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;
      link.as = "image";
      document.head.appendChild(link);
    });
  };

  const enableServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", registration);
      } catch (error) {
        console.log("Service Worker registration failed:", error);
      }
    }
  };

  return {
    enableGPUAcceleration,
    disableGPUAcceleration,
    optimizeImages,
    preloadCriticalResources,
    enableServiceWorker,
  };
}

/**
 * Handle mobile keyboard visibility
 */
export function handleMobileKeyboard(): {
  onKeyboardShow: (callback: () => void) => void;
  onKeyboardHide: (callback: () => void) => void;
} {
  let initialViewportHeight = 0;

  if (typeof window !== "undefined") {
    initialViewportHeight = window.visualViewport?.height || window.innerHeight;
  }

  return {
    onKeyboardShow: (callback: () => void) => {
      if (typeof window === "undefined") return;

      const handleResize = () => {
        const currentHeight =
          window.visualViewport?.height || window.innerHeight;
        if (currentHeight < initialViewportHeight * 0.75) {
          callback();
        }
      };

      window.visualViewport?.addEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);
    },
    onKeyboardHide: (callback: () => void) => {
      if (typeof window === "undefined") return;

      const handleResize = () => {
        const currentHeight =
          window.visualViewport?.height || window.innerHeight;
        if (currentHeight >= initialViewportHeight * 0.9) {
          callback();
        }
      };

      window.visualViewport?.addEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);
    },
  };
}
