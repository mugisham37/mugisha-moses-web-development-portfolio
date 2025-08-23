// Brutalist Process Component
class BrutalistProcess {
  constructor() {
    this.processSection = document.getElementById("processSection");
    this.processTitle = document.getElementById("processTitle");
    this.workflowParticles = document.getElementById("workflowParticles");
    this.connectionLines = document.getElementById("connectionLines");
    this.processSteps = document.querySelectorAll(".process-step");
    this.timelineBars = document.querySelectorAll(".timeline-bar");
    this.pricingTiers = document.querySelectorAll(".pricing-tier");
    this.toolItems = document.querySelectorAll(".tool-item");
    this.primaryProcessCta = document.getElementById("primaryProcessCta");
    this.invitationBtn = document.getElementById("invitationBtn");

    this.isAnimating = false;
    this.currentStep = 0;

    this.init();
  }

  init() {
    this.setupProcessSteps();
    this.setupTimelineAnimations();
    this.setupPricingCalculator();
    this.setupCommunicationTools();
    this.setupCTAInteractions();
    this.setupScrollAnimations();
    this.setupConnectionLines();
    this.startBackgroundAnimations();
  }

  setupProcessSteps() {
    this.processSteps.forEach((step, index) => {
      const stepContainer = step.querySelector(".step-container");
      const stepIcon = step.querySelector(".step-icon");
      const stepNumber = step.querySelector(".step-number");

      // Add hover effects
      stepContainer.addEventListener("mouseenter", () => {
        this.triggerStepHover(step, index);
      });

      stepContainer.addEventListener("mouseleave", () => {
        this.resetStepHover(step);
      });

      // Add click interactions
      stepContainer.addEventListener("click", () => {
        this.selectStep(step, index);
      });

      // Animate step numbers on scroll
      this.animateStepNumber(stepNumber, index);
    });
  }

