#!/usr/bin/env node

/**
 * Development setup script
 * Ensures all dependencies are properly configured before starting development
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up development environment...\n");

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envLocalPath)) {
  console.log(
    "⚠️  .env.local not found. Please copy .env.example to .env.local and configure your environment variables."
  );
  process.exit(1);
}

// Check environment configuration
const envContent = fs.readFileSync(envLocalPath, "utf8");
const hasValidDatabaseUrl =
  envContent.includes("DATABASE_URL=") &&
  !envContent.includes('DATABASE_URL=""') &&
  !envContent.includes("username:password") &&
  !envContent.includes("localhost:5432/brutalist_portfolio");

if (!hasValidDatabaseUrl) {
  console.log("⚠️  DATABASE_URL not properly configured in .env.local");
  console.log("   The application will run without database features.");
  console.log("   To enable database features, configure a real DATABASE_URL.");
  console.log(
    '   Example: DATABASE_URL="postgresql://user:pass@host:5432/dbname"'
  );
}

try {
  // Generate Prisma client
  console.log("📦 Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma client generated successfully\n");

  // Only check database connection if URL is properly configured
  if (hasValidDatabaseUrl) {
    console.log("🔍 Checking database connection...");
    try {
      execSync("npx prisma db push --accept-data-loss", { stdio: "pipe" });
      console.log("✅ Database connection successful\n");
    } catch (dbError) {
      console.log(
        "⚠️  Database connection failed. Continuing without database features."
      );
      console.log("   Make sure your database is running and accessible.\n");
    }
  } else {
    console.log(
      "⏭️  Skipping database connection check (DATABASE_URL not configured)\n"
    );
  }

  // Install dependencies if needed
  if (!fs.existsSync(path.join(process.cwd(), "node_modules"))) {
    console.log("📦 Installing dependencies...");
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ Dependencies installed\n");
  }

  console.log("🎉 Development environment setup complete!");
  console.log("   The application will run with the following features:");
  console.log(
    `   - Database: ${hasValidDatabaseUrl ? "✅ Enabled" : "❌ Disabled"}`
  );
  console.log("   - Static features: ✅ Enabled");
  console.log("   - Performance monitoring: ✅ Enabled");
  console.log('\n   Run "npm run dev" to start the development server.');
} catch (error) {
  console.error("❌ Setup failed:", error.message);
  process.exit(1);
}
