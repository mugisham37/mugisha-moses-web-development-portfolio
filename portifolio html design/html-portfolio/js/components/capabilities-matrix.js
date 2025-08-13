/**
 * CAPABILITIES MATRIX - INTERACTIVE SHOWCASE
 * Industrial Digital Brutalism with Surgical Precision
 */

class CapabilitiesMatrix {
  constructor() {
    this.container = document.querySelector(".capabilities-matrix");
    this.blocks = document.querySelectorAll(".capability-block");
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (!this.container || this.isInitialized) return;

    this.setupEventListeners();
    this.initializeTechnologyBadges();
    this.initializeProgressIndicators();
    this.setupIntersectionObserver();
    this.isInitialized = true;

    console.log("Capabilities Matrix initialized");
  }

  setupEventListeners() {
    this.blocks.forEach((block, index) => {
      // Mouse events
      block.addEventListener("mouseenter", () =>
        this.handleBlockHover(block, true)
      );
      block.addEventListener("mouseleave", () =>
        this.handleBlockHover(block, false)
      );

      // Keyboard events
      block.addEventListener("keydown", (e) => this.handleKeydown(e, block));
      block.addEventListener("focus", () => this.handleBlockFocus(block, true));
      block.addEventListener("blur", () => this.handleBlockFocus(block, false));

      // Touch events for mobile
      block.addEventListener("touchstart", () => this.handleTouchStart(block), {
        passive: true,
      });
      block.addEventListener("touchend", () => this.handleTouchEnd(block), {
        passive: true,
      });
    });
  }

  handleBlockHover(block, isHovering) {
    const blockType = this.getBlockType(block);

    if (isHovering) {
      this.activateBlockDemo(block, blockType);
      this.announceToScreenReader(`Exploring ${blockType} capabilities`);
    } else {
      this.deactivateBlockDemo(block, blockType);
    }
  }

  handleBlockFocus(block, isFocused) {
    if (isFocused) {
      const blockType = this.getBlockType(block);
      this.activateBlockDemo(block, blockType);
    }
  }

