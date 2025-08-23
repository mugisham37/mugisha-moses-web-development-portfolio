// Trust Component JavaScript

class BrutalistTrust {
  constructor() {
    this.trustSection = document.getElementById("trustSection");
    this.testimonialCarousel = document.getElementById("testimonialCarousel");
    this.testimonialTrack = document.getElementById("testimonialTrack");
    this.contributionGraph = document.getElementById("contributionGraph");
    this.certificationsGrid = document.getElementById("certificationsGrid");
    this.logoMarquee = document.getElementById("logoMarquee");
    this.trustParticles = document.getElementById("trustParticles");

    this.currentTestimonial = 0;
    this.testimonialCount = 5;
    this.isCarouselPaused = false;

    this.init();
  }

  init() {
    this.setupTestimonialCarousel();
    this.setupGitHubIntegration();
    this.setupCertifications();
    this.setupLogoMarquee();
    this.setupScrollAnimations();
    this.setupLiveDataSimulation();
    this.startTrustAnimations();
  }

  setupTestimonialCarousel() {
    // Auto-advance testimonials
    this.testimonialInterval = setInterval(() => {
      if (!this.isCarouselPaused) {
        this.nextTestimonial();
      }
    }, 8000);

    // Pause on hover
    if (this.testimonialCarousel) {
      this.testimonialCarousel.addEventListener("mouseenter", () => {
        this.isCarouselPaused = true;
      });

      this.testimonialCarousel.addEventListener("mouseleave", () => {
        this.isCarouselPaused = false;
      });
    }

    // Setup navigation dots
    this.setupTestimonialDots();
  }

