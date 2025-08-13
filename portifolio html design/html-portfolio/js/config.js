/* ==========================================================================
   CONFIGURATION FILE
   Centralized configuration for GitHub integration and other settings
   ========================================================================== */

window.PORTFOLIO_CONFIG = {
  // GitHub Integration Settings
  github: {
    username: "your-github-username", // Replace with your actual GitHub username
    apiUrl: "https://api.github.com/users/",

    // Fallback data when GitHub API is unavailable
    fallbackData: {
      commits: 1250,
      repos: 45,
      followers: 120,
      contributions: 850,
    },

    // API request settings
    timeout: 5000, // 5 seconds
    retryAttempts: 2,
  },

  // Metrics Configuration
  metrics: {
    // Static metrics (not from GitHub)
    projects: 50,
    experience: 5,
    satisfaction: 100,
    availability: 24,

    // Animation settings
    animation: {
      duration: 2000, // 2 seconds
      easing: "easeOutCubic",
      delay: 200, // Stagger delay between counters
    },
  },

  // Animation Settings
  animations: {
    // Respect user's motion preferences
    respectReducedMotion: true,

    // Default animation durations
    fast: 200,
    medium: 400,
    slow: 800,

    // Easing functions
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
  },

  // Performance Settings
  performance: {
    // Intersection Observer settings
    observerThreshold: 0.1,
    observerRootMargin: "0px 0px -50px 0px",

    // Debounce/throttle delays
    scrollThrottle: 16, // ~60fps
    resizeDebounce: 250,

    // Lazy loading settings
    lazyLoadOffset: 100,
  },

  // Accessibility Settings
  accessibility: {
    // Focus management
    focusOutlineWidth: 3,
    focusOutlineColor: "#ffff00",

    // Screen reader announcements
    announceDelay: 1000,

    // Minimum touch target size
    minTouchTarget: 44,
  },

  // Contact Information
  contact: {
    email: "hello@brutalistdev.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    timezone: "PST",

    // Response time commitment
    responseTime: "< 2 hours",
    availability: "24/7",
  },

  // Social Media Links
  social: {
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-profile",
    twitter: "https://twitter.com/your-handle",
    dribbble: "https://dribbble.com/your-profile",
    behance: "https://behance.net/your-profile",
  },

  // Feature Flags
  features: {
    githubIntegration: true,
    metricsAnimation: true,
    particleBackground: true,
    asciiPortrait: true,
    typewriterEffect: true,
    rippleEffects: true,
    magneticButtons: true,
    geometricShapes: true,
  },

  // Development Settings
  development: {
    debug: false,
    mockGitHubAPI: false,
    showPerformanceMetrics: false,
    logAnimations: false,
  },
};

// Utility function to get configuration values with fallbacks
window.getConfig = function (path, fallback = null) {
  const keys = path.split(".");
  let value = window.PORTFOLIO_CONFIG;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }

  return value;
};

// Utility function to check if a feature is enabled
window.isFeatureEnabled = function (featureName) {
  return window.getConfig(`features.${featureName}`, false);
};

// Export for module systems if available
if (typeof module !== "undefined" && module.exports) {
  module.exports = window.PORTFOLIO_CONFIG;
}
