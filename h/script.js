// Brutalist Hero Component
class BrutalistHero {
  constructor() {
    this.heroSection = document.querySelector(".hero-section");
    this.starsField = document.getElementById("starsField");
    this.particleSystem = document.getElementById("particleSystem");
    this.heroHeadline = document.getElementById("heroHeadline");
    this.rotatingSubtitle = document.getElementById("rotatingSubtitle");
    this.metricsBar = document.querySelector(".metrics-bar");
    this.primaryCta = document.getElementById("primaryCta");
    this.secondaryCta = document.getElementById("secondaryCta");
    this.portraitContainer = document.getElementById("portraitContainer");
    this.codeDisplay = document.getElementById("codeDisplay");
    this.scrollIndicator = document.getElementById("scrollIndicator");
    this.cursorTrail = document.getElementById("cursorTrail");

    this.stars = [];
    this.particles = [];
    this.subtitleIndex = 0;
    this.isAnimating = false;

    this.init();
  }

  init() {
    this.createStarField();
    this.createParticleSystem();
    this.setupSubtitleRotation();
    this.setupMetricsAnimation();
    this.setupCTAInteractions();
    this.setupPortraitEffects();
    this.setupCodeDisplay();
    this.setupScrollIndicator();
    this.setupCursorTrail();
    this.startBackgroundAnimations();
  }

  createStarField() {
    if (!this.starsField) return;

    // Create 100 stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.className = `star ${
        ["small", "medium", "large"][Math.floor(Math.random() * 3)]
      }`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${Math.random() * 2 + 2}s`;

