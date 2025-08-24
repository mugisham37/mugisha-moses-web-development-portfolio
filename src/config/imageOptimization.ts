import type { ImageConfigComplete } from "next/dist/shared/lib/image-config";

// Next.js Image Optimization Configuration
export const imageConfig: Partial<ImageConfigComplete> = {
  // Supported image formats in order of preference
  formats: ["image/avif", "image/webp"],

  // Image sizes for responsive images
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  // Device sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // Image domains that are allowed to be optimized
  domains: [
    "localhost",
    "your-domain.com",
    "cdn.your-domain.com",
    "images.unsplash.com",
    "via.placeholder.com",
  ],

  // Remote patterns for more flexible domain matching
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.unsplash.com",
      port: "",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**.placeholder.com",
      port: "",
      pathname: "/**",
    },
  ],

  // Minimum cache TTL in seconds
  minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week

  // Disable static imports for better control
  disableStaticImages: false,

  // Dangerous allow SVG (use with caution)
  dangerouslyAllowSVG: false,

  // Content security policy for SVG
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

// Image optimization presets for different use cases
export const imagePresets = {
  hero: {
    quality: 90,
    priority: true,
    sizes: "100vw",
    placeholder: "blur" as const,
  },

  card: {
    quality: 85,
    priority: false,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    placeholder: "blur" as const,
  },

  thumbnail: {
    quality: 80,
    priority: false,
    sizes: "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw",
    placeholder: "blur" as const,
  },

  portrait: {
    quality: 90,
    priority: false,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw",
    placeholder: "blur" as const,
  },

  logo: {
    quality: 95,
    priority: true,
    sizes: "(max-width: 768px) 200px, 300px",
    placeholder: "empty" as const,
  },

  icon: {
    quality: 95,
    priority: false,
    sizes: "(max-width: 768px) 32px, 48px",
    placeholder: "empty" as const,
  },

  standard: {
    quality: 85,
    priority: false,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    placeholder: "blur" as const,
  },
} as const;

// Performance budgets for different image types
export const performanceBudgets = {
  hero: {
    maxFileSize: 500 * 1024, // 500KB
    maxLoadTime: 1500, // 1.5 seconds
    maxDimensions: { width: 1920, height: 1080 },
  },

  card: {
    maxFileSize: 200 * 1024, // 200KB
    maxLoadTime: 1000, // 1 second
    maxDimensions: { width: 800, height: 600 },
  },

  thumbnail: {
    maxFileSize: 50 * 1024, // 50KB
    maxLoadTime: 500, // 0.5 seconds
    maxDimensions: { width: 400, height: 300 },
  },

  portrait: {
    maxFileSize: 300 * 1024, // 300KB
    maxLoadTime: 1200, // 1.2 seconds
    maxDimensions: { width: 600, height: 800 },
  },

  logo: {
    maxFileSize: 20 * 1024, // 20KB
    maxLoadTime: 300, // 0.3 seconds
    maxDimensions: { width: 300, height: 150 },
  },

  icon: {
    maxFileSize: 5 * 1024, // 5KB
    maxLoadTime: 200, // 0.2 seconds
    maxDimensions: { width: 64, height: 64 },
  },

  standard: {
    maxFileSize: 250 * 1024, // 250KB
    maxLoadTime: 1000, // 1 second
    maxDimensions: { width: 1200, height: 800 },
  },
} as const;

// Critical images that should be preloaded
export const criticalImages = [
  "/hero-portrait.jpg",
  "/hero-portrait.svg",
  // Add other critical images here
] as const;

// Image format preferences based on browser support
export const formatPreferences = {
  modern: ["avif", "webp", "jpg"],
  legacy: ["jpg", "png"],
  vector: ["svg"],
} as const;

// Lazy loading configuration
export const lazyLoadingConfig = {
  // Intersection observer options
  rootMargin: "50px",
  threshold: 0.1,

  // Preload distance (how far ahead to start loading)
  preloadDistance: 2, // screens

  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // milliseconds

  // Performance thresholds
  slowConnectionThreshold: 1000, // milliseconds
  fastConnectionThreshold: 200, // milliseconds
} as const;

// Image compression settings
export const compressionSettings = {
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
  },

  webp: {
    quality: 85,
    lossless: false,
    nearLossless: false,
  },

  avif: {
    quality: 80,
    lossless: false,
    speed: 6, // 0-10, higher is faster but larger
  },

  png: {
    compressionLevel: 9,
    adaptiveFiltering: true,
    palette: true,
  },
} as const;

// Responsive breakpoints
export const responsiveBreakpoints = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
  ultrawide: 1920,
} as const;

// Image loading strategies
export const loadingStrategies = {
  // Above the fold - load immediately
  critical: {
    loading: "eager" as const,
    fetchPriority: "high" as const,
    preload: true,
  },

  // Important but not critical - load with high priority
  important: {
    loading: "lazy" as const,
    fetchPriority: "high" as const,
    preload: false,
  },

  // Standard content - lazy load with normal priority
  standard: {
    loading: "lazy" as const,
    fetchPriority: "auto" as const,
    preload: false,
  },

  // Background/decorative - lazy load with low priority
  background: {
    loading: "lazy" as const,
    fetchPriority: "low" as const,
    preload: false,
  },
} as const;

// Utility function to get image preset
export function getImagePreset(type: keyof typeof imagePresets) {
  return imagePresets[type];
}

// Utility function to get performance budget
export function getPerformanceBudget(type: keyof typeof performanceBudgets) {
  return performanceBudgets[type];
}

// Utility function to get loading strategy
export function getLoadingStrategy(type: keyof typeof loadingStrategies) {
  return loadingStrategies[type];
}

// Utility function to check if image is critical
export function isCriticalImage(src: string): boolean {
  return criticalImages.some((criticalSrc) => src.includes(criticalSrc));
}

// Utility function to get optimal format based on browser support
export function getOptimalFormat(supportedFormats: string[]): string {
  for (const format of formatPreferences.modern) {
    if (supportedFormats.includes(`image/${format}`)) {
      return format;
    }
  }
  return "jpg"; // fallback
}

// Utility function to calculate image priority
export function calculateImagePriority(
  isAboveTheFold: boolean,
  isCritical: boolean,
  isLargest: boolean
): boolean {
  return isAboveTheFold || isCritical || isLargest;
}

// Export all configurations
const imageOptimizationConfig = {
  imageConfig,
  imagePresets,
  performanceBudgets,
  criticalImages,
  formatPreferences,
  lazyLoadingConfig,
  compressionSettings,
  responsiveBreakpoints,
  loadingStrategies,
  getImagePreset,
  getPerformanceBudget,
  getLoadingStrategy,
  isCriticalImage,
  getOptimalFormat,
  calculateImagePriority,
};

export default imageOptimizationConfig;
