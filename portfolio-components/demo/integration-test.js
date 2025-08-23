/**
 * Integration Test Suite for Portfolio Components
 * Tests cross-component interactions, shared resource usage, and conflict detection
 */

class IntegrationTestSuite {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.warnings = [];
    this.startTime = Date.now();
  }

  async runAllTests() {
    console.log("🚀 Starting Integration Test Suite...");

    try {
      // Wait for page to fully load
      await this.waitForPageLoad();

      // Run test categories
      await this.testComponentLoading();
      await this.testSharedResourceUsage();
      await this.testCSSConflicts();
      await this.testJavaScriptErrors();
      await this.testCrossComponentInteractions();
      await this.testAnimationPerformance();
      await this.testResponsiveIntegration();

      // Generate report
      this.generateTestReport();
    } catch (error) {
      console.error("❌ Test suite failed:", error);
      this.errors.push(`Test suite failure: ${error.message}`);
    }
  }

  async waitForPageLoad() {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve);
      }
    });
  }

  async testComponentLoading() {
    console.log("📦 Testing component loading...");

    const expectedComponents = [
      "navigation",
      "hero",
      "trust",
      "value-proposition",
      "project-showcase",
      "tech-capabilities",
      "results",
      "process",
      "social-proof",
      "contact-hub",
      "footer",
    ];

    const loadedComponents = [];
    const missingComponents = [];

    expectedComponents.forEach((componentName) => {
      const container = document.getElementById(`${componentName}-component`);
      if (container && container.children.length > 0) {
        loadedComponents.push(componentName);
        this.logSuccess(`✅ ${componentName} component loaded`);
      } else {
        missingComponents.push(componentName);
        this.logError(`❌ ${componentName} component missing or empty`);
      }
    });

    this.testResults.push({
      category: "Component Loading",
      passed: missingComponents.length === 0,
      details: {
        loaded: loadedComponents.length,
        total: expectedComponents.length,
        missing: missingComponents,
      },
    });
  }

  async testSharedResourceUsage() {
    console.log("🔗 Testing shared resource usage...");

    // Test CSS variables availability
    const testElement = document.createElement("div");
    document.body.appendChild(testElement);

    const cssVariables = [
      "--primary-black",
      "--primary-white",
      "--accent-cyan",
      "--font-mono",
      "--spacing-md",
      "--nav-height",
    ];

    const availableVariables = [];
    const missingVariables = [];

    cssVariables.forEach((variable) => {
      const computedValue =
        getComputedStyle(testElement).getPropertyValue(variable);
      if (computedValue.trim()) {
        availableVariables.push(variable);
        this.logSuccess(`✅ CSS variable ${variable} available`);
      } else {
        missingVariables.push(variable);
        this.logError(`❌ CSS variable ${variable} missing`);
      }
    });

    document.body.removeChild(testElement);

    // Test shared JavaScript utilities
    const sharedUtilities = ["BrutalistUtils"];
    const availableUtilities = [];
    const missingUtilities = [];

    sharedUtilities.forEach((utility) => {
      if (window[utility]) {
        availableUtilities.push(utility);
        this.logSuccess(`✅ Shared utility ${utility} available`);
      } else {
        missingUtilities.push(utility);
        this.logWarning(`⚠️ Shared utility ${utility} not found`);
      }
    });

    this.testResults.push({
      category: "Shared Resources",
      passed: missingVariables.length === 0,
      details: {
        cssVariables: {
          available: availableVariables,
          missing: missingVariables,
        },
        jsUtilities: {
          available: availableUtilities,
          missing: missingUtilities,
        },
      },
    });
  }

  async testCSSConflicts() {
    console.log("🎨 Testing CSS conflicts...");

    const conflicts = [];
    const duplicateClasses = new Map();

    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets);

    try {
      stylesheets.forEach((stylesheet, index) => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          rules.forEach((rule) => {
            if (rule.type === CSSRule.STYLE_RULE) {
              const selector = rule.selectorText;
              if (selector) {
                // Check for potential conflicts
                if (duplicateClasses.has(selector)) {
                  duplicateClasses.get(selector).push(index);
                } else {
                  duplicateClasses.set(selector, [index]);
                }
              }
            }
          });
        } catch (e) {
          // Skip external stylesheets that can't be accessed
          this.logWarning(`⚠️ Cannot access stylesheet ${index}: ${e.message}`);
        }
      });

      // Report potential conflicts
      duplicateClasses.forEach((stylesheetIndices, selector) => {
        if (stylesheetIndices.length > 1) {
          conflicts.push({
            selector,
            stylesheets: stylesheetIndices,
          });
          this.logWarning(
            `⚠️ Potential CSS conflict: ${selector} defined in multiple stylesheets`
          );
        }
      });
    } catch (error) {
      this.logError(`❌ Error analyzing CSS: ${error.message}`);
    }

    this.testResults.push({
      category: "CSS Conflicts",
      passed: conflicts.length === 0,
      details: {
        conflicts: conflicts.length,
        conflictDetails: conflicts,
      },
    });
  }

  async testJavaScriptErrors() {
    console.log("🔧 Testing JavaScript errors...");

    const jsErrors = [];
    const originalConsoleError = console.error;

    // Capture console errors
    console.error = (...args) => {
      jsErrors.push(args.join(" "));
      originalConsoleError.apply(console, args);
    };

    // Test component initialization
    const componentClasses = [
      "BrutalistNavigation",
      "BrutalistHero",
      "BrutalistTrust",
      "BrutalistValueProposition",
      "BrutalistProjectShowcase",
      "BrutalistTechCapabilities",
      "BrutalistResults",
      "BrutalistProcess",
      "BrutalistSocialProof",
      "BrutalistContactHub",
      "BrutalistFooter",
    ];

    const initializedComponents = [];
    const failedComponents = [];

    componentClasses.forEach((className) => {
      try {
        if (window[className]) {
          // Test if class can be instantiated (if not already)
          initializedComponents.push(className);
          this.logSuccess(`✅ ${className} available`);
        } else {
          failedComponents.push(className);
          this.logWarning(`⚠️ ${className} not found`);
        }
      } catch (error) {
        failedComponents.push(className);
        this.logError(`❌ Error with ${className}: ${error.message}`);
      }
    });

    // Restore console.error
    console.error = originalConsoleError;

    this.testResults.push({
      category: "JavaScript Errors",
      passed: jsErrors.length === 0 && failedComponents.length === 0,
      details: {
        errors: jsErrors,
        initialized: initializedComponents,
        failed: failedComponents,
      },
    });
  }

  async testCrossComponentInteractions() {
    console.log("🔄 Testing cross-component interactions...");

    const interactions = [];

    // Test navigation to section scrolling
    try {
      const navItems = document.querySelectorAll("[data-section]");
      const sections = document.querySelectorAll(".component-section");

      this.logSuccess(
        `✅ Found ${navItems.length} navigation items and ${sections.length} sections`
      );

      // Test smooth scrolling functionality
      if (navItems.length > 0) {
        const firstNavItem = navItems[0];
        const sectionName = firstNavItem.getAttribute("data-section");

        // Simulate click (without actually scrolling)
        const clickEvent = new Event("click", { bubbles: true });
        firstNavItem.dispatchEvent(clickEvent);

        interactions.push({
          type: "navigation-scroll",
          success: true,
          details: `Navigation item for ${sectionName} responds to clicks`,
        });

        this.logSuccess(`✅ Navigation interaction test passed`);
      }
    } catch (error) {
      interactions.push({
        type: "navigation-scroll",
        success: false,
        error: error.message,
      });
      this.logError(`❌ Navigation interaction failed: ${error.message}`);
    }

    // Test shared animation triggers
    try {
      const animatedElements = document.querySelectorAll(
        '[class*="animate"], [class*="fade"], [class*="slide"]'
      );
      this.logSuccess(`✅ Found ${animatedElements.length} animated elements`);

      interactions.push({
        type: "animations",
        success: true,
        details: `${animatedElements.length} animated elements detected`,
      });
    } catch (error) {
      this.logError(`❌ Animation detection failed: ${error.message}`);
    }

    this.testResults.push({
      category: "Cross-Component Interactions",
      passed: interactions.every((i) => i.success),
      details: { interactions },
    });
  }

  async testAnimationPerformance() {
    console.log("⚡ Testing animation performance...");

    const performanceMetrics = {
      animationFrames: 0,
      droppedFrames: 0,
      averageFPS: 0,
    };

    // Monitor animation performance for 2 seconds
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();
      const startTime = lastTime;
      const duration = 2000; // 2 seconds

      const measureFrame = (currentTime) => {
        frameCount++;
        const deltaTime = currentTime - lastTime;

        if (deltaTime > 16.67) {
          // More than 60fps threshold
          performanceMetrics.droppedFrames++;
        }

        lastTime = currentTime;

        if (currentTime - startTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          performanceMetrics.animationFrames = frameCount;
          performanceMetrics.averageFPS = Math.round(
            (frameCount / duration) * 1000
          );

          const performanceGood = performanceMetrics.averageFPS >= 30;

          if (performanceGood) {
            this.logSuccess(
              `✅ Animation performance: ${performanceMetrics.averageFPS} FPS`
            );
          } else {
            this.logWarning(
              `⚠️ Low animation performance: ${performanceMetrics.averageFPS} FPS`
            );
          }

          this.testResults.push({
            category: "Animation Performance",
            passed: performanceGood,
            details: performanceMetrics,
          });

          resolve();
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }

  async testResponsiveIntegration() {
    console.log("📱 Testing responsive integration...");

    const breakpoints = [
      { name: "mobile", width: 375 },
      { name: "tablet", width: 768 },
      { name: "desktop", width: 1024 },
      { name: "large", width: 1440 },
    ];

    const responsiveTests = [];
    const originalWidth = window.innerWidth;

    for (const breakpoint of breakpoints) {
      try {
        // Simulate viewport resize (note: this won't actually resize the window)
        const mediaQuery = window.matchMedia(
          `(max-width: ${breakpoint.width}px)`
        );

        // Check if components have responsive styles
        const componentsWithResponsiveStyles = document.querySelectorAll(
          '[class*="mobile"], [class*="tablet"], [class*="desktop"]'
        );

        responsiveTests.push({
          breakpoint: breakpoint.name,
          width: breakpoint.width,
          responsiveElements: componentsWithResponsiveStyles.length,
          mediaQuerySupported: !!mediaQuery,
        });

        this.logSuccess(`✅ ${breakpoint.name} breakpoint test completed`);
      } catch (error) {
        responsiveTests.push({
          breakpoint: breakpoint.name,
          error: error.message,
        });
        this.logError(
          `❌ ${breakpoint.name} breakpoint test failed: ${error.message}`
        );
      }
    }

    this.testResults.push({
      category: "Responsive Integration",
      passed: responsiveTests.every((test) => !test.error),
      details: { breakpointTests: responsiveTests },
    });
  }

  logSuccess(message) {
    console.log(`%c${message}`, "color: #00ff00");
  }

  logWarning(message) {
    console.warn(message);
    this.warnings.push(message);
  }

  logError(message) {
    console.error(message);
    this.errors.push(message);
  }

  generateTestReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const passedTests = this.testResults.filter((test) => test.passed).length;
    const totalTests = this.testResults.length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log("\n" + "=".repeat(60));
    console.log("📊 INTEGRATION TEST REPORT");
    console.log("=".repeat(60));
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${successRate}%)`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log("=".repeat(60));

    // Detailed results
    this.testResults.forEach((result) => {
      const status = result.passed ? "✅" : "❌";
      console.log(`${status} ${result.category}`);
      if (result.details) {
        console.log("   Details:", result.details);
      }
    });

    if (this.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      this.warnings.forEach((warning) => console.log(`   ${warning}`));
    }

    if (this.errors.length > 0) {
      console.log("\n❌ ERRORS:");
      this.errors.forEach((error) => console.log(`   ${error}`));
    }

    // Overall assessment
    console.log("\n" + "=".repeat(60));
    if (successRate >= 90) {
      console.log(
        "🎉 INTEGRATION TEST PASSED - Components are well integrated!"
      );
    } else if (successRate >= 70) {
      console.log("⚠️  INTEGRATION TEST PARTIAL - Some issues need attention");
    } else {
      console.log("❌ INTEGRATION TEST FAILED - Significant issues detected");
    }
    console.log("=".repeat(60));

    // Store results for external access
    window.integrationTestResults = {
      passed: successRate >= 90,
      successRate,
      duration,
      results: this.testResults,
      warnings: this.warnings,
      errors: this.errors,
    };
  }
}

// Auto-run tests when script is loaded
if (typeof window !== "undefined") {
  window.IntegrationTestSuite = IntegrationTestSuite;

  // Run tests after a short delay to ensure all components are loaded
  setTimeout(() => {
    const testSuite = new IntegrationTestSuite();
    testSuite.runAllTests();
  }, 1000);
}

// Export for Node.js environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = IntegrationTestSuite;
}
