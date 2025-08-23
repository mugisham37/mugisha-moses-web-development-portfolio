/**
 * Shared JavaScript Utilities for Portfolio Components
 * Contains common functions for animations, counters, and interactions
 */

// Animation Utilities
export const AnimationUtils = {
  /**
   * Typewriter effect for text elements
   * @param {HTMLElement} element - Target element
   * @param {string} newText - Text to type
   * @param {Function} callback - Callback function when complete
   * @param {number} speed - Typing speed in ms
   */
  typewriterEffect(element, newText, callback = null, speed = 50) {
    const originalText = element.textContent;
    let currentIndex = originalText.length;

    // Clear existing text
    const clearTextInterval = setInterval(() => {
      if (currentIndex > 0) {
        element.textContent = originalText.substring(0, currentIndex - 1);
        currentIndex--;
      } else {
        clearInterval(clearTextInterval);
        this.typeNewText(element, newText, callback, speed);
      }
    }, 30);
  },

  /**
   * Type new text character by character
   * @param {HTMLElement} element - Target element
   * @param {string} text - Text to type
   * @param {Function} callback - Callback function
   * @param {number} speed - Typing speed
   */
  typeNewText(element, text, callback, speed = 50) {
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        element.textContent = text.substring(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        if (callback) callback();
      }
    }, speed);
  },

  /**
   * Animate counter from start to end value
   * @param {HTMLElement} element - Target element
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} duration - Animation duration in ms
   * @param {string} prefix - Optional prefix (e.g., '$')
   * @param {string} suffix - Optional suffix (e.g., '%')
   */
  animateCounter(
    element,
    start,
    end,
    duration = 2000,
    prefix = "",
    suffix = ""
  ) {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let current = start + (end - start) * progress;

      if (isDecimal) {
        current = Math.round(current * 10) / 10;
      } else {
        current = Math.floor(current);
      }

      element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  },

  /**
   * Create glitch effect on element
   * @param {HTMLElement} element - Target element
   * @param {number} duration - Effect duration in ms
   */
  triggerGlitchEffect(element, duration = 300) {
    element.style.animation = "none";
    element.offsetHeight; // Trigger reflow
    element.style.animation = `glitch ${duration}ms ease-out`;

    setTimeout(() => {
      element.style.animation = "";
    }, duration);
  },

  /**
   * Create shimmer effect
   * @param {HTMLElement} element - Target element
   */
  createShimmerEffect(element) {
    const shimmer = document.createElement("div");
    shimmer.className = "shimmer-overlay";
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s ease-in-out infinite;
      pointer-events: none;
    `;

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(shimmer);
  },
};

// DOM Utilities
export const DOMUtils = {
  /**
   * Wait for DOM element to exist
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in ms
   * @returns {Promise<HTMLElement>}
   */
  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  /**
   * Create element with attributes and styles
   * @param {string} tag - HTML tag
   * @param {Object} attributes - Element attributes
   * @param {Object} styles - CSS styles
   * @param {string} content - Inner content
   * @returns {HTMLElement}
   */
  createElement(tag, attributes = {}, styles = {}, content = "") {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    Object.entries(styles).forEach(([key, value]) => {
      element.style[key] = value;
    });

    if (content) {
      element.innerHTML = content;
    }

    return element;
  },

  /**
   * Add multiple event listeners to element
   * @param {HTMLElement} element - Target element
   * @param {Object} events - Event object {event: handler}
   */
  addEventListeners(element, events) {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  },
};

// Intersection Observer Utilities
export const ObserverUtils = {
  /**
   * Create intersection observer for animations
   * @param {Function} callback - Callback function
   * @param {Object} options - Observer options
   * @returns {IntersectionObserver}
   */
  createAnimationObserver(callback, options = { threshold: 0.2 }) {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    }, options);
  },

  /**
   * Observe elements for scroll animations
   * @param {string|NodeList} elements - Elements to observe
   * @param {string} animationClass - CSS class to add
   */
  observeForAnimation(elements, animationClass = "animate-in") {
    const observer = this.createAnimationObserver((element) => {
      element.classList.add(animationClass);
    });

    const elementList =
      typeof elements === "string"
        ? document.querySelectorAll(elements)
        : elements;

    elementList.forEach((element) => observer.observe(element));

    return observer;
  },
};

// Particle System Utilities
export const ParticleUtils = {
  /**
   * Create particle system
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Particle configuration
   */
  createParticleSystem(container, config = {}) {
    const defaultConfig = {
      count: 50,
      colors: ["#00ffff", "#8b5cf6", "#ffff00"],
      minSize: 2,
      maxSize: 6,
      speed: 0.5,
      ...config,
    };

    const particles = [];

    for (let i = 0; i < defaultConfig.count; i++) {
      const particle = this.createParticle(container, defaultConfig);
      particles.push(particle);
    }

    return particles;
  },

  /**
   * Create individual particle
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Particle configuration
   */
  createParticle(container, config) {
    const particle = document.createElement("div");
    const size =
      Math.random() * (config.maxSize - config.minSize) + config.minSize;
    const color =
      config.colors[Math.floor(Math.random() * config.colors.length)];

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      opacity: ${Math.random() * 0.8 + 0.2};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 4 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 8}s;
      pointer-events: none;
    `;

    container.appendChild(particle);
    return particle;
  },
};

