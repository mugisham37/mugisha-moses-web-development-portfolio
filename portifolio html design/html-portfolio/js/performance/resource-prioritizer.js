/* ==========================================================================
   RESOURCE PRIORITIZER
   Implement resource prioritization with fetchpriority attributes
   ========================================================================== */

/**
 * Resource Prioritizer Module
 * Handles resource loading prioritization for optimal performance
 */
class ResourcePrioritizer {
  constructor() {
    this.priorityMap = new Map();
    this.initialized = false;
    this.supportsFetchPriority = "fetchPriority" in HTMLImageElement.prototype;
  }

  /**
   * Initialize the resource prioritizer
   */
  init() {
    if (this.initialized) return;

    try {
      // Define resource priorities
      this.defineResourcePriorities();

      // Apply priorities to existing resources
      this.applyResourcePriorities();

      // Set up dynamic priority adjustment
      this.setupDynamicPriorities();

      // Monitor resource loading
      this.monitorResourceLoading();

      this.initialized = true;
      console.log(
        `Resource prioritizer initialized. fetchPriority support: ${this.supportsFetchPriority}`
      );
    } catch (error) {
      console.error("Failed to initialize resource prioritizer:", error);
    }
  }

  /**
   * Define resource priorities based on importance
   */
  defineResourcePriorities() {
    // Critical above-the-fold resources
    this.priorityMap.set("critical-images", {
      priority: "high",
      selectors: [
        ".hero img",
        ".hero picture img",
        ".logo img",
        '[data-priority="high"]',
      ],
      type: "image",
    });

    this.priorityMap.set("critical-css", {
      priority: "high",
      selectors: [
        'link[rel="stylesheet"][data-critical]',
        'link[href*="critical.css"]',
        'link[href*="main.css"]',
      ],
      type: "style",
    });

    this.priorityMap.set("critical-fonts", {
      priority: "high",
      selectors: [
        'link[rel="preload"][as="font"]',
        'link[href*="Space+Mono"]',
        'link[href*="JetBrains+Mono"]',
        'link[href*="Inter"]',
      ],
      type: "font",
    });

    // Important but not critical resources
    this.priorityMap.set("important-images", {
      priority: "auto",
      selectors: [
        ".capabilities-matrix img",
        ".project-card img",
        '[data-priority="medium"]',
      ],
      type: "image",
    });

    this.priorityMap.set("component-css", {
      priority: "auto",
      selectors: ['link[href*="components/"]', 'link[href*="utilities/"]'],
      type: "style",
    });

    // Low priority resources
    this.priorityMap.set("lazy-images", {
      priority: "low",
      selectors: [
        'img[loading="lazy"]',
        ".testimonial img",
        ".footer img",
        '[data-priority="low"]',
      ],
      type: "image",
    });

    this.priorityMap.set("non-critical-scripts", {
      priority: "low",
      selectors: [
        'script[src*="analytics"]',
        'script[src*="tracking"]',
        "script[async]",
        "script[defer]",
      ],
      type: "script",
    });
  }

