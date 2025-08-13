/* ==========================================================================
   FOUNDATION ARCHITECTURE - CORE JAVASCRIPT
   Accessibility, performance, and interaction management
   ========================================================================== */

(function () {
  "use strict";

  /* ==========================================================================
     ACCESSIBILITY FOUNDATION
     ========================================================================== */

  // Keyboard navigation detection
  let isKeyboardUser = false;
  let isMouseUser = false;

  // Track keyboard usage
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      isKeyboardUser = true;
      isMouseUser = false;
      document.body.classList.add("keyboard-nav-active");
      document.body.classList.remove("mouse-nav-active");
    }
  });

  // Track mouse usage
  document.addEventListener("mousedown", function () {
    isMouseUser = true;
    isKeyboardUser = false;
    document.body.classList.add("mouse-nav-active");
    document.body.classList.remove("keyboard-nav-active");
  });

  // Focus trap utility
  function createFocusTrap(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    // Focus first element when trap is activated
    firstElement.focus();
  }

  // ARIA live region announcements
  function announceToScreenReader(message, priority = "polite") {
    const liveRegion = document.getElementById("live-region");
    if (liveRegion) {
      liveRegion.setAttribute("aria-live", priority);
      liveRegion.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = "";
      }, 1000);
    }
  }

  // Skip link functionality
  function initializeSkipLinks() {
    const skipLinks = document.querySelectorAll(".skip-link");

    skipLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.focus();
          targetElement.scrollIntoView({ behavior: "smooth" });
          announceToScreenReader(
            `Skipped to ${targetElement.getAttribute("aria-label") || targetId}`
          );
        }
      });
    });
  }

  /* ==========================================================================
     PERFORMANCE OPTIMIZATION
     ========================================================================== */

  // Intersection Observer for lazy loading and animations
  const observerOptions = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Lazy load images
        if (element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute("data-src");
        }

        // Trigger animations
        if (element.classList.contains("animate-on-scroll")) {
          element.classList.add("animate-in");
        }

        // Stop observing once loaded/animated
        intersectionObserver.unobserve(element);
      }
    });
  }, observerOptions);

  // Initialize lazy loading
  function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll("img[data-src]");
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    lazyImages.forEach((img) => intersectionObserver.observe(img));
    animatedElements.forEach((el) => intersectionObserver.observe(el));
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalImages = [
      "/images/hero-portrait.webp",
      "/images/hero-portrait.jpg",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  /* ==========================================================================
     RESPONSIVE UTILITIES
     ========================================================================== */

  // Viewport size detection
  function getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
    };
  }

  // Touch device detection
  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  // Update CSS custom properties based on viewport
  function updateViewportProperties() {
    const viewport = getViewportSize();
    const root = document.documentElement;

    root.style.setProperty("--viewport-width", `${viewport.width}px`);
    root.style.setProperty("--viewport-height", `${viewport.height}px`);

    // Add device classes
    document.body.classList.toggle("is-mobile", viewport.isMobile);
    document.body.classList.toggle("is-tablet", viewport.isTablet);
    document.body.classList.toggle("is-desktop", viewport.isDesktop);
    document.body.classList.toggle("is-touch", isTouchDevice());
  }

  /* ==========================================================================
     ERROR HANDLING
     ========================================================================== */

  // Global error handler
  window.addEventListener("error", function (e) {
    console.error("JavaScript Error:", e.error);

    // Graceful degradation - ensure core functionality works
    if (e.error && e.error.message.includes("animation")) {
      document.body.classList.add("no-animations");
    }
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", function (e) {
    console.error("Unhandled Promise Rejection:", e.reason);
    e.preventDefault();
  });

  /* ==========================================================================
     REDUCED MOTION SUPPORT
     ========================================================================== */

  function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function updateMotionPreference(mediaQuery) {
      if (mediaQuery.matches) {
        document.body.classList.add("reduce-motion");
        document.documentElement.style.setProperty(
          "--animation-duration",
          "0.01ms"
        );
        document.documentElement.style.setProperty(
          "--transition-duration",
          "0.01ms"
        );
      } else {
        document.body.classList.remove("reduce-motion");
        document.documentElement.style.removeProperty("--animation-duration");
        document.documentElement.style.removeProperty("--transition-duration");
      }
    }

    updateMotionPreference(prefersReducedMotion);
    prefersReducedMotion.addEventListener("change", updateMotionPreference);
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */

  // DOM Content Loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize accessibility features
    initializeSkipLinks();

    // Initialize performance optimizations
    initializeLazyLoading();
    preloadCriticalResources();

    // Initialize responsive utilities
    updateViewportProperties();

    // Initialize motion preferences
    handleReducedMotion();

    // Announce page load to screen readers
    announceToScreenReader("Page loaded successfully");

    console.log("Foundation architecture initialized");
  });

  // Window resize handler
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateViewportProperties, 150);
  });

  // Export utilities for other modules
  window.BrutalistFoundation = {
    announceToScreenReader,
    createFocusTrap,
    getViewportSize,
    isTouchDevice,
    isKeyboardUser: () => isKeyboardUser,
    isMouseUser: () => isMouseUser,
  };
})();
