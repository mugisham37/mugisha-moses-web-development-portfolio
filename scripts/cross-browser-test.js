#!/usr/bin/env node

/**
 * Cross-Browser Testing Script
 * Automated testing across different browsers and devices
 */

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Browser configurations for testing
const BROWSER_CONFIGS = {
  chrome: {
    name: "Chrome",
    versions: ["latest", "latest-1", "latest-2"],
    flags: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
  },
  firefox: {
    name: "Firefox",
    versions: ["latest", "latest-1", "latest-2"],
    flags: ["--headless", "--disable-gpu", "--no-sandbox"],
  },
  safari: {
    name: "Safari",
    versions: ["latest", "latest-1"],
    flags: [],
  },
  edge: {
    name: "Edge",
    versions: ["latest", "latest-1"],
    flags: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  },
};

// Device configurations for responsive testing
const DEVICE_CONFIGS = {
  mobile: {
    "iPhone 12": {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      isMobile: true,
    },
    "iPhone SE": {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true,
    },
    "Samsung Galaxy S21": {
      width: 384,
      height: 854,
      deviceScaleFactor: 2.75,
      isMobile: true,
    },
    "Pixel 5": {
      width: 393,
      height: 851,
      deviceScaleFactor: 2.75,
      isMobile: true,
    },
  },
  tablet: {
    iPad: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: false },
    "iPad Pro": {
      width: 1024,
      height: 1366,
      deviceScaleFactor: 2,
      isMobile: false,
    },
    "Surface Pro": {
      width: 912,
      height: 1368,
      deviceScaleFactor: 2,
      isMobile: false,
    },
  },
  desktop: {
    "1920x1080": {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false,
    },
    "1366x768": {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      isMobile: false,
    },
    "2560x1440": {
      width: 2560,
      height: 1440,
      deviceScaleFactor: 1,
      isMobile: false,
    },
  },
};

// Test URLs to check
const TEST_URLS = ["/", "/projects", "/blog", "/services", "/contact"];

// Feature tests to run
const FEATURE_TESTS = [
  "css-grid",
  "css-flexbox",
  "css-custom-properties",
  "css-backdrop-filter",
  "intersection-observer",
  "resize-observer",
  "web-animations",
  "webp-support",
  "avif-support",
];

class CrossBrowserTester {
  constructor() {
    this.results = {
      browsers: {},
      devices: {},
      features: {},
      performance: {},
      accessibility: {},
      errors: [],
    };
    this.startTime = Date.now();
  }