// Star Field Utilities
export const StarUtils = {
  /**
   * Create star field
   * @param {HTMLElement} container - Container element
   * @param {number} count - Number of stars
   */
  createStarField(container, count = 100) {
    const stars = [];

    for (let i = 0; i < count; i++) {
      const star = this.createStar(container);
      stars.push(star);
    }

    return stars;
  },

  /**
   * Create individual star
   * @param {HTMLElement} container - Container element
   */
  createStar(container) {
    const star = document.createElement("div");
    const sizes = ["small", "medium", "large"];
    const size = sizes[Math.floor(Math.random() * sizes.length)];

    star.className = `star ${size}`;
    star.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 3}s;
      animation-duration: ${Math.random() * 2 + 2}s;
    `;

    container.appendChild(star);
    return star;
  },
};

// Error Handling and Graceful Degradation
export const ErrorUtils = {
  /**
   * Safe function execution with error handling
   * @param {Function} fn - Function to execute
   * @param {*} fallback - Fallback value
   * @param {string} context - Error context
   */
  safeExecute(fn, fallback = null, context = "Unknown") {
    try {
      return fn();
    } catch (error) {
      console.warn(`Error in ${context}:`, error);
      return fallback;
    }
  },

  /**
   * Check if element exists before operating
   * @param {string} selector - CSS selector
   * @param {Function} callback - Function to execute if element exists
   */
  ifExists(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      console.warn(`Element not found: ${selector}`);
    }
  },

  /**
   * Graceful degradation for animations
   * @param {HTMLElement} element - Target element
   * @param {string} animationName - Animation name
   * @param {Function} fallback - Fallback function
   */
  gracefulAnimation(element, animationName, fallback = null) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (fallback) fallback(element);
      return;
    }

    try {
      element.style.animation = animationName;
    } catch (error) {
      console.warn("Animation failed:", error);
      if (fallback) fallback(element);
    }
  },
};

// Local Storage Utilities
export const StorageUtils = {
  /**
   * Safe localStorage operations
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  },

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }
  },
};

// Responsive Utilities
export const ResponsiveUtils = {
  /**
   * Get current breakpoint
   * @returns {string} Current breakpoint name
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 640) return "xs";
    if (width < 768) return "sm";
    if (width < 1024) return "md";
    if (width < 1280) return "lg";
    if (width < 1536) return "xl";
    return "2xl";
  },

  /**
   * Check if mobile device
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Add responsive event listeners
   * @param {Function} callback - Callback function
   * @param {number} debounce - Debounce delay in ms
   */
  onResize(callback, debounce = 250) {
    let timeoutId;

    window.addEventListener("resize", () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, debounce);
    });
  },
};

// Performance Utilities
export const PerformanceUtils = {
  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Request animation frame with fallback
   * @param {Function} callback - Callback function
   */
  requestAnimationFrame(callback) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(callback);
    } else {
      setTimeout(callback, 16); // ~60fps fallback
    }
  },
};

// Export all utilities as default object
export default {
  AnimationUtils,
  DOMUtils,
  ObserverUtils,
  ParticleUtils,
  StarUtils,
  ErrorUtils,
  StorageUtils,
  ResponsiveUtils,
  PerformanceUtils,
};
