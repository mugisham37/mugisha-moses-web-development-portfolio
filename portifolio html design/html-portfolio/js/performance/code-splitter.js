/* ==========================================================================
   CODE SPLITTER
   JavaScript code splitting with dynamic imports for non-critical features
   ========================================================================== */

/**
 * Code Splitter Module
 * Handles dynamic loading of non-critical JavaScript modules
 */
class CodeSplitter {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the code splitter
   */
  init() {
    if (this.initialized) return;

    try {
      // Set up intersection observers for lazy loading
      this.setupLazyLoading();

      // Set up event-based loading
      this.setupEventBasedLoading();

      // Preload critical modules
      this.preloadCriticalModules();

      this.initialized = true;
      console.log("Code splitter initialized successfully");
    } catch (error) {
      console.error("Failed to initialize code splitter:", error);
    }
  }

  /**
   * Setup lazy loading for modules based on viewport intersection
   */
  setupLazyLoading() {
    if (!("IntersectionObserver" in window)) {
      // Fallback: load modules immediately
      this.loadAllModules();
      return;
    }

    // Define modules and their trigger elements
    const lazyModules = [
      {
        module: "capabilities-matrix",
        trigger: ".capabilities-matrix",
        path: "/js/components/capabilities-matrix.js",
      },
      {
        module: "terminal",
        trigger: ".terminal-section",
        path: "/js/components/terminal.js",
      },
      {
        module: "project-showcase",
        trigger: ".project-showcase",
        path: "/js/components/project-showcase.js",
      },
      {
        module: "technical-arsenal",
        trigger: ".technical-arsenal",
        path: "/js/components/technical-arsenal.js",
      },
      {
        module: "testimonial-carousel",
        trigger: ".testimonial-carousel",
        path: "/js/components/testimonial-carousel.js",
      },
      {
        module: "contact-form",
        trigger: ".contact-form",
        path: "/js/components/contact-form.js",
      },
    ];

    // Create intersection observer
    const observerOptions = {
      root: null,
      rootMargin: "100px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const moduleConfig = lazyModules.find((config) =>
            entry.target.matches(config.trigger)
          );

          if (moduleConfig) {
            this.loadModule(moduleConfig.module, moduleConfig.path);
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe trigger elements
    lazyModules.forEach((config) => {
      const elements = document.querySelectorAll(config.trigger);
      elements.forEach((element) => observer.observe(element));
    });
  }

  /**
   * Setup event-based loading for interactive features
   */
  setupEventBasedLoading() {
    // Load modules on first user interaction
    const interactionEvents = ["click", "touchstart", "keydown"];

    const loadOnInteraction = () => {
      this.loadModule("interactions", "/js/components/interactions.js");

      // Remove event listeners after first interaction
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, loadOnInteraction, {
          passive: true,
        });
      });
    };

    // Add event listeners
    interactionEvents.forEach((event) => {
      document.addEventListener(event, loadOnInteraction, { passive: true });
    });

    // Load search functionality when search input is focused
    document.addEventListener("focusin", (e) => {
      if (e.target.matches(".search-input, [data-search]")) {
        this.loadModule("search", "/js/components/search.js");
      }
    });

    // Load form validation when form is interacted with
    document.addEventListener("focusin", (e) => {
      if (e.target.matches("form input, form textarea, form select")) {
        this.loadModule("form-validation", "/js/components/form-validation.js");
      }
    });
  }

  /**
   * Preload critical modules
   */
  preloadCriticalModules() {
    const criticalModules = [
      {
        module: "hero-animations",
        path: "/js/components/hero-animations.js",
        condition: () => document.querySelector(".hero"),
      },
      {
        module: "navigation",
        path: "/js/components/navigation.js",
        condition: () => document.querySelector(".header"),
      },
    ];

    criticalModules.forEach((config) => {
      if (config.condition()) {
        this.preloadModule(config.module, config.path);
      }
    });
  }

  /**
   * Load a module dynamically
   */
  async loadModule(moduleName, modulePath) {
    // Check if already loaded
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    // Check if already loading
    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    console.log(`Loading module: ${moduleName}`);

    // Create loading promise
    const loadingPromise = this.importModule(modulePath)
      .then((module) => {
        this.loadedModules.set(moduleName, module);
        this.onModuleLoaded(moduleName, module);
        return module;
      })
      .catch((error) => {
        console.error(`Failed to load module ${moduleName}:`, error);
        this.onModuleError(moduleName, error);
        throw error;
      })
      .finally(() => {
        this.loadingPromises.delete(moduleName);
      });

    this.loadingPromises.set(moduleName, loadingPromise);
    return loadingPromise;
  }

  /**
   * Preload a module without executing
   */
  preloadModule(moduleName, modulePath) {
    // Create preload link
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = modulePath;
    document.head.appendChild(link);

    console.log(`Preloading module: ${moduleName}`);
  }

  /**
   * Import module with fallback
   */
  async importModule(modulePath) {
    try {
      // Try dynamic import
      const module = await import(modulePath);
      return module;
    } catch (error) {
      // Fallback to script loading
      return this.loadModuleAsScript(modulePath);
    }
  }

  /**
   * Load module as script (fallback)
   */
  loadModuleAsScript(modulePath) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = modulePath;
      script.type = "module";

      script.onload = () => {
        // Try to get module from global scope
        const moduleName = this.getModuleNameFromPath(modulePath);
        const module = window[moduleName] || {};
        resolve(module);
      };

      script.onerror = () => {
        reject(new Error(`Failed to load script: ${modulePath}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Get module name from path
   */
  getModuleNameFromPath(path) {
    const filename = path.split("/").pop().replace(".js", "");
    return filename.replace(/-([a-z])/g, (match, letter) =>
      letter.toUpperCase()
    );
  }

  /**
   * Handle successful module loading
   */
  onModuleLoaded(moduleName, module) {
    console.log(`Module loaded successfully: ${moduleName}`);

    // Initialize module if it has an init function
    if (module.default && typeof module.default.init === "function") {
      try {
        module.default.init();
      } catch (error) {
        console.error(`Failed to initialize module ${moduleName}:`, error);
      }
    } else if (typeof module.init === "function") {
      try {
        module.init();
      } catch (error) {
        console.error(`Failed to initialize module ${moduleName}:`, error);
      }
    }

    // Dispatch custom event
    const event = new CustomEvent("moduleLoaded", {
      detail: { moduleName, module },
    });
    document.dispatchEvent(event);
  }

  /**
   * Handle module loading errors
   */
  onModuleError(moduleName, error) {
    console.error(`Module loading error: ${moduleName}`, error);

    // Dispatch error event
    const event = new CustomEvent("moduleError", {
      detail: { moduleName, error },
    });
    document.dispatchEvent(event);
  }

  /**
   * Load all modules immediately (fallback)
   */
  loadAllModules() {
    const allModules = [
      {
        name: "capabilities-matrix",
        path: "/js/components/capabilities-matrix.js",
      },
      { name: "terminal", path: "/js/components/terminal.js" },
      { name: "project-showcase", path: "/js/components/project-showcase.js" },
      {
        name: "technical-arsenal",
        path: "/js/components/technical-arsenal.js",
      },
      {
        name: "testimonial-carousel",
        path: "/js/components/testimonial-carousel.js",
      },
      { name: "contact-form", path: "/js/components/contact-form.js" },
      { name: "interactions", path: "/js/components/interactions.js" },
      { name: "search", path: "/js/components/search.js" },
      { name: "form-validation", path: "/js/components/form-validation.js" },
    ];

    allModules.forEach((config) => {
      this.loadModule(config.name, config.path).catch(() => {
        // Ignore errors in fallback mode
      });
    });
  }

  /**
   * Get loading status
   */
  getLoadingStatus() {
    return {
      initialized: this.initialized,
      loadedModules: Array.from(this.loadedModules.keys()),
      loadingModules: Array.from(this.loadingPromises.keys()),
      totalLoaded: this.loadedModules.size,
    };
  }

  /**
   * Manually load a module
   */
  async loadModuleManually(moduleName, modulePath) {
    return this.loadModule(moduleName, modulePath);
  }

  /**
   * Check if module is loaded
   */
  isModuleLoaded(moduleName) {
    return this.loadedModules.has(moduleName);
  }

  /**
   * Get loaded module
   */
  getModule(moduleName) {
    return this.loadedModules.get(moduleName);
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CodeSplitter;
} else {
  window.CodeSplitter = CodeSplitter;
}
