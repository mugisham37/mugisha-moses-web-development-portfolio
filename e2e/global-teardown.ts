import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Starting global teardown for E2E tests...");

  try {
    // Clean up test data if needed
    if (process.env.NODE_ENV === "test") {
      console.log("🗑️ Cleaning up test data...");
      // Add any cleanup logic here
    }

    console.log("✅ Global teardown completed");
  } catch (error) {
    console.error("❌ Global teardown failed:", error);
    // Don't throw here to avoid masking test failures
  }
}

export default globalTeardown;
