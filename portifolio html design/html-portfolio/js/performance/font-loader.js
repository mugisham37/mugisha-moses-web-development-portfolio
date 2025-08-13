/* ==========================================================================
   FONT LOADER
   Font preloading strategy with font-display: swap
   ========================================================================== */

/**
 * Font Loader Module
 * Handles font preloading and optimization for performance
 */
class FontLoader {
  constructor() {
    this.fonts = new Map();
    this.loadedFonts = new Set();
    this.initialized = false;
  }

  /**
   * Initialize the font loader
   */
  init() {
    if (this.initialized) return;

    try {
      // Define critical fonts
      this.defineCriticalFonts();

      // Preload critical fonts
      this.preloadCriticalFonts();

      // Set up font loading detection
      this.setupFontLoadingDetection();

      // Handle font loading events
      this.handleFontEvents();

      this.initialized = true;
      console.log("Font loader initialized successfully");
    } catch (error) {
      console.error("Failed to initialize font loader:", error);
    }
  }

  /**
   * Define critical fonts for the application
   */
  defineCriticalFonts() {
    // Space Mono - Display font
    this.fonts.set("Space Mono", {
      family: "Space Mono",
      weights: [400, 700],
      display: "swap",
      critical: true,
      fallback: '"Courier New", monospace',
      preload: true,
    });

    // JetBrains Mono - Code font
    this.fonts.set("JetBrains Mono", {
      family: "JetBrains Mono",
      weights: [400, 700],
      display: "swap",
      critical: true,
      fallback: '"Space Mono", "Courier New", monospace',
      preload: true,
    });

    // Inter - Body font
    this.fonts.set("Inter", {
      family: "Inter",
      weights: [400, 500, 600, 700],
      display: "swap",
      critical: true,
      fallback: '"Helvetica Neue", Arial, sans-serif',
      preload: true,
    });
  }

  /**
   * Preload critical fonts
   */
  preloadCriticalFonts() {
    this.fonts.forEach((font, name) => {
      if (font.critical && font.preload) {
        this.preloadFont(font);
      }
    });
  }

  /**
   * Preload a single font
   */
  preloadFont(font) {
    font.weights.forEach((weight) => {
      // Create preload link for each weight
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      link.href = this.getFontURL(font.family, weight);

      // Add to document head
      document.head.appendChild(link);
    });
  }

