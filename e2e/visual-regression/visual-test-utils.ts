import { Page, expect } from "@playwright/test";

export interface VisualTestOptions {
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
  mask?: string[];
  threshold?: number;
  maxDiffPixels?: number;
  animations?: "disabled" | "allow";
}

export class VisualTestUtils {
  constructor(private page: Page) {}

  /**
   * Take a screenshot and compare with baseline
   */
  async compareScreenshot(name: string, options: VisualTestOptions = {}) {
    const {
      fullPage = true,
      clip,
      mask = [],
      threshold = 0.2,
      maxDiffPixels = 100,
      animations = "disabled",
    } = options;

    // Disable animations for consistent screenshots
    if (animations === "disabled") {
      await this.page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `,
      });
    }

    // Wait for page to be stable
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);

    // Mask dynamic content
    const maskSelectors = [
      '[data-testid="current-time"]',
      '[data-testid="random-content"]',
      ".loading-spinner",
      ...mask,
    ];

    const maskElements = [];
    for (const selector of maskSelectors) {
      const elements = await this.page.locator(selector).all();
      maskElements.push(...elements);
    }

    // Take screenshot
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage,
      clip,
      mask: maskElements,
      threshold,
      maxDiffPixels,
    });
  }

  /**
   * Compare element screenshot
   */
  async compareElementScreenshot(
    selector: string,
    name: string,
    options: VisualTestOptions = {}
  ) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible" });

    const {
      mask = [],
      threshold = 0.2,
      maxDiffPixels = 100,
      animations = "disabled",
    } = options;

    // Disable animations
    if (animations === "disabled") {
      await this.page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `,
      });
    }

    // Mask dynamic content within element
    const maskElements = [];
    for (const maskSelector of mask) {
      const elements = await element.locator(maskSelector).all();
      maskElements.push(...elements);
    }

    await expect(element).toHaveScreenshot(`${name}.png`, {
      mask: maskElements,
      threshold,
      maxDiffPixels,
    });
  }

  /**
   * Test responsive screenshots
   */
  async compareResponsiveScreenshots(
    name: string,
    options: VisualTestOptions = {}
  ) {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(500); // Allow for responsive changes

      await this.compareScreenshot(`${name}-${viewport.name}`, options);
    }
  }

  /**
   * Test component states
   */
  async compareComponentStates(
    selector: string,
    name: string,
    states: Array<{
      name: string;
      action: () => Promise<void>;
    }>,
    options: VisualTestOptions = {}
  ) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible" });

    // Take default state screenshot
    await this.compareElementScreenshot(selector, `${name}-default`, options);

    // Test each state
    for (const state of states) {
      await state.action();
      await this.page.waitForTimeout(300); // Allow for state changes
      await this.compareElementScreenshot(
        selector,
        `${name}-${state.name}`,
        options
      );
    }
  }

  /**
   * Test hover states
   */
  async compareHoverStates(
    selector: string,
    name: string,
    options: VisualTestOptions = {}
  ) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible" });

    // Default state
    await this.compareElementScreenshot(selector, `${name}-default`, options);

    // Hover state
    await element.hover();
    await this.page.waitForTimeout(300);
    await this.compareElementScreenshot(selector, `${name}-hover`, options);
  }

  /**
   * Test focus states
   */
  async compareFocusStates(
    selector: string,
    name: string,
    options: VisualTestOptions = {}
  ) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible" });

    // Default state
    await this.compareElementScreenshot(selector, `${name}-default`, options);

    // Focus state
    await element.focus();
    await this.page.waitForTimeout(300);
    await this.compareElementScreenshot(selector, `${name}-focus`, options);
  }

  /**
   * Test dark/light theme variations
   */
  async compareThemeVariations(name: string, options: VisualTestOptions = {}) {
    // Light theme
    await this.page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    });
    await this.page.waitForTimeout(500);
    await this.compareScreenshot(`${name}-light`, options);

    // Dark theme
    await this.page.evaluate(() => {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    });
    await this.page.waitForTimeout(500);
    await this.compareScreenshot(`${name}-dark`, options);
  }

  /**
   * Test loading states
   */
  async compareLoadingStates(
    name: string,
    loadingSelector: string,
    options: VisualTestOptions = {}
  ) {
    // Wait for loading state
    await this.page.locator(loadingSelector).waitFor({ state: "visible" });
    await this.compareScreenshot(`${name}-loading`, options);

    // Wait for loaded state
    await this.page.locator(loadingSelector).waitFor({ state: "hidden" });
    await this.compareScreenshot(`${name}-loaded`, options);
  }

  /**
   * Test error states
   */
  async compareErrorStates(
    name: string,
    triggerError: () => Promise<void>,
    options: VisualTestOptions = {}
  ) {
    // Normal state
    await this.compareScreenshot(`${name}-normal`, options);

    // Trigger error
    await triggerError();
    await this.page.waitForTimeout(500);
    await this.compareScreenshot(`${name}-error`, options);
  }

  /**
   * Test animation frames
   */
  async compareAnimationFrames(
    name: string,
    animationSelector: string,
    frames: number[] = [0, 25, 50, 75, 100],
    options: VisualTestOptions = {}
  ) {
    const element = this.page.locator(animationSelector);
    await element.waitFor({ state: "visible" });

    for (const frame of frames) {
      // Set animation progress
      await this.page.evaluate(
        ({ selector, progress }) => {
          const el = document.querySelector(selector);
          if (el) {
            (el as HTMLElement).style.animationPlayState = "paused";
            (el as HTMLElement).style.animationDelay = `-${progress}%`;
          }
        },
        { selector: animationSelector, progress: frame }
      );

      await this.page.waitForTimeout(100);
      await this.compareElementScreenshot(
        animationSelector,
        `${name}-frame-${frame}`,
        options
      );
    }
  }

  /**
   * Test print styles
   */
  async comparePrintStyles(name: string, options: VisualTestOptions = {}) {
    // Emulate print media
    await this.page.emulateMedia({ media: "print" });
    await this.page.waitForTimeout(500);

    await this.compareScreenshot(`${name}-print`, {
      ...options,
      fullPage: true,
    });

    // Reset to screen media
    await this.page.emulateMedia({ media: "screen" });
  }

  /**
   * Test high contrast mode
   */
  async compareHighContrastMode(name: string, options: VisualTestOptions = {}) {
    // Enable high contrast
    await this.page.emulateMedia({
      colorScheme: "dark",
      forcedColors: "active",
    });
    await this.page.waitForTimeout(500);

    await this.compareScreenshot(`${name}-high-contrast`, options);

    // Reset
    await this.page.emulateMedia({
      colorScheme: "light",
      forcedColors: "none",
    });
  }

  /**
   * Test reduced motion
   */
  async compareReducedMotion(name: string, options: VisualTestOptions = {}) {
    // Enable reduced motion
    await this.page.emulateMedia({
      reducedMotion: "reduce",
    });
    await this.page.waitForTimeout(500);

    await this.compareScreenshot(`${name}-reduced-motion`, options);

    // Reset
    await this.page.emulateMedia({
      reducedMotion: "no-preference",
    });
  }

  /**
   * Generate visual test report
   */
  async generateVisualReport(
    testResults: Array<{
      name: string;
      passed: boolean;
      diffPixels?: number;
      threshold?: number;
    }>
  ) {
    const report = {
      summary: {
        total: testResults.length,
        passed: testResults.filter((r) => r.passed).length,
        failed: testResults.filter((r) => r.passed === false).length,
      },
      results: testResults,
      timestamp: new Date().toISOString(),
    };

    // Save report
    await this.page.evaluate((reportData) => {
      console.log("Visual Test Report:", JSON.stringify(reportData, null, 2));
    }, report);

    return report;
  }
}
