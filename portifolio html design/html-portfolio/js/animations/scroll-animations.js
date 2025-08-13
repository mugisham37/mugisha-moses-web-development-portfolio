/* ==========================================================================
   SCROLL-TRIGGERED ANIMATIONS
   Advanced scroll-based animations using Intersection Observer API
   ========================================================================== */

class ScrollAnimationController {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Map();
    this.scrollTriggers = new Map();
    this.isInitialized = false;
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Performance settings
    this.performanceMode = "high"; // high, medium, low
    this.frameThrottle = 16; // ~60fps

    this.init();
  }

  /**
   * Initialize scroll animation system
   */
  init() {
    if (this.isInitialized) return;

    if (this.prefersReducedMotion) {
      this.setupReducedMotionFallbacks();
      return;
    }

    this.setupIntersectionObservers();
    this.setupScrollTriggers();
    this.setupParallaxEffects();
    this.setupProgressIndicators();
    this.initPerformanceOptimizations();

    this.isInitialized = true;
  }

  /**
   * Setup intersection observers for different animation types
   */
  setupIntersectionObservers() {
    // Main content observer - high threshold for precise timing
    const mainObserver = new IntersectionObserver(
      this.handleMainContentIntersection.bind(this),
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "0px 0px -10% 0px",
      }
    );

    // Hero elements observer - immediate trigger
    const heroObserver = new IntersectionObserver(
      this.handleHeroIntersection.bind(this),
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    // Cards observer - staggered animations
    const cardsObserver = new IntersectionObserver(
      this.handleCardsIntersection.bind(this),
      {
        threshold: 0.2,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    // Background elements observer - subtle animations
    const backgroundObserver = new IntersectionObserver(
      this.handleBackgroundIntersection.bind(this),
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    this.observers.set("main", mainObserver);
    this.observers.set("hero", heroObserver);
    this.observers.set("cards", cardsObserver);
    this.observers.set("background", backgroundObserver);

    this.observeElements();
  }

  /**
   * Observe elements with appropriate observers
   */
  observeElements() {
    // Main content sections
    const mainSections = document.querySelectorAll(`
      .capabilities-matrix,
      .terminal-section,
      .project-showcase,
      .technical-arsenal,
      .testimonial-carousel,
      .contact-section
    `);

    mainSections.forEach((section) => {
      this.observers.get("main").observe(section);
      this.prepareElementForAnimation(section, "main");
    });

    // Hero elements
    const heroElements = document.querySelectorAll(`
      .hero__title,
      .hero__subtitle,
      .hero__description,
      .hero__metrics,
      .hero__cta
    `);

    heroElements.forEach((element) => {
      this.observers.get("hero").observe(element);
      this.prepareElementForAnimation(element, "hero");
    });

    // Card elements
    const cardElements = document.querySelectorAll(`
      .capability-block,
      .project-card,
      .skill-card,
      .testimonial-card,
      .metric-card
    `);

    cardElements.forEach((card) => {
      this.observers.get("cards").observe(card);
      this.prepareElementForAnimation(card, "card");
    });

    // Background elements
    const backgroundElements = document.querySelectorAll(`
      .hero__visual-elements .hero__shape,
      .section-divider,
      .background-pattern
    `);

    backgroundElements.forEach((element) => {
      this.observers.get("background").observe(element);
      this.prepareElementForAnimation(element, "background");
    });
  }

  /**
   * Prepare element for animation by setting initial state
   */
  prepareElementForAnimation(element, type) {
    const animationConfig = this.getAnimationConfig(type);

    // Set initial state using GSAP
    if (typeof gsap !== "undefined") {
      gsap.set(element, animationConfig.initial);
    } else {
      // Fallback to CSS classes
      element.classList.add(`scroll-animate-${type}-initial`);
    }

    this.animatedElements.set(element, {
      type,
      config: animationConfig,
      hasAnimated: false,
    });
  }

  /**
   * Get animation configuration for element type
   */
  getAnimationConfig(type) {
    const configs = {
      main: {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
      },
      hero: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      },
      card: {
        initial: { opacity: 0, y: 40, rotationY: 15, scale: 0.9 },
        animate: {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
      },
      background: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 0.1, scale: 1, duration: 1.5, ease: "power1.out" },
      },
    };

    return configs[type] || configs.main;
  }

  /**
   * Handle main content intersection
   */
  handleMainContentIntersection(entries) {
    entries.forEach((entry) => {
      const element = entry.target;
      const elementData = this.animatedElements.get(element);

      if (!elementData || elementData.hasAnimated) return;

      if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
        this.animateElement(element, elementData);
      }
    });
  }

  /**
   * Handle hero elements intersection
   */
  handleHeroIntersection(entries) {
    entries.forEach((entry) => {
      const element = entry.target;
      const elementData = this.animatedElements.get(element);

      if (!elementData || elementData.hasAnimated) return;

      if (entry.isIntersecting) {
        // Add staggered delay based on element order
        const delay = this.calculateStaggerDelay(element);
        elementData.config.animate.delay = delay;

        this.animateElement(element, elementData);
      }
    });
  }

  /**
   * Handle cards intersection with staggered animation
   */
  handleCardsIntersection(entries) {
    const visibleCards = entries.filter((entry) => entry.isIntersecting);

    if (visibleCards.length === 0) return;

    // Group cards by parent container for staggered animation
    const cardGroups = new Map();

    visibleCards.forEach((entry) => {
      const element = entry.target;
      const parent = element.closest(
        ".capabilities-grid, .project-grid, .skills-grid, .testimonials-container"
      );
      const parentKey = parent ? parent.className : "default";

      if (!cardGroups.has(parentKey)) {
        cardGroups.set(parentKey, []);
      }

      cardGroups.get(parentKey).push(element);
    });

    // Animate each group with stagger
    cardGroups.forEach((cards) => {
      this.animateCardGroup(cards);
    });
  }

  /**
   * Handle background elements intersection
   */
  handleBackgroundIntersection(entries) {
    entries.forEach((entry) => {
      const element = entry.target;
      const elementData = this.animatedElements.get(element);

      if (!elementData || elementData.hasAnimated) return;

      if (entry.isIntersecting) {
        this.animateElement(element, elementData);
      }
    });
  }

  /**
   * Animate individual element
   */
  animateElement(element, elementData) {
    if (elementData.hasAnimated) return;

    const { config } = elementData;

    if (typeof gsap !== "undefined") {
      gsap.to(element, config.animate);
    } else {
      // Fallback to CSS animation
      element.classList.add(`scroll-animate-${elementData.type}`);
    }

    elementData.hasAnimated = true;

    // Unobserve element to improve performance
    this.observers.forEach((observer) => {
      observer.unobserve(element);
    });
  }

  /**
   * Animate group of cards with stagger
   */
  animateCardGroup(cards) {
    const validCards = cards.filter((card) => {
      const elementData = this.animatedElements.get(card);
      return elementData && !elementData.hasAnimated;
    });

    if (validCards.length === 0) return;

    if (typeof gsap !== "undefined") {
      gsap.to(validCards, {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });
    } else {
      // Fallback staggered CSS animation
      validCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("scroll-animate-card");
        }, index * 100);
      });
    }

    // Mark as animated
    validCards.forEach((card) => {
      const elementData = this.animatedElements.get(card);
      if (elementData) elementData.hasAnimated = true;
    });
  }

  /**
   * Calculate stagger delay for hero elements
   */
  calculateStaggerDelay(element) {
    const heroElements = [
      ".hero__title",
      ".hero__subtitle",
      ".hero__description",
      ".hero__metrics",
      ".hero__cta",
    ];

    for (let i = 0; i < heroElements.length; i++) {
      if (element.matches(heroElements[i])) {
        return i * 0.2; // 200ms stagger
      }
    }

    return 0;
  }

  /**
   * Setup scroll triggers for advanced effects
   */
  setupScrollTriggers() {
    if (typeof ScrollTrigger === "undefined") return;

    // Parallax hero background
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(".hero__visual-elements", {
          y: progress * 100,
          opacity: 1 - progress,
          duration: 0.3,
        });
      },
    });

    // Section reveal with scale
    const sections = document.querySelectorAll("section:not(.hero)");
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(section, {
            scale: 0.95 + progress * 0.05,
            opacity: 0.7 + progress * 0.3,
            duration: 0.3,
          });
        },
      });
    });

    // Progress indicators
    this.setupScrollProgress();
  }

  /**
   * Setup scroll progress indicators
   */
  setupScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector(".scroll-progress");
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.className = "scroll-progress";
      progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
      document.body.appendChild(progressBar);
    }

    const progressBarFill = progressBar.querySelector(".scroll-progress-bar");

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress * 100;
        gsap.to(progressBarFill, {
          width: `${progress}%`,
          duration: 0.3,
        });
      },
    });
  }

  /**
   * Setup parallax effects
   */
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;

      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const y = self.progress * speed * 100;
          gsap.to(element, {
            y: y,
            duration: 0.3,
          });
        },
      });
    });
  }

  /**
   * Initialize performance optimizations
   */
  initPerformanceOptimizations() {
    // Throttle scroll events
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updatePerformanceMode();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Monitor performance
    this.monitorPerformance();
  }

  /**
   * Update performance mode based on scroll behavior
   */
  updatePerformanceMode() {
    const scrollSpeed = Math.abs(window.scrollY - (this.lastScrollY || 0));
    this.lastScrollY = window.scrollY;

    if (scrollSpeed > 50) {
      this.setPerformanceMode("low");
    } else if (scrollSpeed > 20) {
      this.setPerformanceMode("medium");
    } else {
      this.setPerformanceMode("high");
    }
  }

  /**
   * Set performance mode
   */
  setPerformanceMode(mode) {
    if (this.performanceMode === mode) return;

    this.performanceMode = mode;

    const settings = {
      high: { frameThrottle: 16, quality: 1 },
      medium: { frameThrottle: 33, quality: 0.8 },
      low: { frameThrottle: 66, quality: 0.6 },
    };

    const setting = settings[mode];
    this.frameThrottle = setting.frameThrottle;

    // Adjust GSAP performance
    if (typeof gsap !== "undefined") {
      gsap.ticker.fps(1000 / this.frameThrottle);
    }

    document.body.classList.remove("perf-high", "perf-medium", "perf-low");
    document.body.classList.add(`perf-${mode}`);
  }

  /**
   * Monitor performance metrics
   */
  monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitor = (currentTime) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;

        if (fps < 30) {
          this.setPerformanceMode("low");
        } else if (fps < 50) {
          this.setPerformanceMode("medium");
        } else {
          this.setPerformanceMode("high");
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  /**
   * Setup reduced motion fallbacks
   */
  setupReducedMotionFallbacks() {
    // Show all elements immediately
    const allElements = document.querySelectorAll(`
      .capabilities-matrix,
      .terminal-section,
      .project-showcase,
      .technical-arsenal,
      .testimonial-carousel,
      .contact-section,
      .hero__title,
      .hero__subtitle,
      .hero__description,
      .hero__metrics,
      .hero__cta,
      .capability-block,
      .project-card,
      .skill-card,
      .testimonial-card,
      .metric-card
    `);

    allElements.forEach((element) => {
      element.classList.add("scroll-animate-visible");
    });

    document.body.classList.add("reduced-motion");
  }

  /**
   * Refresh animations (useful for dynamic content)
   */
  refresh() {
    // Re-observe new elements
    this.observeElements();

    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Cleanup all observers and animations
   */
  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });

    this.observers.clear();
    this.animatedElements.clear();
    this.scrollTriggers.clear();

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.killAll();
    }
  }

  /**
   * Get animation statistics
   */
  getStats() {
    return {
      observedElements: this.animatedElements.size,
      animatedElements: Array.from(this.animatedElements.values()).filter(
        (data) => data.hasAnimated
      ).length,
      performanceMode: this.performanceMode,
      activeObservers: this.observers.size,
    };
  }
}

// Export for use in other modules
window.ScrollAnimationController = ScrollAnimationController;

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.scrollAnimationController = new ScrollAnimationController();
  });
} else {
  window.scrollAnimationController = new ScrollAnimationController();
}
