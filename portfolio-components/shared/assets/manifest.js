/**
 * Asset Manifest for Portfolio Components
 * Centralized asset path management
 */

// Base paths for different asset types
export const ASSET_PATHS = {
  images: "./shared/assets/images/",
  fonts: "./shared/assets/fonts/",
  icons: "./shared/assets/icons/",
};

// Image assets
export const IMAGES = {
  heroPortrait: {
    jpg: "hero-portrait.jpg",
    svg: "hero-portrait.svg",
  },
  // Placeholder for additional images
  placeholders: {
    avatar: "placeholder-avatar.jpg",
    project: "placeholder-project.jpg",
    testimonial: "placeholder-testimonial.jpg",
  },
};

// Font assets (Google Fonts URLs for now, can be updated to local fonts)
export const FONTS = {
  spaceMono: {
    name: "Space Mono",
    weights: [400, 700, 900],
    googleUrl:
      "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700;900&display=swap",
  },
  jetBrainsMono: {
    name: "JetBrains Mono",
    weights: [400, 700, 800],
    googleUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap",
  },
};

// Icon assets (can be expanded with actual icon files)
export const ICONS = {
  social: {
    github: "github.svg",
    linkedin: "linkedin.svg",
    twitter: "twitter.svg",
    email: "email.svg",
  },
  tech: {
    react: "react.svg",
    nodejs: "nodejs.svg",
    aws: "aws.svg",
    docker: "docker.svg",
  },
  ui: {
    arrow: "arrow.svg",
    check: "check.svg",
    close: "close.svg",
    menu: "menu.svg",
  },
};

/**
 * Get full path for an image asset
 * @param {string} imageName - Name of the image file
 * @returns {string} Full path to the image
 */
export function getImagePath(imageName) {
  return `${ASSET_PATHS.images}${imageName}`;
}

/**
 * Get full path for a font asset
 * @param {string} fontName - Name of the font file
 * @returns {string} Full path to the font
 */
export function getFontPath(fontName) {
  return `${ASSET_PATHS.fonts}${fontName}`;
}

/**
 * Get full path for an icon asset
 * @param {string} iconName - Name of the icon file
 * @returns {string} Full path to the icon
 */
export function getIconPath(iconName) {
  return `${ASSET_PATHS.icons}${iconName}`;
}

/**
 * Preload critical images
 * @param {Array} imageNames - Array of image names to preload
 */
export function preloadImages(imageNames) {
  imageNames.forEach((imageName) => {
    const img = new Image();
    img.src = getImagePath(imageName);
  });
}

/**
 * Load Google Fonts dynamically
 * @param {Array} fontKeys - Array of font keys from FONTS object
 */
export function loadGoogleFonts(fontKeys = ["spaceMono", "jetBrainsMono"]) {
  fontKeys.forEach((fontKey) => {
    const font = FONTS[fontKey];
    if (font && font.googleUrl) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = font.googleUrl;
      document.head.appendChild(link);
    }
  });
}

/**
 * Check if an asset exists
 * @param {string} assetPath - Path to the asset
 * @returns {Promise<boolean>} Promise that resolves to true if asset exists
 */
export function assetExists(assetPath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = assetPath;
  });
}

/**
 * Get responsive image sources
 * @param {string} baseName - Base name of the image (without extension)
 * @param {Array} sizes - Array of size suffixes (e.g., ['sm', 'md', 'lg'])
 * @param {string} extension - File extension
 * @returns {Object} Object with size keys and image paths
 */
export function getResponsiveImages(
  baseName,
  sizes = ["sm", "md", "lg"],
  extension = "jpg"
) {
  const images = {};
  sizes.forEach((size) => {
    images[size] = getImagePath(`${baseName}-${size}.${extension}`);
  });
  return images;
}

// Export default manifest object
export default {
  ASSET_PATHS,
  IMAGES,
  FONTS,
  ICONS,
  getImagePath,
  getFontPath,
  getIconPath,
  preloadImages,
  loadGoogleFonts,
  assetExists,
  getResponsiveImages,
};
