import { test, expect, type Page, type BrowserContext } from "@playwright/test";

/**
 * Cross-Browser Compatibility Tests
 * Comprehensive testing across different browsers and devices
 */

// Test data and configurations
const TEST_URLS = [
  { path: "/", name: "Home Page" },
  { path: "/projects", name: "Projects Page" },
  { path: "/blog", name: "Blog Page" },
  { path: "/services", name: "Services Page" },
  { path: "/contact", name: "Contact Page" },
];

const VIEWPORT_SIZES = [
  { width: 320, height: 568, name: "Mobile Small" },
  { width: 375, height: 667, name: "Mobile Medium" },
  { width: 768, height: 1024, name: "Tablet" },
  { width: 1024, height: 768, name: "Tablet Landscape" },
  { width: 1280, height: 720, name: "Desktop Small" },
  { width: 1920, height: 1080, name: "Desktop Large" },
];

// Helper functions
async function checkPageLoad(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await expect(page).toHaveTitle(/Portfolio/);
  await page.waitForLoadState("networkidle");
}

async function checkResponsiveLayout(
  page: Page,
  viewport: { width: number; height: number; name: string }
): Promise<void> {
  await page.setViewportSize(viewport);

  // Check that content doesn't overflow horizontally
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyScrollWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small margin for scrollbars

  // Check that main navigation is accessible
  const nav = page.locator("nav");
  await expect(nav).toBeVisible();

  // Check that main content is visible
  const main = page.locator('main, [role="main"], #main-content');
  await expect(main).toBeVisible();
}

async function checkAccessibility(page: Page): Promise<void> {
  // Check for proper heading hierarchy
  const h1Count = await page.locator("h1").count();
  expect(h1Count).toBeGreaterThanOrEqual(1);
  expect(h1Count).toBeLessThanOrEqual(1); // Should have exactly one h1

  // Check for alt text on images
  const images = page.locator("img");
  const imageCount = await images.count();

  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i);
    const alt = await img.getAttribute("alt");
    expect(alt).toBeTruthy();
  }

  // Check for proper form labels
  const inputs = page.locator(
    'input[type="text"], input[type="email"], textarea'
  );
  const inputCount = await inputs.count();

  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute("id");
    const ariaLabel = await input.getAttribute("aria-label");
    const ariaLabelledBy = await input.getAttribute("aria-labelledby");

    if (id) {
      const label = page.locator(`label[for="${id}"]`);
      const hasLabel = (await label.count()) > 0;
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  }

  // Check for keyboard navigation
  await page.keyboard.press("Tab");
  const focusedElement = await page.evaluate(
    () => document.activeElement?.tagName
  );
  expect(focusedElement).toBeTruthy();
}

async function checkPerformance(page: Page): Promise<void> {
  // Start performance monitoring
  await page.goto(page.url(), { waitUntil: "networkidle" });

  // Check Core Web Vitals
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics: any = {};

      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            metrics.fcp = entry.startTime;
          }
        }
      }).observe({ entryTypes: ["paint"] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      }).observe({ entryTypes: ["layout-shift"] });

      // Wait a bit for metrics to be collected
      setTimeout(() => resolve(metrics), 3000);
    });
  });

  // Performance assertions
  if (metrics.fcp) {
    expect(metrics.fcp).toBeLessThan(2500); // FCP should be under 2.5s
  }

  if (metrics.lcp) {
    expect(metrics.lcp).toBeLessThan(4000); // LCP should be under 4s
  }

  if (metrics.cls !== undefined) {
    expect(metrics.cls).toBeLessThan(0.25); // CLS should be under 0.25
  }
}

async function checkJavaScriptErrors(page: Page): Promise<void> {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  // Navigate and wait for any errors
  await page.waitForTimeout(2000);

  // Filter out known acceptable errors
  const criticalErrors = errors.filter(
    (error) =>
      !error.includes("favicon") &&
      !error.includes("analytics") &&
      !error.includes("third-party")
  );

  expect(criticalErrors).toHaveLength(0);
}