  setupTestimonialDots() {
    const navDots = document.getElementById("navDots");
    if (!navDots) return;

    // Create dots
    for (let i = 0; i < this.testimonialCount; i++) {
      const dot = document.createElement("div");
      dot.className = `nav-dot ${i === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => this.goToTestimonial(i));
      navDots.appendChild(dot);
    }
  }

  nextTestimonial() {
    this.currentTestimonial =
      (this.currentTestimonial + 1) % this.testimonialCount;
    this.updateTestimonialDisplay();
  }

  goToTestimonial(index) {
    this.currentTestimonial = index;
    this.updateTestimonialDisplay();
  }

  updateTestimonialDisplay() {
    // Update dots
    const dots = document.querySelectorAll(".nav-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentTestimonial);
    });

    // Trigger glitch effect on active testimonial
    const testimonials = document.querySelectorAll(".testimonial-card");
    if (testimonials[this.currentTestimonial]) {
      testimonials[this.currentTestimonial].style.animation =
        "testimonialGlitch 0.3s ease-out";
    }
  }

  setupGitHubIntegration() {
    // Simulate GitHub contribution graph
    this.generateContributionGraph();

    // Update project progress
    this.updateProjectProgress();
  }

  generateContributionGraph() {
    if (!this.contributionGraph) return;

    // Clear loading text
    this.contributionGraph.innerHTML = "";

    // Create contribution grid (simplified)
    const grid = document.createElement("div");
    grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(53, 1fr);
            gap: 2px;
            width: 100%;
            height: 100%;
            padding: 1rem;
        `;

    // Generate 365 days of contributions
    for (let i = 0; i < 365; i++) {
      const day = document.createElement("div");
      const intensity = Math.random();
      let color = "rgba(255, 255, 255, 0.1)";

      if (intensity > 0.8) color = "#00ff00";
      else if (intensity > 0.6) color = "#00cc00";
      else if (intensity > 0.4) color = "#009900";
      else if (intensity > 0.2) color = "#006600";

      day.style.cssText = `
                width: 100%;
                height: 8px;
                background: ${color};
                border-radius: 1px;
                transition: all 0.3s ease;
            `;

      day.addEventListener("mouseenter", () => {
        day.style.transform = "scale(1.5)";
        day.style.zIndex = "10";
      });

      day.addEventListener("mouseleave", () => {
        day.style.transform = "scale(1)";
        day.style.zIndex = "1";
      });

      grid.appendChild(day);
    }

    this.contributionGraph.appendChild(grid);
  }

  updateProjectProgress() {
    const progressFill = document.querySelector(".progress-fill");
    const progressPercentage = document.querySelector(".progress-percentage");

    if (progressFill && progressPercentage) {
      let currentProgress = 78;
      const targetProgress = 85;

      const updateInterval = setInterval(() => {
        if (currentProgress < targetProgress) {
          currentProgress += 0.5;
          progressFill.style.width = `${currentProgress}%`;
          progressPercentage.textContent = `${Math.floor(currentProgress)}%`;
        } else {
          clearInterval(updateInterval);
        }
      }, 100);
    }
  }

  setupCertifications() {
    const certCards = this.certificationsGrid?.querySelectorAll(".cert-card");

    certCards?.forEach((card) => {
      card.addEventListener("click", () => {
        this.triggerCertificationFlip(card);
      });

      // Add verification button functionality
      const verifyBtn = card.querySelector(".verify-btn");
      verifyBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.triggerVerificationEffect(verifyBtn);
      });
    });
  }

  triggerCertificationFlip(card) {
    // Add extra rotation effect
    card.style.transform = "rotateY(180deg) scale(1.05)";
    setTimeout(() => {
      card.style.transform = "rotateY(180deg) scale(1)";
    }, 300);
  }

  triggerVerificationEffect(button) {
    const originalText = button.textContent;
    button.textContent = "VERIFYING...";
    button.style.background = "#ffff00";
    button.style.color = "#000";

    setTimeout(() => {
      button.textContent = "✓ VERIFIED";
      button.style.background = "#00ff00";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
        button.style.color = "";
      }, 2000);
    }, 1500);
  }

  setupLogoMarquee() {
    // Add hover effects to platform logos
    const platformLogos = document.querySelectorAll(".platform-logo");

    platformLogos.forEach((logo) => {
      logo.addEventListener("mouseenter", () => {
        logo.style.transform = "scale(1.2) rotate(5deg)";
        logo.style.filter = "brightness(1.5)";
      });

      logo.addEventListener("mouseleave", () => {
        logo.style.transform = "scale(1) rotate(0deg)";
        logo.style.filter = "brightness(1)";
      });
    });
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations based on element
            if (entry.target.classList.contains("github-section")) {
              this.animateGitHubSection();
            } else if (entry.target.classList.contains("certifications-grid")) {
              this.animateCertifications();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe key elements
    const elementsToObserve = [
      ".github-section",
      ".certifications-grid",
      ".media-recognition",
    ];

    elementsToObserve.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
  }

  animateGitHubSection() {
    // Animate contribution count
    const statNumber = document.querySelector(".stat-number");
    if (statNumber) {
      this.animateCounter(statNumber, 0, 1847, 2000);
    }
  }

  animateCertifications() {
    const certCards = this.certificationsGrid.querySelectorAll(".cert-card");
    certCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = "rotateY(360deg)";
        setTimeout(() => {
          card.style.transform = "rotateY(0deg)";
        }, 600);
      }, index * 100);
    });
  }

  animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  setupLiveDataSimulation() {
    // Simulate live GitHub activity
    setInterval(() => {
      const commitCount = document.querySelector(".commit-count");
      if (commitCount && Math.random() > 0.8) {
        const current = Number.parseInt(commitCount.textContent);
        commitCount.textContent = current + 1;
        commitCount.style.animation = "pulse 0.5s ease-out";
      }
    }, 60000); // Every minute

    // Update project timeline
    setInterval(() => {
      const timeline = document.querySelector(".project-timeline");
      if (timeline) {
        const days = Number.parseInt(timeline.textContent.match(/\d+/)[0]);
        if (days > 1) {
          timeline.textContent = `Est. completion: ${days - 1} days`;
        }
      }
    }, 86400000); // Every day
  }

  startTrustAnimations() {
    // Add trust-specific CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes trustParticleFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes testimonialGlitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      
      .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
      }
      
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
    `;
    document.head.appendChild(style);
  }
}

// Initialize the trust component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistTrust();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistTrust;
}
