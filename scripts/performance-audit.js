#!/usr/bin/env node

/**
 * Performance Audit Script
 * Runs comprehensive performance audits using Lighthouse and custom metrics
 */

const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs").promises;
const path = require("path");

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  "best-practices": 90,
  seo: 95,
  pwa: 80,
  // Core Web Vitals
  "largest-contentful-paint": 2500,
  "first-input-delay": 100,
  "cumulative-layout-shift": 0.1,
  "first-contentful-paint": 1800,
  "speed-index": 3400,
  "time-to-interactive": 3800,
  "total-blocking-time": 200,
};

// Pages to audit
const PAGES_TO_AUDIT = [
  { url: "http://localhost:3000", name: "homepage" },
  { url: "http://localhost:3000/projects", name: "projects" },
  { url: "http://localhost:3000/blog", name: "blog" },
  { url: "http://localhost:3000/contact", name: "contact" },
];

// Lighthouse configuration
const LIGHTHOUSE_CONFIG = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "desktop",
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36",
  },
};

const MOBILE_CONFIG = {
  ...LIGHTHOUSE_CONFIG,
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    formFactor: "mobile",
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4 * 0.9,
      uploadThroughputKbps: 675 * 0.9,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};

async function launchChrome() {
  return await chromeLauncher.launch({
    chromeFlags: [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
  });
}

async function runLighthouseAudit(url, config, chrome) {
  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: [
      "performance",
      "accessibility",
      "best-practices",
      "seo",
      "pwa",
    ],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options, config);
  return runnerResult;
}

