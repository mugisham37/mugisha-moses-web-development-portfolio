import { chromium, FullConfig } from "@playwright/test";

/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting global test setup...");

  // Launch a browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Verify the application is running
    const baseURL = config.projects[0].use.baseURL || "http://localhost:3000";
    console.log(`📡 Checking if application is available at ${baseURL}`);

    await page.goto(baseURL, { timeout: 30000 });

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify critical elements are present
    const title = await page.title();
    if (!title.includes("Portfolio")) {
      throw new Error("Application does not appear to be running correctly");
    }

    console.log("✅ Application is running and accessible");

    // Warm up the application by visiting key pages
    const pagesToWarmUp = ["/", "/projects", "/blog", "/services", "/contact"];

    for (const path of pagesToWarmUp) {
      try {
        console.log(`🔥 Warming up ${path}`);
        await page.goto(`${baseURL}${path}`, { timeout: 10000 });
        await page.waitForLoadState("networkidle");
      } catch (error) {
        console.warn(`⚠️  Could not warm up ${path}:`, error);
      }
    }

    // Check for any critical JavaScript errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    // Navigate to home page and wait for any errors
    await page.goto(baseURL);
    await page.waitForTimeout(3000);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("analytics") &&
        !error.includes("third-party") &&
        !error.includes("Extension")
    );

    if (criticalErrors.length > 0) {
      console.warn(
        "⚠️  JavaScript errors detected during setup:",
        criticalErrors
      );
    }

    // Set up test data or state if needed
    console.log("📝 Setting up test data...");

    // You can add any test data setup here
    // For example, creating test users, seeding database, etc.

    // Store any global state that tests might need
    process.env.TEST_BASE_URL = baseURL;
    process.env.TEST_SETUP_COMPLETE = "true";

    console.log("✅ Global setup completed successfully");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
