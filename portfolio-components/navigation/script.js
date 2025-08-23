// BRUTAL NAVIGATION SYSTEM - 10/10 LEVEL
class BrutalistNavigation {
  constructor() {
    this.nav = document.getElementById("mainNav");
    this.navItems = document.querySelectorAll(".nav-item");
    this.ctaButton = document.getElementById("ctaButton");
    this.mobileToggle = document.getElementById("mobileToggle");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.logoText = document.getElementById("logoText");

    this.isAnimating = false;
    this.currentSection = "home";

    this.init();
  }

  init() {
    this.setupBrutalNavigation();
    this.setupMobileMenu();
    this.setupCTAButton();
    this.setupResponsiveHandlers();
    this.setupBrutalEffects();
    this.setupKeyboardShortcuts();
    this.setupScrollEffects();
    this.startBrutalAnimations();
  }

  setupResponsiveHandlers() {
    window.addEventListener("resize", () => {
      this.handleResize();
    });
    this.handleResize();
  }

  handleResize() {
    const screenWidth = window.innerWidth;
    const navMenu = document.querySelector(".nav-menu");
    const ctaSection = document.querySelector(".cta-section");
    const mobileToggle = document.querySelector(".mobile-toggle");

    if (screenWidth <= 768) {
      if (navMenu) navMenu.style.display = "none";
      if (ctaSection) ctaSection.style.display = "none";
      if (mobileToggle) mobileToggle.style.display = "block";
    } else {
      if (navMenu) navMenu.style.display = "flex";
      if (ctaSection) ctaSection.style.display = "flex";
      if (mobileToggle) mobileToggle.style.display = "none";
    }
  }

  setupBrutalNavigation() {
    this.navItems.forEach((item, index) => {
      // Add staggered entrance animation
      item.style.animationDelay = `${index * 0.1}s`;

      item.addEventListener("click", () => {
        this.handleBrutalNavClick(item);
      });

      item.addEventListener("mouseenter", () => {
        this.triggerBrutalHover(item);
      });

      item.addEventListener("mouseleave", () => {
        this.resetBrutalHover(item);
      });
    });
  }

  handleBrutalNavClick(item) {
    const section = item.dataset.section;

    // Remove active state from all items
    this.navItems.forEach((navItem) => {
      navItem.classList.remove("active");
    });

    // Add active state to clicked item
    item.classList.add("active");

    // Trigger brutal effects
    this.triggerBrutalClick(item);
    this.triggerGlitchEffect(item);

    // Update current section
    this.currentSection = section;

    // Terminal feedback
    this.updateTerminalFeedback(section);

    console.log(`BRUTAL NAVIGATION: ${section.toUpperCase()}`);
  }

  triggerBrutalHover(item) {
    const text = item.querySelector(".nav-text");

    // Add typewriter effect for non-HOME items
    if (text.textContent !== "HOME") {
      const originalText = text.textContent;
      this.typewriterEffect(text, `> ${originalText.toLowerCase()}`, () => {
        setTimeout(() => {
          this.typewriterEffect(text, originalText);
        }, 1000);
      });
    }
  }

  resetBrutalHover(item) {
    clearTimeout(this.hoverTimeout);
  }

  triggerBrutalClick(item) {
    // Enhanced brutal click animation
    item.style.transform = "scale(0.95) rotate(-1deg)";

    setTimeout(() => {
      item.style.transform = "";
    }, 200);
  }

  triggerGlitchEffect(item) {
    const glitch = item.querySelector(".nav-glitch");
    if (glitch) {
      glitch.style.animation = "none";
      glitch.offsetHeight; // Trigger reflow
      glitch.style.animation = "brutalGlitch 0.3s ease-out";
    }
  }

