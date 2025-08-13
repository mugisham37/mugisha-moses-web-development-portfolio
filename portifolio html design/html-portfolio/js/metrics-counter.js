/* ==========================================================================
   METRICS COUNTER SYSTEM
   Animated counter system with GitHub API integration
   ========================================================================== */

(function () {
  "use strict";

  // Get configuration from global config
  const CONFIG = {
    github: window.getConfig
      ? window.getConfig("github", {
          username: "your-github-username",
          apiUrl: "https://api.github.com/users/",
          fallbackData: {
            commits: 1250,
            repos: 45,
            followers: 120,
            contributions: 850,
          },
        })
      : {
          username: "your-github-username",
          apiUrl: "https://api.github.com/users/",
          fallbackData: {
            commits: 1250,
            repos: 45,
            followers: 120,
            contributions: 850,
          },
        },
    animation: window.getConfig
      ? window.getConfig("metrics.animation", {
          duration: 2000,
          easing: "easeOutCubic",
          delay: 200,
        })
      : {
          duration: 2000,
          easing: "easeOutCubic",
          delay: 200,
        },
    metrics: window.getConfig
      ? window.getConfig("metrics", {
          projects: 50,
          experience: 5,
          satisfaction: 100,
          availability: 24,
        })
      : {
          projects: 50,
          experience: 5,
          satisfaction: 100,
          availability: 24,
        },
  };

  // Easing functions
  const easingFunctions = {
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  /**
   * Animate counter from 0 to target value
   */
  function animateCounter(
    element,
    target,
    duration = 2000,
    easing = "easeOutCubic",
    delay = 0
  ) {
    const startTime = performance.now() + delay;
    const easingFunc = easingFunctions[easing] || easingFunctions.easeOutCubic;

    // Handle special formatting for different metric types
    const isPercentage = element.dataset.type === "percentage";
    const isTime = element.dataset.type === "time";
    const suffix = element.dataset.suffix || "";

    function updateCounter(currentTime) {
      if (currentTime < startTime) {
        requestAnimationFrame(updateCounter);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunc(progress);
      const currentValue = Math.floor(easedProgress * target);

      // Format the display value
      let displayValue;
      if (isPercentage) {
        displayValue = currentValue + "%";
      } else if (isTime) {
        displayValue = currentValue + "/7";
      } else if (target >= 1000) {
        displayValue = (currentValue / 1000).toFixed(1) + "K";
      } else {
        displayValue = currentValue.toString();
      }

      element.textContent = displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Animation complete - add completion class
        element.classList.add("counter-complete");

        // Announce completion to screen readers
        const announcement = `${
          element.closest(".metric-card").querySelector(".metric-card__label")
            .textContent
        }: ${displayValue}${suffix}`;
        announceToScreenReader(announcement);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Fetch GitHub statistics
   */
  async function fetchGitHubStats(username) {
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`${CONFIG.github.apiUrl}${username}`),
        fetch(`${CONFIG.github.apiUrl}${username}/repos?per_page=100`),
      ]);

      if (!userResponse.ok || !reposResponse.ok) {
        throw new Error("GitHub API request failed");
      }

      const userData = await userResponse.json();
      const reposData = await reposResponse.json();

      // Calculate total commits (approximation from repos)
      const totalCommits = reposData.reduce((total, repo) => {
        return total + (repo.size || 0); // Using size as commit approximation
      }, 0);

      return {
        commits: Math.max(totalCommits, CONFIG.github.fallbackData.commits),
        repos: userData.public_repos || CONFIG.github.fallbackData.repos,
        followers: userData.followers || CONFIG.github.fallbackData.followers,
        contributions:
          Math.floor(totalCommits * 0.7) ||
          CONFIG.github.fallbackData.contributions,
      };
    } catch (error) {
      console.warn("GitHub API failed, using fallback data:", error.message);
      return CONFIG.github.fallbackData;
    }
  }

  /**
   * Initialize metrics counters
   */
  async function initMetricsCounters() {
    const metricsSection = document.querySelector(".hero__metrics");
    if (!metricsSection) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Get GitHub stats
    const githubStats = await fetchGitHubStats(CONFIG.github.username);

    // Define metrics with their targets and GitHub integration
    const metrics = [
      {
        selector: '[data-metric="projects"]',
        target: CONFIG.metrics.projects,
        type: "number",
        suffix: "+",
      },
      {
        selector: '[data-metric="experience"]',
        target: CONFIG.metrics.experience,
        type: "number",
        suffix: "+",
      },
      {
        selector: '[data-metric="satisfaction"]',
        target: CONFIG.metrics.satisfaction,
        type: "percentage",
      },
      {
        selector: '[data-metric="availability"]',
        target: CONFIG.metrics.availability,
        type: "time",
      },
      {
        selector: '[data-metric="github-commits"]',
        target: githubStats.commits,
        type: "number",
        suffix: "+",
      },
    ];

    // Initialize each counter
    metrics.forEach((metric, index) => {
      const element = document.querySelector(metric.selector);
      if (!element) return;

      // Set data attributes for formatting
      element.dataset.type = metric.type;
      element.dataset.suffix = metric.suffix || "";

      if (prefersReducedMotion) {
        // Show final value immediately if reduced motion is preferred
        let displayValue;
        if (metric.type === "percentage") {
          displayValue = metric.target + "%";
        } else if (metric.type === "time") {
          displayValue = metric.target + "/7";
        } else if (metric.target >= 1000) {
          displayValue = (metric.target / 1000).toFixed(1) + "K";
        } else {
          displayValue = metric.target.toString();
        }
        element.textContent = displayValue + (metric.suffix || "");
        element.classList.add("counter-complete");
      } else {
        // Animate counter
        const delay = index * CONFIG.animation.delay;
        animateCounter(
          element,
          metric.target,
          CONFIG.animation.duration,
          CONFIG.animation.easing,
          delay
        );
      }
    });

    // Add loaded class to metrics section
    metricsSection.classList.add("metrics-loaded");
  }

  /**
   * Create intersection observer for metrics animation trigger
   */
  function initMetricsObserver() {
    const metricsSection = document.querySelector(".hero__metrics");
    if (!metricsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger metrics animation when section comes into view
            initMetricsCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(metricsSection);
  }

  /**
   * Add hover effects to metric cards
   */
  function initMetricCardEffects() {
    const metricCards = document.querySelectorAll(".metric-card");

    metricCards.forEach((card) => {
      // Add ripple effect on click
      card.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("metric-ripple");

        this.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });

      // Add pulse effect for completed counters
      card.addEventListener("animationend", function () {
        if (this.querySelector(".counter-complete")) {
          this.classList.add("metric-pulse");
        }
      });
    });
  }

  /**
   * Announce to screen reader
   */
  function announceToScreenReader(message) {
    const liveRegion = document.getElementById("live-region");
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = "";
      }, 1000);
    }
  }

  /**
   * Initialize metrics system
   */
  function init() {
    // Initialize intersection observer for metrics
    initMetricsObserver();

    // Initialize metric card effects
    initMetricCardEffects();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export for external use
  window.MetricsCounter = {
    init,
    animateCounter,
    fetchGitHubStats,
  };
})();
