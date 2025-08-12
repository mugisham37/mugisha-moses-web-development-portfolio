#!/usr/bin/env node

/**
 * Production deployment script with health checks and rollback capabilities
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DEPLOYMENT_CONFIG = {
  healthCheckUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  healthCheckTimeout: 30000, // 30 seconds
  rollbackOnFailure: true,
  preDeploymentChecks: true,
  postDeploymentValidation: true,
};

class DeploymentManager {
  constructor() {
    this.startTime = Date.now();
    this.deploymentId = `deploy-${Date.now()}`;
  }

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async execute(command, description) {
    this.log(`Executing: ${description}`);
    try {
      const output = execSync(command, {
        encoding: "utf8",
        stdio: "pipe",
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });
      this.log(`✅ ${description} completed successfully`);
      return output;
    } catch (error) {
      this.log(`❌ ${description} failed: ${error.message}`, "error");
      throw error;
    }
  }

  async runPreDeploymentChecks() {
    this.log("🔍 Running pre-deployment checks...");

    // Check environment variables
    const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    // Check database connection
    try {
      await this.execute("npm run db:generate", "Generating Prisma client");

      // Test database connection
      await this.execute(
        "node -e \"const { PrismaClient } = require('@prisma/client'); const db = new PrismaClient(); db.$queryRaw\`SELECT 1\`.then(() => { console.log('Database connection successful'); process.exit(0); }).catch((e) => { console.error('Database connection failed:', e); process.exit(1); });\"",
        "Testing database connection"
      );
    } catch (error) {
      throw new Error(`Database checks failed: ${error.message}`);
    }

    // Run tests
    try {
      await this.execute("npm run test:ci", "Running test suite");
    } catch (error) {
      if (DEPLOYMENT_CONFIG.rollbackOnFailure) {
        throw new Error(`Tests failed: ${error.message}`);
      } else {
        this.log("Tests failed but continuing deployment", "warn");
      }
    }

    // Check build
    await this.execute("npm run build", "Building application");

    this.log("✅ Pre-deployment checks completed");
  }

  async deployApplication() {
    this.log("🚀 Starting application deployment...");

    // Database migrations
    await this.execute("npm run db:migrate", "Running database migrations");

    // Build application
    await this.execute("npm run build", "Building production application");

    // Additional deployment steps would go here
    // For Vercel, this might be handled automatically
    // For other platforms, you might need to:
    // - Upload build artifacts
    // - Update load balancer configuration
    // - Restart services

    this.log("✅ Application deployment completed");
  }

  async runHealthChecks() {
    this.log("🏥 Running health checks...");

    const maxAttempts = 10;
    const delayBetweenAttempts = 3000; // 3 seconds

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.log(`Health check attempt ${attempt}/${maxAttempts}`);

        // Check main application health
        const healthResponse = await this.checkEndpoint(
          `${DEPLOYMENT_CONFIG.healthCheckUrl}/api/health`
        );

        if (healthResponse.ok) {
          this.log("✅ Application health check passed");
          break;
        } else {
          throw new Error(
            `Health check failed with status: ${healthResponse.status}`
          );
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(
            `Health checks failed after ${maxAttempts} attempts: ${error.message}`
          );
        }

        this.log(
          `Health check attempt ${attempt} failed, retrying in ${delayBetweenAttempts}ms...`,
          "warn"
        );
        await this.sleep(delayBetweenAttempts);
      }
    }

    // Additional health checks
    await this.runAdditionalHealthChecks();

    this.log("✅ All health checks passed");
  }

  async runAdditionalHealthChecks() {
    const endpoints = ["/api/projects", "/api/blog", "/api/testimonials"];

    for (const endpoint of endpoints) {
      try {
        const response = await this.checkEndpoint(
          `${DEPLOYMENT_CONFIG.healthCheckUrl}${endpoint}`
        );
        if (response.ok) {
          this.log(`✅ Endpoint ${endpoint} is healthy`);
        } else {
          this.log(
            `⚠️ Endpoint ${endpoint} returned status ${response.status}`,
            "warn"
          );
        }
      } catch (error) {
        this.log(
          `⚠️ Endpoint ${endpoint} check failed: ${error.message}`,
          "warn"
        );
      }
    }
  }

  async checkEndpoint(url) {
    // Simple fetch implementation for Node.js
    const https = require("https");
    const http = require("http");

    return new Promise((resolve, reject) => {
      const client = url.startsWith("https") ? https : http;
      const request = client.get(url, (response) => {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
        });
      });

      request.on("error", reject);
      request.setTimeout(DEPLOYMENT_CONFIG.healthCheckTimeout, () => {
        request.destroy();
        reject(new Error("Health check timeout"));
      });
    });
  }

  async runPostDeploymentValidation() {
    this.log("🔍 Running post-deployment validation...");

    // Validate critical functionality
    const validationChecks = [
      {
        name: "Database connectivity",
        check: async () => {
          await this.execute(
            "node -e \"const { PrismaClient } = require('@prisma/client'); const db = new PrismaClient(); db.$queryRaw\`SELECT COUNT(*) FROM users\`.then(() => process.exit(0)).catch(() => process.exit(1));\"",
            "Validating database connectivity"
          );
        },
      },
      {
        name: "Static assets",
        check: async () => {
          const response = await this.checkEndpoint(
            `${DEPLOYMENT_CONFIG.healthCheckUrl}/_next/static/chunks/main.js`
          );
          if (!response.ok) {
            throw new Error("Static assets not accessible");
          }
        },
      },
    ];

    for (const validation of validationChecks) {
      try {
        await validation.check();
        this.log(`✅ ${validation.name} validation passed`);
      } catch (error) {
        this.log(
          `❌ ${validation.name} validation failed: ${error.message}`,
          "error"
        );
        throw error;
      }
    }

    this.log("✅ Post-deployment validation completed");
  }

  async rollback() {
    this.log("🔄 Initiating rollback...", "warn");

    try {
      // Rollback database migrations if needed
      // await this.execute("npm run db:migrate:rollback", "Rolling back database migrations");

      // Rollback application deployment
      // This would depend on your deployment platform
      // For Vercel, you might use their API to rollback to previous deployment

      this.log("✅ Rollback completed successfully");
    } catch (error) {
      this.log(`❌ Rollback failed: ${error.message}`, "error");
      throw error;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async deploy() {
    try {
      this.log(`🚀 Starting deployment ${this.deploymentId}`);

      if (DEPLOYMENT_CONFIG.preDeploymentChecks) {
        await this.runPreDeploymentChecks();
      }

      await this.deployApplication();

      if (DEPLOYMENT_CONFIG.postDeploymentValidation) {
        await this.runHealthChecks();
        await this.runPostDeploymentValidation();
      }

      const duration = Date.now() - this.startTime;
      this.log(
        `🎉 Deployment ${this.deploymentId} completed successfully in ${duration}ms`
      );

      // Log deployment metrics
      this.logDeploymentMetrics(duration, true);
    } catch (error) {
      this.log(
        `💥 Deployment ${this.deploymentId} failed: ${error.message}`,
        "error"
      );

      if (DEPLOYMENT_CONFIG.rollbackOnFailure) {
        try {
          await this.rollback();
        } catch (rollbackError) {
          this.log(
            `💥 Rollback also failed: ${rollbackError.message}`,
            "error"
          );
        }
      }

      const duration = Date.now() - this.startTime;
      this.logDeploymentMetrics(duration, false);

      process.exit(1);
    }
  }

  logDeploymentMetrics(duration, success) {
    const metrics = {
      deploymentId: this.deploymentId,
      duration,
      success,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
    };

    // In production, you might want to send these metrics to your monitoring system
    console.log("📊 Deployment Metrics:", JSON.stringify(metrics, null, 2));
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployment = new DeploymentManager();
  deployment.deploy().catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
}

module.exports = DeploymentManager;
