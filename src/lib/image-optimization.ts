/**
 * Image optimization utilities for handling compression, format conversion,
 * and responsive image generation
 */

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: "webp" | "avif" | "jpeg" | "png" | "auto";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  background?: string;
  progressive?: boolean;
  lossless?: boolean;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: number;
  hasAlpha: boolean;
}

/**
 * Generate optimized image URL with Next.js Image Optimization API
 */
export function generateOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const { quality = 85, width, height, format = "auto" } = options;

  // If it's an external URL, return as-is (Next.js will handle optimization)
  if (src.startsWith("http")) {
    return src;
  }

  // For local images, we can add query parameters for optimization hints
  const params = new URLSearchParams();

  if (quality !== 85) params.set("q", quality.toString());
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (format !== "auto") params.set("f", format);

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Generate responsive image sizes string for different breakpoints
 */
export function generateResponsiveSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  defaultSize?: string;
}): string {
  const { mobile = "100vw", tablet = "50vw", desktop = "33vw" } = config;

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
}

/**
 * Calculate optimal image dimensions while maintaining aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  fit: "cover" | "contain" = "contain"
): { width: number; height: number } {
  if (fit === "contain") {
    // Fit within bounds while maintaining aspect ratio
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio),
    };
  } else {
    // Cover bounds while maintaining aspect ratio
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.max(widthRatio, heightRatio);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio),
    };
  }
}

/**
 * Generate blur data URL for placeholder
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = "#1a1a1a"
): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <filter id="blur">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      <rect width="100%" height="100%" fill="${color}" filter="url(#blur)" opacity="0.5"/>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Detect optimal image format based on browser support and image characteristics
 */
export function detectOptimalFormat(
  userAgent?: string,
  hasAlpha: boolean = false
): "webp" | "avif" | "jpeg" | "png" {
  // Check for AVIF support (modern browsers)
  const supportsAVIF =
    userAgent?.includes("Chrome/") &&
    parseInt(userAgent.split("Chrome/")[1]) >= 85;

  // Check for WebP support (most modern browsers)
  const supportsWebP =
    userAgent?.includes("Chrome/") ||
    userAgent?.includes("Firefox/") ||
    userAgent?.includes("Safari/");

  if (supportsAVIF && !hasAlpha) return "avif";
  if (supportsWebP) return "webp";
  if (hasAlpha) return "png";
  return "jpeg";
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 768, 1024, 1280, 1536],
  options: ImageOptimizationOptions = {}
): string {
  return widths
    .map((width) => {
      const url = generateOptimizedImageUrl(src, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(", ");
}

/**
 * Image compression utility for client-side compression
 */
export function compressImage(
  file: File,
  options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: "webp" | "jpeg" | "png";
  } = {}
): Promise<File> {
  return new Promise((resolve, reject) => {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      format = "webp",
    } = options;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const { width, height } = calculateOptimalDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight,
        "contain"
      );

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `.${format}`),
              { type: `image/${format}` }
            );
            resolve(compressedFile);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Extract image metadata
 */
export function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // Check for alpha channel
      const imageData = ctx?.getImageData(0, 0, img.width, img.height);
      let hasAlpha = false;

      if (imageData) {
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] < 255) {
            hasAlpha = true;
            break;
          }
        }
      }

      resolve({
        width: img.width,
        height: img.height,
        format: file.type.split("/")[1],
        size: file.size,
        aspectRatio: img.width / img.height,
        hasAlpha,
      });
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Presets for common image optimization scenarios
 */
export const ImageOptimizationPresets = {
  thumbnail: {
    quality: 75,
    width: 300,
    height: 300,
    format: "webp" as const,
    fit: "cover" as const,
  },

  card: {
    quality: 80,
    width: 600,
    height: 400,
    format: "webp" as const,
    fit: "cover" as const,
  },

  hero: {
    quality: 90,
    width: 1920,
    height: 1080,
    format: "webp" as const,
    fit: "cover" as const,
    progressive: true,
  },

  gallery: {
    quality: 85,
    width: 1200,
    height: 800,
    format: "webp" as const,
    fit: "contain" as const,
  },

  avatar: {
    quality: 75,
    width: 150,
    height: 150,
    format: "webp" as const,
    fit: "cover" as const,
  },
} as const;
