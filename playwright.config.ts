import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for Cross-Browser Testing
 * Comprehensive testing across different browsers, devices, and scenarios
 */
export default defineConfig({
  // Test directory
  testDir: "./tests/e2e",

  // Global test timeout
  timeout: 30000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "test-results/html-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["list"],
    ...(process.env.CI ? [["github"]] : []),
  ],

  // Global setup and teardown
  globalSetup: require.resolve("./tests/global-setup.ts"),
  globalTeardown: require.resolve("./tests/global-teardown.ts"),

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Record video on failure
    video: "retain-on-failure",

    // Take screenshot on failure
    screenshot: "only-on-failure",

    // Global test timeout
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 15000,

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Locale and timezone
    locale: "en-US",
    timezoneId: "America/New_York",

    // Color scheme
    colorScheme: "dark",

    // Viewport (will be overridden by device-specific projects)
    viewport: { width: 1280, height: 720 },

    // User agent (will be overridden by browser-specific projects)
    userAgent: "Mozilla/5.0 (compatible; PlaywrightTesting/1.0)",

    // Extra HTTP headers
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },
  },

  // Configure projects for major browsers and devices
  projects: [
    // Desktop Browsers - Latest Versions
    {
      name: "chromium-latest",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "firefox-latest",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "webkit-latest",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "edge-latest",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Desktop Browsers - Previous Versions (for compatibility testing)
    {
      name: "chrome-previous",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome-beta",
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "firefox-previous",
      use: {
        ...devices["Desktop Firefox"],
        // Note: Playwright doesn't support specific Firefox versions easily
        viewport: { width: 1366, height: 768 },
      },
    },

    // Mobile Devices - iOS
    {
      name: "iphone-12",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "iphone-12-pro",
      use: { ...devices["iPhone 12 Pro"] },
    },
    {
      name: "iphone-se",
      use: { ...devices["iPhone SE"] },
    },
    {
      name: "ipad",
      use: { ...devices["iPad"] },
    },
    {
      name: "ipad-pro",
      use: { ...devices["iPad Pro"] },
    },

    // Mobile Devices - Android
    {
      name: "pixel-5",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "galaxy-s21",
      use: { ...devices["Galaxy S21"] },
    },
    {
      name: "galaxy-tab-s4",
      use: { ...devices["Galaxy Tab S4"] },
    },

    // Desktop - Different Resolutions
    {
      name: "desktop-1440p",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 2560, height: 1440 },
      },
    },
    {
      name: "desktop-1080p",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "desktop-768p",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
      },
    },

    // Accessibility Testing
    {
      name: "accessibility-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        // Force high contrast mode
        colorScheme: "dark",
        reducedMotion: "reduce",
      },
    },
    {
      name: "accessibility-firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 720 },
        colorScheme: "light",
        reducedMotion: "reduce",
      },
    },

    // Performance Testing
    {
      name: "performance-slow-3g",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        // Simulate slow 3G connection
        launchOptions: {
          args: [
            "--enable-features=NetworkService",
            "--force-effective-connection-type=3g",
          ],
        },
      },
    },
    {
      name: "performance-fast-3g",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: [
            "--enable-features=NetworkService",
            "--force-effective-connection-type=4g",
          ],
        },
      },
    },

    // Legacy Browser Simulation
    {
      name: "legacy-browser",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
        launchOptions: {
          args: [
            "--disable-features=VizDisplayCompositor",
            "--disable-gpu",
            "--disable-dev-shm-usage",
          ],
        },
      },
    },
  ],

  // Output directory for test results
  outputDir: "test-results/",

  // Web server configuration for local testing
  webServer: {
    command: "npm run build && npm start",
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      NODE_ENV: "test",
    },
  },

  // Test configuration
  testIgnore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],

  // Global test patterns
  testMatch: ["**/*.spec.ts", "**/*.test.ts", "**/*.e2e.ts"],
});
