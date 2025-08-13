/* ==========================================================================
   VANTA.JS PARTICLE BACKGROUND INTEGRATION
   White dots and yellow accents particle system
   ========================================================================== */

(function () {
  "use strict";

  class VantaBackgroundSystem {
    constructor(elementId, options = {}) {
      this.element = document.getElementById(elementId);
      this.vantaEffect = null;

      // Default configuration for brutalist aesthetic
      this.config = {
        el: this.element,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xffffff, // White dots
        color2: 0xffff00, // Yellow accents
        backgroundColor: 0x000000, // Black background
        size: 1.5, // Dot size
        quantity: 100, // Number of particles
        showLines: false, // No connecting lines for cleaner look
        ...options,
      };

      this.isInitialized = false;
      this.isReducedMotion = false;

      this.init();
    }

    async init() {
      try {
        // Check for reduced motion preference
        this.checkReducedMotion();

        if (this.isReducedMotion) {
          this.showStaticBackground();
          return;
        }

        // Load Vanta.js if not already loaded
        await this.loadVantaJS();

        // Initialize the effect
        this.initializeVantaEffect();

        this.isInitialized = true;

        // Set up event listeners
        this.setupEventListeners();
      } catch (error) {
        console.error("Vanta Background System initialization failed:", error);
        this.showStaticBackground();
      }
    }

    checkReducedMotion() {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.isReducedMotion = mediaQuery.matches;

      // Listen for changes
      mediaQuery.addEventListener("change", (e) => {
        this.isReducedMotion = e.matches;

        if (this.isReducedMotion && this.vantaEffect) {
          this.destroy();
          this.showStaticBackground();
        } else if (!this.isReducedMotion && !this.vantaEffect) {
          this.init();
        }
      });
    }

    loadVantaJS() {
      return new Promise((resolve, reject) => {
        // Check if Vanta is already loaded
        if (window.VANTA && window.VANTA.DOTS) {
          resolve();
          return;
        }

        // Load Three.js first (required by Vanta)
        if (!window.THREE) {
          const threeScript = document.createElement("script");
          threeScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
          threeScript.onload = () => {
            this.loadVantaDots().then(resolve).catch(reject);
          };
          threeScript.onerror = () =>
            reject(new Error("Failed to load Three.js"));
          document.head.appendChild(threeScript);
        } else {
          this.loadVantaDots().then(resolve).catch(reject);
        }
      });
    }

    loadVantaDots() {
      return new Promise((resolve, reject) => {
        const vantaScript = document.createElement("script");
        vantaScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.dots.min.js";
        vantaScript.onload = resolve;
        vantaScript.onerror = () =>
          reject(new Error("Failed to load Vanta.js"));
        document.head.appendChild(vantaScript);
      });
    }

    initializeVantaEffect() {
      if (!window.VANTA || !window.VANTA.DOTS) {
        throw new Error("Vanta.js DOTS effect not available");
      }

      // Destroy existing effect if any
      if (this.vantaEffect) {
        this.vantaEffect.destroy();
      }

      // Create the effect
      this.vantaEffect = window.VANTA.DOTS(this.config);

      // Add custom styling to the canvas
      const canvas = this.element.querySelector("canvas");
      if (canvas) {
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "1";
        canvas.style.pointerEvents = "none";
      }
    }

    setupEventListeners() {
      // Handle window resize
      const handleResize = this.debounce(() => {
        if (this.vantaEffect && this.vantaEffect.resize) {
          this.vantaEffect.resize();
        }
      }, 250);

      window.addEventListener("resize", handleResize);

      // Handle visibility changes for performance
      document.addEventListener("visibilitychange", () => {
        if (this.vantaEffect) {
          if (document.hidden) {
            this.pause();
          } else {
            this.resume();
          }
        }
      });

      // Handle intersection observer for performance optimization
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.target === this.element) {
                if (entry.isIntersecting) {
                  this.resume();
                } else {
                  this.pause();
                }
              }
            });
          },
          {
            threshold: 0.1,
          }
        );

        observer.observe(this.element);
      }
    }

    showStaticBackground() {
      // Create a static background pattern for reduced motion users
      this.element.style.background = `
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 0, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        radial-gradient(circle at 60% 40%, rgba(255, 255, 0, 0.05) 1px, transparent 1px),
        #000000
      `;
      this.element.style.backgroundSize =
        "100px 100px, 150px 150px, 80px 80px, 120px 120px";
      this.element.style.backgroundPosition =
        "0 0, 50px 50px, 25px 75px, 75px 25px";
    }

    // Performance optimization methods
    pause() {
      if (this.vantaEffect && this.vantaEffect.renderer) {
        this.vantaEffect.renderer.setAnimationLoop(null);
      }
    }

    resume() {
      if (
        this.vantaEffect &&
        this.vantaEffect.renderer &&
        this.vantaEffect.animationLoop
      ) {
        this.vantaEffect.renderer.setAnimationLoop(
          this.vantaEffect.animationLoop
        );
      }
    }

    destroy() {
      if (this.vantaEffect) {
        this.vantaEffect.destroy();
        this.vantaEffect = null;
      }
      this.isInitialized = false;
    }

    // Update configuration
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };

      if (this.vantaEffect) {
        // Reinitialize with new config
        this.destroy();
        this.initializeVantaEffect();
      }
    }

    // Utility methods
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Public methods for external control
    setQuantity(quantity) {
      this.updateConfig({ quantity });
    }

    setSize(size) {
      this.updateConfig({ size });
    }

    setColors(color, color2) {
      this.updateConfig({ color, color2 });
    }

    // Responsive adjustments
    adjustForMobile() {
      if (window.innerWidth <= 768) {
        this.updateConfig({
          quantity: 50, // Reduce particles on mobile
          size: 1.0, // Smaller particles
          scaleMobile: 0.8,
        });
      } else {
        this.updateConfig({
          quantity: 100,
          size: 1.5,
          scaleMobile: 1.0,
        });
      }
    }
  }

  // Auto-initialize for hero section if element exists
  document.addEventListener("DOMContentLoaded", () => {
    const heroElement = document.querySelector(".hero");
    if (heroElement && !heroElement.id) {
      heroElement.id = "hero-vanta-background";
    }

    if (document.getElementById("hero-vanta-background")) {
      window.heroVantaBackground = new VantaBackgroundSystem(
        "hero-vanta-background",
        {
          quantity: 80,
          size: 1.2,
          color: 0xffffff,
          color2: 0xffff00,
          backgroundColor: 0x000000,
        }
      );

      // Adjust for mobile on load and resize
      window.heroVantaBackground.adjustForMobile();
      window.addEventListener("resize", () => {
        window.heroVantaBackground.adjustForMobile();
      });
    }
  });

  // Export to global scope
  window.VantaBackgroundSystem = VantaBackgroundSystem;
})();
