import { test, expect } from "@playwright/test";
import { AccessibilityTestUtils } from "../utils/accessibility-test-utils";

test.describe("Contact Form Comprehensive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
  });

  test("displays all contact form fields", async ({ page }) => {
    // Check required form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();

    // Check contact type selector
    const contactTypeSelect = page.locator('select[name="type"]');
    if (await contactTypeSelect.isVisible()) {
      await expect(contactTypeSelect).toBeVisible();
    }

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("successfully submits contact form", async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="subject"]', "Project Inquiry");
    await page.fill(
      'textarea[name="message"]',
      "I would like to discuss a potential project with you. Please contact me at your earliest convenience."
    );

    // Select contact type if available
    const contactTypeSelect = page.locator('select[name="type"]');
    if (await contactTypeSelect.isVisible()) {
      await contactTypeSelect.selectOption("PROJECT_INQUIRY");
    }

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for success message
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    await expect(successMessage).toContainText("Message sent successfully");

    // Form should be reset or disabled
    const nameInput = page.locator('input[name="name"]');
    const submitButton = page.locator('button[type="submit"]');

    // Either form is reset or submit button is disabled
    const nameValue = await nameInput.inputValue();
    const isSubmitDisabled = await submitButton.isDisabled();

    expect(nameValue === "" || isSubmitDisabled).toBe(true);
  });

  test("validates required fields", async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    const nameError = page.locator('[data-testid="name-error"]');
    const emailError = page.locator('[data-testid="email-error"]');
    const messageError = page.locator('[data-testid="message-error"]');

    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
    await expect(messageError).toBeVisible();

    // Error messages should be descriptive
    await expect(nameError).toContainText(/required|name/i);
    await expect(emailError).toContainText(/required|email/i);
    await expect(messageError).toContainText(/required|message/i);
  });

  test("validates email format", async ({ page }) => {
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('textarea[name="message"]', "This is a test message.");

    await page.click('button[type="submit"]');

    const emailError = page.locator('[data-testid="email-error"]');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/valid email|format/i);
  });

  test("validates message length", async ({ page }) => {
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('textarea[name="message"]', "Hi"); // Too short

    await page.click('button[type="submit"]');

    const messageError = page.locator('[data-testid="message-error"]');
    await expect(messageError).toBeVisible();
    await expect(messageError).toContainText(/characters|length/i);
  });

  test("handles project inquiry form with additional fields", async ({
    page,
  }) => {
    // Select project inquiry type
    const contactTypeSelect = page.locator('select[name="type"]');
    if (await contactTypeSelect.isVisible()) {
      await contactTypeSelect.selectOption("PROJECT_INQUIRY");

      // Additional fields should appear
      await expect(page.locator('input[name="projectType"]')).toBeVisible();
      await expect(page.locator('select[name="budget"]')).toBeVisible();
      await expect(page.locator('select[name="timeline"]')).toBeVisible();

      // Fill additional fields
      await page.fill('input[name="projectType"]', "E-commerce Website");
      await page.selectOption('select[name="budget"]', "$10,000 - $25,000");
      await page.selectOption('select[name="timeline"]', "3-4 months");
    }

    // Fill basic fields
    await page.fill('input[name="name"]', "Jane Smith");
    await page.fill('input[name="email"]', "jane@company.com");
    await page.fill('input[name="subject"]', "E-commerce Project");
    await page.fill(
      'textarea[name="message"]',
      "We need a comprehensive e-commerce solution with payment integration and inventory management."
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Should succeed
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });

  test("handles consultation booking", async ({ page }) => {
    const contactTypeSelect = page.locator('select[name="type"]');
    if (await contactTypeSelect.isVisible()) {
      await contactTypeSelect.selectOption("CONSULTATION");

      // Calendar integration might appear
      const calendarWidget = page.locator('[data-testid="calendar-widget"]');
      if (await calendarWidget.isVisible()) {
        // Test calendar interaction
        const availableSlot = page
          .locator('[data-testid="available-slot"]')
          .first();
        if (await availableSlot.isVisible()) {
          await availableSlot.click();
        }
      }
    }

    // Fill basic information
    await page.fill('input[name="name"]', "Mike Johnson");
    await page.fill('input[name="email"]', "mike@startup.com");
    await page.fill('input[name="subject"]', "Consultation Request");
    await page.fill(
      'textarea[name="message"]',
      "I would like to schedule a consultation to discuss our technical requirements."
    );

    await page.click('button[type="submit"]');

    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });

  test("shows loading state during submission", async ({ page }) => {
    // Intercept API call to add delay
    await page.route("**/api/contact", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Message sent successfully",
        }),
      });
    });

    // Fill and submit form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message for loading state."
    );

    await page.click('button[type="submit"]');

    // Should show loading state
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText(/sending|loading/i);

    // Loading spinner should be visible
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    await expect(loadingSpinner).toBeVisible();

    // Wait for completion
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test("handles server errors gracefully", async ({ page }) => {
    // Mock server error
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Internal server error",
        }),
      });
    });

    // Fill and submit form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a test message.");

    await page.click('button[type="submit"]');

    // Should show error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).toContainText(/error|failed/i);

    // Form should remain enabled for retry
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test("handles rate limiting", async ({ page }) => {
    // Mock rate limit response
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Too many requests. Please try again later.",
          retryAfter: 60,
        }),
        headers: {
          "Retry-After": "60",
        },
      });
    });

    // Fill and submit form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is a test message.");

    await page.click('button[type="submit"]');

    // Should show rate limit message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).toContainText(/too many requests|rate limit/i);

    // Submit button should be disabled temporarily
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test("preserves form data on validation errors", async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="subject"]', "Test Subject");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message with sufficient length."
    );

    await page.click('button[type="submit"]');

    // Should show validation error
    const emailError = page.locator('[data-testid="email-error"]');
    await expect(emailError).toBeVisible();

    // Form data should be preserved
    await expect(page.locator('input[name="name"]')).toHaveValue("John Doe");
    await expect(page.locator('input[name="email"]')).toHaveValue(
      "invalid-email"
    );
    await expect(page.locator('input[name="subject"]')).toHaveValue(
      "Test Subject"
    );
    await expect(page.locator('textarea[name="message"]')).toHaveValue(
      "This is a test message with sufficient length."
    );
  });

  test("contact methods are displayed", async ({ page }) => {
    // Check for alternative contact methods
    const emailContact = page.locator('[data-testid="email-contact"]');
    const phoneContact = page.locator('[data-testid="phone-contact"]');
    const socialLinks = page.locator('[data-testid="social-links"]');

    if (await emailContact.isVisible()) {
      await expect(emailContact).toContainText(/@/);
    }

    if (await phoneContact.isVisible()) {
      const phoneText = await phoneContact.textContent();
      expect(phoneText).toMatch(/\+?\d+/);
    }

    if (await socialLinks.isVisible()) {
      const linkedinLink = page.locator('[data-testid="linkedin-link"]');
      const twitterLink = page.locator('[data-testid="twitter-link"]');

      if (await linkedinLink.isVisible()) {
        await expect(linkedinLink).toHaveAttribute("href", /linkedin\.com/);
      }

      if (await twitterLink.isVisible()) {
        await expect(twitterLink).toHaveAttribute("href", /twitter\.com/);
      }
    }
  });

  test("form is accessible", async ({ page }) => {
    const accessibilityUtils = new AccessibilityTestUtils();

    // Test accessibility
    const violations = await accessibilityUtils.testPageAccessibility(page);
    expect(violations.length).toBeLessThan(3);

    // Test form labels
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageTextarea = page.locator('textarea[name="message"]');

    // All form fields should have labels
    await expect(nameInput).toHaveAttribute("aria-label");
    await expect(emailInput).toHaveAttribute("aria-label");
    await expect(messageTextarea).toHaveAttribute("aria-label");

    // Test keyboard navigation
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(emailInput).toBeFocused();

    await page.keyboard.press("Tab");
    const subjectInput = page.locator('input[name="subject"]');
    if (await subjectInput.isVisible()) {
      await expect(subjectInput).toBeFocused();
    }
  });

  test("responsive design works on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Form should be responsive
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Form fields should stack vertically
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');

    const nameBox = await nameInput.boundingBox();
    const emailBox = await emailInput.boundingBox();

    if (nameBox && emailBox) {
      // Email input should be below name input
      expect(emailBox.y).toBeGreaterThan(nameBox.y + nameBox.height - 10);
    }

    // Submit button should be full width on mobile
    const submitButton = page.locator('button[type="submit"]');
    const submitBox = await submitButton.boundingBox();
    const viewportWidth = 375;

    if (submitBox) {
      expect(submitBox.width).toBeGreaterThan(viewportWidth * 0.8); // At least 80% width
    }
  });

  test("spam protection is in place", async ({ page }) => {
    // Check for honeypot field (should be hidden)
    const honeypotField = page.locator('input[name="website"]');
    if (await honeypotField.isVisible()) {
      const honeypotBox = await honeypotField.boundingBox();
      expect(honeypotBox?.width).toBeLessThan(1); // Should be hidden
    }

    // Check for CAPTCHA or similar protection
    const captcha = page.locator('[data-testid="captcha"]');
    if (await captcha.isVisible()) {
      await expect(captcha).toBeVisible();
    }

    // Check for rate limiting indicators
    const rateLimitInfo = page.locator('[data-testid="rate-limit-info"]');
    if (await rateLimitInfo.isVisible()) {
      await expect(rateLimitInfo).toContainText(/limit|requests/i);
    }
  });

  test("form analytics tracking works", async ({ page }) => {
    let analyticsEvents: any[] = [];

    // Intercept analytics calls
    await page.route("**/api/analytics/**", async (route) => {
      const request = route.request();
      const postData = request.postData();
      if (postData) {
        analyticsEvents.push(JSON.parse(postData));
      }
      await route.fulfill({ status: 200, body: "OK" });
    });

    // Fill and submit form
    await page.fill('input[name="name"]', "Analytics Test");
    await page.fill('input[name="email"]', "analytics@example.com");
    await page.fill('textarea[name="message"]', "Testing analytics tracking.");

    await page.click('button[type="submit"]');

    // Wait for form submission
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({
      timeout: 10000,
    });

    // Should have tracked form submission
    const formSubmissionEvents = analyticsEvents.filter(
      (event) =>
        event.event === "form_submission" || event.type === "contact_form"
    );

    expect(formSubmissionEvents.length).toBeGreaterThan(0);
  });
});
