const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["framer-motion", "clsx"],
    optimizeCss: true,
    webVitalsAttribution: ["CLS", "LCP"],
  },

  // Image optimization configuration
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Bundle analyzer for production builds
    if (process.env.ANALYZE === "true" && !dev && !isServer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "../bundle-analyzer-report.html",
        })
      );
    }

    // CSS Modules configuration
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: dev
                ? "[name]__[local]--[hash:base64:5]"
                : "[hash:base64:8]",
              exportLocalsConvention: "camelCase",
            },
            importLoaders: 1,
          },
        },
        "postcss-loader",
      ],
    });

    // Tree shaking optimizations
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    // Advanced bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,

          // Framework chunk (React, Next.js)
          framework: {
            name: "framework",
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },

          // Animation libraries
          animations: {
            name: "animations",
            chunks: "all",
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            priority: 30,
            enforce: true,
          },

          // UI libraries
          ui: {
            name: "ui",
            chunks: "all",
            test: /[\\/]node_modules[\\/](clsx|tailwindcss)[\\/]/,
            priority: 25,
            enforce: true,
          },

          // Vendor chunk for other node_modules
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            enforce: true,
          },

          // Common chunk for shared code
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            enforce: true,
          },
        },
      };

      // Module concatenation for better tree shaking
      config.optimization.concatenateModules = true;

      // Minimize bundle size
      config.optimization.minimize = true;
    }

    // Resolve optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    };

    // Module resolution optimizations
    config.resolve.modules = ["node_modules"];
    config.resolve.extensions = [".tsx", ".ts", ".jsx", ".js", ".json"];

    return config;
  },
};

module.exports = nextConfig;
