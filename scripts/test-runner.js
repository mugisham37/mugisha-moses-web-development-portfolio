#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Comprehensive test runner for the brutalist portfolio
 * Runs all types of tests with proper reporting and error handling
 */
class TestRunner {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, skipped: 0 },
      integration: { passed: 0, failed: 0, skipped: 0 },
      e2e: { passed: 0, failed: 0, skipped: 0 },
      accessibility: { passed: 0, failed: 0, skipped: 0 },
      visual: { passed: 0, failed: 0, skipped: 0 },
    };
    this.startTime = Date.now();
  }

  /**
   * Run all tests with comprehensive reporting
   */
  async runAll() {
    console.log("🚀 Starting comprehensive test suite...\n");

    try {
      // Setup test environment
      await this.setupTestEnvironment();

      // Run different test suites
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runE2ETests();
      await this.runAccessibilityTests();
      await this.runVisualRegressionTests();

      // Generate final report
      this.generateFinalReport();
    } catch (error) {
      console.error("❌ Test suite failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Setup test environment
   */
  async setupTestEnvironment() {
    console.log("🔧 Setting up test environment...");

    try {
      // Check if test database is available
      if (process.env.TEST_DATABASE_URL) {
        console.log("✅ Test database configured");
      } else {
        console.log(
          "⚠️  Test database not configured, using in-memory database"
        );
      }

      // Ensure test directories exist
      const testDirs = [
        "test-results",
        "test-results/screenshots",
        "test-results/videos",
        "test-results/reports",
        "coverage",
      ];

      testDirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      console.log("✅ Test environment ready\n");
    } catch (error) {
      throw new Error(`Failed to setup test environment: ${error.message}`);
    }
  }

  /**
   * Run unit tests
   */
  async runUnitTests() {
    console.log("🧪 Running unit tests...");

    try {
      const result = execSync("npm run test:coverage", {
        encoding: "utf8",
        stdio: "pipe",
      });

      // Parse Jest output for results
      const lines = result.split("\n");
      const summaryLine = lines.find((line) => line.includes("Tests:"));

      if (summaryLine) {
        const matches = summaryLine.match(/(\d+) passed/);
        if (matches) {
          this.results.unit.passed = parseInt(matches[1]);
        }
      }

      console.log("✅ Unit tests completed");
      console.log(`   Passed: ${this.results.unit.passed}`);
    } catch (error) {
      console.log("❌ Unit tests failed");
      this.results.unit.failed = 1;

      // Don't exit on unit test failure, continue with other tests
      console.log("   Continuing with other test suites...");
    }

    console.log("");
  }

  /**
   * Run integration tests (database tests)
   */
  async runIntegrationTests() {
    console.log("🔗 Running integration tests...");

    try {
      const result = execSync("npm run test:db:coverage", {
        encoding: "utf8",
        stdio: "pipe",
      });

      // Parse results
      const lines = result.split("\n");
      const summaryLine = lines.find((line) => line.includes("Tests:"));

      if (summaryLine) {
        const matches = summaryLine.match(/(\d+) passed/);
        if (matches) {
          this.results.integration.passed = parseInt(matches[1]);
        }
      }

      console.log("✅ Integration tests completed");
      console.log(`   Passed: ${this.results.integration.passed}`);
    } catch (error) {
      console.log("❌ Integration tests failed");
      this.results.integration.failed = 1;
      console.log("   Continuing with other test suites...");
    }

    console.log("");
  }

  /**
   * Run end-to-end tests
   */
  async runE2ETests() {
    console.log("🎭 Running end-to-end tests...");

    try {
      // Check if we should run E2E tests
      if (process.env.SKIP_E2E === "true") {
        console.log("⏭️  Skipping E2E tests (SKIP_E2E=true)");
        this.results.e2e.skipped = 1;
        return;
      }

      const result = execSync("npx playwright test --reporter=json", {
        encoding: "utf8",
        stdio: "pipe",
      });

      // Parse Playwright JSON output
      try {
        const report = JSON.parse(result);
        this.results.e2e.passed =
          report.suites?.reduce((total, suite) => {
            return total + (suite.specs?.filter((spec) => spec.ok).length || 0);
          }, 0) || 0;

        this.results.e2e.failed =
          report.suites?.reduce((total, suite) => {
            return (
              total + (suite.specs?.filter((spec) => !spec.ok).length || 0)
            );
          }, 0) || 0;
      } catch (parseError) {
        // Fallback parsing
        this.results.e2e.passed = 1;
      }

      console.log("✅ E2E tests completed");
      console.log(`   Passed: ${this.results.e2e.passed}`);
      console.log(`   Failed: ${this.results.e2e.failed}`);
    } catch (error) {
      console.log("❌ E2E tests failed");
      this.results.e2e.failed = 1;
      console.log("   Continuing with other test suites...");
    }

    console.log("");
  }

  /**
   * Run accessibility tests
   */
  async runAccessibilityTests() {
    console.log("♿ Running accessibility tests...");

    try {
      // Run specific accessibility tests
      const result = execSync(
        'npx playwright test --grep="accessibility" --reporter=json',
        {
          encoding: "utf8",
          stdio: "pipe",
        }
      );

      this.results.accessibility.passed = 1;
      console.log("✅ Accessibility tests completed");
    } catch (error) {
      console.log("❌ Accessibility tests failed");
      this.results.accessibility.failed = 1;
    }

    console.log("");
  }

  /**
   * Run visual regression tests
   */
  async runVisualRegressionTests() {
    console.log("👁️  Running visual regression tests...");

    try {
      // Check if we should run visual tests
      if (process.env.SKIP_VISUAL === "true") {
        console.log("⏭️  Skipping visual tests (SKIP_VISUAL=true)");
        this.results.visual.skipped = 1;
        return;
      }

      const result = execSync(
        "npx playwright test visual-regression --reporter=json",
        {
          encoding: "utf8",
          stdio: "pipe",
        }
      );

      this.results.visual.passed = 1;
      console.log("✅ Visual regression tests completed");
    } catch (error) {
      console.log("❌ Visual regression tests failed");
      this.results.visual.failed = 1;
    }

    console.log("");
  }

  /**
   * Generate final test report
   */
  generateFinalReport() {
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);

    console.log("📊 Test Suite Summary");
    console.log("=".repeat(50));

    const totalPassed = Object.values(this.results).reduce(
      (sum, result) => sum + result.passed,
      0
    );
    const totalFailed = Object.values(this.results).reduce(
      (sum, result) => sum + result.failed,
      0
    );
    const totalSkipped = Object.values(this.results).reduce(
      (sum, result) => sum + result.skipped,
      0
    );

    console.log(`Duration: ${duration}s`);
    console.log(`Total Tests: ${totalPassed + totalFailed + totalSkipped}`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`⏭️  Skipped: ${totalSkipped}`);
    console.log("");

    // Detailed breakdown
    Object.entries(this.results).forEach(([type, result]) => {
      const status = result.failed > 0 ? "❌" : result.passed > 0 ? "✅" : "⏭️";
      console.log(
        `${status} ${type.padEnd(12)}: ${result.passed} passed, ${result.failed} failed, ${result.skipped} skipped`
      );
    });

    console.log("");

    // Generate JSON report
    const report = {
      timestamp: new Date().toISOString(),
      duration,
      results: this.results,
      summary: {
        total: totalPassed + totalFailed + totalSkipped,
        passed: totalPassed,
        failed: totalFailed,
        skipped: totalSkipped,
        success: totalFailed === 0,
      },
    };

    fs.writeFileSync(
      "test-results/test-report.json",
      JSON.stringify(report, null, 2)
    );
    console.log("📄 Test report saved to test-results/test-report.json");

    // Generate HTML report
    this.generateHtmlReport(report);

    // Exit with appropriate code
    if (totalFailed > 0) {
      console.log("\n❌ Test suite failed");
      process.exit(1);
    } else {
      console.log("\n✅ All tests passed!");
      process.exit(0);
    }
  }

  /**
   * Generate HTML test report
   */
  generateHtmlReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - Brutalist Portfolio</title>
    <style>
        body { font-family: 'Space Mono', monospace; background: #000; color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { border: 2px solid #fff; padding: 20px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric { border: 2px solid #fff; padding: 15px; text-align: center; }
        .metric.success { border-color: #00ff00; }
        .metric.error { border-color: #ff0000; }
        .metric.warning { border-color: #ffff00; }
        .results { border: 2px solid #fff; padding: 20px; }
        .test-type { margin-bottom: 15px; padding: 10px; border-left: 4px solid #fff; }
        .test-type.passed { border-left-color: #00ff00; }
        .test-type.failed { border-left-color: #ff0000; }
        .test-type.skipped { border-left-color: #ffff00; }
        h1, h2 { text-transform: uppercase; letter-spacing: 2px; }
        .timestamp { opacity: 0.7; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Brutalist Portfolio - Test Report</h1>
            <div class="timestamp">Generated: ${report.timestamp}</div>
            <div class="timestamp">Duration: ${report.duration}s</div>
        </div>

        <div class="summary">
            <div class="metric ${report.summary.success ? "success" : "error"}">
                <h2>Overall</h2>
                <div>${report.summary.success ? "PASSED" : "FAILED"}</div>
            </div>
            <div class="metric success">
                <h2>Passed</h2>
                <div>${report.summary.passed}</div>
            </div>
            <div class="metric ${report.summary.failed > 0 ? "error" : ""}">
                <h2>Failed</h2>
                <div>${report.summary.failed}</div>
            </div>
            <div class="metric ${report.summary.skipped > 0 ? "warning" : ""}">
                <h2>Skipped</h2>
                <div>${report.summary.skipped}</div>
            </div>
        </div>

        <div class="results">
            <h2>Test Results by Type</h2>
            ${Object.entries(report.results)
              .map(
                ([type, result]) => `
                <div class="test-type ${result.failed > 0 ? "failed" : result.passed > 0 ? "passed" : "skipped"}">
                    <strong>${type.toUpperCase()}</strong>: 
                    ${result.passed} passed, ${result.failed} failed, ${result.skipped} skipped
                </div>
            `
              )
              .join("")}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync("test-results/test-report.html", html);
    console.log("📄 HTML report saved to test-results/test-report.html");
  }

  /**
   * Run specific test type
   */
  async runSpecific(testType) {
    console.log(`🚀 Running ${testType} tests only...\n`);

    await this.setupTestEnvironment();

    switch (testType) {
      case "unit":
        await this.runUnitTests();
        break;
      case "integration":
        await this.runIntegrationTests();
        break;
      case "e2e":
        await this.runE2ETests();
        break;
      case "accessibility":
        await this.runAccessibilityTests();
        break;
      case "visual":
        await this.runVisualRegressionTests();
        break;
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }

    this.generateFinalReport();
  }
}

// CLI interface
const args = process.argv.slice(2);
const testRunner = new TestRunner();

if (args.length === 0) {
  testRunner.runAll();
} else {
  const testType = args[0];
  testRunner.runSpecific(testType);
}
