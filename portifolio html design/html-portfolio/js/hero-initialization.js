/* ==========================================================================
   HERO SECTION INITIALIZATION
   Coordinates all hero section components and animations
   ========================================================================== */

(function () {
  "use strict";

  class HeroSectionController {
    constructor() {
      this.components = {
        asciiPortrait: null,
        vantaBackground: null,
        typewriter: null,
      };

      this.isInitialized = false;
      this.prefersReducedMotion = false;

      this.init();
    }

    init() {
      // Check motion preferences
      this.checkMotionPreferences();

      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          this.initializeComponents()
        );
      } else {
        this.initializeComponents();
      }
    }

    checkMotionPreferences() {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.prefersReducedMotion = mediaQuery.matches;

      // Listen for changes
      mediaQuery.addEventListener("change", (e) => {
        this.prefersReducedMotion = e.matches;
        this.handleMotionPreferenceChange();
      });
    }

    async initializeComponents() {
      try {
        // Initialize components in sequence for better performance
        await this.initializeVantaBackground();
        await this.initializeASCIIPortrait();
        await this.initializeTypewriter();

        this.isInitialized = true;
        this.announceReadiness();
      } catch (error) {
        console.error("Hero Section initialization failed:", error);
        this.showFallbackContent();
      }
    }

    async initializeVantaBackground() {
      return new Promise((resolve) => {
        if (this.prefersReducedMotion) {
          resolve();
          return;
        }

        try {
          if (window.VantaBackgroundSystem) {
            this.components.vantaBackground = new window.VantaBackgroundSystem(
              "hero-vanta-background",
              {
                quantity: window.innerWidth <= 768 ? 50 : 80,
                size: window.innerWidth <= 768 ? 1.0 : 1.2,
                color: 0xffffff,
                color2: 0xffff00,
                backgroundColor: 0x000000,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
              }
            );
          }
        } catch (error) {
          console.warn("Vanta background initialization failed:", error);
        }

        resolve();
      });
    }

    async initializeASCIIPortrait() {
      return new Promise((resolve) => {
        if (this.prefersReducedMotion) {
          this.showPortraitFallback();
          resolve();
          return;
        }

        try {
          if (window.ASCIIPortraitSystem) {
            this.components.asciiPortrait = new window.ASCIIPortraitSystem(
              "ascii-portrait-canvas",
              "images/portrait-placeholder.svg",
              {
                width: window.innerWidth <= 768 ? 50 : 70,
                height: window.innerWidth <= 768 ? 35 : 50,
                fontSize: window.innerWidth <= 768 ? 8 : 10,
                autoStart: true,
                loop: true,
                onComplete: () => {
                  this.onPortraitComplete();
                },
              }
            );
          }
        } catch (error) {
          console.warn("ASCII Portrait initialization failed:", error);
          this.showPortraitFallback();
        }

        resolve();
      });
    }

    async initializeTypewriter() {
      return new Promise((resolve) => {
        try {
          if (window.TypewriterEffect) {
            const phrases = [
              "FULL-STACK DEVELOPER WHO TRANSFORMS IDEAS INTO DIGITAL REALITY",
              "BUILDING THE FUTURE OF WEB DEVELOPMENT",
              "CRAFTING DIGITAL EXPERIENCES WITH PRECISION",
              "WHERE CODE MEETS CREATIVITY",
            ];

            if (this.prefersReducedMotion) {
              // Show static text for reduced motion
              this.showStaticTypewriter(phrases[0]);
            } else {
              this.components.typewriter = new window.TypewriterEffect(
                "hero-typewriter",
                {
                  phrases: phrases,
                  typeSpeed: 50,
                  deleteSpeed: 30,
                  pauseTime: 3000,
                  deletePauseTime: 1000,
                  loop: true,
                  scrambleEffect: false,
                  startDelay: 2000, // Start after ASCII portrait begins
                }
              );
            }
          }
        } catch (error) {
          console.warn("Typewriter initialization failed:", error);
          this.showStaticTypewriter(
            "FULL-STACK DEVELOPER WHO TRANSFORMS IDEAS INTO DIGITAL REALITY"
          );
        }

        resolve();
      });
    }

    showPortraitFallback() {
      const canvas = document.getElementById("ascii-portrait-canvas");
      const fallback = document.querySelector(".portrait-fallback");

      if (canvas && fallback) {
        canvas.style.display = "none";
        fallback.classList.add("active");
      }
    }

    showStaticTypewriter(text) {
      const typewriterElement = document.getElementById("hero-typewriter");
      if (typewriterElement) {
        typewriterElement.innerHTML = `
          <span class="typewriter-text">${text}</span>
          <span class="typewriter-cursor" style="animation: none; opacity: 1;">|</span>
        `;
      }
    }

    showFallbackContent() {
      // Show all fallback content if initialization fails
      this.showPortraitFallback();
      this.showStaticTypewriter(
        "FULL-STACK DEVELOPER WHO TRANSFORMS IDEAS INTO DIGITAL REALITY"
      );

      // Add fallback class to hero section
      const heroSection = document.querySelector(".hero");
      if (heroSection) {
        heroSection.classList.add("hero--fallback");
      }
    }

    onPortraitComplete() {
      // Trigger any additional effects when portrait animation completes
      console.log("ASCII Portrait animation cycle complete");

      // Optional: Add visual feedback or trigger other animations
      const heroSection = document.querySelector(".hero");
      if (heroSection) {
        heroSection.classList.add("portrait-complete");
      }
    }

    handleMotionPreferenceChange() {
      if (this.prefersReducedMotion) {
        // Disable animations
        this.disableAnimations();
      } else {
        // Re-enable animations
        this.enableAnimations();
      }
    }

    disableAnimations() {
      // Pause or destroy animated components
      if (this.components.asciiPortrait) {
        this.components.asciiPortrait.pause();
      }

      if (this.components.vantaBackground) {
        this.components.vantaBackground.pause();
      }

      if (this.components.typewriter) {
        this.components.typewriter.pause();
      }

      // Show fallback content
      this.showFallbackContent();
    }

    enableAnimations() {
      // Re-initialize components if they were disabled
      if (!this.isInitialized) {
        this.initializeComponents();
      } else {
        // Resume existing components
        if (this.components.asciiPortrait) {
          this.components.asciiPortrait.resume();
        }

        if (this.components.vantaBackground) {
          this.components.vantaBackground.resume();
        }

        if (this.components.typewriter) {
          this.components.typewriter.resume();
        }
      }
    }

    announceReadiness() {
      // Announce to screen readers that hero section is ready
      const liveRegion = document.getElementById("live-region");
      if (liveRegion) {
        liveRegion.textContent =
          "Hero section loaded with interactive elements";
        setTimeout(() => {
          liveRegion.textContent = "";
        }, 1000);
      }

      // Dispatch custom event for other scripts
      const event = new CustomEvent("heroSectionReady", {
        detail: {
          components: this.components,
          reducedMotion: this.prefersReducedMotion,
        },
      });
      document.dispatchEvent(event);
    }

    // Public methods for external control
    restart() {
      if (this.components.asciiPortrait) {
        this.components.asciiPortrait.restart();
      }

      if (this.components.typewriter) {
        this.components.typewriter.restart();
      }
    }

    pause() {
      Object.values(this.components).forEach((component) => {
        if (component && typeof component.pause === "function") {
          component.pause();
        }
      });
    }

    resume() {
      Object.values(this.components).forEach((component) => {
        if (component && typeof component.resume === "function") {
          component.resume();
        }
      });
    }

    destroy() {
      Object.values(this.components).forEach((component) => {
        if (component && typeof component.destroy === "function") {
          component.destroy();
        }
      });

      this.components = {
        asciiPortrait: null,
        vantaBackground: null,
        typewriter: null,
      };

      this.isInitialized = false;
    }
  }

  // Initialize hero section controller
  window.heroController = new HeroSectionController();

  // Export for external access
  window.HeroSectionController = HeroSectionController;
})();
