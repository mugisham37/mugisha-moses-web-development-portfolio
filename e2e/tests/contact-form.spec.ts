import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/base-page";

test.describe("Contact Form", () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.navigate("/contact");
  });

  test("should display contact form with all fields", async ({ page }) => {
    // Check form elements
    await expect(
      page.locator('form[data-testid="contact-form"]')
    ).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Should show validation errors
    await expect(page.locator('[data-testid="error-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await basePage.helpers.fillField('input[name="name"]', "Test User");
    await basePage.helpers.fillField('input[name="email"]', "invalid-email");
    await basePage.helpers.fillField(
      'textarea[name="message"]',
      "Test message"
    );

    await page.locator('button[type="submit"]').click();

    // Should show email validation error
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toContainText(
      "valid email"
    );
  });

  test("should submit form successfully with valid data", async ({ page }) => {
    // Mock the API response
    await basePage.helpers.mockApiResponse("/api/contact", {
      success: true,
      message: "Message sent successfully",
    });

    // Fill form with valid data
    await basePage.helpers.fillField('input[name="name"]', "John Doe");
    await basePage.helpers.fillField('input[name="email"]', "john@example.com");
    await basePage.helpers.fillField(
      'input[name="subject"]',
      "Project Inquiry"
    );
    await basePage.helpers.fillField(
      'textarea[name="message"]',
      "I would like to discuss a project with you."
    );

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "sent successfully"
    );
  });

  test("should handle form submission errors", async ({ page }) => {
    // Mock API error response
    await basePage.helpers.mockApiResponse(
      "/api/contact",
      {
        success: false,
        error: "Server error",
      },
      500
    );

    // Fill and submit form
    await basePage.helpers.fillField('input[name="name"]', "John Doe");
    await basePage.helpers.fillField('input[name="email"]', "john@example.com");
    await basePage.helpers.fillField(
      'textarea[name="message"]',
      "Test message"
    );

    await page.locator('button[type="submit"]').click();

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test("should show loading state during submission", async ({ page }) => {
    // Mock delayed API response
    await page.route("/api/contact", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Fill and submit form
    await basePage.helpers.fillField('input[name="name"]', "John Doe");
    await basePage.helpers.fillField('input[name="email"]', "john@example.com");
    await basePage.helpers.fillField(
      'textarea[name="message"]',
      "Test message"
    );

    await page.locator('button[type="submit"]').click();

    // Should show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test("should display contact methods", async ({ page }) => {
    // Check contact methods section
    await expect(page.locator('[data-testid="contact-methods"]')).toBeVisible();

    // Should have email link
    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();

    // Should have social media links
    const socialLinks = page.locator('[data-testid="social-links"] a');
    const socialCount = await socialLinks.count();
    expect(socialCount).toBeGreaterThan(0);
  });

  test("should have consultation booking form", async ({ page }) => {
    // Check if consultation form exists
    const consultationForm = page.locator('[data-testid="consultation-form"]');

    if (await consultationForm.isVisible()) {
      // Should have calendar integration
      await expect(
        page.locator('[data-testid="calendar-widget"]')
      ).toBeVisible();

      // Should have service selection
      await expect(page.locator('select[name="service"]')).toBeVisible();

      // Should have budget range
      await expect(page.locator('select[name="budget"]')).toBeVisible();
    }
  });

  test("should prevent spam submissions", async ({ page }) => {
    // Fill and submit form multiple times quickly
    const formData = {
      name: "Spam User",
      email: "spam@example.com",
      message: "Spam message",
    };

    for (let i = 0; i < 3; i++) {
      await basePage.helpers.fillField('input[name="name"]', formData.name);
      await basePage.helpers.fillField('input[name="email"]', formData.email);
      await basePage.helpers.fillField(
        'textarea[name="message"]',
        formData.message
      );

      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(100);
    }

    // Should show rate limiting message
    await expect(
      page.locator('[data-testid="rate-limit-message"]')
    ).toBeVisible();
  });

  test("should be accessible", async ({ page }) => {
    // Check form accessibility
    const accessibilityIssues = await basePage.helpers.checkAccessibility();

    // Form should have proper labels
    const formIssues = accessibilityIssues.filter(
      (issue) => issue.includes("Input missing label") || issue.includes("form")
    );
    expect(formIssues).toHaveLength(0);

    // Test keyboard navigation
    await page.keyboard.press("Tab"); // Skip nav
    await page.keyboard.press("Tab"); // First form field

    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).toBe("INPUT");
  });

  test("should work on mobile devices", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Form should be responsive
    const form = page.locator('form[data-testid="contact-form"]');
    await expect(form).toBeVisible();

    // Fields should be touch-friendly
    const nameInput = page.locator('input[name="name"]');
    const inputBox = await nameInput.boundingBox();

    // Touch target should be at least 44px high
    expect(inputBox?.height).toBeGreaterThanOrEqual(44);
  });

  test("should handle network failures gracefully", async ({ page }) => {
    // Simulate network failure
    await page.route("/api/contact", (route) => route.abort());

    // Fill and submit form
    await basePage.helpers.fillField('input[name="name"]', "John Doe");
    await basePage.helpers.fillField('input[name="email"]', "john@example.com");
    await basePage.helpers.fillField(
      'textarea[name="message"]',
      "Test message"
    );

    await page.locator('button[type="submit"]').click();

    // Should show network error message
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();

    // Form should remain filled for retry
    await expect(page.locator('input[name="name"]')).toHaveValue("John Doe");
  });
});
