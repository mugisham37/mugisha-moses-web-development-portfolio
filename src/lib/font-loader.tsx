"use client";

import React from "react";

// Font loading utilities with error handling
export interface FontConfig {
  family: string;
  weight: string;
  style: string;
  src: string;
  fallback: string[];
}

export const FONT_CONFIGS: FontConfig[] = [
  {
    family: "Inter",
    weight: "400",
    style: "normal",
    src: "/fonts/inter-v13-latin-regular.woff2",
    fallback: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],
  },
  {
    family: "Space Mono",
    weight: "400",
    style: "normal",
    src: "/fonts/space-mono-v12-latin-regular.woff2",
    fallback: ["SF Mono", "Monaco", "Consolas", "Courier New", "monospace"],
  },
  {
    family: "Space Mono",
    weight: "700",
    style: "normal",
    src: "/fonts/space-mono-v12-latin-700.woff2",
    fallback: ["SF Mono", "Monaco", "Consolas", "Courier New", "monospace"],
  },
];

class FontLoader {
  private loadedFonts = new Set<string>();
  private failedFonts = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();

  async loadFont(config: FontConfig): Promise<void> {
    const fontKey = `${config.family}-${config.weight}-${config.style}`;

    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve();
    }

    if (this.failedFonts.has(fontKey)) {
      return Promise.reject(
        new Error(`Font ${fontKey} previously failed to load`)
      );
    }

    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey)!;
    }

    const loadPromise = this.loadFontInternal(config, fontKey);
    this.loadingPromises.set(fontKey, loadPromise);

    return loadPromise;
  }

  private async loadFontInternal(
    config: FontConfig,
    fontKey: string
  ): Promise<void> {
    try {
      // Check if Font Face API is available
      if ("fonts" in document && "FontFace" in window) {
        const fontFace = new FontFace(config.family, `url(${config.src})`, {
          weight: config.weight,
          style: config.style,
          display: "swap",
        });

        await fontFace.load();
        document.fonts.add(fontFace);
        this.loadedFonts.add(fontKey);
        console.log(`Font loaded successfully: ${fontKey}`);
      } else {
        // Fallback for browsers without Font Face API
        await this.loadFontFallback(config);
        this.loadedFonts.add(fontKey);
      }
    } catch (error) {
      console.warn(`Failed to load font ${fontKey}:`, error);
      this.failedFonts.add(fontKey);
      throw error;
    } finally {
      this.loadingPromises.delete(fontKey);
    }
  }

  private loadFontFallback(config: FontConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      link.href = config.src;

      link.onload = () => {
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to load font: ${config.src}`));
      };

      document.head.appendChild(link);

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error(`Font loading timeout: ${config.src}`));
      }, 5000);
    });
  }

  async loadAllFonts(): Promise<void> {
    const loadPromises = FONT_CONFIGS.map((config) =>
      this.loadFont(config).catch((error) => {
        console.warn(`Font loading failed for ${config.family}:`, error);
        return null; // Don't fail the entire loading process
      })
    );

    await Promise.allSettled(loadPromises);
  }

  getFontStack(family: string): string {
    const config = FONT_CONFIGS.find((f) => f.family === family);
    if (!config) return family;

    const fontKey = `${config.family}-${config.weight}-${config.style}`;

    if (this.loadedFonts.has(fontKey)) {
      return `"${config.family}", ${config.fallback.join(", ")}`;
    }

    // Return fallback stack if font failed to load
    return config.fallback.join(", ");
  }

  isLoaded(family: string, weight = "400", style = "normal"): boolean {
    const fontKey = `${family}-${weight}-${style}`;
    return this.loadedFonts.has(fontKey);
  }

  hasFailed(family: string, weight = "400", style = "normal"): boolean {
    const fontKey = `${family}-${weight}-${style}`;
    return this.failedFonts.has(fontKey);
  }
}

export const fontLoader = new FontLoader();

// React hook for font loading
export function useFontLoader() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [fontError, setFontError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fontLoader
      .loadAllFonts()
      .then(() => {
        setFontsLoaded(true);
        document.documentElement.classList.add("fonts-loaded");
      })
      .catch((error) => {
        setFontError(error.message);
        console.error("Font loading failed:", error);
        // Still mark as loaded to prevent infinite loading
        setFontsLoaded(true);
        document.documentElement.classList.add("fonts-loaded");
      });
  }, []);

  return { fontsLoaded, fontError };
}

// CSS-in-JS font face declarations as fallback
export function generateFontFaces(): string {
  return FONT_CONFIGS.map(
    (config) => `
    @font-face {
      font-family: "${config.family}";
      font-weight: ${config.weight};
      font-style: ${config.style};
      font-display: swap;
      src: url("${config.src}") format("woff2");
    }
  `
  ).join("\n");
}

export default fontLoader;
