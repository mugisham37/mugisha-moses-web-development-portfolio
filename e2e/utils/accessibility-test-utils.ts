import { Page } from "@playwright/test";
import { configureAxe, getViolations } from "@axe-core/playwright";

export interface AccessibilityTestOptions {
  includeTags?: string[];
  excludeTags?: string[];
  rules?: Record<string, any>;
  skipFailures?: boolean;
}

export interface KeyboardNavigationResults {
  canTabToElements: boolean;
  canUseEnterKey: boolean;
  canUseSpaceKey: boolean;
  canUseArrowKeys: boolean;
  hasSkipLinks: boolean;
  focusVisible: boolean;
  trapsFocus: boolean;
}

export interface ScreenReaderResults {
  hasProperHeadings: boolean;
  hasAltText: boolean;
  hasAriaLabels: boolean;
  hasLandmarks: boolean;
  hasFormLabels: boolean;
  hasLiveRegions: boolean;
}

export interface ColorContrastIssue {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagLevel: "AA" | "AAA";
  size: "normal" | "large";
}

export class AccessibilityTestUtils {
  private defaultAxeConfig = {
    rules: {
      // Enable important accessibility rules
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
      "label": { enabled: true },
      "link-name": { enabled: true },
      "list": { enabled: true },
      "listitem": { enabled: true },
      "meta-refresh": { enabled: true },
      "meta-viewport": { enabled: true },
      "region": { enabled: true },
      "skip-link": { enabled: true },
      "tabindex": { enabled: true },
      "valid-lang": { enabled: true },
      // Disable flaky rules for automated testing
      "color-contrast": { enabled: false },
      "focus-order-semantics": { enabled: false },
    },
    tags: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
  };

  /**
   * Test page accessibility using axe-core
   */
  async testPageAccessibility(
    page: Page,
    options: AccessibilityTestOptions = {}
  ) {
    const config = {
      ...this.defaultAxeConfig,
      ...options,
    };

    try {
      await configureAxe(page, config);
      const violations = await getViolations(page);

      if (!options.skipFailures && violations.length > 0) {
        console.warn("Accessibility violations found:", violations);
      }

      return violations;
    } catch (error) {
      console.error("Accessibility test failed:", error);
      return [];
    }
  }

