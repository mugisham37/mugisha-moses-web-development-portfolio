"use client";

/**
 * Scroll utility functions for enhanced scrolling behavior
 */

export interface ScrollToOptions {
  top?: number;
  left?: number;
  behavior?: ScrollBehavior;
  offset?: number;
}

export interface ScrollToElementOptions {
  behavior?: ScrollBehavior;
  offset?: number;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

/**
 * Enhanced scroll to top with smooth animation
 */
export function scrollToTop(options: ScrollToOptions = {}) {
  const { behavior = "smooth", left = 0, offset = 0 } = options;

  window.scrollTo({
    top: offset,
    left,
    behavior,
  });
}

/**
 * Enhanced scroll to bottom with smooth animation
 */
export function scrollToBottom(options: ScrollToOptions = {}) {
  const { behavior = "smooth", left = 0, offset = 0 } = options;

  window.scrollTo({
    top: document.documentElement.scrollHeight - window.innerHeight - offset,
    left,
    behavior,
  });
}

/**
 * Scroll to element by ID with offset support
 */
export function scrollToElement(
  elementId: string,
  options: ScrollToElementOptions = {}
) {
  const {
    behavior = "smooth",
    offset = 80,
    block = "start",
    inline = "nearest",
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID "${elementId}" not found`);
    return false;
  }

  // Use scrollIntoView with the provided options for better browser support
  element.scrollIntoView({
    behavior,
    block,
    inline,
  });

  // Apply offset adjustment if needed
  if (offset !== 0) {
    setTimeout(() => {
      window.scrollBy({
        top: -offset,
        behavior: "smooth",
      });
    }, 100);
  }

  return true;
}

/**
 * Scroll to element by selector with offset support
 */
export function scrollToSelector(
  selector: string,
  options: ScrollToElementOptions = {}
) {
  const { behavior = "smooth", offset = 80 } = options;

  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return false;
  }

  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const targetPosition = absoluteElementTop - offset;

  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior,
  });

  return true;
}

/**
 * Get current scroll position
 */
export function getScrollPosition() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Get scroll progress as percentage (0-100)
 */
export function getScrollProgress(): number {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollHeight <= 0) return 0;

  return Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(
  element: HTMLElement,
  threshold: number = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

/**
 * Get element's visibility percentage in viewport
 */
export function getElementVisibility(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  if (rect.bottom < 0 || rect.top > windowHeight) {
    return 0; // Element is completely out of view
  }

  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(windowHeight, rect.bottom);
  const visibleHeight = visibleBottom - visibleTop;
  const elementHeight = rect.height;

  return elementHeight > 0 ? (visibleHeight / elementHeight) * 100 : 0;
}

/**
 * Throttle scroll events for performance
 */
export function throttleScroll(
  callback: () => void,
  delay: number = 16
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return function throttledCallback() {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      callback();
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          callback();
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime)
      );
    }
  };
}

/**
 * Debounce scroll events
 */
export function debounceScroll(
  callback: () => void,
  delay: number = 100
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debouncedCallback() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

/**
 * Lock scroll (prevent scrolling)
 */
export function lockScroll(): void {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

/**
 * Unlock scroll (restore scrolling)
 */
export function unlockScroll(): void {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

/**
 * Smooth scroll to hash target on page load
 */
export function handleHashScroll(offset: number = 80): void {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;
  if (hash) {
    // Small delay to ensure page is loaded
    setTimeout(() => {
      const targetId = hash.substring(1);
      scrollToElement(targetId, { offset });
    }, 100);
  }
}

/**
 * Add smooth scroll behavior to all internal links
 */
export function enableSmoothScrollLinks(offset: number = 80): void {
  if (typeof document === "undefined") return;

  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        if (scrollToElement(targetId, { offset })) {
          // Update URL without triggering navigation
          if (window.history.replaceState) {
            window.history.replaceState(null, "", href);
          }
        }
      }
    });
  });
}

/**
 * Enhanced smooth scroll with easing and callbacks
 */
export function smoothScrollTo(
  target: number | HTMLElement,
  options: {
    duration?: number;
    easing?: (t: number) => number;
    offset?: number;
    onComplete?: () => void;
    onProgress?: (progress: number) => void;
  } = {}
): void {
  const {
    duration = 800,
    easing = (t) => t * (2 - t), // easeOutQuad
    offset = 0,
    onComplete,
    onProgress,
  } = options;

  const startPosition = window.pageYOffset;
  let targetPosition: number;

  if (typeof target === "number") {
    targetPosition = target;
  } else {
    const rect = target.getBoundingClientRect();
    targetPosition = rect.top + startPosition - offset;
  }

  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const currentPosition = startPosition + distance * easedProgress;
    window.scrollTo(0, currentPosition);

    onProgress?.(progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(animate);
}

/**
 * Scroll direction detection
 */
export class ScrollDirectionDetector {
  private lastScrollY = 0;
  private callbacks: {
    up: (() => void)[];
    down: (() => void)[];
  } = { up: [], down: [] };

  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }

  private init(): void {
    if (typeof window !== "undefined") {
      this.lastScrollY = window.scrollY;
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    }
  }

  private handleScroll(): void {
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.lastScrollY) {
      // Scrolling down
      this.callbacks.down.forEach((callback) => callback());
    } else if (currentScrollY < this.lastScrollY) {
      // Scrolling up
      this.callbacks.up.forEach((callback) => callback());
    }

    this.lastScrollY = currentScrollY;
  }

  public onScrollUp(callback: () => void): void {
    this.callbacks.up.push(callback);
  }

  public onScrollDown(callback: () => void): void {
    this.callbacks.down.push(callback);
  }

  public destroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.handleScroll);
    }
    this.callbacks.up = [];
    this.callbacks.down = [];
  }
}

/**
 * Intersection Observer for scroll-triggered animations
 */
export function createScrollObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Scroll-based parallax effect
 */
export function createParallaxEffect(
  element: HTMLElement,
  speed: number = 0.5,
  direction: "vertical" | "horizontal" = "vertical"
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleScroll = throttleScroll(() => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * speed;

    if (direction === "vertical") {
      element.style.transform = `translateY(${parallax}px)`;
    } else {
      element.style.transform = `translateX(${parallax}px)`;
    }
  }, 16);

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}
