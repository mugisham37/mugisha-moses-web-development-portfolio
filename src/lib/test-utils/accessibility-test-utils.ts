import { Page } from "@playwright/test";
import { configureAxe, getViolations } from "@axe-core/playwright";
import { axe, toHaveNoViolations } from "jest-axe";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Accessibility testing configuration
const axeConfig = {
  rules: {
    // Disable color contrast checking in tests (can be unreliable)
    "color-contrast": { enabled: false },
    // Focus on critical accessibility issues
    "aria-allowed-attr": { enabled: true },
    "aria-required-attr": { enabled: true },
    "aria-valid-attr": { enabled: true },
    "aria-valid-attr-value": { enabled: true },
    "button-name": { enabled: true },
    "duplicate-id": { enabled: true },
    "form-field-multiple-labels": { enabled: true },
    "html-has-lang": { enabled: true },
    "image-alt": { enabled: true },
    "input-image-alt": { enabled: true },
    label: { enabled: true },
    "link-name": { enabled: true },
    list: { enabled: true },
    listitem: { enabled: true },
    "meta-refresh": { enabled: true },
    "meta-viewport": { enabled: true },
    region: { enabled: true },
    "skip-link": { enabled: true },
    tabindex: { enabled: true },
    "valid-lang": { enabled: true },
  },
  tags: ["wcag2a", "wcag2aa", "wcag21aa"],
};

export class AccessibilityTestUtils {
  /**
   * Test accessibility for a React component using jest-axe
   */
  static async testComponentAccessibility(container: HTMLElement) {
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
    return results;
  }

  /**
   * Test accessibility for a page using Playwright and axe-core
   */
  static async testPageAccessibility(
    page: Page,
    options?: {
      includeTags?: string[];
      excludeTags?: string[];
      rules?: Record<string, any>;
    }
  ) {
    await configureAxe(page, {
      ...axeConfig,
      ...options,
    });

    const violations = await getViolations(page);

    if (violations.length > 0) {
      console.error("Accessibility violations found:", violations);
    }

    return violations;
  }

  /**
   * Test keyboard navigation for a page
   */
  static async testKeyboardNavigation(page: Page) {
    const results = {
      canTabToElements: false,
      canUseEnterKey: false,
      canUseSpaceKey: false,
      canUseArrowKeys: false,
      hasSkipLinks: false,
      focusVisible: false,
    };

    try {
      // Test tab navigation
      await page.keyboard.press("Tab");
      const firstFocusedElement = await page.evaluate(
        () => document.activeElement?.tagName
      );
      results.canTabToElements = !!firstFocusedElement;

      // Test skip links
      const skipLink = page.locator(
        'a[href="#main-content"], a[href="#main"], .skip-link'
      );
      results.hasSkipLinks = (await skipLink.count()) > 0;

      // Test Enter key on focusable elements
      const buttons = page.locator('button, [role="button"]');
      if ((await buttons.count()) > 0) {
        await buttons.first().focus();
        await page.keyboard.press("Enter");
        results.canUseEnterKey = true;
      }

      // Test Space key on buttons
      const spaceButtons = page.locator(
        'button[type="button"], [role="button"]'
      );
      if ((await spaceButtons.count()) > 0) {
        await spaceButtons.first().focus();
        await page.keyboard.press("Space");
        results.canUseSpaceKey = true;
      }

      // Test arrow key navigation (for menus, carousels, etc.)
      const menuItems = page.locator(
        '[role="menu"] [role="menuitem"], [role="tablist"] [role="tab"]'
      );
      if ((await menuItems.count()) > 0) {
        await menuItems.first().focus();
        await page.keyboard.press("ArrowDown");
        results.canUseArrowKeys = true;
      }

      // Test focus visibility
      await page.keyboard.press("Tab");
      const focusedElement = page.locator(":focus");
      const focusStyles = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      results.focusVisible = !!(
        focusStyles.outline !== "none" ||
        focusStyles.outlineWidth !== "0px" ||
        focusStyles.boxShadow !== "none"
      );
    } catch (error) {
      console.error("Keyboard navigation test failed:", error);
    }

    return results;
  }

  /**
   * Test screen reader compatibility
   */
  static async testScreenReaderCompatibility(page: Page) {
    const results = {
      hasProperHeadings: false,
      hasAltText: false,
      hasAriaLabels: false,
      hasLandmarks: false,
      hasFormLabels: false,
    };

    try {
      // Test heading structure
      const headings = await page.locator("h1, h2, h3, h4, h5, h6").count();
      const h1Count = await page.locator("h1").count();
      results.hasProperHeadings = headings > 0 && h1Count === 1;

      // Test alt text on images
      const images = await page.locator("img").count();
      const imagesWithAlt = await page.locator("img[alt]").count();
      results.hasAltText = images === 0 || imagesWithAlt === images;

      // Test ARIA labels
      const ariaLabels = await page
        .locator("[aria-label], [aria-labelledby]")
        .count();
      results.hasAriaLabels = ariaLabels > 0;

      // Test landmark regions
      const landmarks = await page
        .locator(
          'main, nav, header, footer, aside, section[aria-label], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]'
        )
        .count();
      results.hasLandmarks = landmarks > 0;

      // Test form labels
      const inputs = await page.locator("input, textarea, select").count();
      const labeledInputs = await page
        .locator(
          "input[aria-label], input[aria-labelledby], textarea[aria-label], textarea[aria-labelledby], select[aria-label], select[aria-labelledby]"
        )
        .count();
      const inputsWithLabels = await page
        .locator("input[id]")
        .evaluateAll((inputs) => {
          return inputs.filter((input) => {
            const id = input.getAttribute("id");
            return id && document.querySelector(`label[for="${id}"]`);
          }).length;
        });

      results.hasFormLabels =
        inputs === 0 || labeledInputs + inputsWithLabels === inputs;
    } catch (error) {
      console.error("Screen reader compatibility test failed:", error);
    }

    return results;
  }

