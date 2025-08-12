#!/usr/bin/env node

/**
 * Production configuration and environment validation script
 */

const fs = require("fs");
const path = require("path");

class ProductionConfigManager {
  constructor() {
    this.requiredEnvVars = [
      // Database
      "DATABASE_URL",

      // Authentication
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",

      // GitHub Integration
      "GITHUB_TOKEN",
      "GITHUB_USERNAME",

      // Email Service
      "RESEND_API_KEY",
      "EMAIL_FROM",
      "ADMIN_EMAIL",

      // File Upload
      "UPLOADTHING_SECRET",
      "UPLOADTHING_APP_ID",

      // Application
      "NEXT_PUBLIC_APP_URL",
    ];

    this.optionalEnvVars = [
      "GITHUB_ID",
      "GITHUB_SECRET",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "NEXT_PUBLIC_VERCEL_ANALYTICS_ID",
      "DATABASE_MAX_CONNECTIONS",
      "DATABASE_CONNECTION_TIMEOUT",
    ];

    this.productionSettings = {
      // Next.js optimizations
      nextConfig: {
        output: "standalone",
        poweredByHeader: false,
        compress: true,
        generateEtags: true,
        httpAgentOptions: {
          keepAlive: true,
        },
      },

      // Database optimizations
      database: {
        maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || "10"),
        connectionTimeout: parseInt(
          process.env.DATABASE_CONNECTION_TIMEOUT || "30000"
        ),
        queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || "10000"),
        statementTimeout: parseInt(
          process.env.DATABASE_STATEMENT_TIMEOUT || "30000"
        ),
      },

      // Caching configuration
      cache: {
        defaultTTL: 300, // 5 minutes
        longTTL: 3600, // 1 hour
        staticTTL: 86400, // 24 hours
        maxMemoryUsage: "100mb",
      },

      // Performance monitoring
      monitoring: {
        enablePerformanceMonitoring: true,
        enableErrorTracking: true,
        enableAnalytics: true,
        logLevel: "error",
      },

