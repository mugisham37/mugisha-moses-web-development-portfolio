/* ==========================================================================
   CRITICAL CSS INLINER
   Automatically inline critical CSS for above-the-fold content
   ========================================================================== */

/**
 * Critical CSS Inliner Module
 * Handles automatic inlining of critical CSS for performance optimization
 */
class CriticalCSSInliner {
  constructor() {
    this.criticalCSS = null;
    this.nonCriticalCSS = [];
    this.initialized = false;
  }

  /**
   * Initialize the critical CSS inliner
   */
  async init() {
    if (this.initialized) return;

    try {
      // Load critical CSS content
      await this.loadCriticalCSS();

      // Inline critical CSS
      this.inlineCriticalCSS();

      // Load non-critical CSS asynchronously
      this.loadNonCriticalCSS();

      this.initialized = true;
      console.log("Critical CSS inliner initialized successfully");
    } catch (error) {
      console.error("Failed to initialize critical CSS inliner:", error);
    }
  }

  /**
   * Load critical CSS content
   */
  async loadCriticalCSS() {
    try {
      const response = await fetch("/css/critical.css");
      if (!response.ok) {
        throw new Error(`Failed to load critical CSS: ${response.status}`);
      }
      this.criticalCSS = await response.text();
    } catch (error) {
      console.warn("Could not load critical CSS file, using fallback");
      // Fallback to existing inlined styles
      const existingStyle = document.querySelector("style");
      if (existingStyle) {
        this.criticalCSS = existingStyle.textContent;
      }
    }
  }

  /**
   * Inline critical CSS in the document head
   */
  inlineCriticalCSS() {
    if (!this.criticalCSS) return;

    // Check if critical CSS is already inlined
    const existingCriticalStyle = document.querySelector(
      "style[data-critical]"
    );
    if (existingCriticalStyle) return;

    // Create style element for critical CSS
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-critical", "true");
    styleElement.textContent = this.criticalCSS;

    // Insert at the beginning of head for highest priority
    const head = document.head;
    const firstChild = head.firstChild;
    head.insertBefore(styleElement, firstChild);
  }

  /**
   * Load non-critical CSS asynchronously
   */
  loadNonCriticalCSS() {
    // Define non-critical CSS files
    const nonCriticalFiles = [
      "/css/components/capabilities-matrix.css",
      "/css/components/terminal.css",
      "/css/components/design-showcase.css",
      "/css/components/technical-arsenal.css",
      "/css/components/testimonial-carousel.css",
      "/css/components/footer.css",
      "/css/pages/home.css",
      "/css/utilities/animations.css",
      "/css/utilities/responsive.css",
    ];

    // Load each file asynchronously
    nonCriticalFiles.forEach((file) => {
      this.loadCSSAsync(file);
    });
  }

  /**
   * Load CSS file asynchronously
   */
  loadCSSAsync(href) {
    // Check if already loaded
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    link.onload = function () {
      this.onload = null;
      this.rel = "stylesheet";
    };

    // Fallback for browsers that don't support preload
    const noscript = document.createElement("noscript");
    const fallbackLink = document.createElement("link");
    fallbackLink.rel = "stylesheet";
    fallbackLink.href = href;
    noscript.appendChild(fallbackLink);

    document.head.appendChild(link);
    document.head.appendChild(noscript);
  }

  /**
   * Extract critical CSS from full stylesheet
   * This method can be used during build process
   */
  static extractCriticalCSS(fullCSS, criticalSelectors) {
    const criticalRules = [];
    const cssRules = fullCSS.split("}");

    cssRules.forEach((rule) => {
      if (!rule.trim()) return;

      const selector = rule.split("{")[0].trim();
      const isCritical = criticalSelectors.some((criticalSelector) =>
        selector.includes(criticalSelector)
      );

      if (isCritical) {
        criticalRules.push(rule + "}");
      }
    });

    return criticalRules.join("\n");
  }

  /**
   * Get critical selectors for above-the-fold content
   */
  static getCriticalSelectors() {
    return [
      ":root",
      "*",
      "html",
      "body",
      ".skip-links",
      ".skip-link",
      ".container",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      ".display",
      ".header",
      ".hero",
      ".hero-content",
      ".hero-title",
      ".hero-subtitle",
      ".sr-only",
      "@media (min-width: 768px)",
      "@media (min-width: 1024px)",
      "*:focus-visible",
      "@media (prefers-reduced-motion: reduce)",
    ];
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CriticalCSSInliner;
} else {
  window.CriticalCSSInliner = CriticalCSSInliner;
}
