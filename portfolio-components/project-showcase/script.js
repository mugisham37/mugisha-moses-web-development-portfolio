// Brutalist Project Showcase Component
class BrutalistShowcase {
  constructor() {
    this.showcaseSection = document.getElementById("showcaseSection");
    this.filterSystem = document.getElementById("filterSystem");
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectsGrid = document.getElementById("projectsGrid");
    this.projectCards = document.querySelectorAll(".project-card");
    this.featuredSpotlight = document.getElementById("featuredSpotlight");
    this.loadMoreBtn = document.getElementById("loadMoreBtn");
    this.showcaseParticles = document.getElementById("showcaseParticles");
    this.matrixRain = document.getElementById("matrixRain");

    this.currentFilter = "all";
    this.visibleProjects = 6;
    this.totalProjects = 12;
    this.isLoading = false;

    this.init();
  }

  init() {
    this.setupFilterSystem();
    this.setupProjectCards();
    this.setupFeaturedSpotlight();
    this.setupLoadMore();
    this.setupScrollAnimations();
    this.setupMatrixRain();
    this.startShowcaseAnimations();
  }

  setupFilterSystem() {
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.handleFilterChange(btn);
      });
    });

    // Setup filter indicator
    this.updateFilterIndicator();
  }

  handleFilterChange(activeBtn) {
    // Remove active state from all buttons
    this.filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active state to clicked button
    activeBtn.classList.add("active");

    // Update current filter
    this.currentFilter = activeBtn.dataset.filter;

    // Update filter indicator position
    this.updateFilterIndicator();

    // Filter projects with animation
    this.filterProjects();

    // Add ripple effect
    this.createRippleEffect(activeBtn);
  }

  updateFilterIndicator() {
    const indicator = document.getElementById("filterIndicator");
    const activeBtn = document.querySelector(".filter-btn.active");

    if (indicator && activeBtn) {
      const btnRect = activeBtn.getBoundingClientRect();
      const containerRect = activeBtn.parentElement.getBoundingClientRect();

      indicator.style.left = `${btnRect.left - containerRect.left}px`;
      indicator.style.width = `${btnRect.width}px`;
    }
  }

  filterProjects() {
    this.projectCards.forEach((card, index) => {
      const cardTech = card.dataset.tech;
      const shouldShow =
        this.currentFilter === "all" || cardTech.includes(this.currentFilter);

      if (shouldShow) {
        card.style.display = "block";
        card.style.animation = `slideInUp 0.5s ease-out ${
          index * 0.1
        }s forwards`;
      } else {
        card.style.animation = "fadeOut 0.3s ease-out forwards";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });

    // Update project counter
    this.updateProjectCounter();
  }

  createRippleEffect(button) {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";

    button.style.position = "relative";
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  setupProjectCards() {
    this.projectCards.forEach((card) => {
      // Setup hover effects
      card.addEventListener("mouseenter", () => {
        this.triggerCardHover(card);
      });

      card.addEventListener("mouseleave", () => {
        this.resetCardHover(card);
      });

      // Setup play button
      const playBtn = card.querySelector(".preview-play-btn");
      playBtn?.addEventListener("click", () => {
        this.playProjectDemo(card);
      });

      // Setup CTA button
      const ctaBtn = card.querySelector(".card-cta");
      ctaBtn?.addEventListener("click", () => {
        this.openCaseStudy(card);
      });

      // Setup GitHub link
      const githubInfo = card.querySelector(".github-info");
      githubInfo?.addEventListener("click", () => {
        this.openGitHubRepo(card);
      });
    });
  }

  triggerCardHover(card) {
    // Add glow effect
    card.style.boxShadow = "0 20px 40px rgba(0, 255, 255, 0.3)";

    // Animate tech badges
    const techBadges = card.querySelectorAll(".tech-badge");
    techBadges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.transform = "scale(1.1)";
        badge.style.boxShadow = `0 0 15px ${badge.style.borderColor}`;
      }, index * 50);
    });

    // Animate metrics
    const metrics = card.querySelectorAll(".metric");
    metrics.forEach((metric) => {
      metric.style.transform = "translateX(5px)";
    });
  }

  resetCardHover(card) {
    card.style.boxShadow = "";

    const techBadges = card.querySelectorAll(".tech-badge");
    techBadges.forEach((badge) => {
      badge.style.transform = "scale(1)";
      badge.style.boxShadow = "";
    });

    const metrics = card.querySelectorAll(".metric");
    metrics.forEach((metric) => {
      metric.style.transform = "translateX(0)";
    });
  }

  playProjectDemo(card) {
    const overlay = card.querySelector(".preview-overlay");
    const playBtn = card.querySelector(".preview-play-btn");

    // Change button to loading state
    playBtn.innerHTML = `
      <div style="width: 20px; height: 20px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <span>LOADING</span>
    `;

    // Simulate demo loading
    setTimeout(() => {
      playBtn.innerHTML = `
        <span class="play-icon">⏸</span>
        <span class="play-text">PLAYING</span>
      `;

      // Hide overlay after demo starts
      overlay.style.opacity = "0";

      // Reset after demo
      setTimeout(() => {
        playBtn.innerHTML = `
          <span class="play-icon">▶</span>
          <span class="play-text">WATCH DEMO</span>
        `;
        overlay.style.opacity = "";
      }, 5000);
    }, 2000);
  }

  openCaseStudy(card) {
    const title = card.querySelector(".card-title").textContent;

    // Create case study modal
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
      <div style="background: #000; border: 2px solid #00ffff; padding: 3rem; max-width: 600px; text-align: center;">
        <h2 style="color: #00ffff; font-family: 'Space Mono', monospace; margin-bottom: 2rem;">${title} - CASE STUDY</h2>
        <p style="color: #fff; margin-bottom: 2rem;">Detailed case study coming soon...</p>
        <button onclick="this.closest('div').parentElement.remove()" style="background: #00ffff; color: #000; border: none; padding: 1rem 2rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; cursor: pointer;">CLOSE</button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  openGitHubRepo(card) {
    // Simulate GitHub link opening
    const githubLink = card.querySelector(".github-info");
    const originalText = githubLink.innerHTML;

    githubLink.innerHTML = `
      <span class="github-icon">⚡</span>
      <span class="github-text">OPENING...</span>
    `;

    setTimeout(() => {
      githubLink.innerHTML = originalText;
      // In real app, would open GitHub repo
      console.log("Opening GitHub repository...");
    }, 1500);
  }

  setupFeaturedSpotlight() {
    const playDemoBtn = document.getElementById("playFeaturedDemo");
    const primaryCta = document.getElementById("primaryShowcaseCta");
    const secondaryCta = document.getElementById("secondaryShowcaseCta");
    const githubLink = document.getElementById("githubShowcaseLink");

    playDemoBtn?.addEventListener("click", () => {
      this.playFeaturedDemo();
    });

    primaryCta?.addEventListener("click", () => {
      this.openFeaturedCaseStudy();
    });

    secondaryCta?.addEventListener("click", () => {
      this.openFeaturedDemo();
    });

    githubLink?.addEventListener("click", () => {
      this.openFeaturedGitHub();
    });

    // Animate spotlight metrics
    this.animateSpotlightMetrics();
  }

  playFeaturedDemo() {
    const demoImage = document.getElementById("featuredDemo");
    const playBtn = document.getElementById("playFeaturedDemo");

    // Add video-like overlay
    const videoOverlay = document.createElement("div");
    videoOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(138, 43, 226, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    `;

    videoOverlay.innerHTML = `
      <div style="color: #fff; font-family: 'JetBrains Mono', monospace; text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">▶</div>
        <div>DEMO PLAYING</div>
      </div>
    `;

    demoImage.parentElement.appendChild(videoOverlay);

    // Remove overlay after demo
    setTimeout(() => {
      videoOverlay.remove();
    }, 8000);
  }

  openFeaturedCaseStudy() {
    // Create featured case study modal
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
      <div style="background: #000; border: 2px solid #00ffff; padding: 3rem; max-width: 800px; text-align: center;">
        <h2 style="color: #00ffff; font-family: 'Space Mono', monospace; margin-bottom: 2rem;">ENTERPRISE ANALYTICS DASHBOARD - FULL CASE STUDY</h2>
        <p style="color: #fff; margin-bottom: 2rem;">Comprehensive case study with technical details, architecture diagrams, and performance metrics coming soon...</p>
        <button onclick="this.closest('div').parentElement.remove()" style="background: #00ffff; color: #000; border: none; padding: 1rem 2rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; cursor: pointer;">CLOSE</button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  openFeaturedDemo() {
    // Simulate opening live demo
    console.log("Opening live demo...");
    window.open("https://enterprise-dashboard.live", "_blank");
  }

  openFeaturedGitHub() {
    // Simulate opening GitHub repo
    console.log("Opening GitHub repository...");
    window.open("https://github.com/username/enterprise-dashboard", "_blank");
  }

  animateSpotlightMetrics() {
    const metrics = document.querySelectorAll(
      ".spotlight-metrics .metric-number"
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          metrics.forEach((metric, index) => {
            const target = parseFloat(metric.dataset.target);
            this.animateCounter(metric, 0, target, 2000 + index * 500);
          });
          observer.unobserve(entry.target);
        }
      });
    });

    if (metrics.length > 0) {
      observer.observe(metrics[0].closest(".spotlight-metrics"));
    }
  }

  animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = start + (end - start) * progress;

      // Handle decimal numbers
      if (end % 1 !== 0) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  setupLoadMore() {
    this.loadMoreBtn?.addEventListener("click", () => {
      this.loadMoreProjects();
    });

    this.updateProjectCounter();
  }

  loadMoreProjects() {
    if (this.isLoading) return;

    this.isLoading = true;
    const loadProgress = document.getElementById("loadProgress");
    const loadText = this.loadMoreBtn.querySelector(".load-text");

    // Update button state
    loadText.textContent = "LOADING...";
    loadProgress.style.width = "100%";

    // Simulate loading
    setTimeout(() => {
      this.visibleProjects = Math.min(
        this.visibleProjects + 3,
        this.totalProjects
      );
      this.updateProjectCounter();

      // Reset button
      loadText.textContent = "LOAD MORE PROJECTS";
      loadProgress.style.width = "0%";
      this.isLoading = false;

      // Hide button if all projects loaded
      if (this.visibleProjects >= this.totalProjects) {
        this.loadMoreBtn.style.display = "none";
      }
    }, 2000);
  }

  updateProjectCounter() {
    const currentCount = document.getElementById("currentCount");
    const totalCount = document.getElementById("totalCount");

    if (currentCount) currentCount.textContent = this.visibleProjects;
    if (totalCount) totalCount.textContent = this.totalProjects;
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations
            if (entry.target.classList.contains("project-card")) {
              this.animateProjectCard(entry.target);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe project cards
    this.projectCards.forEach((card) => {
      observer.observe(card);
    });
  }

  animateProjectCard(card) {
    const techBadges = card.querySelectorAll(".tech-badge");
    techBadges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.animation = "slideInUp 0.5s ease-out forwards";
      }, index * 100);
    });
  }

  setupMatrixRain() {
    if (!this.matrixRain) return;

    // Create matrix characters
    for (let i = 0; i < 20; i++) {
      const column = document.createElement("div");
      column.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: -100px;
        color: rgba(0, 255, 255, 0.3);
        font-family: 'JetBrains Mono', monospace;
        font-size: ${Math.random() * 16 + 12}px;
        animation: matrixFall ${Math.random() * 10 + 5}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;

      // Add random characters
      const chars =
        "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
      column.textContent = chars[Math.floor(Math.random() * chars.length)];

      this.matrixRain.appendChild(column);
    }
  }

  startShowcaseAnimations() {
    // Component is ready
    console.log("🚀 Project Showcase Component Initialized");

    // Add error handling for missing elements
    if (!this.showcaseSection) {
      console.warn("⚠️ Showcase section not found");
      return;
    }

    // Initialize component-specific features
    this.initializeShowcaseFeatures();
  }

  initializeShowcaseFeatures() {
    // Add any additional initialization logic here
    // This method can be extended for future features

    // Example: Add keyboard shortcuts for filtering
    document.addEventListener("keydown", (e) => {
      if (e.altKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            this.handleFilterChange(
              document.querySelector('[data-filter="all"]')
            );
            break;
          case "2":
            e.preventDefault();
            this.handleFilterChange(
              document.querySelector('[data-filter="react"]')
            );
            break;
          case "3":
            e.preventDefault();
            this.handleFilterChange(
              document.querySelector('[data-filter="nodejs"]')
            );
            break;
          case "4":
            e.preventDefault();
            this.handleFilterChange(
              document.querySelector('[data-filter="fullstack"]')
            );
            break;
          case "5":
            e.preventDefault();
            this.handleFilterChange(
              document.querySelector('[data-filter="mobile"]')
            );
            break;
        }
      }
    });
  }
}

// Initialize the component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistShowcase();
});

// Export for use in other modules if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistShowcase;
}
