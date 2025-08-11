/**
 * Image accessibility utilities for generating proper alt text,
 * ARIA labels, and ensuring WCAG compliance
 */

export interface ImageAccessibilityOptions {
  context?: "decorative" | "informative" | "functional" | "complex";
  isBackground?: boolean;
  hasCaption?: boolean;
  isInLink?: boolean;
  isInButton?: boolean;
  longDescription?: string;
}

/**
 * Generate appropriate alt text based on context and content
 */
export function generateAltText(
  originalAlt: string,
  options: ImageAccessibilityOptions = {}
): string {
  const {
    context = "informative",
    isBackground = false,
    hasCaption = false,
    isInLink = false,
    isInButton = false,
  } = options;

  // Background/decorative images should have empty alt
  if (context === "decorative" || isBackground) {
    return "";
  }

  // If image is in a link or button, alt should describe the action
  if (isInLink || isInButton) {
    if (
      !originalAlt.toLowerCase().includes("link") &&
      !originalAlt.toLowerCase().includes("button")
    ) {
      return isInLink ? `${originalAlt} (link)` : `${originalAlt} (button)`;
    }
  }

  // If image has a caption, alt can be shorter
  if (hasCaption && context === "informative") {
    // Remove redundant information that might be in caption
    return originalAlt.replace(/\s*\(.*?\)\s*$/, "").trim();
  }

  // For complex images, indicate that more description is available
  if (context === "complex" && options.longDescription) {
    return `${originalAlt}. Detailed description available.`;
  }

  return originalAlt;
}

/**
 * Generate ARIA attributes for images
 */
export function generateAriaAttributes(
  alt: string,
  options: ImageAccessibilityOptions = {}
): Record<string, string> {
  const {
    context = "informative",
    longDescription,
    isBackground = false,
  } = options;

  const attributes: Record<string, string> = {};

  // Decorative images should be hidden from screen readers
  if (context === "decorative" || isBackground || alt === "") {
    attributes["aria-hidden"] = "true";
    attributes["role"] = "presentation";
    return attributes;
  }

  // Complex images need additional description
  if (context === "complex" && longDescription) {
    attributes["aria-describedby"] = `img-desc-${generateId()}`;
  }

  // Functional images in interactive elements
  if (context === "functional") {
    attributes["role"] = "img";
  }

  return attributes;
}

/**
 * Validate alt text quality and provide suggestions
 */
export function validateAltText(alt: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check length
  if (alt.length === 0) {
    issues.push("Alt text is empty");
    suggestions.push("Provide descriptive alt text or mark as decorative");
  } else if (alt.length > 125) {
    issues.push("Alt text is too long (over 125 characters)");
    suggestions.push("Consider using a caption or long description instead");
  }

  // Check for redundant phrases
  const redundantPhrases = [
    "image of",
    "picture of",
    "photo of",
    "graphic of",
    "screenshot of",
  ];

  redundantPhrases.forEach((phrase) => {
    if (alt.toLowerCase().includes(phrase)) {
      issues.push(`Contains redundant phrase: "${phrase}"`);
      suggestions.push(
        `Remove "${phrase}" - screen readers already announce it's an image`
      );
    }
  });

  // Check for file extensions
  const fileExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  fileExtensions.forEach((ext) => {
    if (alt.toLowerCase().includes(ext)) {
      issues.push(`Contains file extension: "${ext}"`);
      suggestions.push("Remove file extensions from alt text");
    }
  });

  // Check for placeholder text
  const placeholderTexts = [
    "image",
    "photo",
    "picture",
    "graphic",
    "img",
    "untitled",
    "no description",
  ];

  if (placeholderTexts.includes(alt.toLowerCase())) {
    issues.push("Alt text appears to be placeholder text");
    suggestions.push("Provide specific, descriptive alt text");
  }

  // Check for ending punctuation
  if (alt.length > 0 && !alt.match(/[.!?]$/)) {
    suggestions.push(
      "Consider ending alt text with punctuation for better screen reader flow"
    );
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * Generate structured data for images
 */
export function generateImageStructuredData(
  src: string,
  alt: string,
  options: {
    caption?: string;
    author?: string;
    license?: string;
    width?: number;
    height?: number;
    datePublished?: string;
    contentUrl?: string;
  } = {}
) {
  const { caption, author, license, width, height, datePublished, contentUrl } =
    options;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: contentUrl || src,
    description: alt,
    ...(caption && { caption }),
    ...(author && { author: { "@type": "Person", name: author } }),
    ...(license && { license }),
    ...(width && height && { width, height }),
    ...(datePublished && { datePublished }),
  };
}

/**
 * Check if image meets WCAG contrast requirements (for text over images)
 */
export function checkImageContrast(
  imageElement: HTMLImageElement,
  textColor: string = "#ffffff"
): Promise<{
  meetsAA: boolean;
  meetsAAA: boolean;
  averageLuminance: number;
  contrastRatio: number;
}> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve({
        meetsAA: false,
        meetsAAA: false,
        averageLuminance: 0,
        contrastRatio: 0,
      });
      return;
    }

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    ctx.drawImage(imageElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let totalLuminance = 0;
    const pixelCount = data.length / 4;

    // Calculate average luminance
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      // Convert to relative luminance
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      totalLuminance += luminance;
    }

    const averageLuminance = totalLuminance / pixelCount;

    // Calculate contrast ratio with text color
    const textLuminance = hexToLuminance(textColor);
    const contrastRatio =
      (Math.max(averageLuminance, textLuminance) + 0.05) /
      (Math.min(averageLuminance, textLuminance) + 0.05);

    resolve({
      meetsAA: contrastRatio >= 4.5,
      meetsAAA: contrastRatio >= 7,
      averageLuminance,
      contrastRatio,
    });
  });
}

/**
 * Generate responsive image sizes for accessibility
 */
export function generateAccessibleSizes(
  breakpoints: { [key: string]: number } = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  }
): string {
  const entries = Object.entries(breakpoints).sort(([, a], [, b]) => a - b);

  return entries
    .map(([name, width], index) => {
      if (index === entries.length - 1) {
        return "100vw"; // Default for largest breakpoint
      }
      return `(max-width: ${width}px) 100vw`;
    })
    .join(", ");
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function hexToLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Image accessibility presets for common use cases
 */
export const ImageAccessibilityPresets = {
  hero: {
    context: "informative" as const,
    longDescription: "Hero image showcasing the main content",
  },

  thumbnail: {
    context: "functional" as const,
    isInLink: true,
  },

  decorative: {
    context: "decorative" as const,
    isBackground: true,
  },

  avatar: {
    context: "informative" as const,
    isInLink: false,
  },

  gallery: {
    context: "informative" as const,
    hasCaption: true,
  },

  chart: {
    context: "complex" as const,
    longDescription: "Detailed data available in table format below",
  },
} as const;
