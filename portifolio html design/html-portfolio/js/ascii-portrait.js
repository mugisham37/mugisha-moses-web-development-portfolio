/* ==========================================================================
   ASCII PORTRAIT ANIMATION SYSTEM
   Canvas-based portrait animation with 5-phase timeline
   ========================================================================== */

(function () {
  "use strict";

  // ASCII character mapping for 9-level brightness detection
  const ASCII_CHARS = {
    0: " ", // Empty space (lightest)
    1: ".", // Very light
    2: ":", // Light
    3: "-", // Medium-light
    4: "=", // Medium
    5: "+", // Medium-dark
    6: "*", // Dark
    7: "#", // Very dark
    8: "@", // Darkest (highest contrast)
  };

  // Animation timeline configuration
  const ANIMATION_CONFIG = {
    phase1: { duration: 2000, effect: "randomCharacterCycling" },
    phase2: { duration: 2000, effect: "gradualFormation" },
    phase3: { duration: 1000, effect: "detailRefinement" },
    phase4: { duration: 200, effect: "glitchTransition" },
    phase5: { duration: 1000, effect: "photoReveal" },
  };

  class ASCIIPortraitSystem {
    constructor(canvasId, imageUrl, options = {}) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.imageUrl = imageUrl;

      // Configuration options
      this.options = {
        width: options.width || 80,
        height: options.height || 60,
        fontSize: options.fontSize || 12,
        fontFamily: options.fontFamily || "JetBrains Mono, monospace",
        autoStart: options.autoStart !== false,
        loop: options.loop !== false,
        ...options,
      };

      // Animation state
      this.animationState = {
        currentPhase: 0,
        phaseProgress: 0,
        isAnimating: false,
        startTime: 0,
        frameCount: 0,
      };

      // ASCII data storage
      this.asciiData = {
        target: [], // Final ASCII representation
        current: [], // Current display state
        random: [], // Random characters for phase 1
      };

      this.image = null;
      this.imageData = null;

      this.init();
    }

    async init() {
      try {
        await this.loadImage();
        this.setupCanvas();
        this.generateASCIIData();
        this.generateRandomData();

        if (this.options.autoStart) {
          this.startAnimation();
        }
      } catch (error) {
        console.error("ASCII Portrait System initialization failed:", error);
        this.showFallback();
      }
    }

    loadImage() {
      return new Promise((resolve, reject) => {
        this.image = new Image();
        this.image.crossOrigin = "anonymous";

        this.image.onload = () => {
          resolve();
        };

        this.image.onerror = () => {
          reject(new Error("Failed to load portrait image"));
        };

        this.image.src = this.imageUrl;
      });
    }

    setupCanvas() {
      // Set canvas dimensions based on ASCII grid and font size
      const canvasWidth = this.options.width * this.options.fontSize * 0.6;
      const canvasHeight = this.options.height * this.options.fontSize;

      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;

      // Set canvas display size
      this.canvas.style.width = `${canvasWidth}px`;
      this.canvas.style.height = `${canvasHeight}px`;

      // Configure context
      this.ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
      this.ctx.fillStyle = "#ffffff";
    }

    generateASCIIData() {
      // Create temporary canvas for image processing
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = this.options.width;
      tempCanvas.height = this.options.height;

      // Draw and scale image
      tempCtx.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        0,
        0,
        this.options.width,
        this.options.height
      );

      // Get image data
      this.imageData = tempCtx.getImageData(
        0,
        0,
        this.options.width,
        this.options.height
      );

      // Convert to ASCII
      this.asciiData.target = [];
      this.asciiData.current = [];

      for (let y = 0; y < this.options.height; y++) {
        const row = [];
        const currentRow = [];

        for (let x = 0; x < this.options.width; x++) {
          const pixelIndex = (y * this.options.width + x) * 4;
          const r = this.imageData.data[pixelIndex];
          const g = this.imageData.data[pixelIndex + 1];
          const b = this.imageData.data[pixelIndex + 2];

          // Calculate brightness (0-255)
          const brightness = (r + g + b) / 3;

          // Map brightness to ASCII character (0-8)
          const charIndex = Math.floor((brightness / 255) * 8);
          const asciiChar = ASCII_CHARS[8 - charIndex]; // Invert for proper contrast

          row.push(asciiChar);
          currentRow.push(" "); // Start with empty spaces
        }

        this.asciiData.target.push(row);
        this.asciiData.current.push(currentRow);
      }
    }

    generateRandomData() {
      this.asciiData.random = [];
      const chars = Object.values(ASCII_CHARS);

      for (let y = 0; y < this.options.height; y++) {
        const row = [];
        for (let x = 0; x < this.options.width; x++) {
          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          row.push(randomChar);
        }
        this.asciiData.random.push(row);
      }
    }

    startAnimation() {
      if (this.animationState.isAnimating) return;

      this.animationState.isAnimating = true;
      this.animationState.currentPhase = 1;
      this.animationState.startTime = performance.now();
      this.animationState.frameCount = 0;

      this.animate();
    }

    animate(currentTime = performance.now()) {
      if (!this.animationState.isAnimating) return;

      const elapsed = currentTime - this.animationState.startTime;
      this.animationState.frameCount++;

      // Determine current phase and progress
      this.updatePhaseProgress(elapsed);

      // Execute current phase animation
      this.executePhaseAnimation();

      // Render current state
      this.render();

      // Continue animation or finish
      if (this.animationState.currentPhase <= 5) {
        requestAnimationFrame((time) => this.animate(time));
      } else {
        this.finishAnimation();
      }
    }

    updatePhaseProgress(elapsed) {
      let totalDuration = 0;
      let currentPhaseDuration = 0;

      // Calculate which phase we're in
      for (let phase = 1; phase <= 5; phase++) {
        const phaseDuration = ANIMATION_CONFIG[`phase${phase}`].duration;

        if (elapsed <= totalDuration + phaseDuration) {
          this.animationState.currentPhase = phase;
          currentPhaseDuration = phaseDuration;
          break;
        }

        totalDuration += phaseDuration;
      }

      // Calculate progress within current phase (0-1)
      const phaseElapsed = elapsed - totalDuration;
      this.animationState.phaseProgress = Math.min(
        phaseElapsed / currentPhaseDuration,
        1
      );

      // Move to next phase if current is complete
      if (
        this.animationState.phaseProgress >= 1 &&
        this.animationState.currentPhase < 5
      ) {
        // Phase complete, but don't increment here - let the next frame handle it
      }
    }

    executePhaseAnimation() {
      const phase = this.animationState.currentPhase;
      const progress = this.animationState.phaseProgress;

      switch (phase) {
        case 1:
          this.animateRandomCharacterCycling(progress);
          break;
        case 2:
          this.animateGradualFormation(progress);
          break;
        case 3:
          this.animateDetailRefinement(progress);
          break;
        case 4:
          this.animateGlitchTransition(progress);
          break;
        case 5:
          this.animatePhotoReveal(progress);
          break;
      }
    }

    animateRandomCharacterCycling(progress) {
      // Continuously cycle through random characters
      if (this.animationState.frameCount % 3 === 0) {
        // Update every 3 frames
        this.generateRandomData();
      }

      // Copy random data to current display
      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {
          this.asciiData.current[y][x] = this.asciiData.random[y][x];
        }
      }
    }

    animateGradualFormation(progress) {
      // Gradually reveal the target image from random
      const revealThreshold = progress;

      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {
          // Use a noise-like pattern for organic reveal
          const noise = (Math.sin(x * 0.1) + Math.cos(y * 0.1)) * 0.5 + 0.5;
          const adjustedThreshold = revealThreshold + (noise - 0.5) * 0.3;

          if (Math.random() < adjustedThreshold) {
            this.asciiData.current[y][x] = this.asciiData.target[y][x];
          } else {
            // Keep some randomness
            if (this.animationState.frameCount % 5 === 0) {
              const chars = Object.values(ASCII_CHARS);
              this.asciiData.current[y][x] =
                chars[Math.floor(Math.random() * chars.length)];
            }
          }
        }
      }
    }

    animateDetailRefinement(progress) {
      // Fine-tune the details, mostly stable with occasional flickers
      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {
          // 95% chance to show target, 5% chance for flicker
          if (Math.random() < 0.95) {
            this.asciiData.current[y][x] = this.asciiData.target[y][x];
          } else {
            // Subtle flicker with similar characters
            const targetChar = this.asciiData.target[y][x];
            const targetIndex = Object.values(ASCII_CHARS).indexOf(targetChar);
            const flickerRange = 1;
            const flickerIndex = Math.max(
              0,
              Math.min(
                8,
                targetIndex + (Math.random() - 0.5) * flickerRange * 2
              )
            );
            this.asciiData.current[y][x] =
              ASCII_CHARS[Math.floor(flickerIndex)];
          }
        }
      }
    }

    animateGlitchTransition(progress) {
      // Intense glitch effect before reveal
      const glitchIntensity = Math.sin(progress * Math.PI * 10) * 0.5 + 0.5;

      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {
          if (Math.random() < glitchIntensity * 0.7) {
            // Heavy glitch
            const chars = Object.values(ASCII_CHARS);
            this.asciiData.current[y][x] =
              chars[Math.floor(Math.random() * chars.length)];
          } else {
            this.asciiData.current[y][x] = this.asciiData.target[y][x];
          }
        }
      }
    }

    animatePhotoReveal(progress) {
      // Smooth transition to final state
      const stabilityProgress = progress;

      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {
          if (Math.random() < stabilityProgress) {
            this.asciiData.current[y][x] = this.asciiData.target[y][x];
          }
        }
      }

      // At the end, ensure everything is stable
      if (progress >= 0.9) {
        for (let y = 0; y < this.options.height; y++) {
          for (let x = 0; x < this.options.width; x++) {
            this.asciiData.current[y][x] = this.asciiData.target[y][x];
          }
        }
      }
    }

    render() {
      // Clear canvas
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Set text color
      this.ctx.fillStyle = "#ffffff";

      // Render ASCII characters
      const charWidth = this.options.fontSize * 0.6;
      const charHeight = this.options.fontSize;

      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {
          const char = this.asciiData.current[y][x];
          if (char && char !== " ") {
            this.ctx.fillText(char, x * charWidth, y * charHeight);
          }
        }
      }
    }

    finishAnimation() {
      this.animationState.isAnimating = false;

      // Trigger photo reveal if configured
      if (this.options.onComplete) {
        this.options.onComplete();
      }

      // Restart animation if looping is enabled
      if (this.options.loop) {
        setTimeout(() => {
          this.startAnimation();
        }, 3000); // Wait 3 seconds before restarting
      }
    }

    showFallback() {
      // Show fallback content if ASCII animation fails
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = `${this.options.fontSize * 2}px ${
        this.options.fontFamily
      }`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      this.ctx.fillText(
        "PORTRAIT",
        this.canvas.width / 2,
        this.canvas.height / 2 - 20
      );

      this.ctx.fillText(
        "LOADING...",
        this.canvas.width / 2,
        this.canvas.height / 2 + 20
      );
    }

    // Public methods
    restart() {
      this.animationState.isAnimating = false;
      this.startAnimation();
    }

    pause() {
      this.animationState.isAnimating = false;
    }

    resume() {
      if (!this.animationState.isAnimating) {
        this.startAnimation();
      }
    }
  }

  // Export to global scope
  window.ASCIIPortraitSystem = ASCIIPortraitSystem;
})();
