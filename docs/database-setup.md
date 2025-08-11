# Database Architecture and Setup Guide

This document provides comprehensive information about the database architecture, setup, and utilities for the Brutalist Developer Portfolio project.

## Overview

The project uses **Neon PostgreSQL** as the primary database with **Prisma ORM** for type-safe database operations. The architecture is designed for optimal performance with connection pooling, comprehensive indexing, and robust testing utilities.

## Database Architecture

### Technology Stack
- **Database**: Neon PostgreSQL (Serverless PostgreSQL)
- **ORM**: Prisma v6.13.0
- **Connection Pooling**: Neon's built-in connection pooling + Prisma client optimization
- **Testing**: Jest with custom database utilities and mock data generators

### Schema Overview

The database schema includes the following main entities:

1. **User Management**: Users with role-based access control
2. **Content Management**: Projects and blog posts with categories and tags
3. **GitHub Integration**: Repository data and contribution tracking
4. **Analytics**: Page views and user behavior tracking
5. **Social Proof**: Testimonials and client feedback
6. **Communication**: Contact submissions and inquiry management

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file based on `.env.example`:

```bash
# Production Database
DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/brutalist_portfolio?sslmode=require"

# Test Database (optional)
TEST_DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/test_brutalist_portfolio?sslmode=require"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create and run migrations (for production)
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 3. Database Studio

Access the Prisma Studio for visual database management:

```bash
npm run db:studio
```

## Database Utilities

### Connection Management

The database connection is managed through `src/lib/db.ts`:

```typescript
import { db, checkDatabaseConnection, disconnectDatabase } from '@/lib/db';

// Check database health
const isHealthy = await checkDatabaseConnection();

// Graceful shutdown
await disconnectDatabase();
```

### Query Utilities

Comprehensive query utilities are available in `src/lib/db-utils.ts`:

```typescript
import { 
  ProjectQueries, 
  BlogQueries, 
  GitHubQueries, 
  AnalyticsQueries,
  TestimonialQueries,
  ContactQueries,
  DatabaseUtils 
} from '@/lib/db-utils';

// Get featured projects with relations
const featuredProjects = await ProjectQueries.getFeatured(6);

// Search blog posts
const searchResults = await BlogQueries.search('React');

// Record page view
await AnalyticsQueries.recordPageView({
  path: '/projects',
  sessionId: 'session-123',
  country: 'US'
});

// Get database statistics
const stats = await DatabaseUtils.getStats();
```

## Testing

### Test Database Setup

1. **Create Test Database**: Set up a separate test database in Neon
2. **Configure Environment**: Set `TEST_DATABASE_URL` in your environment
3. **Run Database Tests**: Use the specialized database testing commands

### Testing Commands

```bash
# Run all database tests
npm run test:db

# Run database tests in watch mode
npm run test:db:watch

# Run database tests with coverage
npm run test:db:coverage

# Set up test database schema
npm run db:test:setup
```

### Test Utilities

The project includes comprehensive testing utilities:

```typescript
import { 
  TestDatabaseUtils, 
  TestSeeder, 
  MockDataGenerators,
  setupTestDatabase 
} from '@/lib/test-utils/db-test-utils';

// In your test file
setupTestDatabase();

describe('Your Test Suite', () => {
  let testSeeder: TestSeeder;

  beforeEach(async () => {
    const testDb = TestDatabaseUtils.getTestDb();
    testSeeder = new TestSeeder(testDb);
  });

  it('should create and query data', async () => {
    // Seed test data
    const user = await testSeeder.seedUser({ role: 'ADMIN' });
    const project = await testSeeder.seedProject({ authorId: user.id });

    // Test your queries
    const projects = await ProjectQueries.getAll();
    expect(projects).toHaveLength(1);
  });
});
```

### Mock Data Generators

Generate realistic test data:

```typescript
import { MockDataGenerators } from '@/lib/test-utils/db-test-utils';

