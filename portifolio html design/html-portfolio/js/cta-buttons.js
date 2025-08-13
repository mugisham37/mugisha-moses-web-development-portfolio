/* ==========================================================================
   CTA BUTTON SYSTEM
   Enhanced button interactions with ripple effects and animations
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Create ripple effect on button click
   */
  function createRippleEffect(button, event) {
    // Remove existing ripples
    const existingRipples = button.querySelectorAll(".btn-ripple");
    existingRipples.forEach((ripple) => ripple.remove());

    // Create new ripple
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("btn-ripple");

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Add magnetic effect to buttons
   */
  function addMagneticEffect(button) {
    let isHovering = false;

    button.addEventListener("mouseenter", () => {
      isHovering = true;
    });

    button.addEventListener("mouseleave", () => {
      isHovering = false;
      // Reset transform
      button.style.transform = "";
    });

    button.addEventListener("mousemove", (e) => {
      if (!isHovering) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;

      button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  }

  /**
   * Add loading state to button
   */
  function addLoadingState(button, duration = 2000) {
    const originalText = button.textContent;
    const originalHTML = button.innerHTML;

    // Add loading class and spinner
    button.classList.add("btn-loading");
    button.disabled = true;
    button.innerHTML = `
      <span class="btn-spinner"></span>
      <span class="btn-loading-text">LOADING...</span>
    `;

    // Remove loading state after duration
    setTimeout(() => {
      button.classList.remove("btn-loading");
      button.disabled = false;
      button.innerHTML = originalHTML;
    }, duration);
  }

  /**
   * Add success state to button
   */
  function addSuccessState(button, duration = 1500) {
    const originalText = button.textContent;
    const originalHTML = button.innerHTML;

    button.classList.add("btn-success");
    button.innerHTML = `
      <span class="btn-success-icon">✓</span>
      <span class="btn-success-text">SUCCESS!</span>
    `;

    setTimeout(() => {
      button.classList.remove("btn-success");
      button.innerHTML = originalHTML;
    }, duration);
  }

  /**
   * Initialize CTA button enhancements
   */
  function initCTAButtons() {
    const ctaButtons = document.querySelectorAll(
      ".hero__cta .btn, .btn--enhanced"
    );

    ctaButtons.forEach((button) => {
      // Add ripple effect on click
      button.addEventListener("click", function (e) {
        // Only add ripple if not disabled
        if (!this.disabled && !this.classList.contains("btn-loading")) {
          createRippleEffect(this, e);
        }
      });

      // Add magnetic effect (only on desktop with mouse)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        addMagneticEffect(button);
      }

      // Add enhanced focus handling
      button.addEventListener("focus", function () {
        this.classList.add("btn-focused");
      });

      button.addEventListener("blur", function () {
        this.classList.remove("btn-focused");
      });

      // Add keyboard interaction enhancements
      button.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.classList.add("btn-active");

          // Simulate click for ripple effect
          const rect = this.getBoundingClientRect();
          const fakeEvent = {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          };
          createRippleEffect(this, fakeEvent);

          // Trigger actual click
          setTimeout(() => {
            this.click();
          }, 100);
        }
      });

      button.addEventListener("keyup", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          this.classList.remove("btn-active");
        }
      });
    });
  }

  /**
   * Initialize special CTA behaviors
   */
  function initSpecialCTABehaviors() {
    // "View My Work" button - scroll to projects
    const viewWorkBtn = document.querySelector('a[href="projects.html"]');
    if (viewWorkBtn && viewWorkBtn.closest(".hero__cta")) {
      viewWorkBtn.addEventListener("click", function (e) {
        // Check if we're on the same page and there's a projects section
        const projectsSection = document.querySelector(
          "#projects, .projects-section"
        );
        if (
          (projectsSection && window.location.pathname === "/index.html") ||
          window.location.pathname === "/"
        ) {
          e.preventDefault();

          // Add loading state
          addLoadingState(this, 1000);

          // Smooth scroll to projects
          setTimeout(() => {
            projectsSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            // Add success state
            setTimeout(() => {
              addSuccessState(this);
            }, 500);
          }, 500);
        }
      });
    }

    // "Get in Touch" button - enhanced contact interaction
    const contactBtn = document.querySelector('a[href="contact.html"]');
    if (contactBtn && contactBtn.closest(".hero__cta")) {
      contactBtn.addEventListener("click", function (e) {
        // Add loading state for navigation
        addLoadingState(this, 800);
      });
    }
  }

  /**
   * Add entrance animations to CTA buttons
   */
  function initCTAAnimations() {
    const ctaSection = document.querySelector(".hero__cta");
    if (!ctaSection) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      ctaSection.classList.add("cta-visible");
      return;
    }

    // Create intersection observer for CTA animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cta-visible");

            // Stagger button animations
            const buttons = entry.target.querySelectorAll(".btn");
            buttons.forEach((button, index) => {
              setTimeout(() => {
                button.classList.add("btn-entrance");
              }, index * 200);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(ctaSection);
  }

  /**
   * Initialize responsive CTA layout
   */
  function initResponsiveCTA() {
    const ctaSection = document.querySelector(".hero__cta");
    if (!ctaSection) return;

    function updateCTALayout() {
      const isMobile = window.innerWidth < 768;
      const buttons = ctaSection.querySelectorAll(".btn");

      buttons.forEach((button) => {
        if (isMobile) {
          button.classList.add("btn--mobile");
        } else {
          button.classList.remove("btn--mobile");
        }
      });
    }

    // Initial layout update
    updateCTALayout();

    // Update on resize
    window.addEventListener("resize", debounce(updateCTALayout, 250));
  }

  /**
   * Debounce function for performance
   */
  function debounce(func, wait) {
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

  /**
   * Initialize all CTA button functionality
   */
  function init() {
    initCTAButtons();
    initSpecialCTABehaviors();
    initCTAAnimations();
    initResponsiveCTA();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export for external use
  window.CTAButtons = {
    init,
    createRippleEffect,
    addLoadingState,
    addSuccessState,
  };
})();
