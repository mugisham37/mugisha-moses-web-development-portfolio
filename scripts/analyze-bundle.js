#!/usr/bin/env node

/**
 * Bundle analysis script for identifying optimization opportunities
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

class BundleAnalyzer {
  constructor() {
    this.buildDir = ".next";
    this.outputDir = "bundle-analysis";
  }

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async analyzeBundleSize() {
    this.log("📊 Analyzing bundle size...");

    try {
      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Generate bundle analysis
      process.env.ANALYZE = "true";
      execSync("npm run build", { stdio: "inherit" });

      // Parse build output for bundle information
      const buildManifest = this.readBuildManifest();
      const bundleStats = this.calculateBundleStats(buildManifest);

      // Generate report
      this.generateBundleReport(bundleStats);

      this.log("✅ Bundle analysis completed");
      return bundleStats;
    } catch (error) {
      this.log(`Bundle analysis failed: ${error.message}`, "error");
      throw error;
    }
  }

  readBuildManifest() {
    try {
      const manifestPath = path.join(this.buildDir, "build-manifest.json");
      if (fs.existsSync(manifestPath)) {
        return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      }
      return null;
    } catch (error) {
      this.log(`Failed to read build manifest: ${error.message}`, "warn");
      return null;
    }
  }

  calculateBundleStats(manifest) {
    const stats = {
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
      pages: {},
      largestChunks: [],
      duplicatedModules: [],
      recommendations: [],
    };

    if (!manifest) {
      return stats;
    }

    // Analyze static chunks
    const staticDir = path.join(this.buildDir, "static");
    if (fs.existsSync(staticDir)) {
      this.analyzeStaticFiles(staticDir, stats);
    }

    // Analyze pages
    const pagesManifestPath = path.join(
      this.buildDir,
      "server",
      "pages-manifest.json"
    );
    if (fs.existsSync(pagesManifestPath)) {
      const pagesManifest = JSON.parse(
        fs.readFileSync(pagesManifestPath, "utf8")
      );
      this.analyzePages(pagesManifest, stats);
    }

    // Generate recommendations
    this.generateRecommendations(stats);

    return stats;
  }

  analyzeStaticFiles(staticDir, stats) {
    const walkDir = (dir, fileList = []) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath, fileList);
        } else {
          fileList.push({
            path: filePath,
            size: stat.size,
            name: file,
          });
        }
      });

      return fileList;
    };

    const files = walkDir(staticDir);

    files.forEach((file) => {
      stats.totalSize += file.size;

      if (file.name.endsWith(".js")) {
        stats.chunks.push({
          name: file.name,
          size: file.size,
          type: "javascript",
        });
      } else if (file.name.endsWith(".css")) {
        stats.chunks.push({
          name: file.name,
          size: file.size,
          type: "css",
        });
      }
    });

    // Sort chunks by size
    stats.chunks.sort((a, b) => b.size - a.size);
    stats.largestChunks = stats.chunks.slice(0, 10);
  }

  analyzePages(pagesManifest, stats) {
    Object.entries(pagesManifest).forEach(([route, filePath]) => {
      const fullPath = path.join(this.buildDir, "server", filePath);

      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        stats.pages[route] = {
          size: stat.size,
          path: filePath,
        };
      }
    });
  }

  generateRecommendations(stats) {
    const recommendations = [];

    // Large bundle recommendations
    if (stats.totalSize > 2 * 1024 * 1024) {
      // 2MB
      recommendations.push({
        type: "bundle-size",
        severity: "high",
        message: `Total bundle size (${this.formatBytes(stats.totalSize)}) exceeds 2MB. Consider code splitting and lazy loading.`,
        suggestions: [
          "Implement dynamic imports for large components",
          "Use Next.js dynamic imports with loading states",
          "Split vendor libraries into separate chunks",
          "Remove unused dependencies",
        ],
      });
    }

    // Large chunk recommendations
    const largeChunks = stats.chunks.filter((chunk) => chunk.size > 500 * 1024); // 500KB
    if (largeChunks.length > 0) {
      recommendations.push({
        type: "large-chunks",
        severity: "medium",
        message: `Found ${largeChunks.length} chunks larger than 500KB`,
        chunks: largeChunks.map((chunk) => ({
          name: chunk.name,
          size: this.formatBytes(chunk.size),
        })),
        suggestions: [
          "Split large chunks using dynamic imports",
          "Use tree shaking to remove unused code",
          "Consider lazy loading for non-critical components",
        ],
      });
    }

    // JavaScript-heavy recommendations
    const jsChunks = stats.chunks.filter(
      (chunk) => chunk.type === "javascript"
    );
    const totalJsSize = jsChunks.reduce((sum, chunk) => sum + chunk.size, 0);

    if (totalJsSize > stats.totalSize * 0.7) {
      recommendations.push({
        type: "javascript-heavy",
        severity: "medium",
        message: `JavaScript represents ${Math.round((totalJsSize / stats.totalSize) * 100)}% of total bundle size`,
        suggestions: [
          "Optimize JavaScript bundle with tree shaking",
          "Use server-side rendering for initial page load",
          "Implement progressive enhancement",
          "Consider using lighter alternatives for heavy libraries",
        ],
      });
    }

    stats.recommendations = recommendations;
  }

  generateBundleReport(stats) {
    const reportPath = path.join(this.outputDir, "bundle-report.json");
    const htmlReportPath = path.join(this.outputDir, "bundle-report.html");

    // JSON report
    fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2));

    // HTML report
    const htmlReport = this.generateHTMLReport(stats);
    fs.writeFileSync(htmlReportPath, htmlReport);

    // Console summary
    this.printBundleSummary(stats);

    this.log(`📄 Bundle report saved to ${reportPath}`);
    this.log(`🌐 HTML report saved to ${htmlReportPath}`);
  }

  generateHTMLReport(stats) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #333; }
        .metric-label { font-size: 14px; color: #666; margin-top: 5px; }
        .section { margin: 30px 0; }
        .chunk-list { list-style: none; padding: 0; }
        .chunk-item { padding: 10px; margin: 5px 0; background: #f9f9f9; border-radius: 4px; display: flex; justify-content: space-between; }
        .recommendation { margin: 15px 0; padding: 15px; border-left: 4px solid #ff6b6b; background: #fff5f5; }
        .recommendation.medium { border-color: #ffa726; background: #fff8e1; }
        .recommendation.low { border-color: #66bb6a; background: #f1f8e9; }
        .suggestions { margin-top: 10px; }
        .suggestions li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bundle Analysis Report</h1>
        <p>Generated on ${new Date().toISOString()}</p>
    </div>

    <div class="section">
        <h2>Bundle Metrics</h2>
        <div class="metric">
            <div class="metric-value">${this.formatBytes(stats.totalSize)}</div>
            <div class="metric-label">Total Bundle Size</div>
        </div>
        <div class="metric">
            <div class="metric-value">${stats.chunks.length}</div>
            <div class="metric-label">Total Chunks</div>
        </div>
        <div class="metric">
            <div class="metric-value">${Object.keys(stats.pages).length}</div>
            <div class="metric-label">Pages</div>
        </div>
    </div>

    <div class="section">
        <h2>Largest Chunks</h2>
        <ul class="chunk-list">
            ${stats.largestChunks
              .map(
                (chunk) => `
                <li class="chunk-item">
                    <span>${chunk.name}</span>
                    <span>${this.formatBytes(chunk.size)}</span>
                </li>
            `
              )
              .join("")}
        </ul>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        ${stats.recommendations
          .map(
            (rec) => `
            <div class="recommendation ${rec.severity}">
                <h3>${rec.type.replace(/-/g, " ").toUpperCase()}</h3>
                <p>${rec.message}</p>
                ${
                  rec.suggestions
                    ? `
                    <div class="suggestions">
                        <strong>Suggestions:</strong>
                        <ul>
                            ${rec.suggestions.map((suggestion) => `<li>${suggestion}</li>`).join("")}
                        </ul>
                    </div>
                `
                    : ""
                }
            </div>
        `
          )
          .join("")}
    </div>
</body>
</html>
    `;
  }

  printBundleSummary(stats) {
    console.log("\n📊 Bundle Analysis Summary");
    console.log("=".repeat(50));
    console.log(`Total Bundle Size: ${this.formatBytes(stats.totalSize)}`);
    console.log(`Total Chunks: ${stats.chunks.length}`);
    console.log(`Pages: ${Object.keys(stats.pages).length}`);

    if (stats.largestChunks.length > 0) {
      console.log("\n🔍 Largest Chunks:");
      stats.largestChunks.slice(0, 5).forEach((chunk, index) => {
        console.log(
          `  ${index + 1}. ${chunk.name} - ${this.formatBytes(chunk.size)}`
        );
      });
    }

    if (stats.recommendations.length > 0) {
      console.log("\n💡 Recommendations:");
      stats.recommendations.forEach((rec, index) => {
        const icon =
          rec.severity === "high"
            ? "🔴"
            : rec.severity === "medium"
              ? "🟡"
              : "🟢";
        console.log(`  ${icon} ${rec.message}`);
      });
    }

    console.log("\n");
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async run() {
    try {
      await this.analyzeBundleSize();
    } catch (error) {
      console.error("Bundle analysis failed:", error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.run();
}

module.exports = BundleAnalyzer;