  /**
   * Get font URL for Google Fonts
   */
  getFontURL(family, weight) {
    const familyParam = family.replace(/\s+/g, "+");
    return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weight}&display=swap`;
  }

  /**
   * Setup font loading detection using Font Loading API
   */
  setupFontLoadingDetection() {
    if (!("fonts" in document)) {
      // Fallback for browsers without Font Loading API
      this.fallbackFontLoading();
      return;
    }

    // Use Font Loading API
    this.fonts.forEach((font, name) => {
      font.weights.forEach((weight) => {
        const fontFace = new FontFace(
          font.family,
          `url(${this.getFontFileURL(
            font.family,
            weight,
            "woff2"
          )}) format('woff2'),
           url(${this.getFontFileURL(
             font.family,
             weight,
             "woff"
           )}) format('woff')`,
          {
            weight: weight.toString(),
            display: font.display,
          }
        );

        // Load the font
        fontFace
          .load()
          .then((loadedFace) => {
            document.fonts.add(loadedFace);
            this.onFontLoaded(font.family, weight);
          })
          .catch((error) => {
            console.warn(
              `Failed to load font ${font.family} ${weight}:`,
              error
            );
            this.onFontError(font.family, weight);
          });
      });
    });
  }

  /**
   * Get font file URL for direct loading
   */
  getFontFileURL(family, weight, format) {
    // This would typically point to your font files
    // For now, using Google Fonts as fallback
    const familyParam = family.replace(/\s+/g, "+");
    return `https://fonts.gstatic.com/s/${familyParam.toLowerCase()}/v1/${familyParam}-${weight}.${format}`;
  }

  /**
   * Fallback font loading for older browsers
   */
  fallbackFontLoading() {
    // Create a test element to detect font loading
    const testElement = document.createElement("div");
    testElement.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      visibility: hidden;
      font-size: 100px;
      font-family: monospace;
    `;
    testElement.textContent = "BESbswy";
    document.body.appendChild(testElement);

    const fallbackWidth = testElement.offsetWidth;

    this.fonts.forEach((font, name) => {
      if (font.critical) {
        this.testFontLoading(font, testElement, fallbackWidth);
      }
    });
  }

  /**
   * Test font loading using width comparison
   */
  testFontLoading(font, testElement, fallbackWidth) {
    testElement.style.fontFamily = `"${font.family}", monospace`;

    const checkFont = () => {
      const currentWidth = testElement.offsetWidth;
      if (currentWidth !== fallbackWidth) {
        this.onFontLoaded(font.family, "all");
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkFont()) {
      // Poll for font loading
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max

      const pollFont = () => {
        attempts++;
        if (checkFont() || attempts >= maxAttempts) {
          if (attempts >= maxAttempts) {
            this.onFontError(font.family, "all");
          }
          return;
        }
        setTimeout(pollFont, 100);
      };

      setTimeout(pollFont, 100);
    }
  }

  /**
   * Handle font loading events
   */
  handleFontEvents() {
    // Listen for font loading events
    if ("fonts" in document) {
      document.fonts.addEventListener("loadingdone", (event) => {
        console.log("All fonts loaded");
        document.body.classList.add("fonts-loaded");
      });

      document.fonts.addEventListener("loadingerror", (event) => {
        console.warn("Font loading error:", event);
        document.body.classList.add("fonts-error");
      });
    }
  }

  /**
   * Handle successful font loading
   */
  onFontLoaded(family, weight) {
    const fontKey = `${family}-${weight}`;
    this.loadedFonts.add(fontKey);

    // Add CSS class for this font
    const className = `font-${family
      .toLowerCase()
      .replace(/\s+/g, "-")}-loaded`;
    document.body.classList.add(className);

    console.log(`Font loaded: ${family} ${weight}`);

    // Check if all critical fonts are loaded
    this.checkAllFontsLoaded();
  }

  /**
   * Handle font loading errors
   */
  onFontError(family, weight) {
    console.warn(`Font failed to load: ${family} ${weight}`);

    // Add error class
    const className = `font-${family.toLowerCase().replace(/\s+/g, "-")}-error`;
    document.body.classList.add(className);

    // Use fallback font
    this.applyFallbackFont(family);
  }

  /**
   * Apply fallback font
   */
  applyFallbackFont(family) {
    const font = this.fonts.get(family);
    if (font && font.fallback) {
      // Update CSS custom property for fallback
      document.documentElement.style.setProperty(
        `--font-${family.toLowerCase().replace(/\s+/g, "-")}`,
        font.fallback
      );
    }
  }

  /**
   * Check if all critical fonts are loaded
   */
  checkAllFontsLoaded() {
    const criticalFonts = Array.from(this.fonts.values()).filter(
      (font) => font.critical
    );
    const totalCriticalWeights = criticalFonts.reduce(
      (total, font) => total + font.weights.length,
      0
    );

    if (this.loadedFonts.size >= totalCriticalWeights) {
      document.body.classList.add("critical-fonts-loaded");
      this.onAllCriticalFontsLoaded();
    }
  }

  /**
   * Handle all critical fonts loaded
   */
  onAllCriticalFontsLoaded() {
    console.log("All critical fonts loaded");

    // Trigger custom event
    const event = new CustomEvent("criticalFontsLoaded", {
      detail: { loadedFonts: Array.from(this.loadedFonts) },
    });
    document.dispatchEvent(event);

    // Remove font loading indicators
    this.removeFontLoadingIndicators();
  }

  /**
   * Remove font loading indicators
   */
  removeFontLoadingIndicators() {
    const indicators = document.querySelectorAll(".font-loading-indicator");
    indicators.forEach((indicator) => {
      indicator.classList.add("fade-out");
      setTimeout(() => indicator.remove(), 300);
    });
  }

  /**
   * Create font loading CSS
   */
  createFontLoadingCSS() {
    const css = `
      /* Font loading states */
      .fonts-loading {
        visibility: hidden;
      }
      
      .fonts-loaded,
      .fonts-error {
        visibility: visible;
      }
      
      /* Font-specific loading states */
      ${Array.from(this.fonts.entries())
        .map(([name, font]) => {
          const className = name.toLowerCase().replace(/\s+/g, "-");
          return `
          .font-${className}-loading {
            font-family: ${font.fallback};
          }
          
          .font-${className}-loaded {
            font-family: "${font.family}", ${font.fallback};
          }
          
          .font-${className}-error {
            font-family: ${font.fallback};
          }
        `;
        })
        .join("")}
      
      /* Font loading animation */
      @keyframes fontLoadPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .font-loading-indicator {
        animation: fontLoadPulse 1.5s ease-in-out infinite;
      }
      
      .font-loading-indicator.fade-out {
        animation: none;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
    `;

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Get font loading status
   */
  getFontLoadingStatus() {
    return {
      initialized: this.initialized,
      totalFonts: this.fonts.size,
      loadedFonts: this.loadedFonts.size,
      fonts: Array.from(this.fonts.keys()),
      loaded: Array.from(this.loadedFonts),
    };
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = FontLoader;
} else {
  window.FontLoader = FontLoader;
}
