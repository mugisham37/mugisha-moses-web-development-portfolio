/**
 * Comprehensive test configuration for the brutalist portfolio
 * Centralizes all testing settings and environment variables
 */

const path = require("path");

// Test environment configuration
const testConfig = {
  // Environment settings
  environment: {
    NODE_ENV: "test",
    TEST_DATABASE_URL:
      process.env.TEST_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "postgresql://test:test@localhost:5432/test_brutalist_portfolio",
    NEXTAUTH_SECRET: "test-secret-key-for-testing-only",
    NEXTAUTH_URL: "http://localhost:3000",
    SKIP_E2E: process.env.SKIP_E2E || "false",
    SKIP_VISUAL: process.env.SKIP_VISUAL || "false",
    CI: process.env.CI || "false",
  },

  // Jest configuration
  jest: {
    // Unit tests
    unit: {
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
      moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
      testMatch: [
        "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      ],
      testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/",
        "<rootDir>/e2e/",
        "<rootDir>/src/**/*.db.test.{js,jsx,ts,tsx}",
      ],
      collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.stories.{js,jsx,ts,tsx}",
        "!src/**/index.{js,jsx,ts,tsx}",
        "!src/app/**/layout.tsx",
        "!src/app/**/loading.tsx",
        "!src/app/**/error.tsx",
        "!src/app/**/not-found.tsx",
        "!src/app/**/page.tsx",
      ],
      coverageThreshold: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
      coverageReporters: ["text", "lcov", "html", "json"],
      coverageDirectory: "coverage/unit",
    },

    // Integration tests (database)
    integration: {
      displayName: "Integration Tests",
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/jest.db.setup.js"],
      testMatch: [
        "<rootDir>/src/**/*.db.test.{js,jsx,ts,tsx}",
        "<rootDir>/tests/integration/**/*.test.{js,jsx,ts,tsx}",
      ],
      moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
      collectCoverageFrom: [
        "src/lib/db*.ts",
        "src/lib/**/db*.ts",
        "src/app/api/**/*.ts",
        "!src/**/*.d.ts",
      ],
      coverageDirectory: "coverage/integration",
      testTimeout: 30000,
    },
  },

  // Playwright configuration
  playwright: {
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
      ["html", { outputFolder: "test-results/playwright-report" }],
      ["json", { outputFile: "test-results/playwright-results.json" }],
      ["junit", { outputFile: "test-results/playwright-results.xml" }],
    ],
    use: {
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
      trace: "on-first-retry",
      screenshot: "only-on-failure",
      video: "retain-on-failure",
    },
    projects: [
      {
        name: "chromium",
        use: { ...require("@playwright/test").devices["Desktop Chrome"] },
      },
      {
        name: "firefox",
        use: { ...require("@playwright/test").devices["Desktop Firefox"] },
      },
      {
        name: "webkit",
        use: { ...require("@playwright/test").devices["Desktop Safari"] },
      },
      {
        name: "Mobile Chrome",
        use: { ...require("@playwright/test").devices["Pixel 5"] },
      },
      {
        name: "Mobile Safari",
        use: { ...require("@playwright/test").devices["iPhone 12"] },
      },
    ],
    webServer: {
      command: "npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    globalSetup: require.resolve("./e2e/global-setup.ts"),
    globalTeardown: require.resolve("./e2e/global-teardown.ts"),
    timeout: 30 * 1000,
    expect: {
      timeout: 10 * 1000,
    },
    outputDir: "test-results/",
  },

  // Storybook test configuration
  storybook: {
    url: "http://localhost:6006",
    browsers: ["chromium"],
    stories: "src/**/*.stories.@(js|jsx|ts|tsx)",
  },

  // Coverage thresholds
  coverage: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    perFile: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Test data configuration
  testData: {
    // Mock API responses
    mockDelay: 100,

    // Database seeding
    seedData: {
      users: 5,
      projects: 10,
      blogPosts: 8,
      testimonials: 6,
      contacts: 15,
    },

    // File paths
    fixtures: path.join(__dirname, "tests/fixtures"),
    screenshots: path.join(__dirname, "test-results/screenshots"),
    videos: path.join(__dirname, "test-results/videos"),
  },

  // Performance thresholds
  performance: {
    // Lighthouse thresholds
    lighthouse: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 95,
    },

    // Core Web Vitals
    webVitals: {
      lcp: 2500, // Largest Contentful Paint (ms)
      fid: 100, // First Input Delay (ms)
      cls: 0.1, // Cumulative Layout Shift
      fcp: 1800, // First Contentful Paint (ms)
      tti: 3800, // Time to Interactive (ms)
    },

    // Bundle size limits
    bundleSize: {
      maxSize: "500kb",
      maxGzipSize: "150kb",
    },
  },

  // Accessibility configuration
  accessibility: {
    // axe-core rules
    rules: {
      "color-contrast": { enabled: false }, // Disabled for automated testing
      "aria-allowed-attr": { enabled: true },
      "aria-required-attr": { enabled: true },
      "button-name": { enabled: true },
      "duplicate-id": { enabled: true },
      "form-field-multiple-labels": { enabled: true },
      "html-has-lang": { enabled: true },
      "image-alt": { enabled: true },
      label: { enabled: true },
      "link-name": { enabled: true },
    },
    tags: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
  },

  // Visual regression configuration
  visual: {
    threshold: 0.2,
    maxDiffPixels: 100,
    animations: "disabled",

    // Viewports for responsive testing
    viewports: [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ],

    // Elements to mask in screenshots
    maskSelectors: [
      '[data-testid="current-time"]',
      '[data-testid="random-content"]',
      '[data-testid="github-activity"]',
      ".loading-spinner",
      '[data-testid="typewriter-text"]',
      '[data-testid="three-background"]',
    ],
  },

  // CI/CD configuration
  ci: {
    // Parallel execution
    maxWorkers: process.env.CI ? 2 : 4,

    // Timeouts
    testTimeout: process.env.CI ? 60000 : 30000,

    // Retries
    retries: process.env.CI ? 2 : 0,

    // Reporting
    reporters: process.env.CI
      ? ["json", "junit", "github-actions"]
      : ["verbose", "html"],
  },
};

module.exports = testConfig;
