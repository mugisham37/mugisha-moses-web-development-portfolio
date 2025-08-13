/* ==========================================================================
   ENHANCED TYPEWRITER EFFECT SYSTEM
   Advanced typewriter animation with cursor and multiple phrases
   ========================================================================== */

(function () {
  "use strict";

  class TypewriterEffect {
    constructor(elementId, options = {}) {
      this.element = document.getElementById(elementId);
      if (!this.element) {
        console.error(`Typewriter element with ID "${elementId}" not found`);
        return;
      }

      // Configuration options
      this.options = {
        phrases: options.phrases || [
          "FULL-STACK DEVELOPER WHO TRANSFORMS IDEAS INTO DIGITAL REALITY",
        ],
        typeSpeed: options.typeSpeed || 50, // ms per character
        deleteSpeed: options.deleteSpeed || 30, // ms per character when deleting
        pauseTime: options.pauseTime || 2000, // ms to pause at end of phrase
        deletePauseTime: options.deletePauseTime || 1000, // ms to pause before deleting
        loop: options.loop !== false, // loop through phrases
        showCursor: options.showCursor !== false, // show blinking cursor
        cursorChar: options.cursorChar || "|", // cursor character
        cursorBlinkSpeed: options.cursorBlinkSpeed || 530, // ms for cursor blink
        startDelay: options.startDelay || 0, // ms delay before starting
        deleteAll: options.deleteAll !== false, // delete entire phrase or just back to common prefix
        scrambleEffect: options.scrambleEffect || false, // scramble effect before typing
        ...options,
      };

      // State management
      this.state = {
        currentPhraseIndex: 0,
        currentCharIndex: 0,
        isTyping: false,
        isDeleting: false,
        isPaused: false,
        isScrambling: false,
        animationId: null,
        lastTime: 0,
      };

      // DOM elements
      this.textElement = null;
      this.cursorElement = null;

      this.init();
    }

    init() {
      this.setupDOM();
      this.setupCursor();

      // Start animation after delay
      if (this.options.startDelay > 0) {
        setTimeout(() => this.start(), this.options.startDelay);
      } else {
        this.start();
      }
    }

    setupDOM() {
      // Clear existing content
      this.element.innerHTML = "";

      // Create text container
      this.textElement = document.createElement("span");
      this.textElement.className = "typewriter-text";
      this.textElement.setAttribute("aria-live", "polite");
      this.element.appendChild(this.textElement);

      // Create cursor if enabled
      if (this.options.showCursor) {
        this.cursorElement = document.createElement("span");
        this.cursorElement.className = "typewriter-cursor";
        this.cursorElement.textContent = this.options.cursorChar;
        this.cursorElement.setAttribute("aria-hidden", "true");
        this.element.appendChild(this.cursorElement);
      }
    }

    setupCursor() {
      if (!this.cursorElement) return;

      // Set up cursor blinking
      this.cursorElement.style.animation = `typewriter-cursor-blink ${this.options.cursorBlinkSpeed}ms infinite`;

      // Add CSS for cursor animation if not already present
      if (!document.getElementById("typewriter-cursor-styles")) {
        const style = document.createElement("style");
        style.id = "typewriter-cursor-styles";
        style.textContent = `
          @keyframes typewriter-cursor-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          .typewriter-cursor {
            display: inline-block;
            color: var(--color-accent-yellow, #ffff00);
            font-weight: 400;
            margin-left: 2px;
          }
          
          .typewriter-text {
            display: inline-block;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .typewriter-cursor {
              animation: none !important;
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }

    start() {
      if (this.state.isTyping) return;

      this.state.isTyping = true;
      this.state.lastTime = performance.now();
      this.animate();
    }

    stop() {
      this.state.isTyping = false;
      if (this.state.animationId) {
        cancelAnimationFrame(this.state.animationId);
        this.state.animationId = null;
      }
    }

    pause() {
      this.state.isPaused = true;
    }

    resume() {
      this.state.isPaused = false;
      this.state.lastTime = performance.now();
    }

    animate(currentTime = performance.now()) {
      if (!this.state.isTyping || this.state.isPaused) return;

      const deltaTime = currentTime - this.state.lastTime;
      const currentPhrase = this.options.phrases[this.state.currentPhraseIndex];

      // Determine what action to take based on current state
      if (this.state.isScrambling) {
        this.handleScrambling(deltaTime);
      } else if (this.state.isDeleting) {
        this.handleDeleting(deltaTime, currentPhrase);
      } else {
        this.handleTyping(deltaTime, currentPhrase);
      }

      this.state.lastTime = currentTime;
      this.state.animationId = requestAnimationFrame((time) =>
        this.animate(time)
      );
    }

    handleTyping(deltaTime, currentPhrase) {
      const speed = this.options.typeSpeed;

      if (deltaTime >= speed) {
        if (this.state.currentCharIndex < currentPhrase.length) {
          // Add next character
          const nextChar = currentPhrase[this.state.currentCharIndex];
          this.textElement.textContent += nextChar;
          this.state.currentCharIndex++;
          this.state.lastTime = performance.now();
        } else {
          // Finished typing current phrase
          this.onPhraseComplete();
        }
      }
    }

    handleDeleting(deltaTime, currentPhrase) {
      const speed = this.options.deleteSpeed;

      if (deltaTime >= speed) {
        if (this.state.currentCharIndex > 0) {
          // Remove last character
          this.state.currentCharIndex--;
          this.textElement.textContent = currentPhrase.substring(
            0,
            this.state.currentCharIndex
          );
          this.state.lastTime = performance.now();
        } else {
          // Finished deleting
          this.state.isDeleting = false;
          this.moveToNextPhrase();
        }
      }
    }

    handleScrambling(deltaTime) {
      // Scramble effect before typing
      if (deltaTime >= 50) {
        // Scramble every 50ms
        const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        const currentPhrase =
          this.options.phrases[this.state.currentPhraseIndex];
        const targetLength = Math.min(
          this.state.currentCharIndex + 1,
          currentPhrase.length
        );

        let scrambledText = "";
        for (let i = 0; i < targetLength; i++) {
          if (i < this.state.currentCharIndex) {
            // Keep already "typed" characters
            scrambledText += currentPhrase[i];
          } else {
            // Scramble the next character
            scrambledText +=
              scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }

        this.textElement.textContent = scrambledText;
        this.state.lastTime = performance.now();

        // Stop scrambling after a few iterations
        if (this.state.scrambleCount > 5) {
          this.state.isScrambling = false;
          this.state.scrambleCount = 0;
        } else {
          this.state.scrambleCount = (this.state.scrambleCount || 0) + 1;
        }
      }
    }

    onPhraseComplete() {
      // Pause at the end of phrase
      setTimeout(() => {
        if (this.options.phrases.length > 1 && this.options.loop) {
          // Start deleting if we have multiple phrases
          this.startDeleting();
        } else if (!this.options.loop) {
          // Stop if not looping
          this.stop();
        }
      }, this.options.pauseTime);
    }

    startDeleting() {
      setTimeout(() => {
        this.state.isDeleting = true;
        this.state.lastTime = performance.now();
      }, this.options.deletePauseTime);
    }

    moveToNextPhrase() {
      // Move to next phrase
      this.state.currentPhraseIndex =
        (this.state.currentPhraseIndex + 1) % this.options.phrases.length;
      this.state.currentCharIndex = 0;

      // Start scrambling effect if enabled
      if (this.options.scrambleEffect) {
        this.state.isScrambling = true;
        this.state.scrambleCount = 0;
      }

      this.state.lastTime = performance.now();
    }

    // Public methods
    updatePhrases(newPhrases) {
      this.options.phrases = newPhrases;
      this.restart();
    }

    restart() {
      this.stop();
      this.state.currentPhraseIndex = 0;
      this.state.currentCharIndex = 0;
      this.state.isDeleting = false;
      this.state.isScrambling = false;
      this.textElement.textContent = "";
      this.start();
    }

    getCurrentPhrase() {
      return this.options.phrases[this.state.currentPhraseIndex];
    }

    setSpeed(typeSpeed, deleteSpeed) {
      this.options.typeSpeed = typeSpeed;
      if (deleteSpeed !== undefined) {
        this.options.deleteSpeed = deleteSpeed;
      }
    }

    // Accessibility methods
    announceCompletion() {
      if (this.textElement) {
        // Announce completion to screen readers
        const announcement = `Typewriter animation complete: ${this.textElement.textContent}`;
        const liveRegion = document.getElementById("live-region");
        if (liveRegion) {
          liveRegion.textContent = announcement;
          setTimeout(() => {
            liveRegion.textContent = "";
          }, 1000);
        }
      }
    }
  }

  // Auto-initialize for hero typewriter if element exists
  document.addEventListener("DOMContentLoaded", () => {
    const heroTypewriter = document.querySelector(".hero__typewriter");
    if (heroTypewriter && !heroTypewriter.id) {
      heroTypewriter.id = "hero-typewriter";
    }

    if (document.getElementById("hero-typewriter")) {
      // Check for reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Show static text for reduced motion users
        const staticElement = document.getElementById("hero-typewriter");
        staticElement.innerHTML = `
          <span class="typewriter-text">FULL-STACK DEVELOPER WHO TRANSFORMS IDEAS INTO DIGITAL REALITY</span>
          <span class="typewriter-cursor" style="animation: none; opacity: 1;">|</span>
        `;
      } else {
        // Initialize typewriter effect
        window.heroTypewriter = new TypewriterEffect("hero-typewriter", {
          phrases: [
            "FULL-STACK DEVELOPER WHO TRANSFORMS IDEAS INTO DIGITAL REALITY",
            "BUILDING THE FUTURE OF WEB DEVELOPMENT",
            "CRAFTING DIGITAL EXPERIENCES WITH PRECISION",
            "WHERE CODE MEETS CREATIVITY",
          ],
          typeSpeed: 50,
          deleteSpeed: 30,
          pauseTime: 3000,
          deletePauseTime: 1000,
          loop: true,
          scrambleEffect: false,
          startDelay: 1000,
        });
      }
    }
  });

  // Export to global scope
  window.TypewriterEffect = TypewriterEffect;
})();
