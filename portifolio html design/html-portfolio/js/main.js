/* ==========================================================================
   MAIN JAVASCRIPT
   Core functionality and progressive enhancement
   ========================================================================== */

(function () {
  "use strict";

  // ==========================================================================
  // SCROLL-BASED ANIMATIONS
  // ==========================================================================

  /**
   * Initialize scroll-based animations using Intersection Observer
   */
  function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // If user prefers reduced motion, make all elements visible immediately
      const animatedElements = document.querySelectorAll(
        ".fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in-scroll"
      );
      animatedElements.forEach((element) => {
        element.classList.add("visible");
      });
      return;
    }

    // Create intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Optionally unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
      ".fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in-scroll"
    );
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // ==========================================================================
  // ENHANCED HOVER EFFECTS
  // ==========================================================================

  /**
   * Add enhanced hover effects for cards and buttons
   */
  function initEnhancedHoverEffects() {
    // Add hover classes to cards for enhanced effects
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      if (!card.classList.contains("card--accent")) {
        card.classList.add("card-hover-lift");
      }
    });

    // Add hover classes to buttons
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
      button.classList.add("btn-hover-lift");
    });

    // Add image zoom effects
    const imageContainers = document.querySelectorAll(".card__image");
    imageContainers.forEach((container) => {
      container.classList.add("image-hover-zoom");
    });

    // Add text hover effects to navigation links
    const navLinks = document.querySelectorAll(
      ".nav__link:not(.nav__link--active)"
    );
    navLinks.forEach((link) => {
      link.classList.add("text-hover-underline");
    });
  }

  // ==========================================================================
  // FOCUS ENHANCEMENTS
  // ==========================================================================

  /**
   * Enhance focus states for better accessibility
   */
  function initFocusEnhancements() {
    // Add enhanced focus rings to interactive elements
    const focusElements = document.querySelectorAll(
      "button, a, input, textarea, select"
    );
    focusElements.forEach((element) => {
      element.classList.add("focus-ring-animated");
    });
  }

  // ==========================================================================
  // KEYBOARD NAVIGATION
  // ==========================================================================

  /**
   * Enhanced keyboard navigation support
   */
  function initKeyboardNavigation() {
    // Handle escape key for closing modals/menus
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu");
        const navToggle = document.getElementById("nav-toggle");
        if (mobileMenu && mobileMenu.getAttribute("aria-hidden") === "false") {
          closeMobileMenu();
        }
      }
    });

    // Trap focus in mobile menu when open
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      const focusableElements = mobileMenu.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        mobileMenu.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            if (e.shiftKey) {
              // Shift + Tab
              if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
              }
            } else {
              // Tab
              if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
              }
            }
          }
        });
      }
    }

    // Add arrow key navigation for filter buttons
    const filterGroups = document.querySelectorAll(
      ".projects-filter-buttons, .filter-buttons"
    );
    filterGroups.forEach((group) => {
      const buttons = group.querySelectorAll("button");
      buttons.forEach((button, index) => {
        button.addEventListener("keydown", (e) => {
          let targetIndex;

          switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
              e.preventDefault();
              targetIndex = (index + 1) % buttons.length;
              buttons[targetIndex].focus();
              break;
            case "ArrowLeft":
            case "ArrowUp":
              e.preventDefault();
              targetIndex = (index - 1 + buttons.length) % buttons.length;
              buttons[targetIndex].focus();
              break;
            case "Home":
              e.preventDefault();
              buttons[0].focus();
              break;
            case "End":
              e.preventDefault();
              buttons[buttons.length - 1].focus();
              break;
          }
        });
      });
    });
  }

  // ==========================================================================
  // SCREEN READER ANNOUNCEMENTS
  // ==========================================================================

  /**
   * Create live region for screen reader announcements
   */
  function createLiveRegion() {
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only live-region";
    liveRegion.id = "live-region";
    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  /**
   * Announce message to screen readers
   */
  function announceToScreenReader(message) {
    const liveRegion =
      document.getElementById("live-region") || createLiveRegion();
    liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1000);
  }

  // ==========================================================================
  // FORM ACCESSIBILITY
  // ==========================================================================

  /**
   * Enhanced form accessibility
   */
  function initFormAccessibility() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      // Add form validation feedback
      const inputs = form.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );

      inputs.forEach((input) => {
        // Create error message container if it doesn't exist
        let errorContainer = input.parentNode.querySelector(".form-error");
        if (!errorContainer) {
          errorContainer = document.createElement("div");
          errorContainer.className = "form-error";
          errorContainer.setAttribute("aria-live", "polite");
          input.parentNode.appendChild(errorContainer);
        }

        // Set up validation
        input.addEventListener("invalid", (e) => {
          e.preventDefault();
          const message = getValidationMessage(input);
          errorContainer.textContent = message;
          errorContainer.style.display = "block";
          input.setAttribute(
            "aria-describedby",
            errorContainer.id || "error-" + input.id
          );
          announceToScreenReader(`Error: ${message}`);
        });

        input.addEventListener("input", () => {
          if (input.validity.valid) {
            errorContainer.textContent = "";
            errorContainer.style.display = "none";
            input.removeAttribute("aria-describedby");
          }
        });
      });
    });
  }

  /**
   * Get appropriate validation message for input
   */
  function getValidationMessage(input) {
    if (input.validity.valueMissing) {
      return `${input.labels[0]?.textContent || "This field"} is required`;
    }
    if (input.validity.typeMismatch) {
      return `Please enter a valid ${input.type}`;
    }
    if (input.validity.tooShort) {
      return `Please enter at least ${input.minLength} characters`;
    }
    if (input.validity.tooLong) {
      return `Please enter no more than ${input.maxLength} characters`;
    }
    return "Please check your input";
  }

  // ==========================================================================
  // LOADING STATES
  // ==========================================================================

  /**
   * Handle image loading states
   */
  function initImageLoadingStates() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      if (!img.complete) {
        // Add loading placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.style.aspectRatio = "16 / 9";

        // Insert placeholder before image
        img.parentNode.insertBefore(placeholder, img);
        img.style.display = "none";

        // Show image when loaded
        img.addEventListener("load", () => {
          placeholder.remove();
          img.style.display = "";
          img.classList.add("animate-fade-in");
        });

        // Handle error state
        img.addEventListener("error", () => {
          placeholder.textContent = "IMAGE FAILED TO LOAD";
          placeholder.style.color = "var(--color-accent-yellow)";
        });
      }
    });
  }

  // ==========================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ==========================================================================

  /**
   * Throttle function for performance optimization
   */
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function for performance optimization
   */
  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  /**
   * Initialize all functionality when DOM is ready
   */
  function init() {
    // Initialize scroll animations
    initScrollAnimations();

    // Initialize enhanced hover effects
    initEnhancedHoverEffects();

    // Initialize focus enhancements
    initFocusEnhancements();

    // Initialize keyboard navigation
    initKeyboardNavigation();

    // Initialize form accessibility
    initFormAccessibility();

    // Initialize image loading states
    initImageLoadingStates();

    // Create live region for announcements
    createLiveRegion();

    // Add loaded class to body for CSS transitions
    document.body.classList.add("loaded");

    // Announce page load to screen readers
    setTimeout(() => {
      const pageTitle =
        document.querySelector("h1")?.textContent || document.title;
      announceToScreenReader(`Page loaded: ${pageTitle}`);
    }, 1000);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Handle reduced motion preference changes
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", () => {
    if (mediaQuery.matches) {
      // Disable animations
      document.body.classList.add("reduce-motion");
    } else {
      // Re-enable animations
      document.body.classList.remove("reduce-motion");
    }
  });
})();
