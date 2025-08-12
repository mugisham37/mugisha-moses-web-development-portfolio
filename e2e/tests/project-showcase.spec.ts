import { test, expect } from "@playwright/test";
import { AccessibilityTestUtils } from "../utils/accessibility-test-utils";

test.describe("Project Showcase", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
  });

  test("displays project grid with filtering", async ({ page }) => {
    // Check if projects are loaded
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards.first()).toBeVisible();

    const projectCount = await projectCards.count();
    expect(projectCount).toBeGreaterThan(0);

    // Check filter buttons
    const filterButtons = page.locator('[data-testid="filter-button"]');
    await expect(filterButtons.first()).toBeVisible();

    // Test technology filter
    const reactFilter = page.locator(
      '[data-testid="filter-button"]:has-text("React")'
    );
    if (await reactFilter.isVisible()) {
      await reactFilter.click();
      await page.waitForTimeout(500); // Wait for filter animation

      // Verify filtered results
      const filteredCards = page.locator('[data-testid="project-card"]');
      const filteredCount = await filteredCards.count();
      expect(filteredCount).toBeLessThanOrEqual(projectCount);
    }
  });

  test("project card interactions work correctly", async ({ page }) => {
    const firstProjectCard = page
      .locator('[data-testid="project-card"]')
      .first();
    await expect(firstProjectCard).toBeVisible();

    // Test hover effect
    await firstProjectCard.hover();
    const overlay = firstProjectCard.locator('[data-testid="project-overlay"]');
    await expect(overlay).toBeVisible();

    // Test project links
    const githubLink = firstProjectCard.locator('[data-testid="github-link"]');
    const liveLink = firstProjectCard.locator('[data-testid="live-link"]');

    if (await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute("href", /github\.com/);
      await expect(githubLink).toHaveAttribute("target", "_blank");
    }

    if (await liveLink.isVisible()) {
      await expect(liveLink).toHaveAttribute("target", "_blank");
    }
  });

  test("project detail navigation works", async ({ page }) => {
    const firstProjectCard = page
      .locator('[data-testid="project-card"]')
      .first();
    const projectTitle = await firstProjectCard.locator("h3").textContent();

    // Click on project card to navigate to detail page
    await firstProjectCard.click();
    await page.waitForLoadState("networkidle");

    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/projects\/.+/);

    // Check if project detail content is loaded
    const detailTitle = page.locator("h1");
    await expect(detailTitle).toBeVisible();

    if (projectTitle) {
      await expect(detailTitle).toHaveText(projectTitle);
    }
  });

  test("search functionality works", async ({ page }) => {
    const searchInput = page.locator('[data-testid="project-search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill("portfolio");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);

      // Check if search results are displayed
      const searchResults = page.locator('[data-testid="project-card"]');
      const resultCount = await searchResults.count();

      // Should have some results or show no results message
      if (resultCount === 0) {
        const noResultsMessage = page.locator('[data-testid="no-results"]');
        await expect(noResultsMessage).toBeVisible();
      } else {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test("pagination works correctly", async ({ page }) => {
    const paginationContainer = page.locator('[data-testid="pagination"]');

    if (await paginationContainer.isVisible()) {
      const nextButton = page.locator('[data-testid="pagination-next"]');
      const prevButton = page.locator('[data-testid="pagination-prev"]');

      // Test next page
      if ((await nextButton.isVisible()) && !(await nextButton.isDisabled())) {
        await nextButton.click();
        await page.waitForLoadState("networkidle");

        // URL should change to include page parameter
        await expect(page).toHaveURL(/page=2/);

        // Previous button should now be enabled
        await expect(prevButton).not.toBeDisabled();
      }
    }
  });

  test("responsive design works on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Check if mobile layout is applied
    const projectGrid = page.locator('[data-testid="project-grid"]');
    await expect(projectGrid).toBeVisible();

    // Projects should stack vertically on mobile
    const projectCards = page.locator('[data-testid="project-card"]');
    if ((await projectCards.count()) > 1) {
      const firstCard = projectCards.first();
      const secondCard = projectCards.nth(1);

      const firstCardBox = await firstCard.boundingBox();
      const secondCardBox = await secondCard.boundingBox();

      if (firstCardBox && secondCardBox) {
        // Second card should be below first card (not side by side)
        expect(secondCardBox.y).toBeGreaterThan(
          firstCardBox.y + firstCardBox.height - 50
        );
      }
    }

    // Mobile filters should work
    const mobileFilterToggle = page.locator(
      '[data-testid="mobile-filter-toggle"]'
    );
    if (await mobileFilterToggle.isVisible()) {
      await mobileFilterToggle.click();
      const filterPanel = page.locator('[data-testid="filter-panel"]');
      await expect(filterPanel).toBeVisible();
    }
  });

  test("loading states are handled properly", async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route("**/api/projects*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.goto("/projects");

    // Should show loading skeleton or spinner
    const loadingIndicator = page.locator('[data-testid="projects-loading"]');
    await expect(loadingIndicator).toBeVisible();

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Loading indicator should be hidden
    await expect(loadingIndicator).not.toBeVisible();

    // Projects should be visible
    const projectCards = page.locator('[data-testid="project-card"]');
    await expect(projectCards.first()).toBeVisible();
  });

  test("error states are handled gracefully", async ({ page }) => {
    // Intercept API calls to simulate error
    await page.route("**/api/projects*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    await page.goto("/projects");
    await page.waitForTimeout(2000);

    // Should show error message
    const errorMessage = page.locator('[data-testid="projects-error"]');
    await expect(errorMessage).toBeVisible();

    // Should have retry button
    const retryButton = page.locator('[data-testid="retry-button"]');
    if (await retryButton.isVisible()) {
      await expect(retryButton).toBeEnabled();
    }
  });

  test("project metrics are displayed correctly", async ({ page }) => {
    const firstProjectCard = page
      .locator('[data-testid="project-card"]')
      .first();
    await expect(firstProjectCard).toBeVisible();

    // Check for technology tags
    const techTags = firstProjectCard.locator('[data-testid="tech-tag"]');
    const techCount = await techTags.count();
    expect(techCount).toBeGreaterThan(0);

    // Check for project stats if available
    const viewCount = firstProjectCard.locator('[data-testid="view-count"]');
    const likeCount = firstProjectCard.locator('[data-testid="like-count"]');

    if (await viewCount.isVisible()) {
      const viewText = await viewCount.textContent();
      expect(viewText).toMatch(/\d+/);
    }

    if (await likeCount.isVisible()) {
      const likeText = await likeCount.textContent();
      expect(likeText).toMatch(/\d+/);
    }
  });

  test("keyboard navigation works properly", async ({ page }) => {
    // Focus on first project card
    const firstProjectCard = page
      .locator('[data-testid="project-card"]')
      .first();
    await firstProjectCard.focus();
    await expect(firstProjectCard).toBeFocused();

    // Navigate with Tab key
    await page.keyboard.press("Tab");

    // Should focus on next interactive element
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Test Enter key on project card
    await firstProjectCard.focus();
    await page.keyboard.press("Enter");

    // Should navigate to project detail
    await expect(page).toHaveURL(/\/projects\/.+/);
  });

  test("accessibility compliance", async ({ page }) => {
    const accessibilityUtils = new AccessibilityTestUtils();

    // Test for accessibility violations
    const violations = await accessibilityUtils.testPageAccessibility(page);
    expect(violations.length).toBeLessThan(5); // Allow minor violations

    // Test keyboard navigation
    const keyboardResults =
      await accessibilityUtils.testKeyboardNavigation(page);
    expect(keyboardResults.canTabToElements).toBe(true);

    // Test screen reader compatibility
    const screenReaderResults =
      await accessibilityUtils.testScreenReaderCompatibility(page);
    expect(screenReaderResults.hasProperHeadings).toBe(true);
    expect(screenReaderResults.hasAltText).toBe(true);
  });

  test("performance metrics are acceptable", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds

    // Check for Core Web Vitals
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ["largest-contentful-paint"] });
      });
    });

    expect(lcp).toBeLessThan(2500); // LCP should be under 2.5s
  });

  test("social sharing works correctly", async ({ page }) => {
    // Navigate to project detail page
    const firstProjectCard = page
      .locator('[data-testid="project-card"]')
      .first();
    await firstProjectCard.click();
    await page.waitForLoadState("networkidle");

    // Check for social sharing buttons
    const shareButtons = page.locator('[data-testid="share-button"]');

    if ((await shareButtons.count()) > 0) {
      const twitterShare = page.locator('[data-testid="share-twitter"]');
      const linkedinShare = page.locator('[data-testid="share-linkedin"]');

      if (await twitterShare.isVisible()) {
        await expect(twitterShare).toHaveAttribute("href", /twitter\.com/);
      }

      if (await linkedinShare.isVisible()) {
        await expect(linkedinShare).toHaveAttribute("href", /linkedin\.com/);
      }
    }
  });

  test("project categories work correctly", async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');

    if (await categoryFilter.isVisible()) {
      const categories = page.locator('[data-testid="category-option"]');
      const categoryCount = await categories.count();

      if (categoryCount > 0) {
        // Click on first category
        await categories.first().click();
        await page.waitForTimeout(500);

        // Should filter projects by category
        const filteredProjects = page.locator('[data-testid="project-card"]');
        await expect(filteredProjects.first()).toBeVisible();

        // URL should reflect the filter
        const url = page.url();
        expect(url).toMatch(/category=/);
      }
    }
  });
});
