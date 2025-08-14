import { FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * Global teardown for Playwright tests
 * Runs once after all tests complete
 */
async function globalTeardown(config: FullConfig) {
  console.log("🧹 Starting global test teardown...");

  try {
    // Clean up test data or state if needed
    console.log("📝 Cleaning up test data...");

    // Generate test summary report
    await generateTestSummary();

    // Clean up temporary files
    await cleanupTempFiles();

    // Archive test results if needed
    await archiveTestResults();

    console.log("✅ Global teardown completed successfully");
  } catch (error) {
    console.error("❌ Global teardown failed:", error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

/**
 * Generate a summary of test results
 */
async function generateTestSummary(): Promise<void> {
  try {
    const resultsPath = path.join(process.cwd(), "test-results");

    if (!fs.existsSync(resultsPath)) {
      console.log("📊 No test results found to summarize");
      return;
    }

    // Look for JSON results file
    const jsonResultsPath = path.join(resultsPath, "results.json");

    if (fs.existsSync(jsonResultsPath)) {
      const results = JSON.parse(fs.readFileSync(jsonResultsPath, "utf8"));

      const summary = {
        timestamp: new Date().toISOString(),
        totalTests:
          results.suites?.reduce((total: number, suite: any) => {
            return total + (suite.specs?.length || 0);
          }, 0) || 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: results.stats?.duration || 0,
        browsers: [],
        errors: [],
      };

      // Count test results
      results.suites?.forEach((suite: any) => {
        suite.specs?.forEach((spec: any) => {
          spec.tests?.forEach((test: any) => {
            test.results?.forEach((result: any) => {
              switch (result.status) {
                case "passed":
                  summary.passed++;
                  break;
                case "failed":
                  summary.failed++;
                  if (result.error) {
                    summary.errors.push({
                      test: test.title,
                      error: result.error.message,
                    });
                  }
                  break;
                case "skipped":
                  summary.skipped++;
                  break;
              }
            });
          });
        });
      });

      // Extract browser information
      const projects = results.config?.projects || [];
      summary.browsers = projects.map((project: any) => project.name);

      // Write summary file
      const summaryPath = path.join(resultsPath, "test-summary.json");
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

      // Write human-readable summary
      const readableSummary = `
Cross-Browser Test Summary
==========================
Generated: ${summary.timestamp}

Results:
- Total Tests: ${summary.totalTests}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Skipped: ${summary.skipped}
- Duration: ${Math.round(summary.duration / 1000)}s

Browsers Tested:
${summary.browsers.map((browser) => `- ${browser}`).join("\n")}

${
  summary.errors.length > 0
    ? `
Errors:
${summary.errors.map((error) => `- ${error.test}: ${error.error}`).join("\n")}
`
    : "No errors detected! 🎉"
}
      `;

      const readableSummaryPath = path.join(resultsPath, "test-summary.txt");
      fs.writeFileSync(readableSummaryPath, readableSummary);

      console.log("📊 Test summary generated:", {
        total: summary.totalTests,
        passed: summary.passed,
        failed: summary.failed,
        skipped: summary.skipped,
      });

      // Log summary to console
      console.log(readableSummary);
    } else {
      console.log("📊 No JSON results file found for summary generation");
    }
  } catch (error) {
    console.error("❌ Failed to generate test summary:", error);
  }
}

/**
 * Clean up temporary files created during testing
 */
async function cleanupTempFiles(): Promise<void> {
  try {
    const tempPaths = [
      path.join(process.cwd(), "temp-*.spec.js"),
      path.join(process.cwd(), "scripts", "temp-*.spec.js"),
    ];

    for (const tempPath of tempPaths) {
      const dir = path.dirname(tempPath);
      const pattern = path.basename(tempPath);

      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const tempFiles = files.filter((file) =>
          file.match(pattern.replace("*", ".*"))
        );

        for (const file of tempFiles) {
          const filePath = path.join(dir, file);
          fs.unlinkSync(filePath);
          console.log(`🗑️  Cleaned up temp file: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Failed to clean up temp files:", error);
  }
}

/**
 * Archive test results for historical tracking
 */
async function archiveTestResults(): Promise<void> {
  try {
    const resultsPath = path.join(process.cwd(), "test-results");
    const archivePath = path.join(process.cwd(), "test-archives");

    if (!fs.existsSync(resultsPath)) {
      return;
    }

    // Create archive directory if it doesn't exist
    if (!fs.existsSync(archivePath)) {
      fs.mkdirSync(archivePath, { recursive: true });
    }

    // Create timestamped archive folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archiveFolder = path.join(archivePath, `test-results-${timestamp}`);

    // Copy results to archive (simple copy, not move)
    if (process.env.ARCHIVE_TEST_RESULTS === "true") {
      fs.mkdirSync(archiveFolder, { recursive: true });

      const files = fs.readdirSync(resultsPath);
      for (const file of files) {
        const srcPath = path.join(resultsPath, file);
        const destPath = path.join(archiveFolder, file);

        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      }

      console.log(`📦 Test results archived to: ${archiveFolder}`);
    }

    // Clean up old archives (keep last 10)
    const archives = fs
      .readdirSync(archivePath)
      .filter((name) => name.startsWith("test-results-"))
      .sort()
      .reverse();

    if (archives.length > 10) {
      const toDelete = archives.slice(10);
      for (const archive of toDelete) {
        const archiveToDelete = path.join(archivePath, archive);
        fs.rmSync(archiveToDelete, { recursive: true, force: true });
        console.log(`🗑️  Deleted old archive: ${archive}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to archive test results:", error);
  }
}

export default globalTeardown;
