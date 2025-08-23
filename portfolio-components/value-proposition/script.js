// Brutalist Value Proposition Component
class BrutalistValueProposition {
  constructor() {
    this.valueSection = document.getElementById("valueSection");
    this.valueTitle = document.getElementById("valueTitle");
    this.titleUnderline = document.getElementById("titleUnderline");
    this.valueColumns = document.querySelectorAll(".value-column");
    this.metricNumbers = document.querySelectorAll(".metric-number");
    this.valueCta = document.getElementById("valueCta");
    this.ctaText = document.getElementById("ctaText");
    this.ctaProgressBar = document.getElementById("ctaProgressBar");
    this.scrollArrow = document.getElementById("scrollArrow");
    this.valueParticles = document.getElementById("valueParticles");

    this.isAnimating = false;
    this.metricsAnimated = false;
    this.particles = [];

    this.init();
  }

  init() {
    this.createParticleSystem();
    this.setupScrollAnimations();
    this.setupColumnInteractions();
    this.setupCTAInteractions();
    this.setupMetricsAnimation();
    this.setupScrollArrow();
    this.startBackgroundAnimations();
    this.setupErrorHandling();
  }

  createParticleSystem() {
    if (!this.valueParticles) return;

    // Create floating particles for background effect
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${
          Math.random() > 0.5 ? "var(--accent-cyan)" : "var(--accent-purple)"
        };
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.2};
        animation: particleFloat ${
          Math.random() * 10 + 8
        }s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;

