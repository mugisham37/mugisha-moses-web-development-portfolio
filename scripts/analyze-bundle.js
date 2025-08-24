#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Bundle Analysis Script
 * Analyzes Next.js bundle composition and provides optimization recommendations
 */

const BUNDLE_SIZE_LIMITS = {
  framework: 50 * 1024, // 50KB
  vendor: 100 * 1024, // 100KB
  main: 30 * 1024, // 30KB
  animations: 80 * 1024, // 80KB
  total: 300 * 1024, // 300KB
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function analyzeBundleSize() {
  console.log("🔍 Analyzing bundle sizes...\n");

  const buildDir = path.join(process.cwd(), ".next");
  const staticDir = path.join(buildDir, "static");

  if (!fs.existsSync(staticDir)) {
    console.error(
      '❌ Build directory not found. Please run "npm run build" first.'
    );
    process.exit(1);
  }

  const jsDir = path.join(staticDir, "chunks");
  const cssDir = path.join(staticDir, "css");

  const bundles = [];
  let totalSize = 0;

  // Analyze JavaScript bundles
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs
      .readdirSync(jsDir)
      .filter((file) => file.endsWith(".js"));

    jsFiles.forEach((file) => {
      const filePath = path.join(jsDir, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      totalSize += size;

      // Determine bundle type
      let type = "other";
      if (file.includes("framework")) type = "framework";
      else if (file.includes("vendor")) type = "vendor";
      else if (file.includes("main")) type = "main";
      else if (file.includes("animations")) type = "animations";

      bundles.push({
        name: file,
        type,
        size,
        path: filePath,
      });
    });
  }

  // Analyze CSS bundles
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs
      .readdirSync(cssDir)
      .filter((file) => file.endsWith(".css"));

    cssFiles.forEach((file) => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      totalSize += size;

      bundles.push({
        name: file,
        type: "css",
        size,
        path: filePath,
      });
    });
  }

  return { bundles, totalSize };
}

function generateReport(bundles, totalSize) {
  console.log("📊 Bundle Analysis Report\n");
  console.log("=".repeat(60));

  // Summary
  console.log(`\n📦 Total Bundle Size: ${formatBytes(totalSize)}`);
  console.log(`📁 Number of Bundles: ${bundles.length}`);

  // Size by type
  const bundlesByType = bundles.reduce((acc, bundle) => {
    if (!acc[bundle.type]) acc[bundle.type] = [];
    acc[bundle.type].push(bundle);
    return acc;
  }, {});

  console.log("\n📋 Bundle Breakdown:");
  Object.entries(bundlesByType).forEach(([type, typeBundles]) => {
    const typeSize = typeBundles.reduce((sum, bundle) => sum + bundle.size, 0);
    const percentage = ((typeSize / totalSize) * 100).toFixed(1);
    console.log(
      `  ${type.padEnd(12)}: ${formatBytes(typeSize).padEnd(10)} (${percentage}%)`
    );
  });

  // Largest bundles
  console.log("\n🔍 Largest Bundles:");
  const sortedBundles = bundles.sort((a, b) => b.size - a.size).slice(0, 10);
  sortedBundles.forEach((bundle, index) => {
    const percentage = ((bundle.size / totalSize) * 100).toFixed(1);
    console.log(
      `  ${(index + 1).toString().padStart(2)}. ${bundle.name.padEnd(30)} ${formatBytes(bundle.size).padEnd(10)} (${percentage}%)`
    );
  });

  // Size limit violations
  console.log("\n⚠️  Size Limit Analysis:");
  const violations = [];

  Object.entries(BUNDLE_SIZE_LIMITS).forEach(([type, limit]) => {
    if (type === "total") {
      if (totalSize > limit) {
        violations.push(
          `Total bundle size (${formatBytes(totalSize)}) exceeds limit (${formatBytes(limit)})`
        );
      }
    } else {
      const typeBundles = bundlesByType[type] || [];
      const typeSize = typeBundles.reduce(
        (sum, bundle) => sum + bundle.size,
        0
      );

      if (typeSize > limit) {
        violations.push(
          `${type} bundles (${formatBytes(typeSize)}) exceed limit (${formatBytes(limit)})`
        );
      }
    }
  });

  if (violations.length > 0) {
    violations.forEach((violation) => console.log(`  ❌ ${violation}`));
  } else {
    console.log("  ✅ All bundles are within size limits");
  }

  return violations;
}