  handleKeydown(event, block) {
    // Handle Enter and Space key activation
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.activateBlockInteraction(block);
    }
  }

  handleTouchStart(block) {
    // Add touch feedback
    block.style.transform = "scale(1.02) translateZ(0)";
  }

  handleTouchEnd(block) {
    // Reset touch feedback
    setTimeout(() => {
      block.style.transform = "";
    }, 150);
  }

  getBlockType(block) {
    const classList = Array.from(block.classList);
    const typeClass = classList.find((cls) => cls.includes("--"));
    return typeClass ? typeClass.split("--")[1] : "default";
  }

  activateBlockDemo(block, blockType) {
    switch (blockType) {
      case "frontend":
        this.activateFrontendDemo(block);
        break;
      case "backend":
        this.activateBackendDemo(block);
        break;
      case "mobile":
        this.activateMobileDemo(block);
        break;
      case "database":
        this.activateDatabaseDemo(block);
        break;
      case "devops":
        this.activateDevOpsDemo(block);
        break;
      case "design":
        this.activateDesignDemo(block);
        break;
    }
  }

  deactivateBlockDemo(block, blockType) {
    // Reset any active demo states
    const demoElements = block.querySelectorAll("[data-demo-active]");
    demoElements.forEach((el) => {
      el.removeAttribute("data-demo-active");
    });
  }

  activateFrontendDemo(block) {
    const reactLogo = block.querySelector(".react-logo");
    const codeElement = block.querySelector(".react-code");

    if (reactLogo) {
      reactLogo.setAttribute("data-demo-active", "true");
    }

    if (codeElement) {
      this.typewriterEffect(
        codeElement,
        "const App = () => <div>Hello World!</div>"
      );
    }
  }

  activateBackendDemo(block) {
    const endpoints = block.querySelectorAll(".api-endpoint");
    const flowArrows = block.querySelectorAll(".flow-arrow");

    endpoints.forEach((endpoint, index) => {
      setTimeout(() => {
        endpoint.style.background = "rgba(0, 255, 0, 0.2)";
        endpoint.setAttribute("data-demo-active", "true");
      }, index * 200);
    });

    flowArrows.forEach((arrow) => {
      arrow.setAttribute("data-demo-active", "true");
    });
  }

  activateMobileDemo(block) {
    const appSlides = block.querySelector(".app-slides");
    if (appSlides) {
      appSlides.style.animationPlayState = "running";
      appSlides.setAttribute("data-demo-active", "true");
    }
  }

  activateDatabaseDemo(block) {
    const schemaTables = block.querySelectorAll(".schema-table");
    const relations = block.querySelectorAll(".schema-relation");

    schemaTables.forEach((table, index) => {
      setTimeout(() => {
        table.style.background = "rgba(255, 255, 0, 0.2)";
        table.style.borderColor = "var(--color-accent)";
        table.setAttribute("data-demo-active", "true");
      }, index * 300);
    });

    relations.forEach((relation) => {
      relation.setAttribute("data-demo-active", "true");
    });
  }

  activateDevOpsDemo(block) {
    const stages = block.querySelectorAll(".pipeline-stage");
    const progressBar = block.querySelector(".pipeline-progress");

    // Sequential pipeline stage animation
    stages.forEach((stage, index) => {
      setTimeout(() => {
        // Animate stage activation
        stage.style.borderLeftColor = "var(--color-success)";
        stage.style.background = "rgba(0, 255, 0, 0.1)";
        stage.style.transform = "translateX(0)";
        stage.style.opacity = "1";
        stage.setAttribute("data-demo-active", "true");

        // Animate status indicator
        const status = stage.querySelector(".stage-status");
        if (status) {
          status.style.background = "var(--color-success)";
          status.style.boxShadow = "0 0 8px var(--color-success)";
          status.style.animation = "pulse-success 1s ease-out";
        }

        // Add stage completion text
        const stageText = stage.querySelector(".stage-text");
        if (stageText) {
          stageText.style.color = "var(--color-success)";
          stageText.style.fontWeight = "bold";
        }

        // Update progress bar if exists
        if (progressBar) {
          const progressPercent = ((index + 1) / stages.length) * 100;
          progressBar.style.width = `${progressPercent}%`;
        }

        // Add completion checkmark animation
        this.addCompletionCheckmark(stage);
      }, index * 200);
    });

    // Add overall completion rate display
    setTimeout(() => {
      this.showCompletionRate(block, 95); // 95% success rate
    }, stages.length * 200 + 300);
  }

  activateDesignDemo(block) {
    const colorPalette = block.querySelector(".color-palette");
    const colorSwatches = block.querySelectorAll(".color-swatch");
    const designTools = block.querySelectorAll(".design-tool");

    // Expand color palette
    if (colorPalette) {
      colorPalette.style.transform = "scale(1.1)";
      colorPalette.style.gap = "var(--space-sm)";
    }

    // Animate color swatches with expansion effect
    colorSwatches.forEach((swatch, index) => {
      setTimeout(() => {
        swatch.style.transform = "scale(1.3) rotate(5deg)";
        swatch.style.borderColor = "var(--color-accent)";
        swatch.style.borderWidth = "2px";
        swatch.style.boxShadow = "0 4px 8px rgba(255, 255, 0, 0.3)";
        swatch.setAttribute("data-demo-active", "true");

        // Add color name tooltip
        this.showColorTooltip(swatch, this.getColorName(index));
      }, index * 80);
    });

    // Animate design tools with enhanced effects
    designTools.forEach((tool, index) => {
      setTimeout(() => {
        tool.style.background = "rgba(255, 255, 0, 0.2)";
        tool.style.borderColor = "var(--color-accent)";
        tool.style.transform = "translateY(-4px) scale(1.05)";
        tool.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
        tool.setAttribute("data-demo-active", "true");

        // Add tool icon animation
        this.addToolIconAnimation(tool);
      }, index * 120);
    });

    // Show design process flow
    setTimeout(() => {
      this.showDesignProcessFlow(block);
    }, colorSwatches.length * 80 + designTools.length * 120);
  }

  activateBlockInteraction(block) {
    // Add ripple effect for interaction feedback
    this.createRippleEffect(block);

    // Announce interaction to screen readers
    const blockType = this.getBlockType(block);
    this.announceToScreenReader(`${blockType} capability activated`);
  }

  createRippleEffect(element) {
    const ripple = document.createElement("div");
    ripple.className = "capability-ripple";
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 0, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    element.style.position = "relative";
    element.appendChild(ripple);

    // Add ripple animation if not already defined
    if (!document.querySelector("#ripple-animation")) {
      const style = document.createElement("style");
      style.id = "ripple-animation";
      style.textContent = `
        @keyframes ripple {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  typewriterEffect(element, text, speed = 50) {
    element.textContent = "";
    let i = 0;

    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add visible class for fade-in-scroll animation
          entry.target.classList.add("visible");
          this.animateBlocksOnScroll();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (this.container) {
      observer.observe(this.container);
    }
  }

  animateBlocksOnScroll() {
    this.blocks.forEach((block, index) => {
      setTimeout(() => {
        block.style.opacity = "1";
        block.style.transform = "translateY(0)";
        block.classList.add("animate-in");
      }, index * 100);
    });
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById("live-region");
    if (liveRegion) {
      liveRegion.textContent = message;

      // Clear the message after a short delay
      setTimeout(() => {
        liveRegion.textContent = "";
      }, 1000);
    }
  }

  // Public method to refresh the component
  refresh() {
    this.blocks = document.querySelectorAll(".capability-block");
    this.setupEventListeners();
  }

  // Initialize technology badges with pulse animations
  initializeTechnologyBadges() {
    const techBadges = document.querySelectorAll(".tech-badge");

    techBadges.forEach((badge, index) => {
      // Add staggered pulse animation
      badge.style.animationDelay = `${index * 0.2}s`;

      // Enhanced hover effects
      badge.addEventListener("mouseenter", () => {
        badge.style.transform = "scale(1.1) translateY(-2px)";
        badge.style.boxShadow = "0 4px 8px rgba(255, 255, 0, 0.4)";
        badge.style.animation = "none";
      });

      badge.addEventListener("mouseleave", () => {
        badge.style.transform = "";
        badge.style.boxShadow = "";
        badge.style.animation = "pulse 2s infinite";
      });
    });
  }

  // Initialize progress indicators
  initializeProgressIndicators() {
    this.blocks.forEach((block) => {
      const blockType = this.getBlockType(block);
      this.addProgressIndicator(block, blockType);
    });
  }

  // Add progress indicator to capability block
  addProgressIndicator(block, blockType) {
    const completionRate = this.getCompletionRate(blockType);
    const progressContainer = document.createElement("div");
    progressContainer.className = "capability-progress";
    progressContainer.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%" data-progress="${completionRate}"></div>
      </div>
      <span class="progress-text">${completionRate}% Complete</span>
    `;

    const content = block.querySelector(".capability-block__content");
    if (content) {
      content.appendChild(progressContainer);
    }

    // Animate progress bar on hover
    block.addEventListener("mouseenter", () => {
      const progressFill = progressContainer.querySelector(".progress-fill");
      if (progressFill) {
        setTimeout(() => {
          progressFill.style.width = `${completionRate}%`;
        }, 200);
      }
    });

    block.addEventListener("mouseleave", () => {
      const progressFill = progressContainer.querySelector(".progress-fill");
      if (progressFill) {
        progressFill.style.width = "0%";
      }
    });
  }

  // Get completion rate based on block type
  getCompletionRate(blockType) {
    const rates = {
      frontend: 95,
      backend: 90,
      mobile: 85,
      database: 92,
      devops: 88,
      design: 93,
    };
    return rates[blockType] || 90;
  }

  // Add completion checkmark to pipeline stage
  addCompletionCheckmark(stage) {
    const checkmark = document.createElement("span");
    checkmark.className = "stage-checkmark";
    checkmark.innerHTML = "✓";
    checkmark.style.cssText = `
      color: var(--color-success);
      font-weight: bold;
      margin-left: auto;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease-out;
    `;

    stage.appendChild(checkmark);

    setTimeout(() => {
      checkmark.style.opacity = "1";
      checkmark.style.transform = "scale(1)";
    }, 100);
  }

  // Show completion rate for DevOps block
  showCompletionRate(block, rate) {
    const completionDisplay = document.createElement("div");
    completionDisplay.className = "completion-rate-display";
    completionDisplay.innerHTML = `
      <div class="completion-circle">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="var(--color-muted)" stroke-width="2"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="var(--color-success)" stroke-width="2"
                  stroke-dasharray="113" stroke-dashoffset="${
                    113 - (113 * rate) / 100
                  }"
                  transform="rotate(-90 20 20)" class="progress-circle"/>
        </svg>
        <span class="completion-percentage">${rate}%</span>
      </div>
      <span class="completion-label">Success Rate</span>
    `;

    const demo = block.querySelector(".capability-block__demo");
    if (demo) {
      demo.appendChild(completionDisplay);
    }
  }

  // Get color name for tooltip
  getColorName(index) {
    const colorNames = ["Primary", "Secondary", "Accent", "Success", "Danger"];
    return colorNames[index] || "Color";
  }

  // Show color tooltip
  showColorTooltip(swatch, colorName) {
    const tooltip = document.createElement("div");
    tooltip.className = "color-tooltip";
    tooltip.textContent = colorName;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-black);
      color: var(--color-white);
      padding: 4px 8px;
      font-size: 10px;
      font-family: var(--font-mono);
      border: 1px solid var(--color-accent);
      white-space: nowrap;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    swatch.style.position = "relative";
    swatch.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  // Add tool icon animation
  addToolIconAnimation(tool) {
    const icon = document.createElement("span");
    icon.className = "tool-icon";
    icon.innerHTML = this.getToolIcon(tool.textContent);
    icon.style.cssText = `
      display: inline-block;
      margin-right: 4px;
      animation: bounce 0.6s ease-out;
    `;

    tool.insertBefore(icon, tool.firstChild);
  }

  // Get tool icon based on tool name
  getToolIcon(toolName) {
    const icons = {
      Figma: "🎨",
      Adobe: "🖌️",
      Sketch: "✏️",
    };
    return icons[toolName] || "🔧";
  }

  // Show design process flow
  showDesignProcessFlow(block) {
    const processFlow = document.createElement("div");
    processFlow.className = "design-process-flow";
    processFlow.innerHTML = `
      <div class="process-step">Research</div>
      <div class="process-arrow">→</div>
      <div class="process-step">Design</div>
      <div class="process-arrow">→</div>
      <div class="process-step">Test</div>
    `;
    processFlow.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--color-accent);
      opacity: 0;
      animation: fadeInUp 0.5s ease-out forwards;
    `;

    const demo = block.querySelector(".design-demo");
    if (demo) {
      demo.appendChild(processFlow);
    }
  }

  // Public method to destroy the component
  destroy() {
    this.blocks.forEach((block) => {
      block.removeEventListener("mouseenter", this.handleBlockHover);
      block.removeEventListener("mouseleave", this.handleBlockHover);
      block.removeEventListener("keydown", this.handleKeydown);
      block.removeEventListener("focus", this.handleBlockFocus);
      block.removeEventListener("blur", this.handleBlockFocus);
      block.removeEventListener("touchstart", this.handleTouchStart);
      block.removeEventListener("touchend", this.handleTouchEnd);
    });

    this.isInitialized = false;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Check if capabilities matrix exists on the page
  if (document.querySelector(".capabilities-matrix")) {
    window.capabilitiesMatrix = new CapabilitiesMatrix();
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = CapabilitiesMatrix;
}