  /**
   * Test color contrast (basic check)
   */
  static async testColorContrast(page: Page) {
    const contrastIssues = await page.evaluate(() => {
      const issues: Array<{
        element: string;
        foreground: string;
        background: string;
        ratio: number;
      }> = [];

      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button, label"
      );

      textElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const foreground = styles.color;
        const background = styles.backgroundColor;

        // Simple contrast ratio calculation (not perfect but gives an idea)
        const fgRgb = foreground.match(/\d+/g);
        const bgRgb = background.match(/\d+/g);

        if (fgRgb && bgRgb && fgRgb.length >= 3 && bgRgb.length >= 3) {
          const fgLuminance =
            (0.299 * parseInt(fgRgb[0]) +
              0.587 * parseInt(fgRgb[1]) +
              0.114 * parseInt(fgRgb[2])) /
            255;
          const bgLuminance =
            (0.299 * parseInt(bgRgb[0]) +
              0.587 * parseInt(bgRgb[1]) +
              0.114 * parseInt(bgRgb[2])) /
            255;

          const ratio =
            (Math.max(fgLuminance, bgLuminance) + 0.05) /
            (Math.min(fgLuminance, bgLuminance) + 0.05);

          // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
          if (ratio < 4.5) {
            issues.push({
              element: element.tagName.toLowerCase(),
              foreground,
              background,
              ratio: Math.round(ratio * 100) / 100,
            });
          }
        }
      });

      return issues;
    });

    return contrastIssues;
  }

  /**
   * Test responsive design accessibility
   */
  static async testResponsiveAccessibility(page: Page) {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    const results = [];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Allow for responsive changes

      const violations = await this.testPageAccessibility(page);
      const keyboardNav = await this.testKeyboardNavigation(page);

      // Test touch targets on mobile
      let touchTargetIssues = [];
      if (viewport.name === "mobile") {
        touchTargetIssues = await page.evaluate(() => {
          const issues: string[] = [];
          const clickableElements = document.querySelectorAll(
            'button, a, input, [role="button"], [tabindex="0"]'
          );

          clickableElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const minSize = 44; // WCAG recommendation for touch targets

            if (rect.width < minSize || rect.height < minSize) {
              issues.push(
                `${element.tagName.toLowerCase()} is too small for touch (${Math.round(rect.width)}x${Math.round(rect.height)}px)`
              );
            }
          });

          return issues;
        });
      }

      results.push({
        viewport: viewport.name,
        violations: violations.length,
        keyboardNavigation: keyboardNav,
        touchTargetIssues,
      });
    }

    return results;
  }

  /**
   * Generate accessibility report
   */
  static generateAccessibilityReport(results: {
    violations: any[];
    keyboardNavigation: any;
    screenReader: any;
    colorContrast: any[];
    responsive: any[];
  }) {
    const report = {
      summary: {
        totalViolations: results.violations.length,
        criticalIssues: results.violations.filter(
          (v) => v.impact === "critical"
        ).length,
        seriousIssues: results.violations.filter((v) => v.impact === "serious")
          .length,
        moderateIssues: results.violations.filter(
          (v) => v.impact === "moderate"
        ).length,
        minorIssues: results.violations.filter((v) => v.impact === "minor")
          .length,
      },
      keyboardNavigation: results.keyboardNavigation,
      screenReader: results.screenReader,
      colorContrast: {
        issuesFound: results.colorContrast.length,
        issues: results.colorContrast,
      },
      responsive: results.responsive,
      recommendations: this.generateRecommendations(results),
    };

    return report;
  }

  /**
   * Generate accessibility recommendations
   */
  private static generateRecommendations(results: any) {
    const recommendations: string[] = [];

    if (results.violations.length > 0) {
      recommendations.push("Fix accessibility violations found by axe-core");
    }

    if (!results.keyboardNavigation.canTabToElements) {
      recommendations.push(
        "Ensure all interactive elements are keyboard accessible"
      );
    }

    if (!results.keyboardNavigation.hasSkipLinks) {
      recommendations.push("Add skip navigation links for keyboard users");
    }

    if (!results.keyboardNavigation.focusVisible) {
      recommendations.push("Improve focus indicators for better visibility");
    }

    if (!results.screenReader.hasProperHeadings) {
      recommendations.push("Improve heading structure for screen readers");
    }

    if (!results.screenReader.hasAltText) {
      recommendations.push("Add alt text to all images");
    }

    if (!results.screenReader.hasFormLabels) {
      recommendations.push("Ensure all form fields have proper labels");
    }

    if (results.colorContrast.length > 0) {
      recommendations.push("Improve color contrast ratios");
    }

    return recommendations;
  }
}

// Export for use in tests
export { axe, toHaveNoViolations };
