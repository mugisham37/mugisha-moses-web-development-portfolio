// Brutalist Results Component
class BrutalistResults {
  constructor() {
    this.resultsSection = document.getElementById("resultsSection");
    this.resultsTitle = document.getElementById("resultsTitle");
    this.successParticles = document.getElementById("successParticles");
    this.achievementStreams = document.getElementById("achievementStreams");
    this.achievementTrack = document.getElementById("achievementTrack");
    this.resultsCta = document.getElementById("resultsCta");

    this.counterMetrics = document.querySelectorAll(
      ".counter-metric .counter-number"
    );
    this.revenueAmounts = document.querySelectorAll(".category-amount");
    this.comparisonCards = document.querySelectorAll(".comparison-card");
    this.achievementMedallions = document.querySelectorAll(
      ".achievement-medallion"
    );

    this.isAnimating = false;
    this.hasAnimated = false;

    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupComparisonInteractions();
    this.setupTimelineInteractions();
    this.setupCTAInteractions();
    this.setupBackgroundEffects();
    this.setupROICalculator();
    this.startLiveUpdates();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.triggerEntranceAnimations();
            this.hasAnimated = true;
          }
        });
      },
      { threshold: 0.2 }
    );

    if (this.resultsSection) {
      observer.observe(this.resultsSection);
    }
  }

  triggerEntranceAnimations() {
    // Animate title
    if (this.resultsTitle) {
      this.resultsTitle.style.animation = "slideInUp 1s ease-out forwards";
    }

    // Animate counter metrics with stagger
    this.counterMetrics.forEach((counter, index) => {
      setTimeout(() => {
        this.animateCounter(counter);
      }, index * 300);
    });

    // Animate revenue amounts
    setTimeout(() => {
      this.revenueAmounts.forEach((amount, index) => {
        setTimeout(() => {
          this.animateRevenueCounter(amount);
        }, index * 200);
      });
    }, 1000);

    // Animate comparison cards
    setTimeout(() => {
      this.comparisonCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.animation = "slideInUp 0.8s ease-out forwards";
          card.style.opacity = "1";
        }, index * 200);
      });
    }, 1500);
  }

  setupCounterAnimations() {
    // Set initial state
    this.counterMetrics.forEach((counter) => {
      counter.textContent = "0";
    });

    this.revenueAmounts.forEach((amount) => {
      const target = parseFloat(amount.dataset.target);
      if (amount.textContent.includes("$")) {
        amount.textContent = "$0";
      } else if (amount.textContent.includes("%")) {
        amount.textContent = "0%";
      } else {
        amount.textContent = "0";
      }
    });
  }

  animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = target * easeOutQuart;

      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Add final formatting
        if (isDecimal) {
          element.textContent = target.toFixed(1);
        } else {
          element.textContent = target.toLocaleString();
        }

        // Add success effect
        element.style.animation = "counterSuccess 0.5s ease-out";
      }
    };

    requestAnimationFrame(updateCounter);
  }

  animateRevenueCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2500;
    const startTime = performance.now();
    const isPercentage = element.textContent.includes("%");
    const isCurrency = element.textContent.includes("$");

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = target * easeOutQuart;

      if (isPercentage) {
        element.textContent = Math.floor(current) + "%";
      } else if (isCurrency) {
        if (target >= 1000000) {
          element.textContent = "$" + (current / 1000000).toFixed(1) + "M";
        } else if (target >= 1000) {
          element.textContent = "$" + (current / 1000).toFixed(0) + "K";
        } else {
          element.textContent = "$" + Math.floor(current).toLocaleString();
        }
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Final formatting
        if (isPercentage) {
          element.textContent = target + "%";
        } else if (isCurrency) {
          if (target >= 1000000) {
            element.textContent = "$" + (target / 1000000).toFixed(1) + "M";
          } else if (target >= 1000) {
            element.textContent = "$" + (target / 1000).toFixed(0) + "K";
          } else {
            element.textContent = "$" + target.toLocaleString();
          }
        }

        element.style.animation = "goldGlow 0.8s ease-out";
      }
    };

    requestAnimationFrame(updateCounter);
  }

  setupComparisonInteractions() {
    this.comparisonCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.triggerComparisonHover(card);
      });

      card.addEventListener("mouseleave", () => {
        this.resetComparisonHover(card);
      });

      card.addEventListener("click", () => {
        this.triggerComparisonClick(card);
      });
    });
  }

  triggerComparisonHover(card) {
    const arrow = card.querySelector(".arrow-icon");
    const impactHighlight = card.querySelector(".impact-highlight");

    if (arrow) {
      arrow.style.animation = "arrowPulse 0.5s ease-in-out infinite";
    }

    if (impactHighlight) {
      impactHighlight.style.animation = "goldGlow 1s ease-in-out infinite";
    }

    // Add subtle glow effect
    card.style.boxShadow = "0 0 30px rgba(255, 215, 0, 0.2)";
  }

  resetComparisonHover(card) {
    const arrow = card.querySelector(".arrow-icon");
    const impactHighlight = card.querySelector(".impact-highlight");

    if (arrow) {
      arrow.style.animation = "arrowPulse 2s ease-in-out infinite";
    }

    if (impactHighlight) {
      impactHighlight.style.animation = "";
    }

    card.style.boxShadow = "";
  }

  triggerComparisonClick(card) {
    const comparisonType = card.dataset.comparison;

    // Create detailed view overlay
    this.showComparisonDetails(comparisonType, card);
  }

  showComparisonDetails(type, card) {
    const overlay = document.createElement("div");
    overlay.className = "comparison-detail-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    const detailCard = card.cloneNode(true);
    detailCard.style.cssText = `
      transform: scale(1.2);
      max-width: 800px;
      margin: 2rem;
      position: relative;
    `;

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "✕";
    closeButton.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #ffd700;
      color: #000;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 10001;
    `;

    closeButton.addEventListener("click", () => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 300);
      }
    });

    detailCard.appendChild(closeButton);
    overlay.appendChild(detailCard);
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 10);
  }

  setupTimelineInteractions() {
    this.achievementMedallions.forEach((medallion, index) => {
      medallion.addEventListener("mouseenter", () => {
        this.triggerMedallionHover(medallion);
      });

      medallion.addEventListener("mouseleave", () => {
        this.resetMedallionHover(medallion);
      });

      medallion.addEventListener("click", () => {
        this.triggerMedallionClick(medallion, index);
      });
    });

    // Auto-scroll timeline
    this.setupTimelineAutoScroll();
  }

  triggerMedallionHover(medallion) {
    const icon = medallion.querySelector(".medallion-icon");
    const year = medallion.querySelector(".medallion-year");

    if (icon) {
      icon.style.animation = "medallionGlow 0.5s ease-in-out infinite";
    }

    if (year) {
      year.style.textShadow = "0 0 10px #ffd700";
    }
  }

  resetMedallionHover(medallion) {
    const icon = medallion.querySelector(".medallion-icon");
    const year = medallion.querySelector(".medallion-year");

    if (icon) {
      icon.style.animation = "medallionGlow 3s ease-in-out infinite";
    }

    if (year) {
      year.style.textShadow = "";
    }
  }

  triggerMedallionClick(medallion, index) {
    // Highlight clicked medallion
    this.achievementMedallions.forEach((m) => m.classList.remove("active"));
    medallion.classList.add("active");

    // Create achievement detail popup
    this.showAchievementDetails(medallion, index);
  }

  showAchievementDetails(medallion, index) {
    const year = medallion.querySelector(".medallion-year").textContent;
    const title = medallion.querySelector(".medallion-title").textContent;
    const description = medallion.querySelector(
      ".medallion-description"
    ).textContent;

    const achievements = {
      0: {
        details:
          "Delivered a comprehensive enterprise solution that transformed the client's entire workflow, resulting in 40% efficiency gains.",
        impact: "$100,000 project value",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      },
      1: {
        details:
          "Achieved AWS Solutions Architect Professional certification, demonstrating expertise in cloud architecture and scalable systems.",
        impact: "Professional certification",
        technologies: ["AWS", "Cloud Architecture", "DevOps", "Security"],
      },
      2: {
        details:
          "Established independent consultancy practice, focusing on high-impact web applications for growing businesses.",
        impact: "Business milestone",
        technologies: [
          "Full-Stack Development",
          "Consulting",
          "Project Management",
        ],
      },
      3: {
        details:
          "Exceeded $1M in total revenue generated for clients through optimized applications and improved business processes.",
        impact: "$1,000,000+ client revenue",
        technologies: [
          "Performance Optimization",
          "Business Intelligence",
          "Analytics",
        ],
      },
      4: {
        details:
          "Open source project gained significant traction with 1,000+ GitHub stars and active community contributions.",
        impact: "1,000+ GitHub stars",
        technologies: ["Open Source", "Community Building", "Documentation"],
      },
      5: {
        details:
          "Maintained perfect client satisfaction rate with 99.9% project success rate and zero client churn.",
        impact: "99.9% satisfaction rate",
        technologies: [
          "Client Relations",
          "Quality Assurance",
          "Project Delivery",
        ],
      },
    };

    const achievement = achievements[index] || achievements[0];

    const popup = document.createElement("div");
    popup.className = "achievement-popup";
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #ffd700;
      padding: 2rem;
      max-width: 500px;
      z-index: 10000;
      font-family: 'JetBrains Mono', monospace;
      color: white;
      border-radius: 8px;
    `;

    popup.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 2rem; color: #ffd700; margin-bottom: 0.5rem;">${year}</div>
        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">${title}</div>
        <div style="font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">${
          achievement.details
        }</div>
        <div style="font-size: 1rem; color: #ffd700; margin-bottom: 1rem;">${
          achievement.impact
        }</div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
          ${achievement.technologies
            .map(
              (tech) =>
                `<span style="background: rgba(255, 215, 0, 0.1); color: #ffd700; padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid rgba(255, 215, 0, 0.3);">${tech}</span>`
            )
            .join("")}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 1.5rem; background: #ffd700; color: #000; border: none; padding: 0.5rem 1rem; cursor: pointer; font-family: inherit;">CLOSE</button>
      </div>
    `;

    document.body.appendChild(popup);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (popup.parentElement) {
        popup.remove();
      }
    }, 10000);
  }

  setupTimelineAutoScroll() {
    if (!this.achievementTrack) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    const maxScroll =
      this.achievementTrack.scrollWidth - this.achievementTrack.clientWidth;

    const autoScroll = () => {
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      } else {
        scrollPosition += scrollSpeed;
      }

      this.achievementTrack.scrollLeft = scrollPosition;
    };

    // Start auto-scroll after 3 seconds
    setTimeout(() => {
      setInterval(autoScroll, 50);
    }, 3000);
  }

  setupCTAInteractions() {
    if (!this.resultsCta) return;

    this.resultsCta.addEventListener("click", () => {
      this.triggerCTAAction();
    });

    this.resultsCta.addEventListener("mouseenter", () => {
      this.resultsCta.style.transform = "translateY(-5px) scale(1.05)";
    });

    this.resultsCta.addEventListener("mouseleave", () => {
      this.resultsCta.style.transform = "translateY(0) scale(1)";
    });
  }

  triggerCTAAction() {
    const originalText = this.resultsCta.querySelector(".cta-text").textContent;
    const ctaText = this.resultsCta.querySelector(".cta-text");

    // Change text with animation
    ctaText.textContent = "INITIATING CONTACT...";
    this.resultsCta.style.background =
      "linear-gradient(45deg, #10b981, #ffd700)";

    setTimeout(() => {
      ctaText.textContent = "MESSAGE SENT!";
      this.resultsCta.style.background =
        "linear-gradient(45deg, #00ff00, #ffd700)";
    }, 1500);

    setTimeout(() => {
      ctaText.textContent = originalText;
      this.resultsCta.style.background =
        "linear-gradient(45deg, #ffd700, #10b981)";
    }, 3000);

    // Create success notification
    this.showSuccessNotification();
  }

  showSuccessNotification() {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(45deg, #00ff00, #ffd700);
      color: #000;
      padding: 1rem 2rem;
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      z-index: 10000;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%);
      animation: slideInRight 0.5s ease-out;
    `;
    notification.textContent = "SUCCESS! We'll be in touch soon.";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.5s ease-in";
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  setupBackgroundEffects() {
    this.createSuccessParticles();
    this.createAchievementStreams();
  }

  createSuccessParticles() {
    if (!this.successParticles) return;

    // Create floating success particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: #ffd700;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: successParticleFloat ${
          Math.random() * 10 + 15
        }s ease-in-out infinite;
        opacity: ${Math.random() * 0.8 + 0.2};
      `;
      this.successParticles.appendChild(particle);
    }
  }

  createAchievementStreams() {
    if (!this.achievementStreams) return;

    // Create flowing achievement streams
    for (let i = 0; i < 5; i++) {
      const stream = document.createElement("div");
      stream.style.cssText = `
        position: absolute;
        width: 2px;
        height: 100px;
        background: linear-gradient(to bottom, transparent, #ffd700, transparent);
        left: ${Math.random() * 100}%;
        top: -100px;
        animation: achievementStreamFlow ${
          Math.random() * 8 + 12
        }s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      this.achievementStreams.appendChild(stream);
    }
  }

  setupROICalculator() {
    // Simple ROI calculator functionality
    const revenueCategories = document.querySelectorAll(".revenue-category");

    revenueCategories.forEach((category) => {
      category.addEventListener("click", () => {
        this.showROIBreakdown(category);
      });
    });
  }

  showROIBreakdown(category) {
    const title = category.querySelector(".category-title").textContent;
    const amount = category.querySelector(".category-amount").textContent;
    const details = category.querySelector(".category-details").textContent;

    const breakdown = document.createElement("div");
    breakdown.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #ffd700;
      padding: 1.5rem;
      max-width: 300px;
      font-family: 'JetBrains Mono', monospace;
      color: white;
      z-index: 10000;
      animation: slideInUp 0.5s ease-out;
    `;

    breakdown.innerHTML = `
      <div style="color: #ffd700; font-weight: 700; margin-bottom: 0.5rem;">${title}</div>
      <div style="font-size: 1.5rem; color: #ffd700; margin-bottom: 0.5rem;">${amount}</div>
      <div style="font-size: 0.875rem; margin-bottom: 1rem;">${details}</div>
      <div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.7);">
        Click anywhere to close
      </div>
    `;

    breakdown.addEventListener("click", () => {
      breakdown.style.animation = "slideOutDown 0.5s ease-in";
      setTimeout(() => breakdown.remove(), 500);
    });

    document.body.appendChild(breakdown);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (breakdown.parentElement) {
        breakdown.style.animation = "slideOutDown 0.5s ease-in";
        setTimeout(() => breakdown.remove(), 500);
      }
    }, 8000);
  }

  startLiveUpdates() {
    // Simulate live data updates
    setInterval(() => {
      this.updateLiveMetrics();
    }, 30000); // Every 30 seconds

    // Update terminal success line
    setInterval(() => {
      this.updateTerminalLine();
    }, 5000); // Every 5 seconds
  }

  updateLiveMetrics() {
    // Randomly update one of the counter metrics
    if (Math.random() > 0.7) {
      const randomMetric =
        this.counterMetrics[
          Math.floor(Math.random() * this.counterMetrics.length)
        ];
      const currentValue = parseInt(
        randomMetric.textContent.replace(/[^\d]/g, "")
      );
      const newValue = currentValue + Math.floor(Math.random() * 3) + 1;

      randomMetric.textContent = newValue.toLocaleString();
      randomMetric.style.animation = "counterSuccess 0.5s ease-out";
    }
  }

  updateTerminalLine() {
    const terminalLine = document.querySelector(
      ".terminal-success-line .success-text"
    );
    if (!terminalLine) return;

    const messages = [
      ">> compiling_results... SUCCESS",
      ">> analyzing_impact... COMPLETE",
      ">> calculating_roi... OPTIMIZED",
      ">> generating_value... MAXIMIZED",
      ">> client_satisfaction... 99.9%",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    terminalLine.textContent = randomMessage;
  }
}

// Additional CSS animations for the component
const resultsAnimations = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes slideOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(100%);
    }
  }

  @keyframes counterSuccess {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); color: #00ff00; }
    100% { transform: scale(1); }
  }

  @keyframes goldGlow {
    0%, 100% { text-shadow: none; }
    50% { text-shadow: 0 0 20px #ffd700; }
  }

  @keyframes successParticleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
    50% { transform: translateY(-50px) rotate(180deg); opacity: 1; }
  }

  @keyframes achievementStreamFlow {
    0% { top: -100px; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100vh; opacity: 0; }
  }

  .achievement-medallion.active {
    border-color: #00ff00 !important;
    background: rgba(0, 255, 0, 0.1) !important;
    transform: translateY(-10px) scale(1.05) !important;
  }
`;

// Inject animations
const styleSheet = document.createElement("style");
styleSheet.textContent = resultsAnimations;
document.head.appendChild(styleSheet);

// Initialize the component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistResults();
});

// Export for use in other components
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistResults;
}
