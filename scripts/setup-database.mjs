#!/usr/bin/env node

/**
 * Database Setup Script
 * This script helps set up the PostgreSQL database for the project
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message) {
  console.log(`[DB Setup] ${message}`);
}

function error(message) {
  console.error(`[DB Setup Error] ${message}`);
}

function checkDatabaseConnection() {
  try {
    log('Checking database connection...');
    execSync('npx prisma db pull --preview-feature', { stdio: 'inherit' });
    log('Database connection successful!');
    return true;
  } catch {
    error('Database connection failed. Please check your DATABASE_URL in .env.local');
    return false;
  }
}

function setupDatabase() {
  try {
    log('Setting up database schema...');
    
    // Generate Prisma client
    log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    log('Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // Seed the database
    log('Seeding database...');
    try {
      execSync('npx prisma db seed', { stdio: 'inherit' });
    } catch {
      log('Seeding failed, but database schema is set up. You can seed manually later.');
    }
    
    log('Database setup completed successfully!');
    return true;
  } catch (err) {
    error('Database setup failed:');
    error(err.message);
    return false;
  }
}

function createEnvFileFromExample() {
  const projectRoot = path.join(__dirname, '..');
  const envExamplePath = path.join(projectRoot, '.env.example');
  const envLocalPath = path.join(projectRoot, '.env.local');
  
  if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
    log('Creating .env.local from .env.example...');
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envLocalPath, envExample);
    log('Please update .env.local with your actual database credentials');
    return false; // User needs to update credentials
  }
  return true;
}

function main() {
  log('Starting database setup...');
  
  // Check if .env.local exists, create from example if not
  if (!createEnvFileFromExample()) {
    log('Please update your .env.local file with correct database credentials and run this script again.');
    process.exit(1);
  }
  
  // Check database connection
  if (!checkDatabaseConnection()) {
    log('Please ensure PostgreSQL is running and credentials are correct in .env.local');
    process.exit(1);
  }
  
  // Setup database
  if (setupDatabase()) {
    log('🎉 Database setup completed successfully!');
    log('You can now run: npm run dev');
  } else {
    process.exit(1);
  }
}

main();

export { setupDatabase, checkDatabaseConnection };