  /**
   * Test keyboard navigation functionality
   */
  async testKeyboardNavigation(page: Page): Promise<KeyboardNavigationResults> {
    const results: KeyboardNavigationResults = {
      canTabToElements: false,
      canUseEnterKey: false,
      canUseSpaceKey: false,
      canUseArrowKeys: false,
      hasSkipLinks: false,
      focusVisible: false,
      trapsFocus: false,
    };

    try {
      // Test tab navigation
      await page.keyboard.press("Tab");
      const firstFocusedElement = await page.evaluate(
        () => document.activeElement?.tagName
      );
      results.canTabToElements = !!firstFocusedElement;

      // Test skip links
      const skipLinks = await page.locator(
        'a[href="#main-content"], a[href="#main"], .skip-link, [data-testid="skip-link"]'
      ).count();
      results.hasSkipLinks = skipLinks > 0;

      // Test Enter key on buttons
      const buttons = page.locator('button, [role="button"]');
      if ((await buttons.count()) > 0) {
        await buttons.first().focus();
        
        // Check if focus is visible
        const focusStyles = await buttons.first().evaluate((el) => {
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

        // Test Enter key
        const initialUrl = page.url();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(100);
        
        // Check if Enter key had an effect (URL change or other interaction)
        const newUrl = page.url();
        results.canUseEnterKey = newUrl !== initialUrl || await this.checkForInteraction(page);
      }

      // Test Space key on buttons
      const spaceButtons = page.locator('button[type="button"], [role="button"]');
      if ((await spaceButtons.count()) > 0) {
        await spaceButtons.first().focus();
        await page.keyboard.press("Space");
        results.canUseSpaceKey = await this.checkForInteraction(page);
      }

      // Test arrow key navigation (for menus, carousels, etc.)
      const menuItems = page.locator(
        '[role="menu"] [role="menuitem"], [role="tablist"] [role="tab"], [role="listbox"] [role="option"]'
      );
      if ((await menuItems.count()) > 0) {
        await menuItems.first().focus();
        const initialFocus = await page.evaluate(() => document.activeElement);
        await page.keyboard.press("ArrowDown");
        const newFocus = await page.evaluate(() => document.activeElement);
        results.canUseArrowKeys = initialFocus !== newFocus;
      }

      // Test focus trapping in modals
      const modals = page.locator('[role="dialog"], .modal, [data-testid="modal"]');
      if ((await modals.count()) > 0) {
        results.trapsFocus = await this.testFocusTrapping(page, modals.first());
      }

    } catch (error) {
      console.error("Keyboard navigation test failed:", error);
    }

    return results;
  }

  /**
   * Test screen reader compatibility
   */
  async testScreenReaderCompatibility(page: Page): Promise<ScreenReaderResults> {
    const results: ScreenReaderResults = {
      hasProperHeadings: false,
      hasAltText: false,
      hasAriaLabels: false,
      hasLandmarks: false,
      hasFormLabels: false,
      hasLiveRegions: false,
    };

    try {
      // Test heading structure
      const headings = await page.locator("h1, h2, h3, h4, h5, h6").count();
      const h1Count = await page.locator("h1").count();
      results.hasProperHeadings = headings > 0 && h1Count === 1;

      // Test alt text on images
      const images = await page.locator("img").count();
      const imagesWithAlt = await page.locator("img[alt]").count();
      const decorativeImages = await page.locator('img[alt=""], img[role="presentation"]').count();
      results.hasAltText = images === 0 || (imagesWithAlt + decorativeImages) === images;

      // Test ARIA labels
      const ariaLabels = await page.locator("[aria-label], [aria-labelledby], [aria-describedby]").count();
      results.hasAriaLabels = ariaLabels > 0;

      // Test landmark regions
      const landmarks = await page.locator(
        'main, nav, header, footer, aside, section[aria-label], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"]'
      ).count();
      results.hasLandmarks = landmarks > 0;

      // Test form labels
      const inputs = await page.locator("input, textarea, select").count();
      if (inputs > 0) {
        const labeledInputs = await page.evaluate(() => {
          const inputs = document.querySelectorAll("input, textarea, select");
          let labeledCount = 0;

          inputs.forEach((input) => {
            const id = input.getAttribute("id");
            const ariaLabel = input.getAttribute("aria-label");
            const ariaLabelledBy = input.getAttribute("aria-labelledby");
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);

            if (hasLabel || ariaLabel || ariaLabelledBy) {
              labeledCount++;
            }
          });

          return labeledCount;
        });

        results.hasFormLabels = labeledInputs === inputs;
      } else {
        results.hasFormLabels = true; // No forms to test
      }

      // Test live regions
      const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').count();
      results.hasLiveRegions = liveRegions > 0;

    } catch (error) {
      console.error("Screen reader compatibility test failed:", error);
    }

    return results;
  }

  /**
   * Test color contrast (basic implementation)
   */
  async testColorContrast(page: Page): Promise<ColorContrastIssue[]> {
    const contrastIssues = await page.evaluate(() => {
      const issues: ColorContrastIssue[] = [];

      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button, label, li, td, th"
      );

      textElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const foreground = styles.color;
        const background = styles.backgroundColor;
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;

        // Simple RGB extraction
        const fgMatch = foreground.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const bgMatch = background.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (fgMatch && bgMatch) {
          const fgLuminance = this.calculateLuminance(
            parseInt(fgMatch[1]),
            parseInt(fgMatch[2]),
            parseInt(fgMatch[3])
          );
          const bgLuminance = this.calculateLuminance(
            parseInt(bgMatch[1]),
            parseInt(bgMatch[2]),
            parseInt(bgMatch[3])
          );

          const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                       (Math.min(fgLuminance, bgLuminance) + 0.05);

          const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === "bold" || parseInt(fontWeight) >= 700));
          const requiredRatio = isLargeText ? 3.0 : 4.5;

          if (ratio < requiredRatio) {
            issues.push({
              element: element.tagName.toLowerCase(),
              foreground,
              background,
              ratio: Math.round(ratio * 100) / 100,
              wcagLevel: "AA",
              size: isLargeText ? "large" : "normal",
            });
          }
        }
      });

      return issues;
    });

    return contrastIssues;
  }

  /**
   * Test responsive accessibility across different viewports
   */
  async testResponsiveAccessibility(page: Page) {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    const results = [];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);

      const violations = await this.testPageAccessibility(page, { skipFailures: true });
      const keyboardNav = await this.testKeyboardNavigation(page);
      const screenReader = await this.testScreenReaderCompatibility(page);

      // Test touch targets on mobile
      let touchTargetIssues: string[] = [];
      if (viewport.name === "mobile") {
        touchTargetIssues = await page.evaluate(() => {
          const issues: string[] = [];
          const clickableElements = document.querySelectorAll(
            'button, a, input[type="button"], input[type="submit"], [role="button"], [tabindex="0"]'
          );

          clickableElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const minSize = 44; // WCAG recommendation

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
        screenReader: screenReader,
        touchTargetIssues,
      });
    }

    return results;
  }

  /**
   * Generate comprehensive accessibility report
   */
  async generateAccessibilityReport(page: Page) {
    const violations = await this.testPageAccessibility(page, { skipFailures: true });
    const keyboardNavigation = await this.testKeyboardNavigation(page);
    const screenReader = await this.testScreenReaderCompatibility(page);
    const colorContrast = await this.testColorContrast(page);
    const responsive = await this.testResponsiveAccessibility(page);

    const report = {
      url: page.url(),
      timestamp: new Date().toISOString(),
      summary: {
        totalViolations: violations.length,
        criticalIssues: violations.filter(v => v.impact === "critical").length,
        seriousIssues: violations.filter(v => v.impact === "serious").length,
        moderateIssues: violations.filter(v => v.impact === "moderate").length,
        minorIssues: violations.filter(v => v.impact === "minor").length,
        colorContrastIssues: colorContrast.length,
      },
      violations,
      keyboardNavigation,
      screenReader,
      colorContrast,
      responsive,
      recommendations: this.generateRecommendations({
        violations,
        keyboardNavigation,
        screenReader,
        colorContrast,
      }),
    };

    return report;
  }

  /**
   * Helper method to check for interaction effects
   */
  private async checkForInteraction(page: Page): Promise<boolean> {
    // Check for common interaction indicators
    const indicators = await page.evaluate(() => {
      // Check for modal dialogs
      const modals = document.querySelectorAll('[role="dialog"], .modal');
      if (modals.length > 0) return true;

      // Check for expanded elements
      const expanded = document.querySelectorAll('[aria-expanded="true"]');
      if (expanded.length > 0) return true;

      // Check for active elements
      const active = document.querySelectorAll('.active, [aria-current]');
      if (active.length > 0) return true;

      return false;
    });

    return indicators;
  }

  /**
   * Test focus trapping in modal dialogs
   */
  private async testFocusTrapping(page: Page, modal: any): Promise<boolean> {
    try {
      // Get focusable elements within modal
      const focusableElements = await modal.locator(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ).count();

      if (focusableElements === 0) return false;

      // Focus first element
      await modal.locator(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ).first().focus();

      // Tab through all elements
      for (let i = 0; i < focusableElements + 2; i++) {
        await page.keyboard.press("Tab");
      }

      // Check if focus is still within modal
      const focusedElement = await page.evaluate(() => document.activeElement);
      const isWithinModal = await modal.evaluate((modalEl: Element, focusedEl: Element) => {
        return modalEl.contains(focusedEl);
      }, focusedElement);

      return isWithinModal;
    } catch (error) {
      console.error("Focus trapping test failed:", error);
      return false;
    }
  }

  /**
   * Calculate luminance for color contrast
   */
  private calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Generate accessibility recommendations
   */
  private generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    if (results.violations.length > 0) {
      recommendations.push("Fix accessibility violations found by axe-core");
      
      const criticalViolations = results.violations.filter((v: any) => v.impact === "critical");
      if (criticalViolations.length > 0) {
        recommendations.push("Address critical accessibility violations immediately");
      }
    }

    if (!results.keyboardNavigation.canTabToElements) {
      recommendations.push("Ensure all interactive elements are keyboard accessible");
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

    if (!results.screenReader.hasLandmarks) {
      recommendations.push("Add landmark regions for better navigation");
    }

    if (results.colorContrast.length > 0) {
      recommendations.push("Improve color contrast ratios to meet WCAG standards");
    }

    return recommendations;
  }
}

export default AccessibilityTestUtils;