      this.starsField.appendChild(star);
      this.stars.push(star);
    }
  }

  createParticleSystem() {
    if (!this.particleSystem) return;

    // Create 50 floating particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${Math.random() * 4 + 6}s`;

      this.particleSystem.appendChild(particle);
      this.particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
  }

  setupSubtitleRotation() {
    const subtitles = this.rotatingSubtitle?.querySelectorAll(".subtitle-text");
    if (!subtitles || subtitles.length === 0) return;

    setInterval(() => {
      // Remove active class from current
      subtitles[this.subtitleIndex].classList.remove("active");

      // Move to next subtitle
      this.subtitleIndex = (this.subtitleIndex + 1) % subtitles.length;

      // Add active class to new subtitle
      subtitles[this.subtitleIndex].classList.add("active");
    }, 3000);
  }

  setupMetricsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateMetrics();
          observer.unobserve(entry.target);
        }
      });
    });

    if (this.metricsBar) {
      observer.observe(this.metricsBar);
    }
  }

  animateMetrics() {
    const metrics = this.metricsBar.querySelectorAll(".metric-number");

    metrics.forEach((metric, index) => {
      const target = parseFloat(metric.dataset.target);
      const isRevenue = metric.textContent.includes("$");
      const isPercentage = target === 99.9;

      let current = 0;
      const increment = target / 100;
      const duration = 2000 + index * 500; // Stagger animations

      setTimeout(() => {
        const timer = setInterval(() => {
          current += increment;

          if (current >= target) {
            current = target;
            clearInterval(timer);
          }

          // Format the display value
          let displayValue;
          if (isRevenue) {
            displayValue = `$${Math.floor(current)}`;
          } else if (isPercentage) {
            displayValue = current.toFixed(1);
          } else {
            displayValue = Math.floor(current);
          }

          metric.textContent = displayValue;

          // Add pulse effect when complete
          if (current >= target) {
            metric.style.animation = "pulse 0.5s ease-out";
          }
        }, 20);
      }, duration);
    });
  }

  setupCTAInteractions() {
    // Primary CTA interactions
    if (this.primaryCta) {
      this.primaryCta.addEventListener("click", () => {
        this.triggerCTAEffect(this.primaryCta, "LOADING...");
      });

      this.primaryCta.addEventListener("mouseenter", () => {
        this.primaryCta.style.transform = "scale(1.05) rotate(1deg)";
      });

      this.primaryCta.addEventListener("mouseleave", () => {
        this.primaryCta.style.transform = "scale(1) rotate(0deg)";
      });
    }

    // Secondary CTA interactions
    if (this.secondaryCta) {
      this.secondaryCta.addEventListener("click", () => {
        this.triggerCTAEffect(this.secondaryCta, "CONNECTING...");
      });

      this.secondaryCta.addEventListener("mouseenter", () => {
        this.secondaryCta.style.transform = "translateY(-2px) scale(1.02)";
      });

      this.secondaryCta.addEventListener("mouseleave", () => {
        this.secondaryCta.style.transform = "translateY(0) scale(1)";
      });
    }
  }

  triggerCTAEffect(button, loadingText) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const originalText = button.querySelector(".cta-text").textContent;
    const ctaText = button.querySelector(".cta-text");

    // Change text with typewriter effect
    this.typewriterEffect(ctaText, loadingText, () => {
      setTimeout(() => {
        this.typewriterEffect(ctaText, originalText, () => {
          this.isAnimating = false;
        });
      }, 1500);
    });

    // Add glitch effect
    button.style.animation = "textGlitch 0.3s ease-out";
  }

  typewriterEffect(element, newText, callback) {
    const originalText = element.textContent;
    let currentIndex = originalText.length;

    // Clear current text
    const clearInterval = setInterval(() => {
      if (currentIndex > 0) {
        element.textContent = originalText.substring(0, currentIndex - 1);
        currentIndex--;
      } else {
        clearInterval(clearInterval);
        this.typeNewText(element, newText, callback);
      }
    }, 30);
  }

  typeNewText(element, text, callback) {
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        element.textContent = text.substring(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        if (callback) callback();
      }
    }, 50);
  }

  setupPortraitEffects() {
    if (!this.portraitContainer) return;

    const portraitFrame =
      this.portraitContainer.querySelector(".portrait-frame");
    const scanEffect = this.portraitContainer.querySelector(".scan-effect");
    const badges = this.portraitContainer.querySelectorAll(".badge");

    // Portrait hover effects
    if (portraitFrame) {
      portraitFrame.addEventListener("mouseenter", () => {
        if (scanEffect) {
          scanEffect.style.opacity = "1";
          scanEffect.style.animation = "scanLine 2s ease-in-out";
        }
      });

      portraitFrame.addEventListener("mouseleave", () => {
        if (scanEffect) {
          scanEffect.style.opacity = "0";
        }
      });
    }

    // Badge interactions
    badges.forEach((badge, index) => {
      badge.addEventListener("mouseenter", () => {
        badge.style.transform = "scale(1.2) rotate(5deg)";
        badge.style.zIndex = "10";

        // Show tooltip
        const tooltip = badge.dataset.tooltip;
        if (tooltip) {
          this.showTooltip(badge, tooltip);
        }
      });

      badge.addEventListener("mouseleave", () => {
        badge.style.transform = "scale(1) rotate(0deg)";
        badge.style.zIndex = "1";
        this.hideTooltip();
      });

      badge.addEventListener("click", () => {
        this.triggerBadgeEffect(badge);
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement("div");
    tooltip.className = "badge-tooltip";
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 120%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: var(--accent-cyan);
      padding: 0.5rem;
      font-size: 0.75rem;
      white-space: nowrap;
      border: 1px solid var(--accent-cyan);
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.3s ease-out forwards;
    `;

    element.appendChild(tooltip);
  }

  hideTooltip() {
    const tooltip = document.querySelector(".badge-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }

  triggerBadgeEffect(badge) {
    badge.style.animation = "pulse 0.5s ease-out";

    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      inset: -10px;
      border: 2px solid var(--accent-cyan);
      border-radius: 50%;
      opacity: 0.8;
      animation: scale 0.6s ease-out forwards;
      pointer-events: none;
    `;

    badge.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupCodeDisplay() {
    if (!this.codeDisplay) return;

    const codeLines = this.codeDisplay.querySelectorAll(".code-line");

    // Simulate live coding
    setInterval(() => {
      const randomLine =
        codeLines[Math.floor(Math.random() * codeLines.length)];
      if (randomLine && Math.random() > 0.8) {
        randomLine.style.animation = "textGlitch 0.2s ease-out";

        setTimeout(() => {
          randomLine.style.animation = "";
        }, 200);
      }
    }, 3000);

    // Add typing cursor effect
    const cursor = document.createElement("span");
    cursor.textContent = "_";
    cursor.style.cssText = `
      color: var(--accent-cyan);
      animation: blink 1s step-end infinite;
      margin-left: 0.25rem;
    `;

    const lastLine = codeLines[codeLines.length - 1];
    if (lastLine) {
      lastLine.appendChild(cursor);
    }
  }

  setupScrollIndicator() {
    if (!this.scrollIndicator) return;

    const scrollProgress = document.getElementById("scrollProgress");

    // Update scroll progress
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 360;

      if (scrollProgress) {
        scrollProgress.style.background = `conic-gradient(var(--accent-yellow) ${progress}deg, transparent ${progress}deg)`;
      }
    });

    // Smooth scroll on click
    this.scrollIndicator.addEventListener("click", () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });

    // Hover effects
    this.scrollIndicator.addEventListener("mouseenter", () => {
      this.scrollIndicator.style.transform = "translateX(-50%) scale(1.1)";
    });

    this.scrollIndicator.addEventListener("mouseleave", () => {
      this.scrollIndicator.style.transform = "translateX(-50%) scale(1)";
    });
  }

  setupCursorTrail() {
    if (!this.cursorTrail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      this.cursorTrail.style.opacity = "0.6";
    });

    // Hide cursor trail when mouse leaves
    document.addEventListener("mouseleave", () => {
      this.cursorTrail.style.opacity = "0";
    });

    // Smooth trail animation
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;

      this.cursorTrail.style.left = `${trailX - 10}px`;
      this.cursorTrail.style.top = `${trailY - 10}px`;

      requestAnimationFrame(animateTrail);
    };

    animateTrail();
  }

  startBackgroundAnimations() {
    // Continuous particle movement
    setInterval(() => {
      this.particles.forEach((particle) => {
        if (Math.random() > 0.98) {
          particle.element.style.background = `hsl(${
            Math.random() * 360
          }, 70%, 60%)`;
        }
      });
    }, 100);

    // Star twinkling variations
    setInterval(() => {
      this.stars.forEach((star) => {
        if (Math.random() > 0.95) {
          star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        }
      });
    }, 2000);

    // Add dynamic CSS animations
    this.addDynamicStyles();
  }

  addDynamicStyles() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes scale {
        from {
          transform: scale(1);
          opacity: 0.8;
        }
        to {
          transform: scale(2);
          opacity: 0;
        }
      }

      .badge-tooltip {
        animation: fadeIn 0.3s ease-out forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Public methods for external control
  pauseAnimations() {
    const allAnimated = this.heroSection.querySelectorAll("*");
    allAnimated.forEach((el) => {
      el.style.animationPlayState = "paused";
    });
  }

  resumeAnimations() {
    const allAnimated = this.heroSection.querySelectorAll("*");
    allAnimated.forEach((el) => {
      el.style.animationPlayState = "running";
    });
  }

  updateMetric(index, newValue) {
    const metrics = this.metricsBar.querySelectorAll(".metric-number");
    if (metrics[index]) {
      metrics[index].textContent = newValue;
      metrics[index].style.animation = "pulse 0.5s ease-out";
    }
  }

  triggerGlitchEffect() {
    this.heroSection.style.animation = "glitch 0.5s ease-out";
    setTimeout(() => {
      this.heroSection.style.animation = "";
    }, 500);
  }
}

// Initialize the hero component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const hero = new BrutalistHero();

  // Make hero instance globally available for debugging
  window.brutalistHero = hero;
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistHero;
}