      this.valueParticles.appendChild(particle);
      this.particles.push(particle);
    }
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations based on element
            if (entry.target === this.valueSection && !this.metricsAnimated) {
              this.animateMetrics();
              this.metricsAnimated = true;
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe the main section
    if (this.valueSection) {
      observer.observe(this.valueSection);
    }

    // Observe individual columns for staggered animation
    this.valueColumns.forEach((column, index) => {
      const columnObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add("column-visible");
                this.triggerColumnAnimation(entry.target);
              }, index * 200);
            }
          });
        },
        { threshold: 0.3 }
      );
      columnObserver.observe(column);
    });
  }

  setupColumnInteractions() {
    this.valueColumns.forEach((column) => {
      const columnType = column.dataset.column;
      const icon = column.querySelector(".column-icon");
      const metricNumber = column.querySelector(".metric-number");

      // Enhanced hover effects
      column.addEventListener("mouseenter", () => {
        this.triggerColumnHover(column, columnType);
      });

      column.addEventListener("mouseleave", () => {
        this.resetColumnHover(column, columnType);
      });

      // Click interactions for mobile
      column.addEventListener("click", () => {
        this.triggerColumnClick(column, columnType);
      });

      // Icon-specific interactions
      if (icon) {
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          this.triggerIconInteraction(icon, columnType);
        });
      }
    });
  }

  triggerColumnHover(column, columnType) {
    const icon = column.querySelector(".column-icon");
    const metricNumber = column.querySelector(".metric-number");

    // Add hover class for CSS animations
    column.classList.add("column-hovered");

    // Specific effects based on column type
    switch (columnType) {
      case "business":
        this.triggerBusinessEffect(column);
        break;
      case "speed":
        this.triggerSpeedEffect(column);
        break;
      case "architecture":
        this.triggerArchitectureEffect(column);
        break;
    }

    // Animate metric number
    if (metricNumber) {
      this.animateMetricNumber(metricNumber);
    }
  }

  resetColumnHover(column, columnType) {
    column.classList.remove("column-hovered");
  }

  triggerColumnClick(column, columnType) {
    // Mobile-friendly interaction
    if (window.innerWidth <= 768) {
      column.classList.toggle("column-active");

      // Scroll column into better view
      column.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  triggerBusinessEffect(column) {
    const icon = column.querySelector(".business-icon");
    if (icon) {
      // Create profit indicator effect
      const profitIndicator = document.createElement("div");
      profitIndicator.textContent = "+$$$";
      profitIndicator.style.cssText = `
        position: absolute;
        top: -20px;
        right: -20px;
        color: var(--accent-green);
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        font-size: 0.875rem;
        opacity: 0;
        animation: profitPop 1s ease-out forwards;
        pointer-events: none;
      `;

      icon.appendChild(profitIndicator);

      setTimeout(() => {
        profitIndicator.remove();
      }, 1000);
    }
  }

  triggerSpeedEffect(column) {
    const icon = column.querySelector(".speed-icon");
    if (icon) {
      // Create speed burst effect
      for (let i = 0; i < 5; i++) {
        const speedLine = document.createElement("div");
        speedLine.style.cssText = `
          position: absolute;
          width: 30px;
          height: 2px;
          background: var(--accent-purple);
          right: -40px;
          top: 50%;
          transform: translateY(-50%) rotate(${Math.random() * 20 - 10}deg);
          opacity: 0;
          animation: speedBurst 0.6s ease-out forwards;
          animation-delay: ${i * 0.1}s;
        `;

        icon.appendChild(speedLine);

        setTimeout(() => {
          speedLine.remove();
        }, 800);
      }
    }
  }

  triggerArchitectureEffect(column) {
    const icon = column.querySelector(".architecture-icon");
    if (icon) {
      // Create network expansion effect
      const networkNodes = icon.querySelectorAll("circle");
      networkNodes.forEach((node, index) => {
        setTimeout(() => {
          node.style.animation = "networkNodePulse 0.5s ease-out";
        }, index * 100);
      });
    }
  }

  triggerIconInteraction(icon, columnType) {
    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 255, 255, 0.3), transparent);
      animation: rippleExpand 0.6s ease-out;
      pointer-events: none;
    `;

    icon.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupCTAInteractions() {
    if (!this.valueCta) return;

    this.valueCta.addEventListener("click", () => {
      this.triggerCTAAction();
    });

    this.valueCta.addEventListener("mouseenter", () => {
      this.startCTAHoverEffect();
    });

    this.valueCta.addEventListener("mouseleave", () => {
      this.stopCTAHoverEffect();
    });
  }

  triggerCTAAction() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const originalText = this.ctaText.textContent;

    // Animate button text change
    this.typewriterEffect(this.ctaText, "LOADING RESULTS...", () => {
      // Simulate loading
      this.animateProgressBar();

      setTimeout(() => {
        this.typewriterEffect(this.ctaText, "RESULTS READY!", () => {
          setTimeout(() => {
            this.typewriterEffect(this.ctaText, originalText, () => {
              this.isAnimating = false;
            });
          }, 1500);
        });
      }, 2000);
    });

    // Create success particles
    this.createSuccessParticles();
  }

  startCTAHoverEffect() {
    if (this.ctaProgressBar) {
      this.ctaProgressBar.style.width = "100%";
    }
  }

  stopCTAHoverEffect() {
    if (this.ctaProgressBar) {
      this.ctaProgressBar.style.width = "0%";
    }
  }

  animateProgressBar() {
    if (!this.ctaProgressBar) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      this.ctaProgressBar.style.width = `${progress}%`;
    }, 100);
  }

  createSuccessParticles() {
    const button = this.valueCta;
    if (!button) return;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-green);
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
        animation: successParticle 1s ease-out forwards;
        animation-delay: ${i * 0.1}s;
        pointer-events: none;
      `;

      button.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  setupMetricsAnimation() {
    // Animate metrics when they come into view
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.metricsAnimated) {
            this.animateMetrics();
            this.metricsAnimated = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    this.metricNumbers.forEach((metric) => {
      metricsObserver.observe(metric);
    });
  }

  animateMetrics() {
    this.metricNumbers.forEach((metric, index) => {
      const target = parseInt(metric.dataset.target) || 0;
      const isPercentage = metric.parentElement.textContent.includes("%");
      const isMultiplier = metric.parentElement.textContent.includes("x");

      setTimeout(() => {
        this.animateCounter(
          metric,
          0,
          target,
          2000,
          isPercentage,
          isMultiplier
        );
      }, index * 300);
    });
  }

  animateCounter(
    element,
    start,
    end,
    duration,
    isPercentage = false,
    isMultiplier = false
  ) {
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);

      if (isMultiplier) {
        element.textContent = current;
      } else {
        element.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Add completion effect
        element.style.animation = "metricComplete 0.5s ease-out";
      }
    };

    requestAnimationFrame(updateCounter);
  }

  animateMetricNumber(metricElement) {
    if (!metricElement) return;

    // Create floating number effect
    const floatingNumber = document.createElement("div");
    const currentValue = metricElement.textContent;
    floatingNumber.textContent = `+${Math.floor(Math.random() * 50 + 10)}`;
    floatingNumber.style.cssText = `
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      color: var(--accent-green);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      opacity: 0;
      animation: floatingNumber 1.5s ease-out forwards;
      pointer-events: none;
    `;

    metricElement.parentElement.appendChild(floatingNumber);

    setTimeout(() => {
      floatingNumber.remove();
    }, 1500);
  }

  setupScrollArrow() {
    if (!this.scrollArrow) return;

    this.scrollArrow.addEventListener("click", () => {
      // Simulate scroll to next section
      this.triggerScrollEffect();
    });

    // Update arrow text based on scroll position
    this.updateScrollArrowText();
  }

  triggerScrollEffect() {
    const arrowIcon = this.scrollArrow.querySelector(".arrow-icon");
    const arrowText = this.scrollArrow.querySelector(".arrow-text");

    if (arrowIcon && arrowText) {
      arrowText.textContent = "Scrolling...";
      arrowIcon.style.animation = "scrollPulse 0.5s ease-out";

      setTimeout(() => {
        arrowText.textContent = "Results section loading...";
        arrowIcon.style.animation = "bounce 2s ease-in-out infinite";
      }, 1000);
    }
  }

  updateScrollArrowText() {
    const arrowText = this.scrollArrow?.querySelector(".arrow-text");
    if (!arrowText) return;

    // Simulate dynamic text updates
    const messages = [
      "Results section loading...",
      "Preparing case studies...",
      "Loading success metrics...",
      "Ready to show impact...",
    ];

    let messageIndex = 0;
    setInterval(() => {
      arrowText.textContent = messages[messageIndex];
      messageIndex = (messageIndex + 1) % messages.length;
    }, 3000);
  }

  triggerColumnAnimation(column) {
    const icon = column.querySelector(".column-icon");
    const title = column.querySelector(".column-title");
    const description = column.querySelector(".column-description");

    // Staggered animation for column elements
    if (icon) {
      setTimeout(() => {
        icon.style.animation = "iconEntrance 0.6s ease-out forwards";
      }, 100);
    }

    if (title) {
      setTimeout(() => {
        title.style.animation = "titleSlideIn 0.6s ease-out forwards";
      }, 200);
    }

    if (description) {
      setTimeout(() => {
        description.style.animation =
          "descriptionFadeIn 0.6s ease-out forwards";
      }, 300);
    }
  }

  typewriterEffect(element, newText, callback) {
    if (!element) return;

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

  startBackgroundAnimations() {
    // Add dynamic particle movement
    setInterval(() => {
      this.particles.forEach((particle) => {
        if (Math.random() > 0.98) {
          particle.style.background =
            Math.random() > 0.5 ? "var(--accent-cyan)" : "var(--accent-purple)";
        }
      });
    }, 2000);

    // Add CSS animations for component-specific effects
    this.addComponentAnimations();
  }

  addComponentAnimations() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(90deg); }
        50% { transform: translateY(-10px) rotate(180deg); }
        75% { transform: translateY(-30px) rotate(270deg); }
      }
      
      @keyframes profitPop {
        0% { opacity: 0; transform: translateY(0) scale(0.5); }
        50% { opacity: 1; transform: translateY(-10px) scale(1.2); }
        100% { opacity: 0; transform: translateY(-20px) scale(1); }
      }
      
      @keyframes speedBurst {
        0% { opacity: 0; transform: translateX(0); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: translateX(50px); }
      }
      
      @keyframes networkNodePulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes rippleExpand {
        0% { transform: scale(0); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes successParticle {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { 
          opacity: 0; 
          transform: translate(
            calc(-50% + ${Math.random() * 200 - 100}px), 
            calc(-50% + ${Math.random() * 200 - 100}px)
          ) scale(0.5); 
        }
      }
      
      @keyframes floatingNumber {
        0% { opacity: 0; transform: translateX(-50%) translateY(0); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
      }
      
      @keyframes metricComplete {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); color: var(--accent-green); }
        100% { transform: scale(1); }
      }
      
      @keyframes scrollPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      @keyframes iconEntrance {
        0% { opacity: 0; transform: scale(0.5) rotate(-180deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      
      @keyframes titleSlideIn {
        0% { opacity: 0; transform: translateX(-30px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes descriptionFadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  setupErrorHandling() {
    // Graceful degradation for missing elements
    window.addEventListener("error", (e) => {
      console.warn("Value Proposition Component Error:", e.message);
      // Continue functioning with available elements
    });

    // Fallback for animation support
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => {
        return setTimeout(callback, 16);
      };
    }
  }
}

// Initialize the component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    new BrutalistValueProposition();
  } catch (error) {
    console.error("Failed to initialize Value Proposition component:", error);
    // Provide fallback functionality
    document.querySelectorAll(".metric-number").forEach((metric) => {
      const target = metric.dataset.target;
      if (target) {
        metric.textContent = target;
      }
    });
  }
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistValueProposition;
}
