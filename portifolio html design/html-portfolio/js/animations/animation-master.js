/* ==========================================================================
   ANIMATION MASTER CONTROLLER
   Master animation timeline and choreography system with GSAP
   ========================================================================== */

class AnimationMaster {
  constructor() {
    this.timeline = null;
    this.scrollAnimations = new Map();
    this.hoverOrchestrations = new Map();
    this.loadingAnimations = new Map();
    this.activeAnimations = new Set();
    this.isInitialized = false;
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Performance monitoring
    this.performanceMetrics = {
      frameDrops: 0,
      averageFPS: 60,
      memoryUsage: 0,
    };

    this.init();
  }

  /**
   * Initialize the animation system
   */
  init() {
    if (this.isInitialized) return;

    // Check if GSAP is available
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded. Loading from CDN...");
      this.loadGSAP().then(() => {
        this.setupAnimationSystem();
      });
    } else {
      this.setupAnimationSystem();
    }
  }

  /**
   * Load GSAP from CDN if not available
   */
  async loadGSAP() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.onload = () => {
        // Load ScrollTrigger plugin
        const scrollTriggerScript = document.createElement("script");
        scrollTriggerScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        scrollTriggerScript.onload = resolve;
        scrollTriggerScript.onerror = reject;
        document.head.appendChild(scrollTriggerScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Setup the complete animation system
   */
  setupAnimationSystem() {
    if (this.prefersReducedMotion) {
      this.setupReducedMotionFallbacks();
      return;
    }

    // Register GSAP plugins
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Setup master timeline
    this.createMasterTimeline();

    // Initialize subsystems
    this.initScrollAnimations();
    this.initHoverOrchestrations();
    this.initLoadingAnimations();
    this.initPerformanceMonitoring();

    // Setup cleanup system
    this.setupCleanupSystem();

    this.isInitialized = true;

    // Trigger page load sequence
    this.playPageLoadSequence();
  }

  /**
   * Create master timeline for page load sequence
   */
  createMasterTimeline() {
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.onPageLoadComplete();
      },
    });

    // Page load sequence choreography
    this.timeline
      // Phase 1: Initial setup (0-0.5s)
      .set("body", { opacity: 1 })
      .set(".hero__content > *", { opacity: 0, y: 30 })
      .set(".capabilities-matrix", { opacity: 0, y: 50 })
      .set(".metric-card", { opacity: 0, scale: 0.8, rotationY: 90 })

      // Phase 2: Hero entrance (0.5-2s)
      .to(
        ".hero__title",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.5
      )
      .to(
        ".hero__subtitle",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.7
      )
      .to(
        ".hero__description",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.9
      )

      // Phase 3: Metrics animation (1.5-3s)
      .to(
        ".metric-card",
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        1.5
      )

      // Phase 4: CTA buttons (2.5-3.5s)
      .to(
        ".hero__cta .btn",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        },
        2.5
      )

      // Phase 5: Background elements (3-4s)
      .to(
        ".hero__visual-elements .hero__shape",
        {
          opacity: 0.1,
          scale: 1,
          rotation: (i) => i * 45,
          duration: 1,
          stagger: 0.1,
          ease: "power1.inOut",
        },
        3
      );
  }

  /**
   * Initialize scroll-triggered animations
   */
  initScrollAnimations() {
    // Capabilities Matrix entrance
    this.createScrollAnimation(".capabilities-matrix", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Capability blocks staggered entrance
    this.createScrollAnimation(".capability-block", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)",
    });

    // Terminal section
    this.createScrollAnimation(".terminal-section", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Project showcase
    this.createScrollAnimation(".project-showcase", {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power2.out",
    });

    // Technical arsenal
    this.createScrollAnimation(".technical-arsenal", {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });

    // Testimonial carousel
    this.createScrollAnimation(".testimonial-carousel", {
      opacity: 1,
      rotationY: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Contact section
    this.createScrollAnimation(".contact-section", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });
  }

  /**
   * Create scroll-triggered animation
   */
  createScrollAnimation(selector, animation) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: selector,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        const tl = gsap.to(elements, animation);
        this.activeAnimations.add(tl);
        this.scrollAnimations.set(selector, tl);
      },
      onLeave: () => {
        // Optional: reverse animation when leaving viewport
      },
    });

    return scrollTrigger;
  }

  /**
   * Initialize hover orchestration system
   */
  initHoverOrchestrations() {
    // Capability blocks coordinated hover
    this.setupCapabilityBlockHover();

    // Project cards hover orchestration
    this.setupProjectCardHover();

    // Button hover enhancements
    this.setupButtonHoverEffects();

    // Navigation hover effects
    this.setupNavigationHover();
  }

  /**
   * Setup capability block hover orchestration
   */
  setupCapabilityBlockHover() {
    const capabilityBlocks = document.querySelectorAll(".capability-block");

    capabilityBlocks.forEach((block, index) => {
      const hoverTimeline = gsap.timeline({ paused: true });

      hoverTimeline
        .to(block, {
          scale: 1.05,
          y: -10,
          boxShadow: "0 20px 40px rgba(255, 255, 0, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          block.querySelector(".capability-block__icon"),
          {
            scale: 1.2,
            rotation: 360,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          0
        )
        .to(
          block.querySelectorAll(".tech-badge"),
          {
            scale: 1.1,
            y: -2,
            stagger: 0.05,
            duration: 0.3,
            ease: "power2.out",
          },
          0.1
        );

      // Store timeline for cleanup
      this.hoverOrchestrations.set(`capability-${index}`, hoverTimeline);

      block.addEventListener("mouseenter", () => {
        hoverTimeline.play();
      });

      block.addEventListener("mouseleave", () => {
        hoverTimeline.reverse();
      });
    });
  }

  /**
   * Setup project card hover orchestration
   */
  setupProjectCardHover() {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card, index) => {
      const hoverTimeline = gsap.timeline({ paused: true });

      hoverTimeline
        .to(card, {
          rotationY: 180,
          duration: 0.6,
          ease: "power2.inOut",
        })
        .to(
          card.querySelector(".project-card__front"),
          {
            opacity: 0,
            duration: 0.3,
          },
          0
        )
        .to(
          card.querySelector(".project-card__back"),
          {
            opacity: 1,
            duration: 0.3,
          },
          0.3
        );

      this.hoverOrchestrations.set(`project-${index}`, hoverTimeline);

      let hoverTimeout;
      card.addEventListener("mouseenter", () => {
        hoverTimeout = setTimeout(() => {
          hoverTimeline.play();
        }, 500); // 500ms delay as specified
      });

      card.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout);
        hoverTimeline.reverse();
      });
    });
  }

  /**
   * Setup button hover effects
   */
  setupButtonHoverEffects() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button, index) => {
      const hoverTimeline = gsap.timeline({ paused: true });

      hoverTimeline
        .to(button, {
          scale: 1.05,
          y: -2,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          duration: 0.2,
          ease: "power2.out",
        })
        .to(
          button.querySelector("::before") || button,
          {
            background: "rgba(255, 255, 255, 0.1)",
            duration: 0.3,
          },
          0
        );

      this.hoverOrchestrations.set(`button-${index}`, hoverTimeline);

      button.addEventListener("mouseenter", () => {
        hoverTimeline.play();
      });

      button.addEventListener("mouseleave", () => {
        hoverTimeline.reverse();
      });
    });
  }

  /**
   * Setup navigation hover effects
   */
  setupNavigationHover() {
    const navLinks = document.querySelectorAll(".nav__link");

    navLinks.forEach((link, index) => {
      const hoverTimeline = gsap.timeline({ paused: true });

      hoverTimeline.to(link, {
        color: "#FFFF00",
        textShadow: "0 0 10px rgba(255, 255, 0, 0.5)",
        duration: 0.2,
        ease: "power2.out",
      });

      this.hoverOrchestrations.set(`nav-${index}`, hoverTimeline);

      link.addEventListener("mouseenter", () => {
        hoverTimeline.play();
      });

      link.addEventListener("mouseleave", () => {
        hoverTimeline.reverse();
      });
    });
  }

  /**
   * Initialize loading state animations
   */
  initLoadingAnimations() {
    this.createSkeletonScreens();
    this.setupProgressiveEnhancement();
    this.initImageLoadingStates();
  }

  /**
   * Create skeleton loading screens
   */
  createSkeletonScreens() {
    const sections = [
      ".capabilities-matrix",
      ".terminal-section",
      ".project-showcase",
      ".technical-arsenal",
      ".testimonial-carousel",
    ];

    sections.forEach((selector) => {
      const section = document.querySelector(selector);
      if (!section) return;

      const skeleton = this.createSkeletonElement(selector);
      section.parentNode.insertBefore(skeleton, section);

      // Hide actual content initially
      gsap.set(section, { opacity: 0 });

      // Animate skeleton
      const skeletonTimeline = gsap.timeline({ repeat: -1 });
      skeletonTimeline.to(skeleton.querySelectorAll(".skeleton"), {
        opacity: 0.5,
        duration: 1,
        stagger: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });

      this.loadingAnimations.set(selector, {
        skeleton,
        timeline: skeletonTimeline,
      });
    });
  }

  /**
   * Create skeleton element for section
   */
  createSkeletonElement(selector) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-container";
    skeleton.setAttribute("aria-hidden", "true");

    switch (selector) {
      case ".capabilities-matrix":
        skeleton.innerHTML = `
          <div class="skeleton-grid">
            ${Array(6)
              .fill()
              .map(
                () => `
              <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button"></div>
              </div>
            `
              )
              .join("")}
          </div>
        `;
        break;

      case ".terminal-section":
        skeleton.innerHTML = `
          <div class="skeleton-terminal">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-image"></div>
          </div>
        `;
        break;

      case ".project-showcase":
        skeleton.innerHTML = `
          <div class="skeleton-projects">
            ${Array(4)
              .fill()
              .map(
                () => `
              <div class="skeleton-project-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
              </div>
            `
              )
              .join("")}
          </div>
        `;
        break;

      default:
        skeleton.innerHTML = `
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        `;
    }

    return skeleton;
  }

  /**
   * Setup progressive enhancement
   */
  setupProgressiveEnhancement() {
    // Show content progressively as it loads
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.enhanceSection(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });
  }

  /**
   * Enhance section with progressive loading
   */
  enhanceSection(section) {
    const sectionClass = section.className.split(" ")[0];
    const selector = `.${sectionClass}`;

    if (this.loadingAnimations.has(selector)) {
      const { skeleton, timeline } = this.loadingAnimations.get(selector);

      // Fade out skeleton
      gsap.to(skeleton, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          skeleton.remove();
          timeline.kill();
        },
      });

      // Fade in actual content
      gsap.to(section, {
        opacity: 1,
        duration: 0.5,
        delay: 0.3,
      });

      this.loadingAnimations.delete(selector);
    }
  }

  /**
   * Initialize image loading states
   */
  initImageLoadingStates() {
    const images = document.querySelectorAll(
      'img[data-src], img[loading="lazy"]'
    );

    images.forEach((img) => {
      // Create placeholder
      const placeholder = document.createElement("div");
      placeholder.className = "image-loading-placeholder";
      placeholder.style.aspectRatio = img.dataset.aspectRatio || "16/9";

      img.parentNode.insertBefore(placeholder, img);
      gsap.set(img, { opacity: 0 });

      // Animate placeholder
      const placeholderTimeline = gsap.timeline({ repeat: -1 });
      placeholderTimeline.to(placeholder, {
        opacity: 0.5,
        duration: 1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });

      // Handle image load
      img.addEventListener("load", () => {
        placeholderTimeline.kill();
        gsap.to(placeholder, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => placeholder.remove(),
        });
        gsap.to(img, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });
  }

  /**
   * Initialize performance monitoring
   */
  initPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitorFrame = (currentTime) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.averageFPS = frameCount;

        // Adjust animation quality based on performance
        if (this.performanceMetrics.averageFPS < 30) {
          this.reduceAnimationQuality();
        } else if (this.performanceMetrics.averageFPS > 55) {
          this.restoreAnimationQuality();
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitorFrame);
    };

    requestAnimationFrame(monitorFrame);
  }

  /**
   * Reduce animation quality for performance
   */
  reduceAnimationQuality() {
    gsap.globalTimeline.timeScale(0.5);
    document.body.classList.add("reduced-animation-quality");
  }

  /**
   * Restore full animation quality
   */
  restoreAnimationQuality() {
    gsap.globalTimeline.timeScale(1);
    document.body.classList.remove("reduced-animation-quality");
  }

  /**
   * Setup animation cleanup system
   */
  setupCleanupSystem() {
    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      this.cleanup();
    });

    // Cleanup on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });

    // Memory cleanup interval
    setInterval(() => {
      this.cleanupInactiveAnimations();
    }, 30000); // Every 30 seconds
  }

  /**
   * Pause all animations
   */
  pauseAnimations() {
    if (this.timeline) this.timeline.pause();
    this.activeAnimations.forEach((animation) => {
      if (animation.pause) animation.pause();
    });
    this.hoverOrchestrations.forEach((timeline) => {
      timeline.pause();
    });
  }

  /**
   * Resume all animations
   */
  resumeAnimations() {
    if (this.timeline) this.timeline.resume();
    this.activeAnimations.forEach((animation) => {
      if (animation.resume) animation.resume();
    });
  }

  /**
   * Clean up inactive animations
   */
  cleanupInactiveAnimations() {
    this.activeAnimations.forEach((animation) => {
      if (animation.progress() === 1 && !animation.isActive()) {
        animation.kill();
        this.activeAnimations.delete(animation);
      }
    });
  }

  /**
   * Play page load sequence
   */
  playPageLoadSequence() {
    if (this.timeline) {
      this.timeline.play();
    }
  }

  /**
   * Handle page load completion
   */
  onPageLoadComplete() {
    document.body.classList.add("page-load-complete");

    // Trigger custom event
    const event = new CustomEvent("pageLoadAnimationComplete", {
      detail: { timestamp: performance.now() },
    });
    document.dispatchEvent(event);
  }

  /**
   * Setup reduced motion fallbacks
   */
  setupReducedMotionFallbacks() {
    // Immediately show all content
    gsap.set("body", { opacity: 1 });
    gsap.set(".hero__content > *, .capabilities-matrix, .metric-card", {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
    });

    document.body.classList.add("reduced-motion");
    this.onPageLoadComplete();
  }

  /**
   * Complete cleanup
   */
  cleanup() {
    // Kill all timelines
    if (this.timeline) this.timeline.kill();

    this.activeAnimations.forEach((animation) => {
      if (animation.kill) animation.kill();
    });

    this.hoverOrchestrations.forEach((timeline) => {
      timeline.kill();
    });

    this.loadingAnimations.forEach(({ timeline }) => {
      timeline.kill();
    });

    // Clear ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.killAll();
    }

    // Clear maps and sets
    this.activeAnimations.clear();
    this.scrollAnimations.clear();
    this.hoverOrchestrations.clear();
    this.loadingAnimations.clear();
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      activeAnimations: this.activeAnimations.size,
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
    };
  }
}

// Export for use in other modules
window.AnimationMaster = AnimationMaster;

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.animationMaster = new AnimationMaster();
  });
} else {
  window.animationMaster = new AnimationMaster();
}
