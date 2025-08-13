/* ==========================================================================
   MOBILE MENU JAVASCRIPT
   Mobile navigation functionality - Lightweight vanilla JS (< 1KB)
   ========================================================================== */

(function () {
  "use strict";

  // Get DOM elements
  const toggle =
    document.getElementById("nav-toggle") ||
    document.querySelector(".nav__toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-overlay");
  const body = document.body;

  // Early return if elements don't exist
  if (!toggle || !mobileMenu || !overlay) return;

  let isOpen = false;

  // Toggle mobile menu
  function toggleMenu() {
    isOpen = !isOpen;

    // Update toggle button
    toggle.classList.toggle("nav__toggle--open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close mobile menu" : "Open mobile menu"
    );

    // Update mobile menu
    mobileMenu.classList.toggle("nav__mobile--open", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);

    // Update overlay
    overlay.classList.toggle("nav__overlay--visible", isOpen);
    overlay.setAttribute("aria-hidden", !isOpen);

    // Prevent body scroll when menu is open
    body.style.overflow = isOpen ? "hidden" : "";

    // Announce state change to screen readers
    const announcement = isOpen ? "Mobile menu opened" : "Mobile menu closed";
    announceToScreenReader(announcement);

    // Focus management
    if (isOpen) {
      // Focus first menu item
      const firstLink = mobileMenu.querySelector(".nav__mobile-link");
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    } else {
      // Return focus to toggle button
      toggle.focus();
    }
  }

  // Helper function for screen reader announcements
  function announceToScreenReader(message) {
    let liveRegion = document.getElementById("mobile-menu-announcements");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "mobile-menu-announcements";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1000);
  }

  // Close menu
  function closeMenu() {
    if (isOpen) toggleMenu();
  }

  // Event listeners
  toggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
    }
  });

  // Close menu when clicking mobile menu links
  const mobileLinks = mobileMenu.querySelectorAll(".nav__mobile-link");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Handle window resize - close menu on desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768 && isOpen) {
      closeMenu();
    }
  });

  // Trap focus within mobile menu when open
  document.addEventListener("keydown", function (e) {
    if (!isOpen || e.key !== "Tab") return;

    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
})();
