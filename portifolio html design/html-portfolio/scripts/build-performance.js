#!/usr/bin/env node

/* ==========================================================================
   BUILD PERFORMANCE SCRIPT
   Automates performance optimization tasks
   ========================================================================== */

const fs = require("fs");
const path = require("path");

/**
 * Performance Build Script
 * Automates critical CSS extraction, image optimization, and other performance tasks
 */
class PerformanceBuildScript {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.cssDir = path.join(this.projectRoot, "css");
    this.jsDir = path.join(this.projectRoot, "js");
    this.imagesDir = path.join(this.projectRoot, "images");
  }

  /**
   * Run all performance optimization tasks
   */
  async run() {
    console.log("🚀 Starting performance optimization build...\n");

    try {
      // 1. Extract and inline critical CSS
      await this.extractCriticalCSS();

      // 2. Minify JavaScript files
      await this.minifyJavaScript();

      // 3. Generate image optimization manifest
      await this.generateImageManifest();

      // 4. Create resource hints
      await this.generateResourceHints();

      // 5. Generate performance report
      await this.generatePerformanceReport();

      console.log(
        "\n✅ Performance optimization build completed successfully!"
      );
    } catch (error) {
      console.error("\n❌ Build failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Extract critical CSS for above-the-fold content
   */
  async extractCriticalCSS() {
    console.log("📝 Extracting critical CSS...");

    const criticalSelectors = [
      ":root",
      "*",
      "*::before",
      "*::after",
      "html",
      "body",
      ".skip-links",
      ".skip-link",
      ".container",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      ".display",
      ".header",
      ".nav",
      ".hero",
      ".hero-content",
      ".hero-title",
      ".hero-subtitle",
      ".sr-only",
      "*:focus-visible",
      "@media (min-width: 768px)",
      "@media (min-width: 1024px)",
      "@media (prefers-reduced-motion: reduce)",
    ];

    try {
      const criticalCSSPath = path.join(this.cssDir, "critical.css");
      const mainCSSPath = path.join(this.cssDir, "main.css");

      if (fs.existsSync(criticalCSSPath)) {
        console.log("  ✓ Critical CSS already exists");
        return;
      }

      if (!fs.existsSync(mainCSSPath)) {
        console.log(
          "  ⚠️  Main CSS not found, skipping critical CSS extraction"
        );
        return;
      }

      const mainCSS = fs.readFileSync(mainCSSPath, "utf8");
      const criticalCSS = this.extractCriticalRules(mainCSS, criticalSelectors);

      fs.writeFileSync(criticalCSSPath, criticalCSS);
      console.log("  ✓ Critical CSS extracted and saved");
    } catch (error) {
      console.log("  ⚠️  Critical CSS extraction failed:", error.message);
    }
  }

  /**
   * Extract critical CSS rules
   */
  extractCriticalRules(css, selectors) {
    const rules = css.split("}");
    const criticalRules = [];

    rules.forEach((rule) => {
      if (!rule.trim()) return;

      const selector = rule.split("{")[0].trim();
      const isCritical = selectors.some(
        (criticalSelector) =>
          selector.includes(criticalSelector) ||
          criticalSelector.includes(selector)
      );

      if (isCritical) {
        criticalRules.push(rule + "}");
      }
    });

    return criticalRules.join("\n");
  }

  /**
   * Minify JavaScript files
   */
  async minifyJavaScript() {
    console.log("🗜️  Minifying JavaScript files...");

    const jsFiles = ["main.js", "mobile-menu.js"];

    jsFiles.forEach((filename) => {
      try {
        const filePath = path.join(this.jsDir, filename);
        const minFilePath = path.join(
          this.jsDir,
          filename.replace(".js", ".min.js")
        );

        if (!fs.existsSync(filePath)) {
          console.log(`  ⚠️  ${filename} not found, skipping`);
          return;
        }

        if (fs.existsSync(minFilePath)) {
          console.log(`  ✓ ${filename} already minified`);
          return;
        }

        const jsContent = fs.readFileSync(filePath, "utf8");
        const minifiedJS = this.minifyJS(jsContent);

        fs.writeFileSync(minFilePath, minifiedJS);
        console.log(`  ✓ ${filename} minified`);
      } catch (error) {
        console.log(`  ⚠️  Failed to minify ${filename}:`, error.message);
      }
    });
  }

  /**
   * Simple JavaScript minification
   */
  minifyJS(js) {
    return (
      js
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "")
        // Remove extra whitespace
        .replace(/\s+/g, " ")
        // Remove whitespace around operators
        .replace(/\s*([{}();,:])\s*/g, "$1")
        .trim()
    );
  }

  /**
   * Generate image optimization manifest
   */
  async generateImageManifest() {
    console.log("🖼️  Generating image optimization manifest...");

    const manifest = {
      version: "1.0.0",
      generated: new Date().toISOString(),
      images: {},
      formats: {
        webp: { quality: 80, supported: true },
        jpeg: { quality: 85, fallback: true },
        png: { quality: 90, fallback: true },
      },
    };

    try {
      const imageDirectories = [
        "project-thumbnails",
        "testimonials",
        "clients",
        "icons",
      ];

      imageDirectories.forEach((dir) => {
        const dirPath = path.join(this.imagesDir, dir);
        if (!fs.existsSync(dirPath)) return;

        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
          const ext = path.extname(file).toLowerCase();
          if ([".jpg", ".jpeg", ".png", ".svg"].includes(ext)) {
            const baseName = path.basename(file, ext);
            manifest.images[`${dir}/${baseName}`] = {
              original: `${dir}/${file}`,
              webp: `${dir}/${baseName}.webp`,
              fallback:
                ext === ".svg" ? `${dir}/${file}` : `${dir}/${baseName}.jpg`,
              priority: this.getImagePriority(dir, baseName),
            };
          }
        });
      });

      const manifestPath = path.join(
        this.imagesDir,
        "optimization-manifest.json"
      );
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("  ✓ Image optimization manifest generated");
    } catch (error) {
      console.log("  ⚠️  Failed to generate image manifest:", error.message);
    }
  }

  /**
   * Get image priority based on location and usage
   */
  getImagePriority(directory, filename) {
    // Hero and above-the-fold images get high priority
    if (
      directory === "icons" ||
      filename.includes("hero") ||
      filename.includes("logo")
    ) {
      return "high";
    }

    // Project thumbnails get medium priority
    if (directory === "project-thumbnails") {
      return "auto";
    }

    // Everything else gets low priority
    return "low";
  }

  /**
   * Generate resource hints for preloading
   */
  async generateResourceHints() {
    console.log("🔗 Generating resource hints...");

    const hints = {
      preload: [
        { href: "/css/critical.css", as: "style", type: "text/css" },
        { href: "/css/main.min.css", as: "style", type: "text/css" },
        { href: "/js/main.min.js", as: "script", type: "text/javascript" },
      ],
      prefetch: [
        { href: "/css/components/capabilities-matrix.css", as: "style" },
        { href: "/css/components/terminal.css", as: "style" },
        { href: "/css/components/technical-arsenal.css", as: "style" },
      ],
      preconnect: [
        { href: "https://fonts.googleapis.com", crossorigin: true },
        { href: "https://fonts.gstatic.com", crossorigin: true },
        { href: "https://api.github.com", crossorigin: true },
      ],
    };

    try {
      const hintsPath = path.join(this.projectRoot, "resource-hints.json");
      fs.writeFileSync(hintsPath, JSON.stringify(hints, null, 2));
      console.log("  ✓ Resource hints generated");
    } catch (error) {
      console.log("  ⚠️  Failed to generate resource hints:", error.message);
    }
  }

  /**
   * Generate performance optimization report
   */
  async generatePerformanceReport() {
    console.log("📊 Generating performance report...");

    const report = {
      timestamp: new Date().toISOString(),
      optimizations: {
        criticalCSS: fs.existsSync(path.join(this.cssDir, "critical.css")),
        minifiedJS: fs.existsSync(path.join(this.jsDir, "main.min.js")),
        imageManifest: fs.existsSync(
          path.join(this.imagesDir, "optimization-manifest.json")
        ),
        resourceHints: fs.existsSync(
          path.join(this.projectRoot, "resource-hints.json")
        ),
      },
      recommendations: [
        "Enable gzip compression on server",
        "Set up CDN for static assets",
        "Implement HTTP/2 server push for critical resources",
        "Add service worker for caching",
        "Optimize images with actual WebP conversion",
        "Set up automated performance monitoring",
      ],
      nextSteps: [
        "Run Lighthouse audit",
        "Test on slow 3G connection",
        "Verify Core Web Vitals scores",
        "Test with real user monitoring",
      ],
    };

    try {
      const reportPath = path.join(this.projectRoot, "performance-report.json");
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log("  ✓ Performance report generated");

      // Display summary
      console.log("\n📋 Optimization Summary:");
      Object.entries(report.optimizations).forEach(([key, value]) => {
        const status = value ? "✅" : "❌";
        console.log(`  ${status} ${key}`);
      });
    } catch (error) {
      console.log(
        "  ⚠️  Failed to generate performance report:",
        error.message
      );
    }
  }
}

// Run the build script if called directly
if (require.main === module) {
  const buildScript = new PerformanceBuildScript();
  buildScript.run();
}

module.exports = PerformanceBuildScript;
