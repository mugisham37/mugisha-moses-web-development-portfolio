module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000",
        "http://localhost:3000/projects",
        "http://localhost:3000/blog",
        "http://localhost:3000/services",
        "http://localhost:3000/contact",
      ],
      startServerCommand: "npm start",
      startServerReadyPattern: "ready on",
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
        preset: "desktop",
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
        formFactor: "desktop",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
    },
    assert: {
      assertions: {
        // Performance thresholds
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],

        // Core Web Vitals
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "first-input-delay": ["error", { maxNumericValue: 100 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "speed-index": ["error", { maxNumericValue: 3000 }],
        interactive: ["error", { maxNumericValue: 3800 }],

        // Resource optimization
        "total-byte-weight": ["warn", { maxNumericValue: 1600000 }], // 1.6MB
        "unused-javascript": ["warn", { maxNumericValue: 200000 }], // 200KB
        "unused-css-rules": ["warn", { maxNumericValue: 50000 }], // 50KB
        "modern-image-formats": "error",
        "uses-optimized-images": "error",
        "uses-webp-images": "warn",
        "uses-responsive-images": "error",

        // Caching and compression
        "uses-long-cache-ttl": "warn",
        "uses-text-compression": "error",

        // JavaScript and CSS optimization
        "unminified-css": "error",
        "unminified-javascript": "error",
        "unused-javascript": ["warn", { maxNumericValue: 200000 }],
        "render-blocking-resources": "warn",

        // Accessibility requirements
        "color-contrast": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",
        "button-name": "error",

        // SEO requirements
        "document-title": "error",
        "meta-description": "error",
        "http-status-code": "error",
        "link-text": "error",
        "is-crawlable": "error",

        // Best practices
        "is-on-https": "error",
        "uses-http2": "warn",
        "no-vulnerable-libraries": "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
    server: {
      port: 9001,
      storage: {
        storageMethod: "sql",
        sqlDialect: "sqlite",
        sqlDatabasePath: "./lhci.db",
      },
    },
  },
};