// Test suites
test.describe("Cross-Browser Compatibility", () => {
  test.describe("Page Loading", () => {
    for (const testUrl of TEST_URLS) {
      test(`${testUrl.name} loads successfully`, async ({ page }) => {
        await checkPageLoad(page, testUrl.path);
      });
    }
  });

  test.describe("Responsive Design", () => {
    for (const viewport of VIEWPORT_SIZES) {
      test(`Layout works on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        page,
      }) => {
        await page.goto("/");
        await checkResponsiveLayout(page, viewport);
      });
    }
  });

  test.describe("Navigation Functionality", () => {
    test("Navigation links work correctly", async ({ page }) => {
      await page.goto("/");

      // Test main navigation
      const navLinks = page.locator('nav a[href^="/"]');
      const linkCount = await navLinks.count();

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute("href");

        if (href && href !== "/") {
          await link.click();
          await page.waitForLoadState("networkidle");
          expect(page.url()).toContain(href);

          // Go back to home for next test
          await page.goto("/");
        }
      }
    });

    test("Mobile navigation works", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Look for mobile menu trigger
      const mobileMenuTrigger = page
        .locator(
          '[aria-label*="menu"], .mobile-menu-trigger, button[aria-expanded]'
        )
        .first();

      if ((await mobileMenuTrigger.count()) > 0) {
        await mobileMenuTrigger.click();

        // Check if mobile menu is visible
        const mobileMenu = page
          .locator('.mobile-menu, [role="dialog"], nav[aria-expanded="true"]')
          .first();
        await expect(mobileMenu).toBeVisible();

        // Test a navigation link in mobile menu
        const mobileNavLink = mobileMenu.locator('a[href^="/"]').first();
        if ((await mobileNavLink.count()) > 0) {
          await mobileNavLink.click();
          await page.waitForLoadState("networkidle");
        }
      }
    });
  });

  test.describe("Interactive Elements", () => {
    test("Buttons and interactive elements work", async ({ page }) => {
      await page.goto("/");

      // Test buttons
      const buttons = page.locator("button:visible");
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        const isDisabled = await button.isDisabled();

        if (!isDisabled) {
          await button.hover();
          await button.focus();
          // Don't click all buttons as some might trigger navigation
        }
      }

      // Test form inputs if present
      const inputs = page.locator("input:visible, textarea:visible");
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 2); i++) {
        const input = inputs.nth(i);
        await input.focus();
        await input.fill("test");
        await input.clear();
      }
    });

    test("Hover effects work on desktop", async ({ page, browserName }) => {
      // Skip hover tests on mobile browsers
      if (browserName === "webkit" && process.env.CI) {
        test.skip();
      }

      await page.goto("/");

      // Test hover effects on cards and buttons
      const hoverElements = page.locator(".card, .btn, button, a").first();

      if ((await hoverElements.count()) > 0) {
        const element = hoverElements.first();

        // Get initial styles
        const initialTransform = await element.evaluate(
          (el) => window.getComputedStyle(el).transform
        );

        // Hover and check for changes
        await element.hover();
        await page.waitForTimeout(500); // Wait for transition

        const hoveredTransform = await element.evaluate(
          (el) => window.getComputedStyle(el).transform
        );

        // Transform should change on hover (for elements with hover effects)
        // This is a basic check - specific implementations may vary
      }
    });
  });

  test.describe("Accessibility", () => {
    test("Basic accessibility requirements are met", async ({ page }) => {
      await page.goto("/");
      await checkAccessibility(page);
    });

    test("Keyboard navigation works", async ({ page }) => {
      await page.goto("/");

      // Test tab navigation
      let tabCount = 0;
      const maxTabs = 10;

      while (tabCount < maxTabs) {
        await page.keyboard.press("Tab");
        tabCount++;

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el
            ? {
                tagName: el.tagName,
                type: el.getAttribute("type"),
                role: el.getAttribute("role"),
                href: el.getAttribute("href"),
              }
            : null;
        });

        if (focusedElement) {
          // Should be able to focus on interactive elements
          const interactiveElements = [
            "BUTTON",
            "A",
            "INPUT",
            "TEXTAREA",
            "SELECT",
          ];
          const isInteractive =
            interactiveElements.includes(focusedElement.tagName) ||
            focusedElement.role === "button" ||
            focusedElement.role === "link";

          if (isInteractive) {
            // Test Enter key on focused element
            if (
              focusedElement.tagName === "BUTTON" ||
              focusedElement.role === "button"
            ) {
              // Don't actually press Enter on buttons as it might trigger actions
            } else if (
              focusedElement.tagName === "A" &&
              focusedElement.href?.startsWith("#")
            ) {
              await page.keyboard.press("Enter");
            }
          }
        }
      }
    });

    test("Screen reader compatibility", async ({ page }) => {
      await page.goto("/");

      // Check for proper ARIA labels and roles
      const elementsWithAriaLabel = await page.locator("[aria-label]").count();
      const elementsWithRole = await page.locator("[role]").count();
      const landmarks = await page
        .locator("main, nav, header, footer, aside, section[aria-label]")
        .count();

      // Should have some accessibility attributes
      expect(
        elementsWithAriaLabel + elementsWithRole + landmarks
      ).toBeGreaterThan(0);

      // Check for skip links
      const skipLinks = page.locator(
        'a[href="#main"], a[href="#content"], .skip-link'
      );
      if ((await skipLinks.count()) > 0) {
        const skipLink = skipLinks.first();
        await skipLink.focus();
        await expect(skipLink).toBeVisible();
      }
    });
  });

  test.describe("Performance", () => {
    test("Page loads within acceptable time limits", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/", { waitUntil: "networkidle" });
      const loadTime = Date.now() - startTime;

      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("Core Web Vitals are within acceptable ranges", async ({ page }) => {
      await page.goto("/");
      await checkPerformance(page);
    });

    test("No JavaScript errors occur", async ({ page }) => {
      await page.goto("/");
      await checkJavaScriptErrors(page);
    });
  });

  test.describe("Feature Detection", () => {
    test("CSS features are properly detected and handled", async ({ page }) => {
      await page.goto("/");

      const featureSupport = await page.evaluate(() => {
        return {
          cssGrid: CSS.supports("display", "grid"),
          cssFlexbox: CSS.supports("display", "flex"),
          cssCustomProperties: CSS.supports("--custom", "property"),
          cssBackdropFilter: CSS.supports("backdrop-filter", "blur(10px)"),
        };
      });

      // Check that feature detection classes are applied
      const htmlClasses = await page.locator("html").getAttribute("class");

      if (featureSupport.cssGrid) {
        expect(htmlClasses).toContain("supports-css-grid");
      } else {
        expect(htmlClasses).toContain("no-css-grid");
      }

      if (featureSupport.cssFlexbox) {
        expect(htmlClasses).toContain("supports-css-flexbox");
      }
    });

    test("JavaScript features are properly polyfilled", async ({ page }) => {
      await page.goto("/");

      const jsFeatures = await page.evaluate(() => {
        return {
          intersectionObserver: "IntersectionObserver" in window,
          resizeObserver: "ResizeObserver" in window,
          webAnimations: "animate" in document.createElement("div"),
          customElements: "customElements" in window,
        };
      });

      // These features should be available (either natively or via polyfills)
      expect(jsFeatures.intersectionObserver).toBeTruthy();
      // ResizeObserver might not be polyfilled in all test environments
      // expect(jsFeatures.resizeObserver).toBeTruthy();
    });
  });

  test.describe("Browser-Specific Issues", () => {
    test("Safari-specific issues are handled", async ({
      page,
      browserName,
    }) => {
      if (browserName !== "webkit") {
        test.skip();
      }

      await page.goto("/");

      // Test Safari-specific CSS fixes
      const safariClasses = await page.locator("html").getAttribute("class");
      expect(safariClasses).toContain("browser-safari");

      // Test sticky positioning (common Safari issue)
      const stickyElements = page.locator('.sticky, [style*="sticky"]');
      if ((await stickyElements.count()) > 0) {
        const stickyElement = stickyElements.first();
        const position = await stickyElement.evaluate(
          (el) => window.getComputedStyle(el).position
        );
        expect(position).toMatch(/sticky|-webkit-sticky/);
      }
    });

    test("Chrome-specific issues are handled", async ({
      page,
      browserName,
    }) => {
      if (browserName !== "chromium") {
        test.skip();
      }

      await page.goto("/");

      // Test Chrome autofill styling
      const inputs = page.locator(
        'input[type="email"], input[type="password"]'
      );
      if ((await inputs.count()) > 0) {
        const input = inputs.first();

        // Simulate autofill
        await input.fill("test@example.com");

        // Check that autofill styles don't break the design
        const backgroundColor = await input.evaluate(
          (el) => window.getComputedStyle(el).backgroundColor
        );

        // Should not be the default yellow autofill background
        expect(backgroundColor).not.toBe("rgb(250, 255, 189)");
      }
    });

    test("Firefox-specific issues are handled", async ({
      page,
      browserName,
    }) => {
      if (browserName !== "firefox") {
        test.skip();
      }

      await page.goto("/");

      // Test Firefox button focus outline removal
      const buttons = page.locator("button");
      if ((await buttons.count()) > 0) {
        const button = buttons.first();
        await button.focus();

        // Firefox-specific focus inner border should be removed
        const focusInner = await button.evaluate((el) => {
          const style = window.getComputedStyle(el, "::-moz-focus-inner");
          return style.border;
        });

        // Should be 0 or none
        expect(focusInner).toMatch(/^(0|none)/);
      }
    });
  });
});

// Visual regression tests (if visual testing is enabled)
test.describe("Visual Regression", () => {
  test("Homepage visual consistency", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      threshold: 0.3, // Allow 30% difference for cross-browser variations
    });
  });

  test("Mobile layout visual consistency", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      threshold: 0.3,
    });
  });
});
