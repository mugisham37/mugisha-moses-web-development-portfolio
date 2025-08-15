# Prisma Client Setup Fix

## Problem Description

The error you encountered was:

```
Module not found: Can't resolve '.prisma/client/default'
```

This happens because:

1. **Prisma Client Not Generated**: The `.prisma/client` directory doesn't exist because `prisma generate` hasn't been run
2. **Instrumentation Loading Order**: Next.js instrumentation runs early and tries to import the database connection before Prisma client is available
3. **Development vs Production**: The issue is more prominent in development with Turbopack

## Root Causes

1. **Missing Prisma Client Generation**: The Prisma client needs to be generated before the application starts
2. **Eager Imports in Instrumentation**: The instrumentation file was importing database connections immediately
3. **Missing Environment Variables**: DATABASE_URL might not be configured
4. **Build Order Dependencies**: Next.js tries to load instrumentation before dependencies are ready

## Solutions Implemented

### 1. Fixed Instrumentation File (`src/instrumentation.ts`)

- Added try-catch blocks around database imports
- Made database monitoring conditional on Prisma client availability
- Added graceful fallback when database is not available

### 2. Enhanced Performance Monitor (`src/lib/performance-monitor.ts`)

- Made database imports lazy-loaded
- Added conditional database operations
- Graceful handling when database is unavailable

### 3. Improved Database Connection (`src/lib/db.ts`)

- Added warning when DATABASE_URL is not configured
- Reduced logging in development to avoid noise
- Better error handling for missing environment variables

### 4. Updated Middleware (`src/middleware.ts`)

- Made Prisma imports lazy-loaded
- Added fallback behavior when authentication is unavailable
- Used string constants instead of Prisma enums to avoid dependency issues

### 5. Enhanced Package Scripts

- Added `postinstall` script to automatically generate Prisma client
- Created setup script for development environment
- Updated development scripts to ensure proper initialization

### 6. Created Setup Scripts

- `scripts/setup-dev.js`: Comprehensive development setup
- Updated `scripts/dev-windows.ps1`: Enhanced Windows development script

## How to Use

### Quick Start (Recommended)

```bash
npm run dev
```

This will automatically run setup and start the development server.

### Manual Setup

```bash
# 1. Copy environment variables
cp .env.example .env.local

# 2. Configure your DATABASE_URL in .env.local
# DATABASE_URL="postgresql://username:password@localhost:5432/brutalist_portfolio"

# 3. Generate Prisma client
npm run db:generate

# 4. Push database schema (optional)
npm run db:push

# 5. Start development server
npm run dev:quick
```

### Windows Users

```powershell
npm run dev:windows
```

## Environment Setup

### Required Environment Variables

Create `.env.local` with at minimum:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/brutalist_portfolio"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup Options

#### Option 1: Local PostgreSQL

1. Install PostgreSQL locally
2. Create database: `createdb brutalist_portfolio`
3. Set DATABASE_URL in `.env.local`

#### Option 2: Cloud Database (Recommended)

Use services like:

- **Supabase** (Free tier available)
- **PlanetScale** (Free tier available)
- **Railway** (Free tier available)
- **Neon** (Free tier available)

#### Option 3: Development Without Database

The application will work without a database, but some features will be disabled:

- Authentication
- Blog posts
- Project management
- Analytics

## Troubleshooting

### Issue: "Module not found: Can't resolve '.prisma/client/default'"

**Solution**: Run `npm run db:generate` or `npx prisma generate`

### Issue: "Database connection failed"

**Solutions**:

1. Check DATABASE_URL in `.env.local`
2. Ensure database server is running
3. Verify database credentials
4. Check network connectivity

### Issue: "Slow filesystem detected"

**Solutions** (Windows):

1. Add project folder to Windows Defender exclusions
2. Move project to local drive (not network drive)
3. Consider using WSL2 for better performance

### Issue: Authentication errors

**Solutions**:

1. Set NEXTAUTH_SECRET in `.env.local`
2. Ensure NEXTAUTH_URL matches your development URL
3. Run `npm run db:push` to create auth tables

## Performance Optimizations

### Windows Development

- Add project folder to antivirus exclusions
- Use local drive (not network drive)
- Consider WSL2 for better performance
- Use `npm run dev:windows` for optimized Windows setup

### General

- Use Turbopack for faster builds (`npm run dev`)
- Clear caches regularly (`npm run clean`)
- Monitor performance with built-in monitoring

## Prevention

To prevent similar issues in the future:

1. **Always run setup**: Use `npm run dev` instead of `npm run dev:quick`
2. **Check environment**: Ensure `.env.local` is properly configured
3. **Generate client**: Run `npm run db:generate` after schema changes
4. **Use postinstall**: The `postinstall` script ensures Prisma client is always generated

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [Database Setup Guide](./database-setup.md)
