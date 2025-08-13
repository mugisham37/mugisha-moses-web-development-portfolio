/**
 * Scroll Animations Controller
 * Handles fade-in-scroll animations and section visibility
 */

class ScrollAnimations {
  constructor() {
    this.animatedElements = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Initialize immediately for critical sections
    this.initializeImmediateAnimations();

    // Set up intersection observer for scroll animations
    this.setupIntersectionObserver();

    // Observe all elements with animation classes
    this.observeElements();

    // Fallback for older browsers
    this.setupFallback();

    // Force visibility for critical sections
    this.forceVisibilityForCriticalSections();
  }

  initializeImmediateAnimations() {
    // Make hero section immediately visible
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      heroSection.style.opacity = "1";
      heroSection.style.transform = "translateY(0)";
    }

    // Make header immediately visible
    const header = document.querySelector(".header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "0px 0px -100px 0px", // Trigger 100px before element enters viewport
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Select all elements that should be animated
    const selectors = [
      ".fade-in-scroll",
      ".animate-scale-in",
      ".animate-slide-in-left",
      ".animate-slide-in-right",
      ".animate-rotate-in",
      ".capabilities-matrix",
      ".project-showcase",
      ".terminal-section",
      ".technical-arsenal",
      ".client-impact",
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        // Don't observe hero section as it should be immediately visible
        if (!element.closest(".hero")) {
          this.observer.observe(element);
          this.animatedElements.push(element);
        }
      });
    });
  }

  animateElement(element) {
    // Add visible class for CSS animations
    element.classList.add("visible", "animate-in");

    // Ensure element is visible
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";

    // Handle staggered animations for child elements
    this.handleStaggeredAnimations(element);

    // Stop observing this element
    this.observer.unobserve(element);
  }

  handleStaggeredAnimations(parentElement) {
    const childElements = parentElement.querySelectorAll(
      '[class*="animate-delay-"]'
    );

    childElements.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add("visible", "animate-in");
        child.style.opacity = "1";
        child.style.transform = "translateY(0)";
      }, index * 100); // 100ms delay between each child
    });
  }

  setupFallback() {
    // Fallback for browsers without Intersection Observer support
    if (!("IntersectionObserver" in window)) {
      console.log("IntersectionObserver not supported, using fallback");
      this.fallbackAnimation();
    }

    // Fallback for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.disableAnimations();
    }
  }

  fallbackAnimation() {
    // Make all animated elements visible immediately
    const allAnimatedElements = document.querySelectorAll(`
      .fade-in-scroll,
      .animate-scale-in,
      .animate-slide-in-left,
      .animate-slide-in-right,
      .animate-rotate-in
    `);

    allAnimatedElements.forEach((element) => {
      element.classList.add("visible", "animate-in");
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

  disableAnimations() {
    // Add no-animation class to body
    document.body.classList.add("no-animations");

    // Make all elements immediately visible
    this.fallbackAnimation();
  }

  forceVisibilityForCriticalSections() {
    // Force visibility for sections that should always be visible
    const criticalSections = [
      ".capabilities-matrix",
      ".project-showcase",
      ".terminal-section",
      ".technical-arsenal",
      ".client-impact",
      ".final-cta",
    ];

    criticalSections.forEach((selector) => {
      const section = document.querySelector(selector);
      if (section) {
        // Remove any hiding classes
        section.classList.remove("fade-in-scroll");

        // Ensure visibility and proper positioning
        section.style.opacity = "1";
        section.style.transform = "none";
        section.style.visibility = "visible";
        section.style.display = "block";
        section.style.position = "relative";
        section.style.zIndex = "auto";

        // Add visible class
        section.classList.add("visible", "animate-in");

        console.log(`Forced visibility for: ${selector}`);
      }
    });
  }

  // Method to manually trigger animation for specific element
  triggerAnimation(element) {
    if (element) {
      this.animateElement(element);
    }
  }

  // Method to check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Method to force all animations to complete
  forceAllAnimations() {
    this.animatedElements.forEach((element) => {
      this.animateElement(element);
    });
  }

  // Destroy method for cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.animatedElements = [];
  }
}

// Initialize scroll animations when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create global instance
  window.scrollAnimations = new ScrollAnimations();

  // Force visibility after a short delay to ensure all CSS is loaded
  setTimeout(() => {
    window.scrollAnimations.forceVisibilityForCriticalSections();
  }, 100);

  // Additional fallback - force all animations after 2 seconds
  setTimeout(() => {
    window.scrollAnimations.forceAllAnimations();
  }, 2000);
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && window.scrollAnimations) {
    // Re-trigger animations when page becomes visible
    setTimeout(() => {
      window.scrollAnimations.forceVisibilityForCriticalSections();
    }, 100);
  }
});

// Handle window load event
window.addEventListener("load", () => {
  if (window.scrollAnimations) {
    // Final check to ensure all sections are visible
    window.scrollAnimations.forceVisibilityForCriticalSections();
  }
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScrollAnimations;
}