  typewriterEffect(element, newText, callback) {
    const originalText = element.textContent;
    let currentIndex = originalText.length;

    const clearTextInterval = setInterval(() => {
      if (currentIndex > 0) {
        element.textContent = originalText.substring(0, currentIndex - 1);
        currentIndex--;
      } else {
        clearInterval(clearTextInterval);
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

  updateTerminalFeedback(section) {
    const terminalPrompt = document.querySelector(".terminal-prompt");
    const terminalCursor = document.querySelector(".terminal-cursor");

    if (terminalPrompt && terminalCursor) {
      terminalPrompt.textContent = `> navigating to ${section}`;
      terminalCursor.style.animation = "brutalBlink 0.5s step-end infinite";

      setTimeout(() => {
        terminalPrompt.textContent = ">";
        terminalCursor.style.animation = "brutalBlink 1s step-end infinite";
      }, 1500);
    }
  }

  setupBrutalEffects() {
    // Enhanced logo click effect
    const logoBlock = document.querySelector(".logo-block");
    if (logoBlock) {
      logoBlock.addEventListener("click", () => {
        this.triggerLogoEffect();
      });
    }

    // Start status updates
    this.startStatusUpdates();

    // Start live data simulation
    this.simulateLiveUpdates();
  }

  triggerLogoEffect() {
    const logoText = this.logoText;
    const originalText = logoText.textContent;

    // Brutal logo transformation
    logoText.textContent = "BRUTAL";
    logoText.style.color = "#ffff00";
    logoText.style.transform = "scale(1.2) rotate(5deg)";

    setTimeout(() => {
      logoText.textContent = originalText;
      logoText.style.color = "";
      logoText.style.transform = "";
    }, 1500);
  }

  startStatusUpdates() {
    const statusText = document.querySelector(".status-text");
    const statusOptions = [
      "AVAILABLE",
      "ACTIVE",
      "READY",
      "ONLINE",
      "BUILDING",
    ];
    let currentIndex = 0;

    setInterval(() => {
      if (statusText) {
        statusText.textContent = statusOptions[currentIndex];
        currentIndex = (currentIndex + 1) % statusOptions.length;
      }
    }, 4000);
  }

  simulateLiveUpdates() {
    // Update commit count randomly
    const commitCount = document.querySelector(".commit-count");
    if (commitCount) {
      setInterval(() => {
        const currentCount = parseInt(commitCount.textContent);
        const newCount = currentCount + Math.floor(Math.random() * 3);
        commitCount.textContent = newCount;
      }, 30000); // Update every 30 seconds
    }

    // Update project badge count
    const projectBadge = document.querySelector(".nav-badge");
    if (projectBadge) {
      setInterval(() => {
        const currentCount = parseInt(projectBadge.textContent);
        if (Math.random() > 0.7) {
          projectBadge.textContent = currentCount + 1;
          projectBadge.style.animation = "badgeBounce 0.5s ease-out";
        }
      }, 45000); // Update every 45 seconds
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Alt + Number for quick navigation
      if (e.altKey && e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (this.navItems[index]) {
          this.handleBrutalNavClick(this.navItems[index]);
        }
      }

      // Ctrl + Enter for CTA
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        this.ctaButton.click();
      }

      // Escape to close mobile menu
      if (e.key === "Escape") {
        this.closeMobileMenu();
      }
    });
  }

  setupScrollEffects() {
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      // Hide/show nav on scroll with brutal effect
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        this.nav.style.transform = "translateY(-100%)";
        this.nav.style.boxShadow = "none";
      } else {
        this.nav.style.transform = "translateY(0)";
        this.nav.style.boxShadow = "0 8px 0 #ffff00, 0 16px 0 #ffffff";
      }

      lastScrollY = currentScrollY;
    });
  }

  startBrutalAnimations() {
    // Add entrance animations for nav items
    this.navItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px) rotate(5deg)";

      setTimeout(() => {
        item.style.transition =
          "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        item.style.opacity = "1";
        item.style.transform = "translateY(0) rotate(0deg)";
      }, index * 100);
    });
  }

  setupCTAButton() {
    let isAnimating = false;

    this.ctaButton.addEventListener("click", () => {
      if (isAnimating) return;

      isAnimating = true;
      const originalText =
        this.ctaButton.querySelector(".button-text").textContent;

      // Change text with typewriter effect
      this.typewriterEffect(
        this.ctaButton.querySelector(".button-text"),
        "LET'S BUILD IT",
        () => {
          setTimeout(() => {
            this.typewriterEffect(
              this.ctaButton.querySelector(".button-text"),
              originalText,
              () => {
                isAnimating = false;
              }
            );
          }, 1500);
        }
      );

      // Trigger brutal CTA effect
      this.triggerBrutalCTA();
    });

    // Enhanced hover effects
    this.ctaButton.addEventListener("mouseenter", () => {
      this.ctaButton.style.transform =
        "translate(-6px, -6px) rotate(-2deg) scale(1.05)";
      this.ctaButton.style.boxShadow =
        "12px 12px 0 #ffffff, 24px 24px 0 #000000";
    });

    this.ctaButton.addEventListener("mouseleave", () => {
      this.ctaButton.style.transform = "";
      this.ctaButton.style.boxShadow = "";
    });
  }

  triggerBrutalCTA() {
    // Create enhanced brutal overlay effect
    const brutalOverlay = document.createElement("div");
    brutalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      border: 12px solid #ffffff;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Mono', monospace;
      color: #ffffff;
      font-size: 2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 4px;
      animation: brutalOverlayEnter 0.3s ease-out;
    `;

    const brutalText = document.createElement("div");
    brutalText.innerHTML = `
      <div style="border: 8px solid #ffffff; padding: 3rem; background: #ffff00; color: #000000; transform: rotate(-2deg); box-shadow: 16px 16px 0 #ffffff;">
        COMPILING PROJECT...
      </div>
      <div style="margin-top: 2rem; font-size: 1.25rem; border: 4px solid #ffffff; padding: 1.5rem; background: #000000; color: #00ff00;">
        [████████████████████████████████] 100%
      </div>
      <div style="margin-top: 1rem; font-size: 1rem; color: #ffffff;">
        READY FOR DEPLOYMENT
      </div>
    `;

    brutalOverlay.appendChild(brutalText);
    document.body.appendChild(brutalOverlay);

    // Add CSS animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes brutalOverlayEnter {
        0% { transform: scale(0) rotate(180deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Remove after 3 seconds
    setTimeout(() => {
      brutalOverlay.style.animation =
        "brutalOverlayEnter 0.3s ease-out reverse";
      setTimeout(() => {
        brutalOverlay.remove();
        style.remove();
      }, 300);
    }, 3000);

    console.log("BRUTAL CTA TRIGGERED - PROJECT COMPILATION INITIATED!");
  }

  setupMobileMenu() {
    this.mobileToggle.addEventListener("click", () => {
      this.mobileToggle.classList.toggle("active");
      this.mobileMenu.classList.toggle("active");

      // Add body scroll lock
      if (this.mobileMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.mobileToggle.contains(e.target) &&
        !this.mobileMenu.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Setup mobile menu item clicks
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
    mobileNavItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Close mobile menu
        this.closeMobileMenu();

        // Simulate navigation
        this.simulateNavigation(item.textContent.toLowerCase());
      });
    });

    // Setup mobile CTA button
    const mobileCTAButton = document.querySelector(".mobile-brutal-button");
    if (mobileCTAButton) {
      mobileCTAButton.addEventListener("click", () => {
        this.triggerBrutalCTA();
        this.closeMobileMenu();
      });
    }
  }

  closeMobileMenu() {
    this.mobileToggle.classList.remove("active");
    this.mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }

  simulateNavigation(section) {
    console.log(`BRUTAL MOBILE NAVIGATION: ${section.toUpperCase()}`);
    this.updateTerminalFeedback(section);
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistNavigation();
});

// Export for use in other components
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistNavigation;
}