function analyzeResults(lhr, pageName, formFactor) {
  const scores = {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    "best-practices": Math.round(lhr.categories["best-practices"].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : 0,
  };

  const metrics = {
    "largest-contentful-paint":
      lhr.audits["largest-contentful-paint"].numericValue,
    "first-input-delay": lhr.audits["max-potential-fid"]?.numericValue || 0,
    "cumulative-layout-shift":
      lhr.audits["cumulative-layout-shift"].numericValue,
    "first-contentful-paint": lhr.audits["first-contentful-paint"].numericValue,
    "speed-index": lhr.audits["speed-index"].numericValue,
    "time-to-interactive": lhr.audits["interactive"].numericValue,
    "total-blocking-time": lhr.audits["total-blocking-time"].numericValue,
  };

  const issues = [];
  const recommendations = [];

  // Check scores against thresholds
  Object.entries(scores).forEach(([category, score]) => {
    if (score < PERFORMANCE_THRESHOLDS[category]) {
      issues.push({
        type: "score",
        category,
        current: score,
        threshold: PERFORMANCE_THRESHOLDS[category],
        severity:
          score < PERFORMANCE_THRESHOLDS[category] - 10 ? "high" : "medium",
      });
    }
  });

  // Check metrics against thresholds
  Object.entries(metrics).forEach(([metric, value]) => {
    if (value > PERFORMANCE_THRESHOLDS[metric]) {
      issues.push({
        type: "metric",
        metric,
        current: Math.round(value),
        threshold: PERFORMANCE_THRESHOLDS[metric],
        severity:
          value > PERFORMANCE_THRESHOLDS[metric] * 1.5 ? "high" : "medium",
      });
    }
  });

  // Generate recommendations based on audit results
  if (lhr.audits["unused-css-rules"]?.score < 0.9) {
    recommendations.push("Remove unused CSS to reduce bundle size");
  }

  if (lhr.audits["unused-javascript"]?.score < 0.9) {
    recommendations.push(
      "Remove unused JavaScript to improve loading performance"
    );
  }

  if (lhr.audits["render-blocking-resources"]?.score < 0.9) {
    recommendations.push("Eliminate render-blocking resources");
  }

  if (lhr.audits["unminified-css"]?.score < 1) {
    recommendations.push("Minify CSS files");
  }

  if (lhr.audits["unminified-javascript"]?.score < 1) {
    recommendations.push("Minify JavaScript files");
  }

  if (lhr.audits["efficient-animated-content"]?.score < 0.9) {
    recommendations.push("Use video formats for animated content");
  }

  if (lhr.audits["modern-image-formats"]?.score < 0.9) {
    recommendations.push("Serve images in next-gen formats (WebP, AVIF)");
  }

  if (lhr.audits["offscreen-images"]?.score < 0.9) {
    recommendations.push("Defer offscreen images");
  }

  return {
    page: pageName,
    formFactor,
    scores,
    metrics,
    issues,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

async function generateReport(results) {
  const reportDir = path.join(process.cwd(), "performance-reports");

  try {
    await fs.mkdir(reportDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportPath = path.join(
    reportDir,
    `performance-audit-${timestamp}.json`
  );

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      averagePerformance: Math.round(
        results.reduce((sum, r) => sum + r.scores.performance, 0) /
          results.length
      ),
      totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
      highSeverityIssues: results.reduce(
        (sum, r) => sum + r.issues.filter((i) => i.severity === "high").length,
        0
      ),
    },
    results,
    recommendations: [...new Set(results.flatMap((r) => r.recommendations))],
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Generate HTML report
  const htmlReport = generateHTMLReport(report);
  const htmlPath = path.join(reportDir, `performance-audit-${timestamp}.html`);
  await fs.writeFile(htmlPath, htmlReport);

  return { jsonPath: reportPath, htmlPath };
}

function generateHTMLReport(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Audit Report</title>
  <style>
    body {
      font-family: 'Space Mono', monospace;
      background: #000;
      color: #fff;
      margin: 0;
      padding: 2rem;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1, h2, h3 {
      color: #ffff00;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .summary {
      background: #111;
      border: 4px solid #fff;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .page-result {
      background: #111;
      border: 4px solid #333;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .scores {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    .score {
      text-align: center;
      padding: 1rem;
      border: 2px solid #333;
    }
    .score.good { border-color: #22c55e; }
    .score.needs-improvement { border-color: #f59e0b; }
    .score.poor { border-color: #ef4444; }
    .issues {
      margin-top: 1rem;
    }
    .issue {
      background: #222;
      border-left: 4px solid #ef4444;
      padding: 1rem;
      margin: 0.5rem 0;
    }
    .issue.medium { border-left-color: #f59e0b; }
    .recommendations {
      background: #111;
      border: 4px solid #22c55e;
      padding: 2rem;
      margin-top: 2rem;
    }
    .recommendations ul {
      list-style: none;
      padding: 0;
    }
    .recommendations li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #333;
    }
    .recommendations li:before {
      content: "→ ";
      color: #ffff00;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Performance Audit Report</h1>
    <p>Generated: ${report.timestamp}</p>
    
    <div class="summary">
      <h2>Summary</h2>
      <p><strong>Total Pages Audited:</strong> ${report.summary.totalPages}</p>
      <p><strong>Average Performance Score:</strong> ${report.summary.averagePerformance}/100</p>
      <p><strong>Total Issues:</strong> ${report.summary.totalIssues}</p>
      <p><strong>High Severity Issues:</strong> ${report.summary.highSeverityIssues}</p>
    </div>

    ${report.results
      .map(
        (result) => `
      <div class="page-result">
        <h3>${result.page} (${result.formFactor})</h3>
        
        <div class="scores">
          ${Object.entries(result.scores)
            .map(
              ([category, score]) => `
            <div class="score ${score >= 90 ? "good" : score >= 50 ? "needs-improvement" : "poor"}">
              <div style="font-size: 2rem; font-weight: bold;">${score}</div>
              <div>${category.replace("-", " ")}</div>
            </div>
          `
            )
            .join("")}
        </div>

        ${
          result.issues.length > 0
            ? `
          <div class="issues">
            <h4>Issues</h4>
            ${result.issues
              .map(
                (issue) => `
              <div class="issue ${issue.severity}">
                <strong>${issue.type === "score" ? issue.category : issue.metric}:</strong>
                ${issue.current} (threshold: ${issue.threshold})
              </div>
            `
              )
              .join("")}
          </div>
        `
            : '<p style="color: #22c55e;">No issues found!</p>'
        }
      </div>
    `
      )
      .join("")}

    ${
      report.recommendations.length > 0
        ? `
      <div class="recommendations">
        <h2>Recommendations</h2>
        <ul>
          ${report.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
      </div>
    `
        : ""
    }
  </div>
</body>
</html>
  `;
}

async function main() {
  console.log("🚀 Starting performance audit...");

  const chrome = await launchChrome();
  const results = [];

  try {
    for (const page of PAGES_TO_AUDIT) {
      console.log(`\n📊 Auditing ${page.name}...`);

      // Desktop audit
      console.log("  🖥️  Desktop audit...");
      const desktopResult = await runLighthouseAudit(
        page.url,
        LIGHTHOUSE_CONFIG,
        chrome
      );
      const desktopAnalysis = analyzeResults(
        desktopResult.lhr,
        page.name,
        "desktop"
      );
      results.push(desktopAnalysis);

      // Mobile audit
      console.log("  📱 Mobile audit...");
      const mobileResult = await runLighthouseAudit(
        page.url,
        MOBILE_CONFIG,
        chrome
      );
      const mobileAnalysis = analyzeResults(
        mobileResult.lhr,
        page.name,
        "mobile"
      );
      results.push(mobileAnalysis);

      console.log(`  ✅ ${page.name} completed`);
    }

    // Generate report
    console.log("\n📝 Generating report...");
    const { jsonPath, htmlPath } = await generateReport(results);

    console.log("\n🎉 Performance audit completed!");
    console.log(`📄 JSON Report: ${jsonPath}`);
    console.log(`🌐 HTML Report: ${htmlPath}`);

    // Summary
    const avgPerformance = Math.round(
      results.reduce((sum, r) => sum + r.scores.performance, 0) / results.length
    );
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);

    console.log(`\n📈 Average Performance Score: ${avgPerformance}/100`);
    console.log(`⚠️  Total Issues Found: ${totalIssues}`);

    if (avgPerformance < 90) {
      console.log("\n🔧 Performance improvements needed!");
      process.exit(1);
    } else {
      console.log("\n✨ Excellent performance!");
    }
  } catch (error) {
    console.error("❌ Audit failed:", error);
    process.exit(1);
  } finally {
    await chrome.kill();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, runLighthouseAudit, analyzeResults };