// Generate single items
const user = MockDataGenerators.generateUser({ role: 'ADMIN' });
const project = MockDataGenerators.generateProject({ featured: true });

// Generate multiple items
const users = MockDataGenerators.generateUsers(5);
const projects = MockDataGenerators.generateProjects(10, { status: 'ACTIVE' });
```

## Performance Optimization

### Indexing Strategy

The schema includes strategic indexes for optimal query performance:

- **User queries**: Indexed on email and role
- **Content queries**: Indexed on slug, status, featured, and publication dates
- **Analytics queries**: Indexed on path, session, user, and timestamps
- **GitHub data**: Indexed on repository metadata and sync timestamps

### Connection Pooling

Neon provides built-in connection pooling, and the Prisma client is configured with:

- **Transaction timeout**: 10 seconds
- **Max wait time**: 5 seconds
- **Global singleton**: Prevents connection leaks in development

### Query Optimization

- **Selective includes**: Only fetch related data when needed
- **Pagination support**: Built-in limit/offset for large datasets
- **Efficient aggregations**: Optimized count and grouping queries
- **Batch operations**: Transaction support for multiple operations

## Data Models

### Core Entities

#### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  projects     Project[]
  blogPosts    BlogPost[]
  testimonials Testimonial[]
}
```

#### Project
```prisma
model Project {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  description String
  content     String?
  technologies String[]
  githubUrl   String?
  liveUrl     String?
  status      ProjectStatus @default(ACTIVE)
  featured    Boolean       @default(false)
  
  // Relations
  authorId   String
  author     User                @relation(fields: [authorId], references: [id])
  categories ProjectCategory[]
  analytics  ProjectAnalytics[]
}
```

### Analytics Models

#### PageView
```prisma
model PageView {
  id        String   @id @default(cuid())
  path      String
  sessionId String
  userId    String?
  country   String?
  city      String?
  createdAt DateTime @default(now())
}
```

## Maintenance

### Regular Tasks

1. **Database Cleanup**: Remove old analytics data (automated)
2. **Index Monitoring**: Monitor query performance
3. **Backup Verification**: Ensure Neon backups are working
4. **Schema Updates**: Apply migrations safely

### Monitoring

```typescript
// Health check
const isHealthy = await DatabaseUtils.healthCheck();

// Get statistics
const stats = await DatabaseUtils.getStats();

// Clean up old data
await DatabaseUtils.cleanup();
```

## Security

### Best Practices

1. **Environment Variables**: Never commit database URLs
2. **Connection Limits**: Respect Neon connection limits
3. **Input Validation**: Use Prisma's type safety
4. **Role-Based Access**: Implement proper authorization
5. **SQL Injection Prevention**: Use parameterized queries

### Access Control

```typescript
// Role-based queries
const adminUsers = await db.user.findMany({
  where: { role: 'ADMIN' }
});

// Secure user data access
const userProjects = await db.project.findMany({
  where: { 
    authorId: userId,
    publishedAt: { not: null }
  }
});
```

## Troubleshooting

### Common Issues

1. **Connection Errors**: Check DATABASE_URL format and Neon status
2. **Migration Failures**: Ensure schema changes are compatible
3. **Test Failures**: Verify TEST_DATABASE_URL is set correctly
4. **Performance Issues**: Check query patterns and indexes

### Debug Commands

```bash
# Check Prisma client generation
npm run db:generate

# Validate schema
npx prisma validate

# View database schema
npx prisma db pull

# Reset database (development only)
npm run db:reset
```

## Migration Guide

### Development to Production

1. **Schema Changes**: Use migrations instead of db:push
2. **Data Migration**: Write custom migration scripts for data changes
3. **Rollback Plan**: Always have a rollback strategy
4. **Testing**: Test migrations on staging environment first

### Example Migration

```bash
# Create migration
npx prisma migrate dev --name add_user_preferences

# Apply to production
npx prisma migrate deploy
```

This comprehensive database setup provides a robust foundation for the brutalist developer portfolio with excellent performance, testing capabilities, and maintainability.