/**
 * TESTIMONIAL CAROUSEL COMPONENT
 * Industrial Digital Brutalism - 3D Carousel with Auto-rotation and Manual Controls
 *
 * Features:
 * - 3D perspective transforms with depth effects
 * - Auto-rotation system (5s intervals)
 * - Manual navigation controls
 * - Responsive behavior for mobile devices
 * - Accessibility support with keyboard navigation
 * - Success metrics counter animations
 */

class TestimonialCarousel {
  constructor() {
    this.container = document.getElementById("testimonial-carousel-container");
    this.cards = document.querySelectorAll(".testimonial-card");
    this.indicators = document.querySelectorAll(".testimonial-indicator");
    this.prevButton = document.getElementById("testimonial-prev");
    this.nextButton = document.getElementById("testimonial-next");

    this.currentIndex = 0;
    this.totalCards = this.cards.length;
    this.autoRotateInterval = null;
    this.autoRotateDelay = 5000; // 5 seconds
    this.isTransitioning = false;

    // Success metrics elements
    this.successMetrics = document.querySelectorAll(
      ".success-metric__value[data-metric]"
    );
    this.progressBars = document.querySelectorAll(
      ".success-metric__progress[data-progress]"
    );

    this.init();
  }

  init() {
    if (!this.container || this.cards.length === 0) {
      console.warn("Testimonial carousel elements not found");
      return;
    }

    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.setupIntersectionObserver();
    this.startAutoRotation();
    this.updateNavigation();

    console.log(
      "Testimonial carousel initialized with",
      this.totalCards,
      "testimonials"
    );
  }