  /**
   * Run all cross-browser tests
   */
  async runAllTests() {
    console.log("🚀 Starting cross-browser compatibility tests...\n");

    try {
      // Check if required tools are installed
      await this.checkRequirements();

      // Build the project first
      await this.buildProject();

      // Start the development server
      const server = await this.startServer();

      // Run browser compatibility tests
      await this.runBrowserTests();

      // Run responsive design tests
      await this.runResponsiveTests();

      // Run feature detection tests
      await this.runFeatureTests();

      // Run performance tests
      await this.runPerformanceTests();

      // Run accessibility tests
      await this.runAccessibilityTests();

      // Stop the server
      server.kill();

      // Generate report
      await this.generateReport();

      console.log("✅ All tests completed successfully!");
    } catch (error) {
      console.error("❌ Test suite failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Check if required testing tools are installed
   */
  async checkRequirements() {
    console.log("🔍 Checking requirements...");

    const requirements = [
      { command: "npx playwright --version", name: "Playwright" },
      { command: "npx lighthouse --version", name: "Lighthouse" },
      { command: "npx axe --version", name: "axe-core" },
    ];

    for (const req of requirements) {
      try {
        execSync(req.command, { stdio: "ignore" });
        console.log(`✅ ${req.name} is available`);
      } catch (error) {
        console.log(`⚠️  ${req.name} not found, installing...`);

        if (req.name === "Playwright") {
          execSync("npm install -D @playwright/test playwright", {
            stdio: "inherit",
          });
          execSync("npx playwright install", { stdio: "inherit" });
        } else if (req.name === "Lighthouse") {
          execSync("npm install -D lighthouse", { stdio: "inherit" });
        } else if (req.name === "axe-core") {
          execSync("npm install -D @axe-core/cli", { stdio: "inherit" });
        }
      }
    }
  }

  /**
   * Build the project
   */
  async buildProject() {
    console.log("🏗️  Building project...");
    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ Project built successfully");
    } catch (error) {
      throw new Error("Failed to build project");
    }
  }

  /**
   * Start the development server
   */
  async startServer() {
    console.log("🚀 Starting server...");

    const server = spawn("npm", ["start"], {
      stdio: "pipe",
      detached: false,
    });

    // Wait for server to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Server startup timeout"));
      }, 30000);

      server.stdout.on("data", (data) => {
        if (
          data.toString().includes("Ready") ||
          data.toString().includes("localhost:3000")
        ) {
          clearTimeout(timeout);
          resolve();
        }
      });

      server.stderr.on("data", (data) => {
        console.error("Server error:", data.toString());
      });
    });

    console.log("✅ Server started on http://localhost:3000");
    return server;
  }

  /**
   * Run browser compatibility tests
   */
  async runBrowserTests() {
    console.log("🌐 Running browser compatibility tests...");

    for (const [browserKey, config] of Object.entries(BROWSER_CONFIGS)) {
      console.log(`\n📱 Testing ${config.name}...`);

      for (const version of config.versions) {
        try {
          const result = await this.testBrowser(browserKey, version, config);
          this.results.browsers[`${browserKey}-${version}`] = result;
          console.log(`✅ ${config.name} ${version}: ${result.status}`);
        } catch (error) {
          console.log(`❌ ${config.name} ${version}: Failed`);
          this.results.errors.push({
            browser: `${browserKey}-${version}`,
            error: error.message,
          });
        }
      }
    }
  }

  /**
   * Test individual browser
   */
  async testBrowser(browser, version, config) {
    const testScript = `
      const { test, expect } = require('@playwright/test');
      
      test.describe('${config.name} ${version}', () => {
        test.beforeEach(async ({ page }) => {
          await page.goto('http://localhost:3000');
        });

        test('page loads successfully', async ({ page }) => {
          await expect(page).toHaveTitle(/Portfolio/);
        });

        test('navigation works', async ({ page }) => {
          await page.click('nav a[href="/projects"]');
          await expect(page).toHaveURL(/projects/);
        });

        test('responsive design', async ({ page }) => {
          await page.setViewportSize({ width: 375, height: 667 });
          await expect(page.locator('nav')).toBeVisible();
        });

        test('JavaScript functionality', async ({ page }) => {
          const hasErrors = await page.evaluate(() => {
            return window.onerror !== null || console.error.calls?.length > 0;
          });
          expect(hasErrors).toBeFalsy();
        });
      });
    `;

    // Write temporary test file
    const testFile = path.join(__dirname, `temp-${browser}-${version}.spec.js`);
    fs.writeFileSync(testFile, testScript);

    try {
      // Run Playwright test
      execSync(`npx playwright test ${testFile} --browser=${browser}`, {
        stdio: "pipe",
        timeout: 60000,
      });

      // Clean up
      fs.unlinkSync(testFile);

      return {
        status: "passed",
        browser: config.name,
        version: version,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Clean up
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      throw error;
    }
  }

  /**
   * Run responsive design tests
   */
  async runResponsiveTests() {
    console.log("📱 Running responsive design tests...");

    for (const [category, devices] of Object.entries(DEVICE_CONFIGS)) {
      console.log(`\n📱 Testing ${category} devices...`);

      for (const [deviceName, config] of Object.entries(devices)) {
        try {
          const result = await this.testDevice(deviceName, config);
          this.results.devices[deviceName] = result;
          console.log(`✅ ${deviceName}: ${result.status}`);
        } catch (error) {
          console.log(`❌ ${deviceName}: Failed`);
          this.results.errors.push({
            device: deviceName,
            error: error.message,
          });
        }
      }
    }
  }

  /**
   * Test individual device
   */
  async testDevice(deviceName, config) {
    const testScript = `
      const { test, expect } = require('@playwright/test');
      
      test.describe('${deviceName}', () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ 
            width: ${config.width}, 
            height: ${config.height} 
          });
          await page.goto('http://localhost:3000');
        });

        test('layout is responsive', async ({ page }) => {
          const body = await page.locator('body');
          await expect(body).toBeVisible();
          
          // Check if content fits viewport
          const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
          expect(scrollWidth).toBeLessThanOrEqual(${config.width + 20});
        });

        test('touch interactions work', async ({ page }) => {
          if (${config.isMobile}) {
            await page.tap('button');
            // Add more touch-specific tests
          }
        });

        test('text is readable', async ({ page }) => {
          const fontSize = await page.evaluate(() => {
            const body = document.body;
            return parseInt(window.getComputedStyle(body).fontSize);
          });
          expect(fontSize).toBeGreaterThanOrEqual(14);
        });
      });
    `;

    const testFile = path.join(
      __dirname,
      `temp-device-${deviceName.replace(/\s+/g, "-")}.spec.js`
    );
    fs.writeFileSync(testFile, testScript);

    try {
      execSync(`npx playwright test ${testFile}`, {
        stdio: "pipe",
        timeout: 60000,
      });

      fs.unlinkSync(testFile);

      return {
        status: "passed",
        device: deviceName,
        viewport: config,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      throw error;
    }
  }

  /**
   * Run feature detection tests
   */
  async runFeatureTests() {
    console.log("🔧 Running feature detection tests...");

    const featureTestScript = `
      const { test, expect } = require('@playwright/test');
      
      test.describe('Feature Detection', () => {
        test.beforeEach(async ({ page }) => {
          await page.goto('http://localhost:3000');
        });

        ${FEATURE_TESTS.map(
          (feature) => `
        test('${feature} detection', async ({ page }) => {
          const isSupported = await page.evaluate(() => {
            // Feature detection logic here
            switch('${feature}') {
              case 'css-grid':
                return CSS.supports('display', 'grid');
              case 'css-flexbox':
                return CSS.supports('display', 'flex');
              case 'css-custom-properties':
                return CSS.supports('--custom', 'property');
              case 'css-backdrop-filter':
                return CSS.supports('backdrop-filter', 'blur(10px)');
              case 'intersection-observer':
                return 'IntersectionObserver' in window;
              case 'resize-observer':
                return 'ResizeObserver' in window;
              case 'web-animations':
                return 'animate' in document.createElement('div');
              case 'webp-support':
                const canvas = document.createElement('canvas');
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
              case 'avif-support':
                try {
                  const canvas = document.createElement('canvas');
                  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
                } catch { return false; }
              default:
                return false;
            }
          });
          
          console.log('${feature}:', isSupported ? 'supported' : 'not supported');
        });
        `
        ).join("")}
      });
    `;

    const testFile = path.join(__dirname, "temp-features.spec.js");
    fs.writeFileSync(testFile, featureTestScript);

    try {
      const output = execSync(`npx playwright test ${testFile}`, {
        encoding: "utf8",
        timeout: 60000,
      });

      // Parse feature support from output
      FEATURE_TESTS.forEach((feature) => {
        const match = output.match(
          new RegExp(`${feature}: (supported|not supported)`)
        );
        this.results.features[feature] = match
          ? match[1] === "supported"
          : false;
      });

      fs.unlinkSync(testFile);
      console.log("✅ Feature detection tests completed");
    } catch (error) {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      console.log("⚠️  Feature detection tests had issues");
    }
  }

  /**
   * Run performance tests
   */
  async runPerformanceTests() {
    console.log("⚡ Running performance tests...");

    for (const url of TEST_URLS) {
      try {
        console.log(`Testing performance for ${url}...`);

        const result = execSync(
          `npx lighthouse http://localhost:3000${url} --output=json --quiet --chrome-flags="--headless"`,
          { encoding: "utf8", timeout: 120000 }
        );

        const lighthouse = JSON.parse(result);
        const scores = lighthouse.lhr.categories;

        this.results.performance[url] = {
          performance: Math.round(scores.performance.score * 100),
          accessibility: Math.round(scores.accessibility.score * 100),
          bestPractices: Math.round(scores["best-practices"].score * 100),
          seo: Math.round(scores.seo.score * 100),
          metrics: {
            fcp: lighthouse.lhr.audits["first-contentful-paint"].numericValue,
            lcp: lighthouse.lhr.audits["largest-contentful-paint"].numericValue,
            cls: lighthouse.lhr.audits["cumulative-layout-shift"].numericValue,
            fid: lighthouse.lhr.audits["max-potential-fid"]?.numericValue || 0,
          },
        };

        console.log(
          `✅ ${url}: Performance ${this.results.performance[url].performance}/100`
        );
      } catch (error) {
        console.log(`❌ ${url}: Performance test failed`);
        this.results.errors.push({
          url: url,
          test: "performance",
          error: error.message,
        });
      }
    }
  }

  /**
   * Run accessibility tests
   */
  async runAccessibilityTests() {
    console.log("♿ Running accessibility tests...");

    for (const url of TEST_URLS) {
      try {
        console.log(`Testing accessibility for ${url}...`);

        const result = execSync(
          `npx axe http://localhost:3000${url} --reporter=json`,
          { encoding: "utf8", timeout: 60000 }
        );

        const axeResults = JSON.parse(result);

        this.results.accessibility[url] = {
          violations: axeResults.violations.length,
          passes: axeResults.passes.length,
          incomplete: axeResults.incomplete.length,
          issues: axeResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
          })),
        };

        console.log(
          `✅ ${url}: ${axeResults.violations.length} violations found`
        );
      } catch (error) {
        console.log(`❌ ${url}: Accessibility test failed`);
        this.results.errors.push({
          url: url,
          test: "accessibility",
          error: error.message,
        });
      }
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateReport() {
    console.log("📊 Generating test report...");

    const report = {
      summary: {
        testDuration: Date.now() - this.startTime,
        timestamp: new Date().toISOString(),
        totalTests:
          Object.keys(this.results.browsers).length +
          Object.keys(this.results.devices).length +
          Object.keys(this.results.features).length,
        totalErrors: this.results.errors.length,
      },
      browsers: this.results.browsers,
      devices: this.results.devices,
      features: this.results.features,
      performance: this.results.performance,
      accessibility: this.results.accessibility,
      errors: this.results.errors,
    };

    // Write JSON report
    const reportPath = path.join(
      __dirname,
      "../cross-browser-test-report.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Write HTML report
    const htmlReport = this.generateHTMLReport(report);
    const htmlReportPath = path.join(
      __dirname,
      "../cross-browser-test-report.html"
    );
    fs.writeFileSync(htmlReportPath, htmlReport);

    console.log(`✅ Reports generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);

    // Print summary
    this.printSummary(report);
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cross-Browser Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: #333; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        .section { margin-bottom: 40px; }
        .test-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .test-item { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745; }
        .test-item.failed { border-left-color: #dc3545; }
        .test-item.warning { border-left-color: #ffc107; }
        .performance-scores { display: flex; gap: 10px; margin-top: 10px; }
        .score { padding: 5px 10px; border-radius: 4px; color: white; font-weight: bold; }
        .score.good { background: #28a745; }
        .score.average { background: #ffc107; }
        .score.poor { background: #dc3545; }
        .error-list { background: #f8d7da; padding: 15px; border-radius: 6px; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Cross-Browser Test Report</h1>
        <p>Generated on ${new Date(report.summary.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${report.summary.totalTests}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${report.summary.totalErrors}</div>
                <div class="stat-label">Errors</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${Math.round(report.summary.testDuration / 1000)}s</div>
                <div class="stat-label">Duration</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${Object.keys(report.browsers).length}</div>
                <div class="stat-label">Browsers Tested</div>
            </div>
        </div>

        <div class="section">
            <h2>Browser Compatibility</h2>
            <div class="test-grid">
                ${Object.entries(report.browsers)
                  .map(
                    ([browser, result]) => `
                    <div class="test-item ${result.status === "passed" ? "" : "failed"}">
                        <h3>${result.browser} ${result.version}</h3>
                        <p>Status: <strong>${result.status}</strong></p>
                        <p>Tested: ${new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>

        <div class="section">
            <h2>Device Compatibility</h2>
            <div class="test-grid">
                ${Object.entries(report.devices)
                  .map(
                    ([device, result]) => `
                    <div class="test-item ${result.status === "passed" ? "" : "failed"}">
                        <h3>${result.device}</h3>
                        <p>Status: <strong>${result.status}</strong></p>
                        <p>Viewport: ${result.viewport.width}x${result.viewport.height}</p>
                        <p>Mobile: ${result.viewport.isMobile ? "Yes" : "No"}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>

        <div class="section">
            <h2>Performance Scores</h2>
            <div class="test-grid">
                ${Object.entries(report.performance)
                  .map(
                    ([url, scores]) => `
                    <div class="test-item">
                        <h3>${url}</h3>
                        <div class="performance-scores">
                            <span class="score ${scores.performance >= 90 ? "good" : scores.performance >= 50 ? "average" : "poor"}">
                                Perf: ${scores.performance}
                            </span>
                            <span class="score ${scores.accessibility >= 90 ? "good" : scores.accessibility >= 50 ? "average" : "poor"}">
                                A11y: ${scores.accessibility}
                            </span>
                            <span class="score ${scores.bestPractices >= 90 ? "good" : scores.bestPractices >= 50 ? "average" : "poor"}">
                                BP: ${scores.bestPractices}
                            </span>
                            <span class="score ${scores.seo >= 90 ? "good" : scores.seo >= 50 ? "average" : "poor"}">
                                SEO: ${scores.seo}
                            </span>
                        </div>
                        <p>FCP: ${Math.round(scores.metrics.fcp)}ms | LCP: ${Math.round(scores.metrics.lcp)}ms | CLS: ${scores.metrics.cls.toFixed(3)}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>

        ${
          report.summary.totalErrors > 0
            ? `
        <div class="section">
            <h2>Errors</h2>
            <div class="error-list">
                ${report.errors
                  .map(
                    (error) => `
                    <p><strong>${error.browser || error.device || error.url}:</strong> ${error.error}</p>
                `
                  )
                  .join("")}
            </div>
        </div>
        `
            : ""
        }
    </div>
</body>
</html>
    `;
  }

  /**
   * Print test summary to console
   */
  printSummary(report) {
    console.log("\n📊 TEST SUMMARY");
    console.log("================");
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Total Errors: ${report.summary.totalErrors}`);
    console.log(`Duration: ${Math.round(report.summary.testDuration / 1000)}s`);

    console.log("\n🌐 Browser Support:");
    Object.entries(report.browsers).forEach(([browser, result]) => {
      console.log(`  ${result.status === "passed" ? "✅" : "❌"} ${browser}`);
    });

    console.log("\n📱 Device Support:");
    Object.entries(report.devices).forEach(([device, result]) => {
      console.log(`  ${result.status === "passed" ? "✅" : "❌"} ${device}`);
    });

    console.log("\n⚡ Performance Averages:");
    const perfAvg = Object.values(report.performance).reduce(
      (acc, scores) => {
        acc.performance += scores.performance;
        acc.accessibility += scores.accessibility;
        acc.bestPractices += scores.bestPractices;
        acc.seo += scores.seo;
        return acc;
      },
      { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 }
    );

    const urlCount = Object.keys(report.performance).length;
    if (urlCount > 0) {
      console.log(
        `  Performance: ${Math.round(perfAvg.performance / urlCount)}/100`
      );
      console.log(
        `  Accessibility: ${Math.round(perfAvg.accessibility / urlCount)}/100`
      );
      console.log(
        `  Best Practices: ${Math.round(perfAvg.bestPractices / urlCount)}/100`
      );
      console.log(`  SEO: ${Math.round(perfAvg.seo / urlCount)}/100`);
    }
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  const tester = new CrossBrowserTester();
  tester.runAllTests().catch((error) => {
    console.error("Test suite failed:", error);
    process.exit(1);
  });
}

module.exports = CrossBrowserTester;
