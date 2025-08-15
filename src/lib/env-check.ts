/**
 * Environment configuration checker
 * Validates required environment variables and provides helpful feedback
 */

export interface EnvCheckResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
  recommendations: string[];
}

export function checkEnvironment(): EnvCheckResult {
  const result: EnvCheckResult = {
    isValid: true,
    missing: [],
    warnings: [],
    recommendations: [],
  };

  // Check DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    result.warnings.push("DATABASE_URL not configured");
    result.recommendations.push(
      "Set DATABASE_URL in .env.local for database features"
    );
  } else if (
    dbUrl.includes("username:password") ||
    dbUrl.includes("localhost:5432/brutalist_portfolio")
  ) {
    result.warnings.push("DATABASE_URL appears to be a placeholder");
    result.recommendations.push(
      "Update DATABASE_URL with real database credentials"
    );
  }

  // Check NEXTAUTH_SECRET
  if (!process.env.NEXTAUTH_SECRET) {
    result.missing.push("NEXTAUTH_SECRET");
    result.recommendations.push(
      "Generate NEXTAUTH_SECRET: openssl rand -base64 32"
    );
  }

  // Check NEXTAUTH_URL
  if (!process.env.NEXTAUTH_URL) {
    result.warnings.push("NEXTAUTH_URL not set");
    result.recommendations.push(
      "Set NEXTAUTH_URL=http://localhost:3000 for development"
    );
  }

  // Update validity
  result.isValid = result.missing.length === 0;

  return result;
}

export function printEnvironmentStatus(): void {
  const check = checkEnvironment();

  console.log("\n🔍 Environment Configuration Check:");

  if (check.isValid) {
    console.log("✅ Core configuration is valid");
  } else {
    console.log("❌ Missing required configuration:");
    check.missing.forEach((key) => console.log(`   - ${key}`));
  }

  if (check.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    check.warnings.forEach((warning) => console.log(`   - ${warning}`));
  }

  if (check.recommendations.length > 0) {
    console.log("\n💡 Recommendations:");
    check.recommendations.forEach((rec) => console.log(`   - ${rec}`));
  }

  console.log("");
}

export function isDatabaseConfigured(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return false;

  // Check if it's a placeholder
  if (
    dbUrl.includes("username:password") ||
    dbUrl.includes("localhost:5432/brutalist_portfolio")
  ) {
    return false;
  }

  return true;
}