  setupEventListeners() {
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.goToPrevious());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.goToNext());
    }

    // Indicator buttons
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    // Card click events
    this.cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (index !== this.currentIndex) {
          this.goToSlide(index);
        }
      });
    });

    // Pause auto-rotation on hover
    if (this.container) {
      this.container.addEventListener("mouseenter", () =>
        this.pauseAutoRotation()
      );
      this.container.addEventListener("mouseleave", () =>
        this.startAutoRotation()
      );
    }

    // Handle visibility change (pause when tab is not active)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAutoRotation();
      } else {
        this.startAutoRotation();
      }
    });
  }

  setupKeyboardNavigation() {
    // Add keyboard navigation support
    this.container?.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          this.goToNext();
          break;
        case "Home":
          e.preventDefault();
          this.goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          this.goToSlide(this.totalCards - 1);
          break;
      }
    });

    // Make container focusable for keyboard navigation
    if (this.container) {
      this.container.setAttribute("tabindex", "0");
      this.container.setAttribute("role", "region");
      this.container.setAttribute(
        "aria-label",
        "Testimonial carousel - use arrow keys to navigate"
      );
    }
  }

  setupIntersectionObserver() {
    // Animate success metrics when they come into view
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateSuccessMetrics();
            metricsObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const metricsSection = document.querySelector(".client-impact__metrics");
    if (metricsSection) {
      metricsObserver.observe(metricsSection);
    }
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) {
      return;
    }

    this.isTransitioning = true;
    this.currentIndex = index;

    this.updateCardPositions();
    this.updateIndicators();
    this.updateNavigation();
    this.announceSlideChange();

    // Reset transition lock after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }

  goToNext() {
    const nextIndex = (this.currentIndex + 1) % this.totalCards;
    this.goToSlide(nextIndex);
  }

  goToPrevious() {
    const prevIndex =
      (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    this.goToSlide(prevIndex);
  }

  updateCardPositions() {
    this.cards.forEach((card, index) => {
      // Remove all position classes
      card.classList.remove(
        "testimonial-card--active",
        "testimonial-card--next",
        "testimonial-card--prev"
      );

      if (index === this.currentIndex) {
        card.classList.add("testimonial-card--active");
      } else if (index === (this.currentIndex + 1) % this.totalCards) {
        card.classList.add("testimonial-card--next");
      } else if (
        index ===
        (this.currentIndex - 1 + this.totalCards) % this.totalCards
      ) {
        card.classList.add("testimonial-card--prev");
      }
    });
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle(
        "testimonial-indicator--active",
        index === this.currentIndex
      );
      indicator.setAttribute(
        "aria-pressed",
        index === this.currentIndex ? "true" : "false"
      );
    });
  }

  updateNavigation() {
    // Update navigation button states
    if (this.prevButton) {
      this.prevButton.disabled = false; // Always enabled for circular navigation
    }

    if (this.nextButton) {
      this.nextButton.disabled = false; // Always enabled for circular navigation
    }
  }

  startAutoRotation() {
    this.pauseAutoRotation(); // Clear any existing interval

    this.autoRotateInterval = setInterval(() => {
      this.goToNext();
    }, this.autoRotateDelay);

    // Add visual indicator for auto-rotation
    this.container?.classList.add("testimonial-carousel--auto-rotating");
  }

  pauseAutoRotation() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }

    this.container?.classList.remove("testimonial-carousel--auto-rotating");
  }

  announceSlideChange() {
    // Announce slide change for screen readers
    const currentCard = this.cards[this.currentIndex];
    const clientName = currentCard?.querySelector(
      ".testimonial-client__name"
    )?.textContent;
    const company = currentCard?.querySelector(
      ".testimonial-client__company"
    )?.textContent;

    if (clientName && company) {
      const announcement = `Now showing testimonial from ${clientName} at ${company}`;
      this.announceToScreenReader(announcement);
    }
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById("live-region");
    if (liveRegion) {
      liveRegion.textContent = message;

      // Clear the message after a short delay
      setTimeout(() => {
        liveRegion.textContent = "";
      }, 1000);
    }
  }

  animateSuccessMetrics() {
    // Animate counter values with staggered timing
    this.successMetrics.forEach((metric, index) => {
      const target = parseInt(metric.dataset.target);
      const metricType = metric.dataset.metric;

      // Stagger animations by 200ms each
      setTimeout(() => {
        this.animateCounter(metric, 0, target, 2500, metricType);
      }, index * 200);
    });

    // Animate progress bars with enhanced effects
    this.progressBars.forEach((bar, index) => {
      const progress = parseInt(bar.dataset.progress);

      setTimeout(() => {
        bar.style.width = `${progress}%`;

        // Add completion effect for 100% progress bars
        if (progress === 100) {
          setTimeout(() => {
            bar.style.boxShadow = "0 0 20px rgba(255, 255, 0, 0.8)";
          }, 2000);
        }
      }, 800 + index * 150);
    });

    // Animate timeline indicators for retention metric
    this.animateRetentionTimeline();

    // Initialize real-time status updates
    this.initializeRealTimeStatus();

    // Animate client logos
    this.animateClientLogos();
  }

  animateCounter(element, start, end, duration, metricType) {
    const startTime = performance.now();
    const range = end - start;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Enhanced easing function for more dramatic effect
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + range * easeOutExpo);

      // Format the value based on metric type with enhanced styling
      let displayValue = current;
      if (metricType === "success-rate" || metricType === "client-retention") {
        displayValue = `${current}%`;
      } else if (metricType === "response-time") {
        displayValue = `<${current}H`;
      } else if (metricType === "projects-delivered") {
        displayValue = `${current}+`;
      }

      element.innerHTML = displayValue;

      // Add completion effect
      if (progress === 1) {
        element.style.textShadow = "0 0 15px rgba(255, 255, 0, 0.8)";
        setTimeout(() => {
          element.style.textShadow = "0 0 10px rgba(255, 255, 0, 0.3)";
        }, 500);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  animateRetentionTimeline() {
    const timelineIndicators = document.querySelectorAll(".timeline-indicator");

    timelineIndicators.forEach((indicator, index) => {
      setTimeout(() => {
        if (indicator.classList.contains("timeline-indicator--active")) {
          indicator.style.transform = "scale(1.2)";
          indicator.style.boxShadow = "0 0 12px rgba(255, 255, 0, 0.8)";

          setTimeout(() => {
            indicator.style.transform = "scale(1)";
          }, 300);
        } else if (
          indicator.classList.contains("timeline-indicator--partial")
        ) {
          indicator.style.animation = "pulse 2s ease-in-out infinite";
        }
      }, index * 100);
    });
  }

  initializeRealTimeStatus() {
    const statusIndicator = document.querySelector(".status-indicator--online");
    const statusText = document.querySelector(".status-text");

    if (statusIndicator && statusText) {
      // Simulate real-time status updates
      const updateStatus = () => {
        const now = new Date();
        const hour = now.getHours();

        // Business hours: 9 AM to 6 PM
        const isBusinessHours = hour >= 9 && hour <= 18;

        if (isBusinessHours) {
          statusIndicator.style.background = "#00ff00";
          statusIndicator.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.5)";
          statusText.textContent = "Currently online";
        } else {
          statusIndicator.style.background = "#ffff00";
          statusIndicator.style.boxShadow = "0 0 10px rgba(255, 255, 0, 0.5)";
          statusText.textContent = "Response within 2h";
        }
      };

      updateStatus();
      // Update every minute
      setInterval(updateStatus, 60000);
    }
  }

  animateClientLogos() {
    const clientLogos = document.querySelectorAll(".client-logo");

    clientLogos.forEach((logo, index) => {
      setTimeout(() => {
        logo.style.opacity = "0";
        logo.style.transform = "translateY(20px)";
        logo.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

        setTimeout(() => {
          logo.style.opacity = "1";
          logo.style.transform = "translateY(0)";
        }, 50);
      }, index * 100);
    });

    // Add hover effects for confidential clients
    const confidentialLogos = document.querySelectorAll(
      '.client-logo[data-permission="confidential"]'
    );
    confidentialLogos.forEach((logo) => {
      logo.addEventListener("mouseenter", () => {
        const placeholder = logo.querySelector(".client-logo__placeholder");
        if (placeholder) {
          placeholder.style.borderStyle = "solid";
          placeholder.style.background = "rgba(255, 255, 0, 0.1)";
        }
      });

      logo.addEventListener("mouseleave", () => {
        const placeholder = logo.querySelector(".client-logo__placeholder");
        if (placeholder) {
          placeholder.style.borderStyle = "dashed";
          placeholder.style.background = "rgba(255, 255, 255, 0.1)";
        }
      });
    });
  }

  // Public methods for external control
  destroy() {
    this.pauseAutoRotation();

    // Remove event listeners
    this.prevButton?.removeEventListener("click", this.goToPrevious);
    this.nextButton?.removeEventListener("click", this.goToNext);

    this.indicators.forEach((indicator) => {
      indicator.removeEventListener("click", () => {});
    });

    this.cards.forEach((card) => {
      card.removeEventListener("click", () => {});
    });

    console.log("Testimonial carousel destroyed");
  }

  getCurrentSlide() {
    return this.currentIndex;
  }

  getTotalSlides() {
    return this.totalCards;
  }
}

// Initialize testimonial carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a page with testimonial carousel
  if (document.querySelector(".testimonial-carousel")) {
    window.testimonialCarousel = new TestimonialCarousel();
  }
});

// Handle reduced motion preference
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.addEventListener("DOMContentLoaded", () => {
    const carousel = window.testimonialCarousel;
    if (carousel) {
      carousel.pauseAutoRotation();
    }
  });
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = TestimonialCarousel;
}
