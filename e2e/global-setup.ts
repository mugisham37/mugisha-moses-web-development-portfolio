import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting global setup for E2E tests...");

  // Create a browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the application to be ready
    console.log("⏳ Waiting for application to be ready...");
    await page.goto(config.projects[0].use.baseURL || "http://localhost:3000");

    // Wait for the main content to load
    await page.waitForSelector("main", { timeout: 30000 });

    console.log("✅ Application is ready for testing");

    // Seed test data if needed
    if (process.env.NODE_ENV === "test") {
      console.log("🌱 Seeding test data...");
      // Add any test data seeding logic here
    }
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log("✅ Global setup completed");
}

export default globalSetup;
