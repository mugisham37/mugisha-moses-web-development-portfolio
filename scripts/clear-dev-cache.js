#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🧹 Clearing development cache...");

// Directories to clear
const cacheDirs = [".next", "node_modules/.cache", ".turbo"];

// Files to clear
const cacheFiles = [".next/cache", "tsconfig.tsbuildinfo"];

function deletePath(targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      if (stats.isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`✅ Cleared directory: ${targetPath}`);
      } else {
        fs.unlinkSync(targetPath);
        console.log(`✅ Cleared file: ${targetPath}`);
      }
    } else {
      console.log(`⏭️  Skipped (not found): ${targetPath}`);
    }
  } catch (error) {
    console.log(`❌ Failed to clear ${targetPath}:`, error.message);
  }
}

// Clear cache directories
cacheDirs.forEach(deletePath);

// Clear cache files
cacheFiles.forEach(deletePath);

console.log("✨ Cache clearing complete!");
console.log("💡 Now restart your development server with: npm run dev");
