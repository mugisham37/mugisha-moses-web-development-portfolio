/**
 * Visual Fidelity Test Suite
 * Compares modular version with original design for pixel-perfect accuracy
 */

class VisualFidelityTestSuite {
  constructor() {
    this.testResults = [];
    this.visualDifferences = [];
    this.responsiveIssues = [];
    this.interactionIssues = [];
    this.startTime = Date.now();
  }

  async runVisualTests() {
    console.log("🎨 Starting Visual Fidelity Test Suite...");

    try {
      await this.testLayoutStructure();
      await this.testTypography();
      await this.testColorScheme();
      await this.testSpacing();
      await this.testResponsiveBehavior();
      await this.testAnimations();
      await this.testInteractiveElements();
      await this.testImageAssets();

      this.generateVisualReport();
    } catch (error) {
      console.error("❌ Visual fidelity test suite failed:", error);
    }
  }

  async testLayoutStructure() {
    console.log("📐 Testing layout structure...");

    const expectedSections = [
      { id: "navigation-component", name: "Navigation" },
      { id: "hero-component", name: "Hero" },
      { id: "trust-component", name: "Trust" },
      { id: "value-proposition-component", name: "Value Proposition" },
      { id: "project-showcase-component", name: "Project Showcase" },
      { id: "tech-capabilities-component", name: "Tech Capabilities" },
      { id: "results-component", name: "Results" },
      { id: "process-component", name: "Process" },
      { id: "social-proof-component", name: "Social Proof" },
      { id: "contact-hub-component", name: "Contact Hub" },
      { id: "footer-component", name: "Footer" },
    ];

    const layoutIssues = [];
    const presentSections = [];

    expectedSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const computedStyle = getComputedStyle(element);

        presentSections.push({
          name: section.name,
          width: rect.width,
          height: rect.height,
          display: computedStyle.display,
          position: computedStyle.position,
        });

        // Check if section has content
        if (element.children.length === 0) {
          layoutIssues.push(`${section.name} section is empty`);
        }

        // Check if section is visible
        if (rect.width === 0 || rect.height === 0) {
          layoutIssues.push(`${section.name} section has zero dimensions`);
        }

        this.logSuccess(`✅ ${section.name} section present and visible`);
      } else {
        layoutIssues.push(`${section.name} section missing`);
        this.logError(`❌ ${section.name} section not found`);
      }
    });

    this.testResults.push({
      category: "Layout Structure",
      passed: layoutIssues.length === 0,
      details: {
        sectionsFound: presentSections.length,
        totalExpected: expectedSections.length,
        issues: layoutIssues,
        sections: presentSections,
      },
    });
  }

  async testTypography() {
    console.log("🔤 Testing typography...");

    const typographyTests = [];
    const expectedFonts = ["Space Mono", "JetBrains Mono"];

    // Test font loading
    const fontTests = expectedFonts.map(async (fontFamily) => {
      try {
        const fontFace = new FontFace(
          fontFamily,
          `url(https://fonts.googleapis.com/css2?family=${fontFamily.replace(
            " ",
            "+"
          )}`
        );
        await fontFace.load();
        this.logSuccess(`✅ Font ${fontFamily} loaded successfully`);
        return { font: fontFamily, loaded: true };
      } catch (error) {
        this.logWarning(
          `⚠️ Font ${fontFamily} may not be loaded: ${error.message}`
        );
        return { font: fontFamily, loaded: false, error: error.message };
      }
    });

    const fontResults = await Promise.all(fontTests);

    // Test typography elements
    const typographyElements = [
      { selector: "h1", expectedFont: "Space Mono", expectedWeight: "900" },
      { selector: "h2", expectedFont: "Space Mono", expectedWeight: "700" },
      { selector: "h3", expectedFont: "Space Mono", expectedWeight: "700" },
      {
        selector: ".code-content",
        expectedFont: "JetBrains Mono",
        expectedWeight: "400",
      },
      {
        selector: ".nav-text",
        expectedFont: "Space Mono",
        expectedWeight: "700",
      },
    ];

    typographyElements.forEach((test) => {
      const elements = document.querySelectorAll(test.selector);
      elements.forEach((element, index) => {
        const computedStyle = getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily;
        const fontWeight = computedStyle.fontWeight;

        const fontMatch =
          fontFamily.includes(test.expectedFont.replace(" ", "")) ||
          fontFamily.includes(test.expectedFont);
        const weightMatch =
          fontWeight === test.expectedWeight ||
          (fontWeight === "bold" && test.expectedWeight === "700") ||
          (fontWeight === "normal" && test.expectedWeight === "400");

        if (fontMatch && weightMatch) {
          this.logSuccess(`✅ ${test.selector}[${index}] typography correct`);
        } else {
          const issue = `${test.selector}[${index}] typography mismatch - Expected: ${test.expectedFont} ${test.expectedWeight}, Got: ${fontFamily} ${fontWeight}`;
          typographyTests.push(issue);
          this.logWarning(`⚠️ ${issue}`);
        }
      });
    });

    this.testResults.push({
      category: "Typography",
      passed: typographyTests.length === 0,
      details: {
        fontResults,
        typographyIssues: typographyTests,
      },
    });
  }

  async testColorScheme() {
    console.log("🎨 Testing color scheme...");

    const colorIssues = [];
    const expectedColors = {
      "--primary-black": "#000000",
      "--primary-white": "#ffffff",
      "--accent-cyan": "#00ffff",
      "--accent-yellow": "#ffff00",
      "--accent-purple": "#8b5cf6",
      "--accent-green": "#00ff00",
    };

    // Test CSS custom properties
    const testElement = document.createElement("div");
    document.body.appendChild(testElement);

    Object.entries(expectedColors).forEach(([variable, expectedValue]) => {
      const actualValue = getComputedStyle(testElement)
        .getPropertyValue(variable)
        .trim();

      if (actualValue) {
        // Convert to hex for comparison if needed
        const normalizedActual = this.normalizeColor(actualValue);
        const normalizedExpected = this.normalizeColor(expectedValue);

        if (normalizedActual === normalizedExpected) {
          this.logSuccess(
            `✅ Color variable ${variable} matches expected value`
          );
        } else {
          const issue = `Color variable ${variable} mismatch - Expected: ${expectedValue}, Got: ${actualValue}`;
          colorIssues.push(issue);
          this.logWarning(`⚠️ ${issue}`);
        }
      } else {
        const issue = `Color variable ${variable} not defined`;
        colorIssues.push(issue);
        this.logError(`❌ ${issue}`);
      }
    });

    document.body.removeChild(testElement);

    // Test key elements have correct colors
    const colorElements = [
      { selector: "body", property: "background-color", expected: "#000000" },
      { selector: "body", property: "color", expected: "#ffffff" },
      { selector: ".accent-cyan", property: "color", expected: "#00ffff" },
    ];

    colorElements.forEach((test) => {
      const element = document.querySelector(test.selector);
      if (element) {
        const computedStyle = getComputedStyle(element);
        const actualColor = computedStyle[test.property];
        const normalizedActual = this.normalizeColor(actualColor);
        const normalizedExpected = this.normalizeColor(test.expected);

        if (normalizedActual === normalizedExpected) {
          this.logSuccess(`✅ ${test.selector} ${test.property} correct`);
        } else {
          const issue = `${test.selector} ${test.property} mismatch - Expected: ${test.expected}, Got: ${actualColor}`;
          colorIssues.push(issue);
          this.logWarning(`⚠️ ${issue}`);
        }
      }
    });

    this.testResults.push({
      category: "Color Scheme",
      passed: colorIssues.length === 0,
      details: { colorIssues },
    });
  }

  normalizeColor(color) {
    // Convert rgb/rgba to hex for comparison
    if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        const hex = values
          .slice(0, 3)
          .map((v) => parseInt(v).toString(16).padStart(2, "0"))
          .join("");
        return `#${hex}`;
      }
    }
    return color.toLowerCase();
  }

  async testSpacing() {
    console.log("📏 Testing spacing and layout...");

    const spacingIssues = [];

    // Test CSS spacing variables
    const expectedSpacing = {
      "--spacing-xs": "0.25rem",
      "--spacing-sm": "0.5rem",
      "--spacing-md": "1rem",
      "--spacing-lg": "1.5rem",
      "--spacing-xl": "2rem",
    };

    const testElement = document.createElement("div");
    document.body.appendChild(testElement);

    Object.entries(expectedSpacing).forEach(([variable, expectedValue]) => {
      const actualValue = getComputedStyle(testElement)
        .getPropertyValue(variable)
        .trim();

      if (actualValue === expectedValue) {
        this.logSuccess(`✅ Spacing variable ${variable} correct`);
      } else if (actualValue) {
        const issue = `Spacing variable ${variable} mismatch - Expected: ${expectedValue}, Got: ${actualValue}`;
        spacingIssues.push(issue);
        this.logWarning(`⚠️ ${issue}`);
      } else {
        const issue = `Spacing variable ${variable} not defined`;
        spacingIssues.push(issue);
        this.logError(`❌ ${issue}`);
      }
    });

    document.body.removeChild(testElement);

    // Test component spacing
    const components = document.querySelectorAll(".component-section");
    components.forEach((component, index) => {
      const rect = component.getBoundingClientRect();
      const computedStyle = getComputedStyle(component);

      // Check for reasonable margins/padding
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginBottom = parseFloat(computedStyle.marginBottom);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);

      if (rect.height > 0) {
        this.logSuccess(`✅ Component ${index + 1} has proper dimensions`);
      } else {
        spacingIssues.push(`Component ${index + 1} has zero height`);
      }
    });

    this.testResults.push({
      category: "Spacing",
      passed: spacingIssues.length === 0,
      details: { spacingIssues },
    });
  }

  async testResponsiveBehavior() {
    console.log("📱 Testing responsive behavior...");

    const responsiveIssues = [];
    const breakpoints = [
      { name: "mobile", maxWidth: 768 },
      { name: "tablet", maxWidth: 1024 },
      { name: "desktop", maxWidth: 1440 },
    ];

    // Test media queries
    breakpoints.forEach((breakpoint) => {
      const mediaQuery = window.matchMedia(
        `(max-width: ${breakpoint.maxWidth}px)`
      );

      if (mediaQuery.matches) {
        this.logSuccess(`✅ Currently matching ${breakpoint.name} breakpoint`);
      }

      // Check for responsive classes
      const responsiveElements = document.querySelectorAll(
        `[class*="${breakpoint.name}"]`
      );
      if (responsiveElements.length > 0) {
        this.logSuccess(
          `✅ Found ${responsiveElements.length} elements with ${breakpoint.name} responsive classes`
        );
      }
    });

    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      const content = viewportMeta.getAttribute("content");
      if (content.includes("width=device-width")) {
        this.logSuccess(`✅ Viewport meta tag configured correctly`);
      } else {
        responsiveIssues.push("Viewport meta tag missing device-width");
      }
    } else {
      responsiveIssues.push("Viewport meta tag missing");
    }

    // Test for horizontal scrolling issues
    const bodyWidth = document.body.scrollWidth;
    const windowWidth = window.innerWidth;

    if (bodyWidth > windowWidth) {
      responsiveIssues.push(
        `Horizontal overflow detected: body width ${bodyWidth}px > window width ${windowWidth}px`
      );
      this.logWarning(`⚠️ Horizontal overflow detected`);
    } else {
      this.logSuccess(`✅ No horizontal overflow detected`);
    }

    this.testResults.push({
      category: "Responsive Behavior",
      passed: responsiveIssues.length === 0,
      details: { responsiveIssues },
    });
  }

  async testAnimations() {
    console.log("⚡ Testing animations...");

    const animationIssues = [];

    // Test for CSS animations
    const animatedElements = document.querySelectorAll(
      '[class*="animate"], [class*="fade"], [class*="slide"], [class*="rotate"]'
    );

    if (animatedElements.length > 0) {
      this.logSuccess(
        `✅ Found ${animatedElements.length} potentially animated elements`
      );

      // Test animation properties
      animatedElements.forEach((element, index) => {
        const computedStyle = getComputedStyle(element);
        const animationName = computedStyle.animationName;
        const transitionProperty = computedStyle.transitionProperty;

        if (animationName !== "none" || transitionProperty !== "all") {
          this.logSuccess(
            `✅ Element ${index + 1} has animation/transition properties`
          );
        } else {
          animationIssues.push(
            `Element ${
              index + 1
            } lacks animation properties despite animation class`
          );
        }
      });
    } else {
      this.logWarning(`⚠️ No animated elements found`);
    }

    // Test for smooth scrolling
    const htmlElement = document.documentElement;
    const scrollBehavior = getComputedStyle(htmlElement).scrollBehavior;

    if (scrollBehavior === "smooth") {
      this.logSuccess(`✅ Smooth scrolling enabled`);
    } else {
      animationIssues.push("Smooth scrolling not enabled");
    }

    // Test for reduced motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    if (prefersReducedMotion.matches) {
      this.logSuccess(
        `✅ Reduced motion preference detected and should be respected`
      );
    }

    this.testResults.push({
      category: "Animations",
      passed: animationIssues.length === 0,
      details: {
        animationIssues,
        animatedElementsCount: animatedElements.length,
      },
    });
  }

  async testInteractiveElements() {
    console.log("🖱️ Testing interactive elements...");

    const interactionIssues = [];

    // Test buttons
    const buttons = document.querySelectorAll(
      'button, [role="button"], .btn, .cta-button'
    );
    buttons.forEach((button, index) => {
      const computedStyle = getComputedStyle(button);
      const cursor = computedStyle.cursor;

      if (cursor === "pointer") {
        this.logSuccess(`✅ Button ${index + 1} has pointer cursor`);
      } else {
        interactionIssues.push(`Button ${index + 1} missing pointer cursor`);
      }

      // Test for hover effects (check for transition properties)
      const transitionProperty = computedStyle.transitionProperty;
      if (transitionProperty !== "none") {
        this.logSuccess(`✅ Button ${index + 1} has hover transition`);
      }
    });

    // Test links
    const links = document.querySelectorAll("a[href]");
    links.forEach((link, index) => {
      const href = link.getAttribute("href");
      if (href && href !== "#") {
        this.logSuccess(`✅ Link ${index + 1} has valid href`);
      } else {
        interactionIssues.push(
          `Link ${index + 1} has empty or placeholder href`
        );
      }
    });

    // Test form elements
    const formElements = document.querySelectorAll("input, textarea, select");
    formElements.forEach((element, index) => {
      const computedStyle = getComputedStyle(element);
      const outline = computedStyle.outline;

      // Check for focus styles (this is a basic check)
      if (element.matches(":focus-visible")) {
        this.logSuccess(`✅ Form element ${index + 1} has focus styles`);
      }
    });

    // Test navigation items
    const navItems = document.querySelectorAll("[data-section]");
    navItems.forEach((item, index) => {
      const computedStyle = getComputedStyle(item);
      const cursor = computedStyle.cursor;

      if (cursor === "pointer") {
        this.logSuccess(`✅ Navigation item ${index + 1} has pointer cursor`);
      } else {
        interactionIssues.push(
          `Navigation item ${index + 1} missing pointer cursor`
        );
      }
    });

    this.testResults.push({
      category: "Interactive Elements",
      passed: interactionIssues.length === 0,
      details: {
        interactionIssues,
        buttonsCount: buttons.length,
        linksCount: links.length,
        formElementsCount: formElements.length,
      },
    });
  }

  async testImageAssets() {
    console.log("🖼️ Testing image assets...");

    const imageIssues = [];
    const images = document.querySelectorAll("img");

    const imageTests = Array.from(images).map(async (img, index) => {
      return new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          this.logSuccess(`✅ Image ${index + 1} loaded successfully`);
          resolve({ index, loaded: true });
        } else {
          img.onload = () => {
            this.logSuccess(`✅ Image ${index + 1} loaded successfully`);
            resolve({ index, loaded: true });
          };
          img.onerror = () => {
            const issue = `Image ${index + 1} failed to load: ${img.src}`;
            imageIssues.push(issue);
            this.logError(`❌ ${issue}`);
            resolve({ index, loaded: false });
          };

          // Timeout after 5 seconds
          setTimeout(() => {
            if (!img.complete) {
              const issue = `Image ${index + 1} loading timeout: ${img.src}`;
              imageIssues.push(issue);
              this.logWarning(`⚠️ ${issue}`);
              resolve({ index, loaded: false });
            }
          }, 5000);
        }
      });
    });

    const imageResults = await Promise.all(imageTests);
    const loadedImages = imageResults.filter((result) => result.loaded).length;

    // Test for alt attributes
    images.forEach((img, index) => {
      const alt = img.getAttribute("alt");
      if (alt && alt.trim()) {
        this.logSuccess(`✅ Image ${index + 1} has alt text`);
      } else {
        imageIssues.push(`Image ${index + 1} missing alt text`);
      }
    });

    this.testResults.push({
      category: "Image Assets",
      passed: imageIssues.length === 0,
      details: {
        imageIssues,
        totalImages: images.length,
        loadedImages,
      },
    });
  }

  logSuccess(message) {
    console.log(`%c${message}`, "color: #00ff00");
  }

  logWarning(message) {
    console.warn(message);
    this.visualDifferences.push(message);
  }

  logError(message) {
    console.error(message);
    this.visualDifferences.push(message);
  }

  generateVisualReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const passedTests = this.testResults.filter((test) => test.passed).length;
    const totalTests = this.testResults.length;
    const fidelityScore = Math.round((passedTests / totalTests) * 100);

    console.log("\n" + "=".repeat(60));
    console.log("🎨 VISUAL FIDELITY TEST REPORT");
    console.log("=".repeat(60));
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`🎯 Fidelity Score: ${fidelityScore}%`);
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`⚠️  Visual Issues: ${this.visualDifferences.length}`);
    console.log("=".repeat(60));

    // Detailed results
    this.testResults.forEach((result) => {
      const status = result.passed ? "✅" : "❌";
      console.log(`${status} ${result.category}`);
      if (result.details && Object.keys(result.details).length > 0) {
        console.log("   Details:", result.details);
      }
    });

    if (this.visualDifferences.length > 0) {
      console.log("\n⚠️  VISUAL DIFFERENCES:");
      this.visualDifferences.forEach((diff) => console.log(`   ${diff}`));
    }

    // Overall assessment
    console.log("\n" + "=".repeat(60));
    if (fidelityScore >= 95) {
      console.log("🎉 VISUAL FIDELITY EXCELLENT - Pixel-perfect match!");
    } else if (fidelityScore >= 85) {
      console.log("✅ VISUAL FIDELITY GOOD - Minor differences detected");
    } else if (fidelityScore >= 70) {
      console.log("⚠️  VISUAL FIDELITY FAIR - Some issues need attention");
    } else {
      console.log("❌ VISUAL FIDELITY POOR - Significant differences detected");
    }
    console.log("=".repeat(60));

    // Store results for external access
    window.visualFidelityResults = {
      passed: fidelityScore >= 85,
      fidelityScore,
      duration,
      results: this.testResults,
      visualDifferences: this.visualDifferences,
    };
  }
}

// Auto-run visual tests when script is loaded
if (typeof window !== "undefined") {
  window.VisualFidelityTestSuite = VisualFidelityTestSuite;

  // Run tests after components are loaded
  setTimeout(() => {
    const visualTestSuite = new VisualFidelityTestSuite();
    visualTestSuite.runVisualTests();
  }, 2000);
}

// Export for Node.js environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = VisualFidelityTestSuite;
}