function generateOptimizationRecommendations(bundles, totalSize, violations) {
  console.log("\n💡 Optimization Recommendations:\n");

  const recommendations = [];

  // Size-based recommendations
  if (totalSize > BUNDLE_SIZE_LIMITS.total) {
    recommendations.push(
      "Consider implementing more aggressive code splitting"
    );
    recommendations.push("Review and remove unused dependencies");
    recommendations.push(
      "Implement dynamic imports for non-critical components"
    );
  }

  // Framework bundle recommendations
  const frameworkBundles = bundles.filter((b) => b.type === "framework");
  const frameworkSize = frameworkBundles.reduce((sum, b) => sum + b.size, 0);

  if (frameworkSize > BUNDLE_SIZE_LIMITS.framework) {
    recommendations.push(
      "Framework bundle is large - ensure React is properly optimized"
    );
    recommendations.push("Consider using React production build optimizations");
  }

  // Vendor bundle recommendations
  const vendorBundles = bundles.filter((b) => b.type === "vendor");
  const vendorSize = vendorBundles.reduce((sum, b) => sum + b.size, 0);

  if (vendorSize > BUNDLE_SIZE_LIMITS.vendor) {
    recommendations.push(
      "Vendor bundle is large - review third-party dependencies"
    );
    recommendations.push("Consider tree-shaking unused exports from libraries");
    recommendations.push("Evaluate if all vendor dependencies are necessary");
  }

  // Animation bundle recommendations
  const animationBundles = bundles.filter((b) => b.type === "animations");
  const animationSize = animationBundles.reduce((sum, b) => sum + b.size, 0);

  if (animationSize > BUNDLE_SIZE_LIMITS.animations) {
    recommendations.push(
      "Animation bundle is large - consider lazy loading animations"
    );
    recommendations.push(
      "Review Framer Motion usage and import only needed components"
    );
  }

  // CSS recommendations
  const cssBundles = bundles.filter((b) => b.type === "css");
  const cssSize = cssBundles.reduce((sum, b) => sum + b.size, 0);

  if (cssSize > 20 * 1024) {
    // 20KB
    recommendations.push(
      "CSS bundle is large - consider purging unused styles"
    );
    recommendations.push("Review CSS architecture and remove duplicate styles");
  }

  // Duplicate detection
  const duplicateNames = bundles
    .map((b) => b.name.replace(/\.[a-f0-9]+\./, "."))
    .filter((name, index, arr) => arr.indexOf(name) !== index);

  if (duplicateNames.length > 0) {
    recommendations.push(
      "Potential duplicate bundles detected - review bundle splitting configuration"
    );
  }

  if (recommendations.length === 0) {
    console.log(
      "  ✅ Bundle optimization looks good! No major issues detected."
    );
  } else {
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  return recommendations;
}

function generateBundleReport(bundles, totalSize) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      bundleCount: bundles.length,
    },
    bundles: bundles.map((bundle) => ({
      name: bundle.name,
      type: bundle.type,
      size: bundle.size,
      sizeFormatted: formatBytes(bundle.size),
      percentage: ((bundle.size / totalSize) * 100).toFixed(2),
    })),
    limits: BUNDLE_SIZE_LIMITS,
    violations: [],
    recommendations: [],
  };

  // Check violations
  Object.entries(BUNDLE_SIZE_LIMITS).forEach(([type, limit]) => {
    if (type === "total") {
      if (totalSize > limit) {
        report.violations.push({
          type: "total",
          actual: totalSize,
          limit,
          message: `Total bundle size exceeds limit`,
        });
      }
    } else {
      const typeBundles = bundles.filter((b) => b.type === type);
      const typeSize = typeBundles.reduce((sum, b) => sum + b.size, 0);

      if (typeSize > limit) {
        report.violations.push({
          type,
          actual: typeSize,
          limit,
          message: `${type} bundles exceed size limit`,
        });
      }
    }
  });

  // Save report
  const reportPath = path.join(process.cwd(), "bundle-analysis-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  return report;
}

function main() {
  try {
    console.log("🚀 Starting bundle analysis...\n");

    const { bundles, totalSize } = analyzeBundleSize();
    const violations = generateReport(bundles, totalSize);
    const recommendations = generateOptimizationRecommendations(
      bundles,
      totalSize,
      violations
    );
    const report = generateBundleReport(bundles, totalSize);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Bundle analysis complete!");

    if (violations.length > 0) {
      console.log(`⚠️  Found ${violations.length} size limit violations`);
      process.exit(1);
    } else {
      console.log("🎉 All bundles are within acceptable size limits");
    }
  } catch (error) {
    console.error("❌ Bundle analysis failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  generateReport,
  generateOptimizationRecommendations,
  generateBundleReport,
};
