const { execSync } = require("child_process");
const path = require("path");

// Change to project root directory
process.chdir(path.join(__dirname, ".."));

// Run the seed script
try {
  console.log("🌱 Starting project seeding...");

  // First, ensure the database is up to date
  execSync("npx prisma db push", { stdio: "inherit" });

  // Run the seed script
  execSync("npx tsx src/lib/project-seed.ts", { stdio: "inherit" });

  console.log("✅ Project seeding completed successfully!");
} catch (error) {
  console.error("❌ Project seeding failed:", error.message);
  process.exit(1);
}
