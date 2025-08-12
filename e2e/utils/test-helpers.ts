import { Page, expect } from "@playwright/test";

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded including animations
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500); // Allow for animations to complete
  }

  /**
   * Wait for element to be visible and stable
   */
  async waitForElement(selector: string, timeout = 10000) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible", timeout });
    await element.waitFor({ state: "attached", timeout });
    return element;
  }

  /**
   * Scroll element into view and wait for it to be stable
   */
  async scrollToElement(selector: string) {
    const element = await this.waitForElement(selector);
    await element.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300); // Allow for scroll animations
    return element;
  }

  /**
   * Fill form field with validation
   */
  async fillField(selector: string, value: string) {
    const field = await this.waitForElement(selector);
    await field.clear();
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string, options?: { timeout?: number }) {
    const element = await this.waitForElement(selector, options?.timeout);
    await element.click();
    await this.page.waitForTimeout(100); // Allow for click animations
  }

  /**
   * Check if element is visible without throwing
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: "visible", timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(expectedUrl?: string) {
    await this.page.waitForLoadState("networkidle");
    if (expectedUrl) {
      await expect(this.page).toHaveURL(expectedUrl);
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  /**
   * Check for console errors
   */
  async checkConsoleErrors() {
    const errors: string[] = [];

    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  /**
   * Mock API response
   */
  async mockApiResponse(url: string, response: any, status = 200) {
    await this.page.route(url, (route) => {
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Wait for API call to complete
   */
  async waitForApiCall(url: string, timeout = 10000) {
    return this.page.waitForResponse(
      (response) => response.url().includes(url) && response.status() === 200,
      { timeout }
    );
  }

  /**
   * Check accessibility violations
   */
  async checkAccessibility() {
    // This would integrate with axe-core or similar
    // For now, we'll do basic checks
    const issues: string[] = [];

    // Check for missing alt text on images
    const images = await this.page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");
      if (!alt && src && !src.includes("data:")) {
        issues.push(`Image missing alt text: ${src}`);
      }
    }

    // Check for missing form labels
    const inputs = await this.page.locator("input, textarea, select").all();
    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");

      if (id) {
        const label = await this.page.locator(`label[for="${id}"]`).count();
        if (label === 0 && !ariaLabel && !ariaLabelledBy) {
          issues.push(`Input missing label: ${id}`);
        }
      }
    }

    return issues;
  }

  /**
   * Test responsive design at different breakpoints
   */
  async testResponsiveBreakpoints() {
    const breakpoints = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    const results = [];

    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height,
      });

      await this.waitForPageLoad();

      // Check for horizontal scrollbars (usually indicates responsive issues)
      const hasHorizontalScroll = await this.page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });

      results.push({
        breakpoint: breakpoint.name,
        hasHorizontalScroll,
        viewport: breakpoint,
      });
    }

    return results;
  }
}
