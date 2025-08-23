// Brutalist Footer Component
class BrutalistFooter {
  constructor() {
    this.footerSection = document.getElementById("footerSection");
    this.ultimateCtaTitle = document.getElementById("ultimateCtaTitle");
    this.startProjectBtn = document.getElementById("startProjectBtn");
    this.quickQuoteBtn = document.getElementById("quickQuoteBtn");
    this.scheduleCallBtn = document.getElementById("scheduleCallBtn");
    this.newsletterForm = document.getElementById("newsletterForm");
    this.backToTopBtn = document.getElementById("backToTopBtn");
    this.footerParticles = document.getElementById("footerParticles");

    this.particles = [];
    this.isAnimating = false;
    this.socialTrackingData = {};

    this.init();
  }

  init() {
    this.setupUltimateCTA();
    this.setupNewsletterForm();
    this.setupResourceDownloads();
    this.setupSocialTracking();
    this.setupBackToTop();
    this.setupFooterParticles();
    this.setupScrollAnimations();
    this.startFooterAnimations();
  }

  setupUltimateCTA() {
    // Start Project Button
    this.startProjectBtn?.addEventListener("click", () => {
      this.handleStartProject();
    });

    // Quick Quote Button
    this.quickQuoteBtn?.addEventListener("click", () => {
      this.handleQuickQuote();
    });

    // Schedule Call Button
    this.scheduleCallBtn?.addEventListener("click", () => {
      this.handleScheduleCall();
    });

    // Add hover effects to CTA buttons
    const ctaButtons = document.querySelectorAll(".ultimate-btn");
    ctaButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        this.triggerButtonHoverEffect(button);
      });

      button.addEventListener("mouseleave", () => {
        this.resetButtonHoverEffect(button);
      });
    });

    // Animate CTA title on scroll
    this.setupCtaTitleAnimation();
  }

  handleStartProject() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Change button text with typewriter effect
    const originalText =
      this.startProjectBtn.querySelector(".btn-text").textContent;
    this.typewriterEffect(
      this.startProjectBtn.querySelector(".btn-text"),
      "INITIATING...",
      () => {
        // Simulate project initiation
        this.showProjectInitiationModal();

        setTimeout(() => {
          this.typewriterEffect(
            this.startProjectBtn.querySelector(".btn-text"),
            originalText,
            () => {
              this.isAnimating = false;
            }
          );
        }, 3000);
      }
    );

    // Track conversion
    this.trackConversion("start_project", "ultimate_cta");
  }

  handleQuickQuote() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const originalText =
      this.quickQuoteBtn.querySelector(".btn-text").textContent;
    this.typewriterEffect(
      this.quickQuoteBtn.querySelector(".btn-text"),
      "CALCULATING...",
      () => {
        this.showQuickQuoteModal();

        setTimeout(() => {
          this.typewriterEffect(
            this.quickQuoteBtn.querySelector(".btn-text"),
            originalText,
            () => {
              this.isAnimating = false;
            }
          );
        }, 2500);
      }
    );

    this.trackConversion("quick_quote", "ultimate_cta");
  }

  handleScheduleCall() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const originalText =
      this.scheduleCallBtn.querySelector(".btn-text").textContent;
    this.typewriterEffect(
      this.scheduleCallBtn.querySelector(".btn-text"),
      "CONNECTING...",
      () => {
        this.showScheduleCallModal();

        setTimeout(() => {
          this.typewriterEffect(
            this.scheduleCallBtn.querySelector(".btn-text"),
            originalText,
            () => {
              this.isAnimating = false;
            }
          );
        }, 2000);
      }
    );

    this.trackConversion("schedule_call", "ultimate_cta");
  }

  showProjectInitiationModal() {
    const modal = this.createModal(
      "PROJECT INITIATION",
      `
      <div class="modal-content">
        <div class="initiation-steps">
          <div class="step active">
            <span class="step-number">01</span>
            <span class="step-text">Analyzing requirements...</span>
            <div class="step-progress"></div>
          </div>
          <div class="step">
            <span class="step-number">02</span>
            <span class="step-text">Preparing proposal...</span>
            <div class="step-progress"></div>
          </div>
          <div class="step">
            <span class="step-number">03</span>
            <span class="step-text">Scheduling kickoff...</span>
            <div class="step-progress"></div>
          </div>
        </div>
        <div class="contact-info">
          <p>I'll reach out within 4 hours to discuss your project.</p>
          <p>Email: <a href="mailto:hello@yourname.dev">hello@yourname.dev</a></p>
        </div>
      </div>
    `
    );

    this.animateInitiationSteps(modal);
  }

  showQuickQuoteModal() {
    const modal = this.createModal(
      "QUICK QUOTE CALCULATOR",
      `
      <div class="modal-content">
        <div class="quote-calculator">
          <div class="calculator-display">
            <div class="display-line">Project Complexity: <span class="value">ANALYZING...</span></div>
            <div class="display-line">Timeline Estimate: <span class="value">CALCULATING...</span></div>
            <div class="display-line">Resource Requirements: <span class="value">PROCESSING...</span></div>
            <div class="display-line total">Estimated Range: <span class="value">$5,000 - $15,000</span></div>
          </div>
          <div class="quote-disclaimer">
            <p>* Estimate based on typical project parameters</p>
            <p>Final quote provided after detailed consultation</p>
          </div>
        </div>
      </div>
    `
    );

    this.animateQuoteCalculation(modal);
  }

  showScheduleCallModal() {
    const modal = this.createModal(
      "SCHEDULE CONSULTATION",
      `
      <div class="modal-content">
        <div class="calendar-widget">
          <div class="calendar-header">
            <h4>Available Time Slots</h4>
            <p>All times in your local timezone</p>
          </div>
          <div class="time-slots">
            <div class="time-slot available" data-time="today-2pm">Today 2:00 PM</div>
            <div class="time-slot available" data-time="today-4pm">Today 4:00 PM</div>
            <div class="time-slot available" data-time="tomorrow-10am">Tomorrow 10:00 AM</div>
            <div class="time-slot available" data-time="tomorrow-2pm">Tomorrow 2:00 PM</div>
          </div>
          <div class="calendar-footer">
            <p>30-minute consultation • Free of charge</p>
            <p>We'll discuss your project goals and requirements</p>
          </div>
        </div>
      </div>
    `
    );

    this.setupTimeSlotSelection(modal);
  }

  createModal(title, content) {
    const modal = document.createElement("div");
    modal.className = "footer-modal";
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    const style = document.createElement("style");
    style.textContent = `
      .footer-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
      }
      
      .modal-dialog {
        position: relative;
        background: var(--primary-black);
        border: 2px solid var(--accent-cyan);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        background: rgba(0, 255, 255, 0.1);
      }
      
      .modal-title {
        font-family: "Space Mono", monospace;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-white);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .modal-close {
        background: none;
        border: none;
        color: var(--primary-white);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.3s ease;
      }
      
      .modal-close:hover {
        color: var(--accent-cyan);
      }
      
      .modal-body {
        padding: 2rem;
      }
      
      .initiation-steps {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }
      
      .step.active {
        border-color: var(--accent-cyan);
        background: rgba(0, 255, 255, 0.1);
      }
      
      .step-number {
        font-family: "JetBrains Mono", monospace;
        font-weight: 700;
        color: var(--accent-cyan);
        font-size: 1.25rem;
      }
      
      .step-text {
        flex: 1;
        font-family: "JetBrains Mono", monospace;
        color: var(--primary-white);
      }
      
      .step-progress {
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-cyan);
        border-radius: 50%;
        position: relative;
      }
      
      .step.active .step-progress::after {
        content: "";
        position: absolute;
        inset: 2px;
        background: var(--accent-cyan);
        border-radius: 50%;
        animation: pulse 1s ease-in-out infinite;
      }
      
      .contact-info {
        font-family: "JetBrains Mono", monospace;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
      }
      
      .contact-info a {
        color: var(--accent-cyan);
        text-decoration: none;
      }
      
      .quote-calculator {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      
      .calculator-display {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(0, 255, 255, 0.3);
        padding: 1.5rem;
        font-family: "JetBrains Mono", monospace;
      }
      
      .display-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        color: var(--primary-white);
      }
      
      .display-line.total {
        border-top: 1px solid rgba(0, 255, 255, 0.3);
        padding-top: 0.5rem;
        margin-top: 1rem;
        font-weight: 700;
        color: var(--accent-yellow);
      }
      
      .value {
        color: var(--accent-cyan);
      }
      
      .quote-disclaimer {
        font-family: "JetBrains Mono", monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.4;
      }
      
      .calendar-widget {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .calendar-header h4 {
        font-family: "Space Mono", monospace;
        color: var(--primary-white);
        margin: 0 0 0.5rem 0;
      }
      
      .calendar-header p {
        font-family: "JetBrains Mono", monospace;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }
      
      .time-slots {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      
      .time-slot {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: var(--primary-white);
        font-family: "JetBrains Mono", monospace;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .time-slot:hover {
        border-color: var(--accent-cyan);
        background: rgba(0, 255, 255, 0.1);
      }
      
      .time-slot.selected {
        background: var(--accent-cyan);
        color: var(--primary-black);
      }
      
      .calendar-footer {
        font-family: "JetBrains Mono", monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    // Setup close functionality
    const closeBtn = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");

    closeBtn.addEventListener("click", () => this.closeModal(modal));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.closeModal(modal);
    });

    // Escape key to close
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        this.closeModal(modal);
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);

    return modal;
  }

  closeModal(modal) {
    modal.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => {
      modal.remove();
    }, 300);
  }

  animateInitiationSteps(modal) {
    const steps = modal.querySelectorAll(".step");
    let currentStep = 0;

    const activateStep = () => {
      if (currentStep < steps.length) {
        steps[currentStep].classList.add("active");
        currentStep++;
        setTimeout(activateStep, 800);
      }
    };

    setTimeout(activateStep, 500);
  }

  animateQuoteCalculation(modal) {
    const values = modal.querySelectorAll(".value");
    const finalValues = [
      "MEDIUM COMPLEXITY",
      "4-6 WEEKS",
      "1 SENIOR DEVELOPER",
      "$5,000 - $15,000",
    ];

    values.forEach((value, index) => {
      setTimeout(() => {
        if (index < finalValues.length) {
          this.typewriterEffect(value, finalValues[index]);
        }
      }, (index + 1) * 800);
    });
  }

  setupTimeSlotSelection(modal) {
    const timeSlots = modal.querySelectorAll(".time-slot");

    timeSlots.forEach((slot) => {
      slot.addEventListener("click", () => {
        // Remove previous selection
        timeSlots.forEach((s) => s.classList.remove("selected"));

        // Select current slot
        slot.classList.add("selected");

        // Show confirmation
        setTimeout(() => {
          slot.textContent = "CONFIRMED ✓";
          setTimeout(() => {
            this.closeModal(modal);
            this.showConfirmationMessage(
              "Call scheduled! You'll receive a calendar invite shortly."
            );
          }, 1000);
        }, 500);
      });
    });
  }

  setupNewsletterForm() {
    this.newsletterForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNewsletterSignup(e.target);
    });
  }

  handleNewsletterSignup(form) {
    const email = form.querySelector(".newsletter-input").value;
    const submitBtn = form.querySelector(".newsletter-btn");
    const originalText = submitBtn.querySelector(".btn-text").textContent;

    // Validate email
    if (!this.isValidEmail(email)) {
      this.showErrorMessage("Please enter a valid email address");
      return;
    }

    // Change button state
    this.typewriterEffect(
      submitBtn.querySelector(".btn-text"),
      "SUBSCRIBING...",
      () => {
        // Simulate API call
        setTimeout(() => {
          this.typewriterEffect(
            submitBtn.querySelector(".btn-text"),
            "SUBSCRIBED!",
            () => {
              form.reset();
              this.showConfirmationMessage(
                "Welcome! Check your email for the React cheatsheet."
              );

              setTimeout(() => {
                this.typewriterEffect(
                  submitBtn.querySelector(".btn-text"),
                  originalText
                );
              }, 2000);
            }
          );

          // Track subscription
          this.trackConversion("newsletter_signup", "footer");
        }, 1500);
      }
    );
  }

  setupResourceDownloads() {
    const downloadBtns = document.querySelectorAll(".resource-download-btn");

    downloadBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleResourceDownload(btn);
      });
    });
  }

  handleResourceDownload(btn) {
    const resourceItem = btn.closest(".resource-item");
    const resourceType = resourceItem.dataset.resource;
    const originalText = btn.querySelector(".btn-text").textContent;

    this.typewriterEffect(
      btn.querySelector(".btn-text"),
      "PREPARING...",
      () => {
        setTimeout(() => {
          this.typewriterEffect(
            btn.querySelector(".btn-text"),
            "DOWNLOADED!",
            () => {
              // Simulate download
              this.simulateDownload(resourceType);

              setTimeout(() => {
                this.typewriterEffect(
                  btn.querySelector(".btn-text"),
                  originalText
                );
              }, 2000);
            }
          );

          // Track download
          this.trackConversion("resource_download", resourceType);
        }, 1000);
      }
    );
  }

  simulateDownload(resourceType) {
    // Create download notification
    const notification = document.createElement("div");
    notification.className = "download-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">📥</span>
        <span class="notification-text">Download started: ${resourceType}</span>
      </div>
    `;

    // Add notification styles
    const style = document.createElement("style");
    style.textContent = `
      .download-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-black);
        border: 2px solid var(--accent-green);
        padding: 1rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: "JetBrains Mono", monospace;
        color: var(--accent-green);
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  setupSocialTracking() {
    const socialBtns = document.querySelectorAll(".platform-follow-btn");

    socialBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const platform = btn.closest(".social-platform").dataset.platform;
        this.handleSocialFollow(btn, platform);
      });
    });
  }

  handleSocialFollow(btn, platform) {
    const originalText = btn.querySelector(".btn-text").textContent;

    this.typewriterEffect(btn.querySelector(".btn-text"), "OPENING...", () => {
      // Simulate opening social platform
      setTimeout(() => {
        this.typewriterEffect(
          btn.querySelector(".btn-text"),
          "FOLLOWED!",
          () => {
            // Update follower count
            this.updateFollowerCount(platform);

            setTimeout(() => {
              this.typewriterEffect(
                btn.querySelector(".btn-text"),
                originalText
              );
            }, 2000);
          }
        );

        // Track social follow
        this.trackConversion("social_follow", platform);
      }, 800);
    });
  }

  updateFollowerCount(platform) {
    const platformElement = document.querySelector(
      `[data-platform="${platform}"]`
    );
    const statsElement = platformElement?.querySelector(".platform-stats");

    if (statsElement) {
      const currentCount = parseInt(statsElement.textContent.match(/\d+/)[0]);
      const newCount = currentCount + 1;
      statsElement.textContent = statsElement.textContent.replace(
        /\d+/,
        newCount
      );

      // Add pulse effect
      statsElement.style.animation = "pulse 0.5s ease-out";
    }
  }

  setupBackToTop() {
    this.backToTopBtn?.addEventListener("click", () => {
      this.scrollToTop();
    });

    // Show/hide back to top button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        this.backToTopBtn?.classList.add("visible");
      } else {
        this.backToTopBtn?.classList.remove("visible");
      }
    });
  }

  scrollToTop() {
    const originalText =
      this.backToTopBtn.querySelector(".btn-text").textContent;

    this.typewriterEffect(
      this.backToTopBtn.querySelector(".btn-text"),
      "ASCENDING...",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setTimeout(() => {
          this.typewriterEffect(
            this.backToTopBtn.querySelector(".btn-text"),
            originalText
          );
        }, 1000);
      }
    );
  }

  setupFooterParticles() {
    if (!this.footerParticles) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "footer-particle";
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: var(--accent-cyan);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.3};
        animation: footerParticleFloat ${
          Math.random() * 10 + 10
        }s linear infinite;
      `;

      this.footerParticles.appendChild(particle);
      this.particles.push(particle);
    }

    // Add particle animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes footerParticleFloat {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations
            if (entry.target.classList.contains("ultimate-cta")) {
              this.animateUltimateCTA();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe footer sections
    const sections = [".ultimate-cta", ".footer-content", ".footer-bottom"];
    sections.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
  }

  animateUltimateCTA() {
    // Animate CTA title with glitch effect
    if (this.ultimateCtaTitle) {
      this.ultimateCtaTitle.style.animation = "textGlitch 0.5s ease-out";
    }

    // Stagger animate CTA buttons
    const ctaButtons = document.querySelectorAll(".ultimate-btn");
    ctaButtons.forEach((btn, index) => {
      setTimeout(() => {
        btn.style.transform = "scale(1.05)";
        setTimeout(() => {
          btn.style.transform = "scale(1)";
        }, 200);
      }, index * 200);
    });
  }

  setupCtaTitleAnimation() {
    if (!this.ultimateCtaTitle) return;

    // Create typing effect for CTA title
    const originalText = this.ultimateCtaTitle.textContent;
    this.ultimateCtaTitle.textContent = "";

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < originalText.length) {
        this.ultimateCtaTitle.textContent += originalText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  }

  startFooterAnimations() {
    // Add footer-specific CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes textGlitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
      
      .back-to-top-btn.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .back-to-top-btn {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
      }
      
      .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    // Start particle regeneration
    setInterval(() => {
      this.regenerateParticles();
    }, 30000); // Every 30 seconds
  }

  regenerateParticles() {
    // Remove old particles
    this.particles.forEach((particle) => {
      if (Math.random() > 0.7) {
        particle.remove();
      }
    });

    // Add new particles
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div");
      particle.className = "footer-particle";
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: var(--accent-cyan);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: 100%;
        opacity: ${Math.random() * 0.5 + 0.3};
        animation: footerParticleFloat ${
          Math.random() * 10 + 10
        }s linear infinite;
      `;

      this.footerParticles?.appendChild(particle);
    }
  }

  // Utility Methods
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

  triggerButtonHoverEffect(button) {
    button.style.transform = "scale(1.05) translateY(-2px)";

    // Add random glitch effect
    if (Math.random() > 0.7) {
      button.style.animation = "textGlitch 0.3s ease-out";
    }
  }

  resetButtonHoverEffect(button) {
    button.style.transform = "scale(1) translateY(0)";
    button.style.animation = "";
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showConfirmationMessage(message) {
    const notification = document.createElement("div");
    notification.className = "confirmation-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span class="notification-text">${message}</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .confirmation-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-black);
        border: 2px solid var(--accent-green);
        padding: 1rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
      }
      
      .confirmation-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: "JetBrains Mono", monospace;
        color: var(--accent-green);
        font-size: 0.875rem;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  showErrorMessage(message) {
    const notification = document.createElement("div");
    notification.className = "error-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">❌</span>
        <span class="notification-text">${message}</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-black);
        border: 2px solid #ff4444;
        padding: 1rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
      }
      
      .error-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: "JetBrains Mono", monospace;
        color: #ff4444;
        font-size: 0.875rem;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  trackConversion(action, source) {
    // Track conversion events (integrate with analytics)
    console.log(`Conversion tracked: ${action} from ${source}`);

    // Store in local tracking data
    this.socialTrackingData[action] = {
      source,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
    };

    // In a real implementation, send to analytics service
    // analytics.track(action, { source, timestamp: Date.now() })
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem("footer_session_id");
    if (!sessionId) {
      sessionId =
        "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem("footer_session_id", sessionId);
    }
    return sessionId;
  }
}

// Initialize Footer Component
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistFooter();
});
