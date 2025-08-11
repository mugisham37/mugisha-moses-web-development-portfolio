import { seedProjects } from "./project-seed";

async function main() {
  try {
    await seedProjects();
    console.log("✅ Project seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Project seeding failed:", error);
    process.exit(1);
  }
}

main();