  /**
   * Apply resource priorities to existing elements
   */
  applyResourcePriorities() {
    this.priorityMap.forEach((config, name) => {
      config.selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          this.applyPriorityToElement(element, config);
        });
      });
    });
  }

  /**
   * Apply priority to a specific element
   */
  applyPriorityToElement(element, config) {
    // Apply fetchpriority if supported
    if (this.supportsFetchPriority) {
      element.fetchPriority = config.priority;
    }

    // Apply additional optimizations based on priority
    switch (config.priority) {
      case "high":
        this.applyHighPriorityOptimizations(element, config.type);
        break;
      case "low":
        this.applyLowPriorityOptimizations(element, config.type);
        break;
      default:
        this.applyDefaultOptimizations(element, config.type);
    }

    // Add data attribute for debugging
    element.setAttribute("data-resource-priority", config.priority);
  }

  /**
   * Apply high priority optimizations
   */
  applyHighPriorityOptimizations(element, type) {
    switch (type) {
      case "image":
        // Eager loading for critical images
        element.loading = "eager";
        element.decoding = "sync";

        // Preload if not already loaded
        if (!element.complete && element.src) {
          this.preloadResource(element.src, "image");
        }
        break;

      case "style":
        // Ensure critical CSS is not deferred
        if (element.media === "print") {
          element.media = "all";
        }
        break;

      case "script":
        // Remove defer/async for critical scripts
        element.removeAttribute("defer");
        element.removeAttribute("async");
        break;
    }
  }

  /**
   * Apply low priority optimizations
   */
  applyLowPriorityOptimizations(element, type) {
    switch (type) {
      case "image":
        // Lazy loading for non-critical images
        element.loading = "lazy";
        element.decoding = "async";
        break;

      case "style":
        // Load non-critical CSS asynchronously
        if (element.rel === "stylesheet") {
          this.loadCSSAsync(element);
        }
        break;

      case "script":
        // Defer non-critical scripts
        if (!element.hasAttribute("async")) {
          element.defer = true;
        }
        break;
    }
  }

  /**
   * Apply default optimizations
   */
  applyDefaultOptimizations(element, type) {
    switch (type) {
      case "image":
        // Auto loading with async decoding
        element.loading = element.loading || "auto";
        element.decoding = "async";
        break;

      case "script":
        // Defer by default unless explicitly async
        if (!element.hasAttribute("async") && !element.hasAttribute("defer")) {
          element.defer = true;
        }
        break;
    }
  }

  /**
   * Setup dynamic priority adjustment based on user behavior
   */
  setupDynamicPriorities() {
    // Adjust priorities based on scroll position
    this.setupScrollBasedPriorities();

    // Adjust priorities based on user interactions
    this.setupInteractionBasedPriorities();

    // Adjust priorities based on connection speed
    this.setupConnectionBasedPriorities();
  }

  /**
   * Setup scroll-based priority adjustments
   */
  setupScrollBasedPriorities() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Increase priority for elements coming into view
            this.increasePriority(entry.target);
          }
        });
      },
      {
        rootMargin: "200px 0px",
      }
    );

    // Observe images and other resources
    const observableElements = document.querySelectorAll("img, video, iframe");
    observableElements.forEach((element) => observer.observe(element));
  }

  /**
   * Setup interaction-based priority adjustments
   */
  setupInteractionBasedPriorities() {
    // Increase priority for hovered elements
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("img, video")) {
        this.increasePriority(e.target);
      }
    });

    // Preload resources for likely navigation
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.matches("a[href]")) {
          this.preloadPageResources(e.target.href);
        }
      },
      true
    );
  }

  /**
   * Setup connection-based priority adjustments
   */
  setupConnectionBasedPriorities() {
    if (!("connection" in navigator)) return;

    const connection = navigator.connection;
    const isSlowConnection =
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g" ||
      connection.saveData;

    if (isSlowConnection) {
      // Reduce priorities for slow connections
      this.adjustPrioritiesForSlowConnection();
    }

    // Listen for connection changes
    connection.addEventListener("change", () => {
      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        this.adjustPrioritiesForSlowConnection();
      }
    });
  }

  /**
   * Increase priority for an element
   */
  increasePriority(element) {
    const currentPriority =
      element.getAttribute("data-resource-priority") || "auto";

    if (currentPriority === "low") {
      element.fetchPriority = "auto";
      element.setAttribute("data-resource-priority", "auto");
    } else if (currentPriority === "auto") {
      element.fetchPriority = "high";
      element.setAttribute("data-resource-priority", "high");
    }
  }

  /**
   * Adjust priorities for slow connections
   */
  adjustPrioritiesForSlowConnection() {
    // Reduce priority for non-critical images
    const nonCriticalImages = document.querySelectorAll(
      'img[data-resource-priority="auto"], img[data-resource-priority="low"]'
    );
    nonCriticalImages.forEach((img) => {
      img.fetchPriority = "low";
      img.loading = "lazy";
    });

    // Defer non-critical scripts
    const nonCriticalScripts = document.querySelectorAll(
      'script[data-resource-priority="auto"], script[data-resource-priority="low"]'
    );
    nonCriticalScripts.forEach((script) => {
      script.defer = true;
    });
  }

  /**
   * Preload a resource
   */
  preloadResource(href, as, type = null) {
    // Check if already preloaded
    const existingPreload = document.querySelector(
      `link[rel="preload"][href="${href}"]`
    );
    if (existingPreload) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;

    if (type) {
      link.type = type;
    }

    if (as === "font") {
      link.crossOrigin = "anonymous";
    }

    if (this.supportsFetchPriority) {
      link.fetchPriority = "high";
    }

    document.head.appendChild(link);
  }

  /**
   * Preload resources for a page
   */
  preloadPageResources(href) {
    // Only preload for same-origin URLs
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
    } catch (e) {
      return;
    }

    // Preload the page
    this.preloadResource(href, "document");
  }

  /**
   * Load CSS asynchronously
   */
  loadCSSAsync(linkElement) {
    const href = linkElement.href;

    // Create new link for async loading
    const asyncLink = document.createElement("link");
    asyncLink.rel = "preload";
    asyncLink.as = "style";
    asyncLink.href = href;
    asyncLink.onload = function () {
      this.onload = null;
      this.rel = "stylesheet";
    };

    // Replace original link
    linkElement.parentNode.replaceChild(asyncLink, linkElement);
  }

  /**
   * Monitor resource loading performance
   */
  monitorResourceLoading() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          this.analyzeResourcePerformance(entry);
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });
  }

  /**
   * Analyze resource loading performance
   */
  analyzeResourcePerformance(entry) {
    const loadTime = entry.responseEnd - entry.startTime;
    const isSlowResource = loadTime > 1000; // 1 second threshold

    if (isSlowResource) {
      console.warn(
        `Slow resource detected: ${entry.name} (${loadTime.toFixed(2)}ms)`
      );

      // Adjust priority for similar resources
      this.adjustSimilarResourcePriorities(entry.name, "low");
    }
  }

  /**
   * Adjust priorities for similar resources
   */
  adjustSimilarResourcePriorities(resourceName, priority) {
    const resourceType = this.getResourceType(resourceName);
    const selector = this.getResourceSelector(resourceType);

    if (selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element.src && element.src.includes(resourceType)) {
          element.fetchPriority = priority;
          element.setAttribute("data-resource-priority", priority);
        }
      });
    }
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) return "image";
    if (url.match(/\.(css)$/i)) return "style";
    if (url.match(/\.(js)$/i)) return "script";
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return "font";
    return "other";
  }

  /**
   * Get selector for resource type
   */
  getResourceSelector(type) {
    const selectors = {
      image: "img",
      style: 'link[rel="stylesheet"]',
      script: "script[src]",
      font: 'link[rel="preload"][as="font"]',
    };
    return selectors[type];
  }

  /**
   * Get prioritization status
   */
  getPrioritizationStatus() {
    const elements = document.querySelectorAll("[data-resource-priority]");
    const status = {
      total: elements.length,
      high: 0,
      auto: 0,
      low: 0,
      supportsFetchPriority: this.supportsFetchPriority,
    };

    elements.forEach((element) => {
      const priority = element.getAttribute("data-resource-priority");
      status[priority] = (status[priority] || 0) + 1;
    });

    return status;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ResourcePrioritizer;
} else {
  window.ResourcePrioritizer = ResourcePrioritizer;
}
