import { test, expect } from "@playwright/test";
import { VisualTestUtils } from "../visual-regression/visual-test-utils";

test.describe("Visual Regression Tests", () => {
  let visualUtils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    visualUtils = new VisualTestUtils(page);
  });

  test.describe("Homepage Visual Tests", () => {
    test("homepage renders correctly", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Wait for animations to settle
      await page.waitForTimeout(2000);

      await visualUtils.compareScreenshot("homepage-full", {
        fullPage: true,
        mask: [
          '[data-testid="current-time"]',
          '[data-testid="github-activity"]', // Dynamic content
          ".loading-spinner",
        ],
      });
    });

    test("hero section renders correctly", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroSection = '[data-testid="hero-section"]';
      await page.locator(heroSection).waitFor({ state: "visible" });

      await visualUtils.compareElementScreenshot(heroSection, "hero-section", {
        mask: [
          '[data-testid="typewriter-text"]', // Animated text
          '[data-testid="three-background"]', // 3D animation
        ],
      });
    });

    test("metrics section with counters", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to metrics section to trigger animations
      const metricsSection = '[data-testid="metrics-section"]';
      await page.locator(metricsSection).scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000); // Wait for counter animations

      await visualUtils.compareElementScreenshot(
        metricsSection,
        "metrics-section"
      );
    });

    test("skills visualization", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const skillsSection = '[data-testid="skills-section"]';
      await page.locator(skillsSection).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500); // Wait for skill bar animations

      await visualUtils.compareElementScreenshot(
        skillsSection,
        "skills-section"
      );
    });

    test("github integration section", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const githubSection = '[data-testid="github-section"]';
      await page.locator(githubSection).scrollIntoViewIfNeeded();

      await visualUtils.compareElementScreenshot(
        githubSection,
        "github-section",
        {
          mask: [
            '[data-testid="contribution-graph"]', // Dynamic GitHub data
            '[data-testid="recent-activity"]',
          ],
        }
      );
    });

    test("testimonials carousel", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const testimonialsSection = '[data-testid="testimonials-section"]';
      await page.locator(testimonialsSection).scrollIntoViewIfNeeded();

      await visualUtils.compareElementScreenshot(
        testimonialsSection,
        "testimonials-section"
      );
    });
  });

  test.describe("Project Showcase Visual Tests", () => {
    test("projects grid layout", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      const projectGrid = '[data-testid="project-grid"]';
      await page.locator(projectGrid).waitFor({ state: "visible" });

      await visualUtils.compareElementScreenshot(projectGrid, "projects-grid");
    });

    test("project card hover states", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      const firstProjectCard = '[data-testid="project-card"]';
      await page
        .locator(firstProjectCard)
        .first()
        .waitFor({ state: "visible" });

      await visualUtils.compareComponentStates(
        firstProjectCard,
        "project-card",
        [
          {
            name: "hover",
            action: async () => {
              await page.locator(firstProjectCard).first().hover();
            },
          },
        ]
      );
    });

    test("project filters", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      const filtersSection = '[data-testid="project-filters"]';
      if (await page.locator(filtersSection).isVisible()) {
        await visualUtils.compareElementScreenshot(
          filtersSection,
          "project-filters"
        );
      }
    });

    test("project detail page", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      // Navigate to first project
      const firstProject = page.locator('[data-testid="project-card"]').first();
      await firstProject.click();
      await page.waitForLoadState("networkidle");

      await visualUtils.compareScreenshot("project-detail", {
        fullPage: true,
        mask: [
          '[data-testid="view-count"]', // Dynamic metrics
          '[data-testid="like-count"]',
        ],
      });
    });
  });

  test.describe("Blog Visual Tests", () => {
    test("blog listing page", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareScreenshot("blog-listing", {
        fullPage: true,
        mask: [
          '[data-testid="reading-time"]', // Dynamic content
          '[data-testid="view-count"]',
        ],
      });
    });

    test("blog post card", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("networkidle");

      const blogCard = '[data-testid="blog-card"]';
      if (await page.locator(blogCard).first().isVisible()) {
        await visualUtils.compareElementScreenshot(blogCard, "blog-card");
      }
    });
  });

  test.describe("Contact Form Visual Tests", () => {
    test("contact form layout", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");

      const contactForm = 'form[data-testid="contact-form"]';
      await page.locator(contactForm).waitFor({ state: "visible" });

      await visualUtils.compareElementScreenshot(contactForm, "contact-form");
    });

    test("contact form validation states", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");

      const contactForm = 'form[data-testid="contact-form"]';

      await visualUtils.compareComponentStates(contactForm, "contact-form", [
        {
          name: "validation-errors",
          action: async () => {
            // Trigger validation by submitting empty form
            await page.click('button[type="submit"]');
            await page.waitForTimeout(500);
          },
        },
        {
          name: "filled",
          action: async () => {
            // Fill form with valid data
            await page.fill('input[name="name"]', "John Doe");
            await page.fill('input[name="email"]', "john@example.com");
            await page.fill(
              'textarea[name="message"]',
              "This is a test message."
            );
          },
        },
      ]);
    });
  });

  test.describe("UI Components Visual Tests", () => {
    test("buttons in different states", async ({ page }) => {
      await page.goto("/demo"); // Assuming there's a demo page with components

      if (await page.locator('[data-testid="button-demo"]').isVisible()) {
        const buttonDemo = '[data-testid="button-demo"]';

        await visualUtils.compareComponentStates(buttonDemo, "buttons", [
          {
            name: "hover",
            action: async () => {
              await page.locator(`${buttonDemo} button`).first().hover();
            },
          },
          {
            name: "focus",
            action: async () => {
              await page.locator(`${buttonDemo} button`).first().focus();
            },
          },
        ]);
      }
    });

    test("cards with different variants", async ({ page }) => {
      await page.goto("/demo");

      if (await page.locator('[data-testid="card-demo"]').isVisible()) {
        const cardDemo = '[data-testid="card-demo"]';

        await visualUtils.compareElementScreenshot(cardDemo, "cards-variants");
      }
    });

    test("typography showcase", async ({ page }) => {
      await page.goto("/demo");

      if (await page.locator('[data-testid="typography-demo"]').isVisible()) {
        const typographyDemo = '[data-testid="typography-demo"]';

        await visualUtils.compareElementScreenshot(
          typographyDemo,
          "typography-showcase"
        );
      }
    });
  });

  test.describe("Responsive Visual Tests", () => {
    test("homepage responsive layouts", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareResponsiveScreenshots("homepage-responsive", {
        mask: [
          '[data-testid="typewriter-text"]',
          '[data-testid="three-background"]',
          '[data-testid="github-activity"]',
        ],
      });
    });

    test("navigation responsive behavior", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const header = 'header[data-testid="main-header"]';

      await visualUtils.compareResponsiveScreenshots("navigation-responsive");

      // Test mobile menu
      await page.setViewportSize({ width: 375, height: 667 });

      const mobileMenuToggle = '[data-testid="mobile-menu-toggle"]';
      if (await page.locator(mobileMenuToggle).isVisible()) {
        await page.click(mobileMenuToggle);
        await page.waitForTimeout(500);

        await visualUtils.compareScreenshot("mobile-menu-open", {
          mask: ['[data-testid="three-background"]'],
        });
      }
    });

    test("project grid responsive", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      const projectGrid = '[data-testid="project-grid"]';

      await visualUtils.compareResponsiveScreenshots("project-grid-responsive");
    });
  });

  test.describe("Theme Visual Tests", () => {
    test("light and dark theme variations", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareThemeVariations("homepage-themes", {
        mask: [
          '[data-testid="typewriter-text"]',
          '[data-testid="three-background"]',
        ],
      });
    });

    test("theme toggle functionality", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const themeToggle = '[data-testid="theme-toggle"]';
      if (await page.locator(themeToggle).isVisible()) {
        // Test theme toggle states
        await visualUtils.compareComponentStates(themeToggle, "theme-toggle", [
          {
            name: "dark-mode",
            action: async () => {
              await page.click(themeToggle);
              await page.waitForTimeout(500);
            },
          },
        ]);
      }
    });
  });

  test.describe("Animation Visual Tests", () => {
    test("loading animations", async ({ page }) => {
      // Intercept API to create loading state
      await page.route("**/api/projects*", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto("/projects");

      // Capture loading state
      await visualUtils.compareScreenshot("projects-loading", {
        mask: [".loading-spinner"], // Exclude animated spinners
      });
    });

    test("error states", async ({ page }) => {
      // Mock API error
      await page.route("**/api/projects*", async (route) => {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: "Server error" }),
        });
      });

      await page.goto("/projects");
      await page.waitForTimeout(2000);

      await visualUtils.compareScreenshot("projects-error");
    });

    test("empty states", async ({ page }) => {
      // Mock empty response
      await page.route("**/api/projects*", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: [], total: 0 }),
        });
      });

      await page.goto("/projects");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareScreenshot("projects-empty");
    });
  });

  test.describe("Print Styles Visual Tests", () => {
    test("homepage print layout", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await visualUtils.comparePrintStyles("homepage-print");
    });

    test("blog post print layout", async ({ page }) => {
      await page.goto("/blog");
      await page.waitForLoadState("networkidle");

      // Navigate to first blog post if available
      const firstBlogPost = page.locator('[data-testid="blog-card"] a').first();
      if (await firstBlogPost.isVisible()) {
        await firstBlogPost.click();
        await page.waitForLoadState("networkidle");

        await visualUtils.comparePrintStyles("blog-post-print");
      }
    });
  });

  test.describe("Accessibility Visual Tests", () => {
    test("high contrast mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareHighContrastMode("homepage-high-contrast");
    });

    test("reduced motion preferences", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareReducedMotion("homepage-reduced-motion");
    });

    test("focus indicators", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Focus on interactive elements
      const focusableElements = [
        "a[href]",
        "button",
        "input",
        '[tabindex="0"]',
      ];

      for (const selector of focusableElements) {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          await element.focus();
          await page.waitForTimeout(200);

          await visualUtils.compareElementScreenshot(
            selector,
            `focus-${selector.replace(/[^\w]/g, "-")}`,
            { threshold: 0.1 }
          );
          break; // Test first available element
        }
      }
    });
  });

  test.describe("Cross-Browser Visual Tests", () => {
    test("homepage cross-browser compatibility", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await visualUtils.compareScreenshot(`homepage-${browserName}`, {
        fullPage: true,
        mask: [
          '[data-testid="typewriter-text"]',
          '[data-testid="three-background"]',
        ],
      });
    });
  });
});
