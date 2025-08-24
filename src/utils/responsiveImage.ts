interface ResponsiveImageConfig {
  src: string;
  width: number;
  height: number;
  breakpoints?: number[];
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
}

interface ResponsiveImageResult {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
}

interface BreakpointConfig {
  breakpoint: number;
  width: string;
  descriptor?: string;
}

// Default breakpoints for responsive images
const DEFAULT_BREAKPOINTS = [320, 640, 768, 1024, 1280, 1536, 1920];

// Default responsive configurations
const RESPONSIVE_CONFIGS: Record<string, BreakpointConfig[]> = {
  hero: [
    { breakpoint: 0, width: "100vw" },
    { breakpoint: 768, width: "100vw" },
    { breakpoint: 1024, width: "100vw" },
  ],
  card: [
    { breakpoint: 0, width: "100vw" },
    { breakpoint: 640, width: "50vw" },
    { breakpoint: 1024, width: "33vw" },
  ],
  thumbnail: [
    { breakpoint: 0, width: "100vw" },
    { breakpoint: 640, width: "25vw" },
    { breakpoint: 1024, width: "20vw" },
  ],
  portrait: [
    { breakpoint: 0, width: "100vw" },
    { breakpoint: 768, width: "50vw" },
    { breakpoint: 1024, width: "40vw" },
  ],
  logo: [
    { breakpoint: 0, width: "200px" },
    { breakpoint: 768, width: "300px" },
  ],
};

/**
 * Generate responsive image configuration
 */
export function generateResponsiveImage(
  config: ResponsiveImageConfig
): ResponsiveImageResult {
  const {
    src,
    width,
    height,
    breakpoints = DEFAULT_BREAKPOINTS,
    quality = 85,
    format = "jpg",
  } = config;

  const aspectRatio = width / height;

  // Generate srcSet for different widths
  const srcSetEntries = breakpoints
    .filter((bp) => bp <= width) // Only include breakpoints smaller than original
    .map((bp) => {
      const scaledHeight = Math.round(bp / aspectRatio);
      // In a real implementation, you'd generate optimized images here
      // For now, we'll use the original src with width parameters
      return `${src}?w=${bp}&h=${scaledHeight}&q=${quality}&f=${format} ${bp}w`;
    });

  // Add original image as largest option
  srcSetEntries.push(`${src}?q=${quality}&f=${format} ${width}w`);

  const srcSet = srcSetEntries.join(", ");

  // Generate default sizes attribute
  const sizes = generateDefaultSizes(breakpoints);

  return {
    src: `${src}?w=${width}&h=${height}&q=${quality}&f=${format}`,
    srcSet,
    sizes,
    width,
    height,
    aspectRatio,
  };
}

/**
 * Generate responsive image with predefined configuration
 */
export function generateResponsiveImageWithConfig(
  src: string,
  width: number,
  height: number,
  configName: keyof typeof RESPONSIVE_CONFIGS,
  options: {
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
  } = {}
): ResponsiveImageResult {
  const { quality = 85, format = "jpg" } = options;
  const config = RESPONSIVE_CONFIGS[configName];

  if (!config) {
    throw new Error(`Unknown responsive image config: ${configName}`);
  }

  const aspectRatio = width / height;

  // Generate srcSet based on config
  const srcSetEntries: string[] = [];
  const sizesEntries: string[] = [];

  config.forEach(({ breakpoint, width: configWidth }) => {
    // Calculate actual pixel width from viewport width
    const pixelWidth = configWidth.includes("vw")
      ? Math.round((parseInt(configWidth) / 100) * 1920) // Assume max viewport of 1920px
      : parseInt(configWidth);

    const scaledHeight = Math.round(pixelWidth / aspectRatio);

    srcSetEntries.push(
      `${src}?w=${pixelWidth}&h=${scaledHeight}&q=${quality}&f=${format} ${pixelWidth}w`
    );

    if (breakpoint > 0) {
      sizesEntries.push(`(min-width: ${breakpoint}px) ${configWidth}`);
    } else {
      sizesEntries.push(configWidth);
    }
  });

  const srcSet = srcSetEntries.join(", ");
  const sizes = sizesEntries.reverse().join(", "); // Reverse for mobile-first

  return {
    src: `${src}?w=${width}&h=${height}&q=${quality}&f=${format}`,
    srcSet,
    sizes,
    width,
    height,
    aspectRatio,
  };
}