  triggerStepHover(step, index) {
    const stepIcon = step.querySelector(".step-icon");
    const stepNumber = step.querySelector(".step-number");
    const detailItems = step.querySelectorAll(".detail-item");

    // Icon animation
    stepIcon.style.transform = "scale(1.1) rotate(5deg)";
    stepIcon.style.boxShadow = "0 0 20px rgba(0, 128, 255, 0.5)";

    // Number glow effect
    stepNumber.style.textShadow = "0 0 20px rgba(0, 128, 255, 0.8)";
    stepNumber.style.color = "#0080ff";

    // Stagger detail item animations
    detailItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.transform = "translateX(10px)";
        item.style.color = "rgba(255, 255, 255, 0.9)";
      }, i * 100);
    });

    // Create particle burst effect
    this.createParticleBurst(step);
  }

  resetStepHover(step) {
    const stepIcon = step.querySelector(".step-icon");
    const stepNumber = step.querySelector(".step-number");
    const detailItems = step.querySelectorAll(".detail-item");

    stepIcon.style.transform = "scale(1) rotate(0deg)";
    stepIcon.style.boxShadow = "";
    stepNumber.style.textShadow = "";
    stepNumber.style.color = "rgba(0, 128, 255, 0.2)";

    detailItems.forEach((item) => {
      item.style.transform = "translateX(0)";
      item.style.color = "rgba(255, 255, 255, 0.7)";
    });
  }

  selectStep(step, index) {
    // Remove active state from all steps
    this.processSteps.forEach((s) => s.classList.remove("active"));

    // Add active state to selected step
    step.classList.add("active");
    this.currentStep = index;

    // Trigger selection animation
    this.animateStepSelection(step);

    // Update connection lines
    this.updateConnectionLines(index);
  }

  animateStepSelection(step) {
    const stepContainer = step.querySelector(".step-container");

    // Create selection pulse effect
    stepContainer.style.animation = "none";
    stepContainer.offsetHeight; // Trigger reflow
    stepContainer.style.animation = "stepPulse 0.6s ease-out";

    // Add temporary glow border
    stepContainer.style.borderColor = "#00ffff";
    stepContainer.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.5)";

    setTimeout(() => {
      stepContainer.style.borderColor = "#0080ff";
      stepContainer.style.boxShadow = "0 25px 50px rgba(0, 128, 255, 0.2)";
    }, 600);
  }

  animateStepNumber(numberElement, index) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.countUpAnimation(numberElement, index + 1);
          }, index * 200);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(numberElement);
  }

  countUpAnimation(element, target) {
    let current = 0;
    const increment = target / 20;
    const duration = 1000;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = String(Math.floor(current)).padStart(2, "0");
    }, duration / 20);
  }

  setupTimelineAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateTimelineBars();
          observer.unobserve(entry.target);
        }
      });
    });

    const timelineSection = document.querySelector(".timeline-section");
    if (timelineSection) {
      observer.observe(timelineSection);
    }
  }

  animateTimelineBars() {
    this.timelineBars.forEach((bar, index) => {
      const barFill = bar.querySelector(".bar-fill");
      const weeks = parseInt(barFill.dataset.weeks);
      const maxWeeks = 24; // Maximum weeks for scaling
      const percentage = (weeks / maxWeeks) * 100;

      setTimeout(() => {
        barFill.style.width = `${Math.min(percentage, 100)}%`;

        // Add completion effect
        setTimeout(() => {
          barFill.style.boxShadow = "0 0 10px rgba(0, 128, 255, 0.5)";
        }, 2000);
      }, index * 300);
    });
  }

  setupPricingCalculator() {
    this.pricingTiers.forEach((tier, index) => {
      tier.addEventListener("click", () => {
        this.selectPricingTier(tier, index);
      });

      tier.addEventListener("mouseenter", () => {
        this.triggerPricingHover(tier);
      });

      tier.addEventListener("mouseleave", () => {
        this.resetPricingHover(tier);
      });
    });
  }

  selectPricingTier(tier, index) {
    // Remove active state from all tiers
    this.pricingTiers.forEach((t) => t.classList.remove("active"));

    // Add active state to selected tier
    tier.classList.add("active");

    // Trigger selection animation
    this.animatePricingSelection(tier);

    // Show pricing calculator (if implemented)
    this.showPricingCalculator(index);
  }

  triggerPricingHover(tier) {
    const tierPrice = tier.querySelector(".tier-price");

    tier.style.transform = "translateX(15px) scale(1.02)";
    tier.style.borderColor = "#00ffff";
    tierPrice.style.color = "#00ffff";
    tierPrice.style.textShadow = "0 0 10px rgba(0, 255, 255, 0.5)";
  }

  resetPricingHover(tier) {
    const tierPrice = tier.querySelector(".tier-price");

    tier.style.transform = "translateX(0) scale(1)";
    tier.style.borderColor = "rgba(0, 128, 255, 0.2)";
    tierPrice.style.color = "#0080ff";
    tierPrice.style.textShadow = "";
  }

  animatePricingSelection(tier) {
    tier.style.animation = "pricingPulse 0.5s ease-out";

    // Create price highlight effect
    const tierPrice = tier.querySelector(".tier-price");
    const originalText = tierPrice.textContent;

    tierPrice.style.fontSize = "1.8rem";
    tierPrice.style.color = "#00ff00";

    setTimeout(() => {
      tierPrice.style.fontSize = "1.5rem";
      tierPrice.style.color = "#0080ff";
    }, 500);
  }

  showPricingCalculator(tierIndex) {
    // Create a simple pricing calculator overlay
    const calculator = document.createElement("div");
    calculator.className = "pricing-calculator-overlay";
    calculator.innerHTML = `
      <div class="calculator-content">
        <h3>Project Estimate Calculator</h3>
        <div class="calculator-form">
          <div class="form-group">
            <label>Project Complexity:</label>
            <select id="complexity">
              <option value="1">Simple</option>
              <option value="1.5">Medium</option>
              <option value="2">Complex</option>
            </select>
          </div>
          <div class="form-group">
            <label>Timeline (weeks):</label>
            <input type="range" id="timeline" min="2" max="24" value="8">
            <span id="timelineValue">8 weeks</span>
          </div>
          <div class="estimate-result">
            <div class="estimate-price" id="estimatePrice">$25,000</div>
          </div>
          <button class="close-calculator" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
        </div>
      </div>
    `;

    calculator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(calculator);

    // Add calculator functionality
    this.setupCalculatorLogic(calculator);
  }

  setupCalculatorLogic(calculator) {
    const complexity = calculator.querySelector("#complexity");
    const timeline = calculator.querySelector("#timeline");
    const timelineValue = calculator.querySelector("#timelineValue");
    const estimatePrice = calculator.querySelector("#estimatePrice");

    const updateEstimate = () => {
      const complexityMultiplier = parseFloat(complexity.value);
      const weeks = parseInt(timeline.value);
      const basePrice = weeks * 2000 * complexityMultiplier;

      timelineValue.textContent = `${weeks} weeks`;
      estimatePrice.textContent = `$${basePrice.toLocaleString()}`;
    };

    complexity.addEventListener("change", updateEstimate);
    timeline.addEventListener("input", updateEstimate);

    updateEstimate();
  }

  setupCommunicationTools() {
    this.toolItems.forEach((tool, index) => {
      tool.addEventListener("click", () => {
        this.demonstrateTool(tool, index);
      });

      tool.addEventListener("mouseenter", () => {
        this.triggerToolHover(tool);
      });

      tool.addEventListener("mouseleave", () => {
        this.resetToolHover(tool);
      });
    });
  }

  triggerToolHover(tool) {
    const toolIcon = tool.querySelector(".tool-icon");
    const toolName = tool.querySelector(".tool-name");

    tool.style.transform = "translateY(-10px) scale(1.05)";
    tool.style.borderColor = "#00ffff";
    toolIcon.style.transform = "scale(1.2) rotate(10deg)";
    toolName.style.color = "#00ffff";
  }

  resetToolHover(tool) {
    const toolIcon = tool.querySelector(".tool-icon");
    const toolName = tool.querySelector(".tool-name");

    tool.style.transform = "translateY(0) scale(1)";
    tool.style.borderColor = "rgba(0, 128, 255, 0.2)";
    toolIcon.style.transform = "scale(1) rotate(0deg)";
    toolName.style.color = "var(--primary-white)";
  }

  demonstrateTool(tool, index) {
    const toolName = tool.querySelector(".tool-name").textContent;

    // Create tool demonstration overlay
    const demo = document.createElement("div");
    demo.className = "tool-demo-overlay";
    demo.innerHTML = `
      <div class="demo-content">
        <h3>${toolName} Integration</h3>
        <div class="demo-features">
          ${this.getToolFeatures(toolName)}
        </div>
        <button class="close-demo" onclick="this.parentElement.parentElement.remove()">Close Demo</button>
      </div>
    `;

    demo.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(demo);

    // Animate demo appearance
    const demoContent = demo.querySelector(".demo-content");
    demoContent.style.transform = "scale(0.8) rotate(5deg)";
    demoContent.style.opacity = "0";

    setTimeout(() => {
      demoContent.style.transform = "scale(1) rotate(0deg)";
      demoContent.style.opacity = "1";
      demoContent.style.transition = "all 0.3s ease";
    }, 100);
  }

  getToolFeatures(toolName) {
    const features = {
      Slack: `
        <div class="feature-item">• Real-time messaging and file sharing</div>
        <div class="feature-item">• Dedicated project channels</div>
        <div class="feature-item">• Integration with development tools</div>
        <div class="feature-item">• Daily standup reminders</div>
      `,
      Zoom: `
        <div class="feature-item">• Weekly demo sessions</div>
        <div class="feature-item">• Screen sharing for code reviews</div>
        <div class="feature-item">• Recording for future reference</div>
        <div class="feature-item">• Breakout rooms for focused discussions</div>
      `,
      Email: `
        <div class="feature-item">• Formal project updates</div>
        <div class="feature-item">• Weekly progress reports</div>
        <div class="feature-item">• Milestone notifications</div>
        <div class="feature-item">• Documentation delivery</div>
      `,
      GitHub: `
        <div class="feature-item">• Code repository management</div>
        <div class="feature-item">• Pull request reviews</div>
        <div class="feature-item">• Issue tracking and planning</div>
        <div class="feature-item">• Automated CI/CD pipelines</div>
      `,
      Dashboard: `
        <div class="feature-item">• Real-time progress tracking</div>
        <div class="feature-item">• Sprint burndown charts</div>
        <div class="feature-item">• Performance metrics</div>
        <div class="feature-item">• Budget and timeline monitoring</div>
      `,
    };

    return (
      features[toolName] ||
      "<div class='feature-item'>• Custom tool integration</div>"
    );
  }

  setupCTAInteractions() {
    this.primaryProcessCta.addEventListener("click", () => {
      this.triggerProjectStart();
    });

    this.invitationBtn.addEventListener("click", () => {
      this.triggerSuccessStoryForm();
    });

    // Add hover effects
    this.primaryProcessCta.addEventListener("mouseenter", () => {
      this.primaryProcessCta.style.transform = "translateY(-8px) scale(1.05)";
      this.primaryProcessCta.style.boxShadow =
        "0 25px 50px rgba(0, 128, 255, 0.4)";
    });

    this.primaryProcessCta.addEventListener("mouseleave", () => {
      this.primaryProcessCta.style.transform = "translateY(0) scale(1)";
      this.primaryProcessCta.style.boxShadow =
        "0 20px 40px rgba(0, 128, 255, 0.3)";
    });
  }

  triggerProjectStart() {
    // Create project initiation sequence
    const sequence = document.createElement("div");
    sequence.className = "project-start-sequence";
    sequence.innerHTML = `
      <div class="sequence-content">
        <div class="sequence-step active" data-step="1">
          <div class="step-icon">🚀</div>
          <div class="step-text">Initializing Project...</div>
        </div>
        <div class="sequence-step" data-step="2">
          <div class="step-icon">📋</div>
          <div class="step-text">Preparing Discovery Call...</div>
        </div>
        <div class="sequence-step" data-step="3">
          <div class="step-icon">✅</div>
          <div class="step-text">Ready to Begin!</div>
        </div>
      </div>
    `;

    sequence.style.cssText = `
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
    `;

    document.body.appendChild(sequence);

    // Animate sequence steps
    this.animateProjectSequence(sequence);
  }

  animateProjectSequence(sequence) {
    const steps = sequence.querySelectorAll(".sequence-step");
    let currentStep = 0;

    const nextStep = () => {
      if (currentStep > 0) {
        steps[currentStep - 1].classList.remove("active");
        steps[currentStep - 1].classList.add("completed");
      }

      if (currentStep < steps.length) {
        steps[currentStep].classList.add("active");
        currentStep++;
        setTimeout(nextStep, 1500);
      } else {
        // Sequence complete - redirect or show contact form
        setTimeout(() => {
          sequence.remove();
          this.showContactForm();
        }, 1000);
      }
    };

    nextStep();
  }

  showContactForm() {
    // Create contact form overlay
    const contactForm = document.createElement("div");
    contactForm.className = "contact-form-overlay";
    contactForm.innerHTML = `
      <div class="contact-form-content">
        <h3>Let's Start Your Project</h3>
        <form class="project-contact-form">
          <div class="form-group">
            <label>Your Name:</label>
            <input type="text" required>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" required>
          </div>
          <div class="form-group">
            <label>Project Type:</label>
            <select>
              <option>Landing Page/Portfolio</option>
              <option>Web Application</option>
              <option>Enterprise Solution</option>
            </select>
          </div>
          <div class="form-group">
            <label>Project Description:</label>
            <textarea rows="4" placeholder="Tell us about your project..."></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Schedule Discovery Call</button>
            <button type="button" class="cancel-btn" onclick="this.closest('.contact-form-overlay').remove()">Cancel</button>
          </div>
        </form>
      </div>
    `;

    contactForm.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(contactForm);
  }

  triggerSuccessStoryForm() {
    // Similar to contact form but for success stories
    console.log("Success story form triggered");
    // Implementation would be similar to showContactForm()
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");

            // Trigger specific animations based on element
            if (entry.target.classList.contains("process-step")) {
              this.animateProcessStep(entry.target);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all process steps
    this.processSteps.forEach((step) => {
      observer.observe(step);
    });

    // Observe other key elements
    const elementsToObserve = [
      ".timeline-pricing-section",
      ".communication-section",
      ".process-ctas",
    ];

    elementsToObserve.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });
  }

  animateProcessStep(step) {
    const stepContainer = step.querySelector(".step-container");
    const stepIcon = step.querySelector(".step-icon");
    const detailItems = step.querySelectorAll(".detail-item");

    // Entrance animation
    stepContainer.style.transform = "translateY(50px)";
    stepContainer.style.opacity = "0";

    setTimeout(() => {
      stepContainer.style.transform = "translateY(0)";
      stepContainer.style.opacity = "1";
      stepContainer.style.transition = "all 0.6s ease";
    }, 100);

    // Icon animation
    setTimeout(() => {
      stepIcon.style.transform = "scale(1.1)";
      setTimeout(() => {
        stepIcon.style.transform = "scale(1)";
      }, 300);
    }, 400);

    // Stagger detail items
    detailItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";

      setTimeout(
        () => {
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
          item.style.transition = "all 0.3s ease";
        },
        600 + index * 100
      );
    });
  }

  setupConnectionLines() {
    if (!this.connectionLines) return;

    // Create animated connection lines between steps
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      opacity: 0.3;
    `;

    this.connectionLines.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Animate connection lines
    this.animateConnectionLines(ctx, canvas);
  }

  animateConnectionLines(ctx, canvas) {
    let animationFrame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw animated lines between process steps
      ctx.strokeStyle = "#0080ff";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5 + Math.sin(animationFrame * 0.02) * 0.3;

      // Simple line animation (would be more complex in real implementation)
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(
        canvas.width - 100,
        100 + Math.sin(animationFrame * 0.01) * 50
      );
      ctx.stroke();

      animationFrame++;
      requestAnimationFrame(animate);
    };

    animate();
  }

  updateConnectionLines(activeStepIndex) {
    // Update connection lines based on active step
    // This would highlight the path to the current step
    console.log(`Updating connection lines for step ${activeStepIndex}`);
  }

  createParticleBurst(step) {
    const stepRect = step.getBoundingClientRect();
    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #0080ff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${stepRect.left + stepRect.width / 2}px;
        top: ${stepRect.top + stepRect.height / 2}px;
      `;

      document.body.appendChild(particle);

      // Animate particle
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const duration = 1000 + Math.random() * 500;

      particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${
              Math.sin(angle) * distance
            }px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "ease-out",
        }
      ).onfinish = () => particle.remove();
    }
  }

  startBackgroundAnimations() {
    // Add process-specific CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes stepPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes pricingPulse {
        0% { transform: translateX(0) scale(1); }
        50% { transform: translateX(10px) scale(1.02); }
        100% { transform: translateX(0) scale(1); }
      }
      
      .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
      }
      
      .sequence-step {
        opacity: 0.3;
        transform: scale(0.8);
        transition: all 0.5s ease;
      }
      
      .sequence-step.active {
        opacity: 1;
        transform: scale(1);
      }
      
      .sequence-step.completed {
        opacity: 0.6;
        transform: scale(0.9);
      }
    `;
    document.head.appendChild(style);

    // Start particle system for workflow particles
    this.startWorkflowParticles();
  }

  startWorkflowParticles() {
    if (!this.workflowParticles) return;

    // Create floating workflow particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: rgba(0, 128, 255, ${0.3 + Math.random() * 0.4});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: workflowParticleFloat ${
          8 + Math.random() * 4
        }s ease-in-out infinite;
        animation-delay: ${Math.random() * 8}s;
      `;

      this.workflowParticles.appendChild(particle);
    }

    // Add particle animation
    const particleStyle = document.createElement("style");
    particleStyle.textContent = `
      @keyframes workflowParticleFloat {
        0%, 100% { 
          transform: translateY(0) translateX(0) rotate(0deg);
          opacity: 0.3;
        }
        25% { 
          transform: translateY(-20px) translateX(10px) rotate(90deg);
          opacity: 0.8;
        }
        50% { 
          transform: translateY(-10px) translateX(-10px) rotate(180deg);
          opacity: 0.5;
        }
        75% { 
          transform: translateY(-30px) translateX(5px) rotate(270deg);
          opacity: 0.7;
        }
      }
    `;
    document.head.appendChild(particleStyle);
  }
}

// Initialize the Process component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BrutalistProcess();
});

// Export for use in other components
if (typeof module !== "undefined" && module.exports) {
  module.exports = BrutalistProcess;
}