      // Security settings
      security: {
        enableCSP: true,
        enableHSTS: true,
        enableRateLimiting: true,
        maxRequestsPerMinute: 100,
        enableCORS: false,
      },
    };
  }

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  validateEnvironment() {
    this.log("🔍 Validating production environment...");

    const missingRequired = [];
    const missingOptional = [];

    // Check required environment variables
    for (const envVar of this.requiredEnvVars) {
      if (!process.env[envVar]) {
        missingRequired.push(envVar);
      }
    }

    // Check optional environment variables
    for (const envVar of this.optionalEnvVars) {
      if (!process.env[envVar]) {
        missingOptional.push(envVar);
      }
    }

    // Report missing required variables
    if (missingRequired.length > 0) {
      this.log(`Missing required environment variables:`, "error");
      missingRequired.forEach((envVar) => {
        this.log(`  - ${envVar}`, "error");
      });
      throw new Error("Missing required environment variables");
    }

    // Report missing optional variables
    if (missingOptional.length > 0) {
      this.log(
        `Missing optional environment variables (features may be limited):`,
        "warn"
      );
      missingOptional.forEach((envVar) => {
        this.log(`  - ${envVar}`, "warn");
      });
    }

    // Validate environment variable formats
    this.validateEnvironmentFormats();

    this.log("✅ Environment validation completed");
  }

  validateEnvironmentFormats() {
    // Validate URLs
    const urlVars = ["DATABASE_URL", "NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL"];
    for (const envVar of urlVars) {
      if (process.env[envVar]) {
        try {
          new URL(process.env[envVar]);
        } catch (error) {
          throw new Error(
            `Invalid URL format for ${envVar}: ${process.env[envVar]}`
          );
        }
      }
    }

    // Validate email addresses
    const emailVars = ["EMAIL_FROM", "ADMIN_EMAIL"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const envVar of emailVars) {
      if (process.env[envVar] && !emailRegex.test(process.env[envVar])) {
        throw new Error(
          `Invalid email format for ${envVar}: ${process.env[envVar]}`
        );
      }
    }

    // Validate numeric values
    const numericVars = [
      "DATABASE_MAX_CONNECTIONS",
      "DATABASE_CONNECTION_TIMEOUT",
    ];
    for (const envVar of numericVars) {
      if (process.env[envVar] && isNaN(parseInt(process.env[envVar]))) {
        throw new Error(
          `Invalid numeric value for ${envVar}: ${process.env[envVar]}`
        );
      }
    }
  }

  generateProductionConfig() {
    this.log("⚙️ Generating production configuration...");

    const config = {
      environment: "production",
      timestamp: new Date().toISOString(),
      settings: this.productionSettings,
      environment_variables: {
        required: this.requiredEnvVars.reduce((acc, envVar) => {
          acc[envVar] = process.env[envVar] ? "✓ Set" : "✗ Missing";
          return acc;
        }, {}),
        optional: this.optionalEnvVars.reduce((acc, envVar) => {
          acc[envVar] = process.env[envVar] ? "✓ Set" : "✗ Missing";
          return acc;
        }, {}),
      },
    };

    // Write configuration to file
    const configPath = path.join(process.cwd(), "production-config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    this.log(`📄 Production configuration saved to ${configPath}`);
    return config;
  }

  generateDockerfile() {
    this.log("🐳 Generating optimized Dockerfile...");

    const dockerfile = `# Multi-stage build for production optimization
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]`;

    const dockerfilePath = path.join(process.cwd(), "Dockerfile");
    fs.writeFileSync(dockerfilePath, dockerfile);

    this.log(`🐳 Dockerfile saved to ${dockerfilePath}`);
  }

  generateDockerCompose() {
    this.log("🐳 Generating Docker Compose configuration...");

    const dockerCompose = `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=\${NEXTAUTH_URL}
      - GITHUB_TOKEN=\${GITHUB_TOKEN}
      - GITHUB_USERNAME=\${GITHUB_USERNAME}
      - RESEND_API_KEY=\${RESEND_API_KEY}
      - EMAIL_FROM=\${EMAIL_FROM}
      - ADMIN_EMAIL=\${ADMIN_EMAIL}
      - UPLOADTHING_SECRET=\${UPLOADTHING_SECRET}
      - UPLOADTHING_APP_ID=\${UPLOADTHING_APP_ID}
      - NEXT_PUBLIC_APP_URL=\${NEXT_PUBLIC_APP_URL}
    depends_on:
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=brutalist_portfolio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  postgres_data:
  redis_data:`;

    const dockerComposePath = path.join(process.cwd(), "docker-compose.yml");
    fs.writeFileSync(dockerComposePath, dockerCompose);

    this.log(`🐳 Docker Compose configuration saved to ${dockerComposePath}`);
  }

  generateNginxConfig() {
    this.log("🌐 Generating Nginx configuration...");

    const nginxConfig = `upstream nextjs_upstream {
    server app:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name \${DOMAIN_NAME};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name \${DOMAIN_NAME};

    # SSL configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Static files caching
    location /_next/static/ {
        alias /app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /static/ {
        alias /app/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://nextjs_upstream;
        access_log off;
    }
}`;

    const nginxConfigPath = path.join(process.cwd(), "nginx.conf");
    fs.writeFileSync(nginxConfigPath, nginxConfig);

    this.log(`🌐 Nginx configuration saved to ${nginxConfigPath}`);
  }

  async run() {
    try {
      this.validateEnvironment();
      const config = this.generateProductionConfig();
      this.generateDockerfile();
      this.generateDockerCompose();
      this.generateNginxConfig();

      this.log("🎉 Production configuration completed successfully");
      return config;
    } catch (error) {
      this.log(`Production configuration failed: ${error.message}`, "error");
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const configManager = new ProductionConfigManager();
  configManager.run().catch((error) => {
    console.error("Configuration failed:", error);
    process.exit(1);
  });
}

module.exports = ProductionConfigManager;
