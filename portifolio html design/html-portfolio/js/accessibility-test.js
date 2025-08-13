/* ==========================================================================
   ACCESSIBILITY TESTING UTILITIES
   Client-side accessibility validation and testing
   ========================================================================== */

(function () {
  "use strict";

  // ==========================================================================
  // ACCESSIBILITY TESTING FUNCTIONS
  // ==========================================================================

  /**
   * Test heading hierarchy
   */
  function testHeadingHierarchy() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const issues = [];
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (index === 0 && level !== 1) {
        issues.push(
          `First heading should be h1, found ${heading.tagName.toLowerCase()}`
        );
      }

      if (level > previousLevel + 1) {
        issues.push(
          `Heading level skipped: ${heading.tagName.toLowerCase()} follows h${previousLevel}`
        );
      }

      previousLevel = level;
    });

    return {
      test: "Heading Hierarchy",
      passed: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Test for missing alt text on images
   */
  function testImageAltText() {
    const images = document.querySelectorAll("img");
    const issues = [];

    images.forEach((img, index) => {
      if (!img.hasAttribute("alt")) {
        issues.push(`Image ${index + 1} missing alt attribute`);
      }
    });

    return {
      test: "Image Alt Text",
      passed: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Test form labels
   */
  function testFormLabels() {
    const inputs = document.querySelectorAll("input, textarea, select");
    const issues = [];

    inputs.forEach((input, index) => {
      if (input.type === "hidden") return;

      const hasLabel = input.labels && input.labels.length > 0;
      const hasAriaLabel = input.hasAttribute("aria-label");
      const hasAriaLabelledBy = input.hasAttribute("aria-labelledby");

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push(
          `Form control ${index + 1} (${input.tagName.toLowerCase()}) has no accessible label`
        );
      }
    });

    return {
      test: "Form Labels",
      passed: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Test color contrast (basic check)
   */
  function testColorContrast() {
    const issues = [];

    // This is a simplified test - in production, you'd use a proper contrast checking library
    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, a, button, span"
    );

    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Basic check for transparent backgrounds or very light text
      if (
        color === "rgba(0, 0, 0, 0)" ||
        backgroundColor === "rgba(0, 0, 0, 0)"
      ) {
        // Skip elements with transparent colors as they inherit from parent
        return;
      }

      // This is a very basic check - proper contrast testing requires more sophisticated algorithms
      if (
        color === "rgb(128, 128, 128)" &&
        backgroundColor === "rgb(255, 255, 255)"
      ) {
        issues.push(
          `Element ${index + 1} may have insufficient color contrast`
        );
      }
    });

    return {
      test: "Color Contrast (Basic)",
      passed: issues.length === 0,
      issues:
        issues.length > 0 ? issues : ["Manual contrast testing recommended"],
    };
  }

  /**
   * Test keyboard navigation
   */
  function testKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const issues = [];

    focusableElements.forEach((element, index) => {
      // Check if element is visible
      const styles = window.getComputedStyle(element);
      if (styles.display === "none" || styles.visibility === "hidden") {
        return;
      }

      // Check if element has proper focus styles
      element.focus();
      const focusStyles = window.getComputedStyle(element);

      if (
        focusStyles.outline === "none" &&
        !focusStyles.boxShadow.includes("rgb")
      ) {
        issues.push(
          `Element ${index + 1} (${element.tagName.toLowerCase()}) may not have visible focus indicator`
        );
      }
    });

    return {
      test: "Keyboard Navigation",
      passed: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Test ARIA attributes
   */
  function testAriaAttributes() {
    const issues = [];

    // Test for proper ARIA roles
    const elementsWithRoles = document.querySelectorAll("[role]");
    elementsWithRoles.forEach((element, index) => {
      const role = element.getAttribute("role");
      const validRoles = [
        "banner",
        "navigation",
        "main",
        "contentinfo",
        "complementary",
        "region",
        "article",
        "section",
        "search",
        "form",
        "button",
        "link",
        "menubar",
        "menu",
        "menuitem",
        "listbox",
        "option",
        "tab",
        "tabpanel",
      ];

      if (!validRoles.includes(role)) {
        issues.push(`Element ${index + 1} has invalid ARIA role: ${role}`);
      }
    });

    // Test for aria-hidden on decorative elements
    const decorativeElements = document.querySelectorAll(
      ".hero__shape, .typewriter-cursor"
    );
    decorativeElements.forEach((element, index) => {
      if (!element.hasAttribute("aria-hidden")) {
        issues.push(
          `Decorative element ${index + 1} should have aria-hidden="true"`
        );
      }
    });

    return {
      test: "ARIA Attributes",
      passed: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Test landmark structure
   */
  function testLandmarks() {
    const issues = [];

    // Check for required landmarks
    const requiredLandmarks = ["banner", "main", "contentinfo"];
    requiredLandmarks.forEach((landmark) => {
      const elements = document.querySelectorAll(
        `[role="${landmark}"], ${landmark}`
      );
      if (elements.length === 0) {
        issues.push(`Missing ${landmark} landmark`);
      } else if (elements.length > 1) {
        issues.push(`Multiple ${landmark} landmarks found - should be unique`);
      }
    });

    return {
      test: "Landmark Structure",
      passed: issues.length === 0,
      issues: issues,
    };
  }

  /**
   * Run all accessibility tests
   */
  function runAccessibilityTests() {
    const tests = [
      testHeadingHierarchy(),
      testImageAltText(),
      testFormLabels(),
      testColorContrast(),
      testKeyboardNavigation(),
      testAriaAttributes(),
      testLandmarks(),
    ];

    console.group("🔍 Accessibility Test Results");

    let totalPassed = 0;
    let totalTests = tests.length;

    tests.forEach((test) => {
      if (test.passed) {
        console.log(`✅ ${test.test}: PASSED`);
        totalPassed++;
      } else {
        console.group(`❌ ${test.test}: FAILED`);
        test.issues.forEach((issue) => {
          console.warn(`  • ${issue}`);
        });
        console.groupEnd();
      }
    });

    console.log(`\n📊 Summary: ${totalPassed}/${totalTests} tests passed`);
    console.groupEnd();

    return {
      totalTests,
      totalPassed,
      tests,
    };
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  // Run tests when page is loaded (only in development)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(runAccessibilityTests, 1000);
    });
  }

  // Expose testing function globally for manual testing
  window.runAccessibilityTests = runAccessibilityTests;
})();
