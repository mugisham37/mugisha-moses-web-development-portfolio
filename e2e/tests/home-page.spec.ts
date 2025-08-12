import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page";

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visitHomePage();
  });

  test("should load and display all main sections", async () => {
    // Check hero section
    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.heroTitle).toBeVisible();
    await expect(homePage.heroSubtitle).toBeVisible();

    // Check metrics section
    await homePage.scrollToSection("metrics");
    await expect(homePage.metricsSection).toBeVisible();
    await expect(homePage.experienceCounter).toBeVisible();
    await expect(homePage.projectsCounter).toBeVisible();
    await expect(homePage.technologiesCounter).toBeVisible();

    // Check skills section
    await homePage.scrollToSection("skills");
    await expect(homePage.skillsSection).toBeVisible();
    await expect(homePage.skillBars.first()).toBeVisible();

    // Check GitHub section
    await homePage.scrollToSection("github");
    await expect(homePage.githubSection).toBeVisible();

    // Check featured projects
    await homePage.scrollToSection("projects");
    await expect(homePage.featuredProjectsSection).toBeVisible();

    // Check testimonials
    await homePage.scrollToSection("testimonials");
    await expect(homePage.testimonialsSection).toBeVisible();
  });

  test("should have proper SEO meta tags", async () => {
    // Check page title
    await expect(homePage.page).toHaveTitle(/Brutalist Developer Portfolio/);

    // Check meta description
    const hasMetaDescription = await homePage.checkMetaDescription(
      "Full-Stack Developer"
    );
    expect(hasMetaDescription).toBe(true);

    // Check Open Graph tags
    const ogTags = await homePage.checkOpenGraphTags();
    expect(ogTags.title).toBeTruthy();
    expect(ogTags.description).toBeTruthy();
    expect(ogTags.image).toBeTruthy();

    // Check structured data
    const structuredData = await homePage.checkStructuredData();
    expect(structuredData.length).toBeGreaterThan(0);
  });

  test("should animate counters when scrolled into view", async () => {
    const counters = await homePage.checkCounterAnimations();

    // Counters should show actual values, not zero
    expect(counters.experience).not.toBe("0");
    expect(counters.projects).not.toBe("0");
    expect(counters.technologies).not.toBe("0");
  });

  test("should animate skill bars when scrolled into view", async () => {
    const skillBars = await homePage.checkSkillAnimations();

    // At least some skill bars should have animated (non-zero width)
    const animatedBars = skillBars.filter((width) => width !== "0px");
    expect(animatedBars.length).toBeGreaterThan(0);
  });

  test("should display GitHub integration data", async () => {
    const githubData = await homePage.checkGitHubIntegration();

    // Should have contribution data
    expect(githubData.contributionCells).toBeGreaterThan(0);

    // Should have repository cards
    expect(githubData.repositoryCount).toBeGreaterThan(0);
  });

  test("should handle project card interactions", async () => {
    const interaction = await homePage.interactWithProjectCard(0);

    // Hover should reveal overlay
    expect(interaction.isOverlayVisible).toBe(true);
  });

  test("should navigate to project details", async () => {
    await homePage.navigateToProjectDetails(0);

    // Should navigate to project page
    await expect(homePage.page).toHaveURL(/\/projects\/.+/);
  });

  test("should handle testimonial carousel", async () => {
    const carousel = await homePage.checkTestimonialCarousel();

    // Should have testimonials
    expect(carousel.testimonialCount).toBeGreaterThan(0);
  });

  test("should render Three.js background", async () => {
    const threeJs = await homePage.checkThreeJsBackground();

    expect(threeJs.isVisible).toBe(true);
    expect(threeJs.width).toBeGreaterThan(0);
    expect(threeJs.height).toBeGreaterThan(0);
  });

  test("should have working navigation", async () => {
    // Test main navigation links
    await homePage.clickNavigation("projects");
    await expect(homePage.page).toHaveURL("/projects");

    await homePage.clickNavigation("blog");
    await expect(homePage.page).toHaveURL("/blog");

    await homePage.clickNavigation("services");
    await expect(homePage.page).toHaveURL("/services");

    await homePage.clickNavigation("contact");
    await expect(homePage.page).toHaveURL("/contact");

    await homePage.clickNavigation("home");
    await expect(homePage.page).toHaveURL("/");
  });

  test("should work on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile menu
    await homePage.openMobileMenu();

    // Mobile navigation should be visible
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeVisible();

    // Test mobile navigation
    await homePage.clickNavigation("projects");
    await expect(page).toHaveURL("/projects");
  });

  test("should be accessible", async () => {
    // Check for accessibility issues
    const accessibilityIssues = await homePage.helpers.checkAccessibility();

    // Should have minimal accessibility issues
    expect(accessibilityIssues.length).toBeLessThan(5);

    // Test keyboard navigation
    await homePage.useSkipNavigation();

    // Should focus on main content
    const mainContent = homePage.mainContent;
    await expect(mainContent).toBeFocused();
  });

  test("should handle responsive breakpoints", async () => {
    const responsiveResults =
      await homePage.helpers.testResponsiveBreakpoints();

    // Should not have horizontal scroll at any breakpoint
    for (const result of responsiveResults) {
      expect(result.hasHorizontalScroll).toBe(false);
    }
  });

  test("should load without console errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await homePage.visitHomePage();
    await homePage.helpers.waitForPageLoad();

    // Filter out known acceptable errors (like network errors in dev)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("Failed to load resource") &&
        !error.includes("net::ERR_") &&
        !error.includes("favicon.ico")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should have fast loading performance", async ({ page }) => {
    const startTime = Date.now();

    await homePage.visitHomePage();
    await homePage.helpers.waitForPageLoad();

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds (generous for E2E)
    expect(loadTime).toBeLessThan(5000);

    // Check for Largest Contentful Paint
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ["largest-contentful-paint"] });
      });
    });

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });
});