/**
 * Generate default sizes attribute
 */
function generateDefaultSizes(breakpoints: number[]): string {
  const sizes = breakpoints
    .slice(1) // Skip the first (mobile) breakpoint
    .reverse() // Start from largest
    .map((bp, index) => {
      const percentage = Math.max(100 - (index + 1) * 20, 33); // Decrease by 20% each step, min 33%
      return `(min-width: ${bp}px) ${percentage}vw`;
    });

  sizes.push("100vw"); // Default for mobile
  return sizes.join(", ");
}

/**
 * Calculate optimal image dimensions for a container
 */
export function calculateOptimalDimensions(
  containerWidth: number,
  containerHeight: number,
  originalWidth: number,
  originalHeight: number,
  devicePixelRatio: number = 1
): { width: number; height: number } {
  const originalAspectRatio = originalWidth / originalHeight;
  const containerAspectRatio = containerWidth / containerHeight;

  let targetWidth: number;
  let targetHeight: number;

  if (originalAspectRatio > containerAspectRatio) {
    // Image is wider than container
    targetWidth = containerWidth;
    targetHeight = containerWidth / originalAspectRatio;
  } else {
    // Image is taller than container
    targetHeight = containerHeight;
    targetWidth = containerHeight * originalAspectRatio;
  }

  // Account for device pixel ratio
  return {
    width: Math.round(targetWidth * devicePixelRatio),
    height: Math.round(targetHeight * devicePixelRatio),
  };
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = "#f0f0f0"
): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="${color}" filter="url(#blur)"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get image format support
 */
export function getOptimalImageFormat(): "avif" | "webp" | "jpg" {
  if (typeof window === "undefined") return "jpg";

  // Check for AVIF support
  const avifCanvas = document.createElement("canvas");
  avifCanvas.width = 1;
  avifCanvas.height = 1;
  const avifSupported =
    avifCanvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;

  if (avifSupported) return "avif";

  // Check for WebP support
  const webpCanvas = document.createElement("canvas");
  webpCanvas.width = 1;
  webpCanvas.height = 1;
  const webpSupported =
    webpCanvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;

  if (webpSupported) return "webp";

  return "jpg";
}

/**
 * Hook for responsive image generation
 */
export function useResponsiveImage(
  src: string,
  width: number,
  height: number,
  configName?: keyof typeof RESPONSIVE_CONFIGS
) {
  if (configName) {
    return generateResponsiveImageWithConfig(src, width, height, configName);
  }

  return generateResponsiveImage({ src, width, height });
}

/**
 * Utility to check if image should be lazy loaded
 */
export function shouldLazyLoad(
  priority: boolean = false,
  aboveTheFold: boolean = false
): boolean {
  return !priority && !aboveTheFold;
}

/**
 * Generate Next.js Image component props
 */
export function generateNextImageProps(
  src: string,
  width: number,
  height: number,
  options: {
    priority?: boolean;
    quality?: number;
    configName?: keyof typeof RESPONSIVE_CONFIGS;
    alt: string;
    className?: string;
  }
) {
  const {
    priority = false,
    quality = 85,
    configName,
    alt,
    className,
  } = options;

  const responsive = configName
    ? generateResponsiveImageWithConfig(src, width, height, configName, {
        quality,
      })
    : generateResponsiveImage({ src, width, height, quality });

  return {
    src: responsive.src,
    alt,
    width: responsive.width,
    height: responsive.height,
    priority,
    quality,
    sizes: responsive.sizes,
    className,
    placeholder: "blur" as const,
    blurDataURL: generateBlurPlaceholder(
      10,
      Math.round(10 / responsive.aspectRatio)
    ),
  };
}
