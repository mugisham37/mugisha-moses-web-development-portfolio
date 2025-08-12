# Testing Documentation

This document provides comprehensive information about the testing setup for the Brutalist Developer Portfolio.

## Overview

The project implements a multi-layered testing strategy covering:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Database operations and API routes
- **End-to-End Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance and keyboard navigation
- **Visual Regression Tests**: UI consistency across changes
- **Performance Tests**: Core Web Vitals and bundle size

## Test Structure

```
├── src/
│   ├── components/
│   │   └── **/__tests__/          # Component unit tests
│   ├── lib/
│   │   ├── __tests__/             # Utility unit tests
│   │   └── test-utils/            # Test utilities and helpers
│   └── app/api/
│       └── __tests__/             # API integration tests
├── e2e/
│   ├── tests/                     # End-to-end tests
│   ├── pages/                     # Page object models
│   ├── utils/                     # E2E test utilities
│   └── visual-regression/         # Visual regression tests
├── tests/
│   ├── fixtures/                  # Test data fixtures
│   └── integration/               # Additional integration tests
└── scripts/
    └── test-runner.js             # Comprehensive test runner
```

## Testing Technologies

### Core Testing Framework

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **axe-core**: Accessibility testing

### Additional Tools

- **@faker-js/faker**: Test data generation
- **jest-axe**: Accessibility testing in Jest
- **Storybook Test Runner**: Component story testing
- **MSW**: API mocking (if needed)

## Running Tests

### All Tests

```bash
# Run complete test suite
npm run test:all

# Run tests for CI/CD
npm run test:ci
```

### Individual Test Types

```bash
# Unit tests
npm run test:unit
npm run test:watch

# Integration tests
npm run test:integration
npm run test:db

# End-to-end tests
npm run test:e2e
npm run test:e2e:ui          # With Playwright UI
npm run test:e2e:debug       # Debug mode
npm run test:e2e:headed      # With browser UI

# Accessibility tests
npm run test:accessibility

# Visual regression tests
npm run test:visual
npm run test:visual:update   # Update snapshots

# Storybook tests
npm run test:storybook
```

### Quick Testing

```bash
# Test only changed files
npm run test:changed

# Test related to specific files
npm run test:quick src/components/ui/button.tsx

# Test with coverage
npm run test:coverage
```

## Test Configuration

### Environment Variables

```bash
# Test database (optional, falls back to main DB)
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db

# Skip certain test types in CI
SKIP_E2E=true
SKIP_VISUAL=true

# Playwright base URL
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

### Jest Configuration

- **Unit tests**: `jest.config.js`
- **Integration tests**: `jest.db.config.js`
- **Setup files**: `jest.setup.js`, `jest.db.setup.js`

### Playwright Configuration

- **Main config**: `playwright.config.ts`
- **Global setup**: `e2e/global-setup.ts`
- **Global teardown**: `e2e/global-teardown.ts`

## Writing Tests

### Unit Tests

#### Component Testing

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";
import { renderWithProviders } from "@/lib/test-utils/component-test-utils";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
```

#### Utility Function Testing

```typescript
import { formatDate, calculateReadingTime } from "../utils";

describe("Utility Functions", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toBe("January 15, 2024");
    });
  });

  describe("calculateReadingTime", () => {
    it("calculates reading time for short text", () => {
      const text = "This is a short text.";
      expect(calculateReadingTime(text)).toBe(1);
    });
  });
});
```

### Integration Tests

#### API Route Testing

```typescript
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import {
  TestDatabaseUtils,
  MockDataGenerators,
} from "@/lib/test-utils/db-test-utils";

describe("/api/projects", () => {
  beforeAll(async () => {
    await TestDatabaseUtils.setup();
  });

  afterAll(async () => {
    await TestDatabaseUtils.teardown();
  });

  beforeEach(async () => {
    await TestDatabaseUtils.reset();
  });

  it("returns paginated projects", async () => {
    const request = new NextRequest("http://localhost:3000/api/projects");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

#### Database Testing

```typescript
import { db } from "@/lib/db";
import { TestSeeder } from "@/lib/test-utils/db-test-utils";

describe("Project Queries", () => {
  let testSeeder: TestSeeder;

  beforeAll(async () => {
    testSeeder = new TestSeeder(db);
  });

  it("creates and retrieves project", async () => {
    const project = await testSeeder.seedProject({
      title: "Test Project",
      featured: true,
    });

    const retrieved = await db.project.findUnique({
      where: { id: project.id },
    });

    expect(retrieved).toBeTruthy();
    expect(retrieved?.title).toBe("Test Project");
    expect(retrieved?.featured).toBe(true);
  });
});
```

### End-to-End Tests

#### Page Testing

```typescript
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("displays hero section", async ({ page }) => {
    await page.goto("/");

    const heroTitle = page.locator('[data-testid="hero-title"]');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText("BRUTALIST");
  });

  test("navigates to projects page", async ({ page }) => {
    await page.goto("/");

    await page.click('[data-testid="projects-link"]');
    await expect(page).toHaveURL("/projects");
  });
});
```

#### Form Testing

```typescript
test("submits contact form successfully", async ({ page }) => {
  await page.goto("/contact");

  await page.fill('input[name="name"]', "John Doe");
  await page.fill('input[name="email"]', "john@example.com");
  await page.fill('textarea[name="message"]', "Test message");

  await page.click('button[type="submit"]');

  const successMessage = page.locator('[data-testid="success-message"]');
  await expect(successMessage).toBeVisible();
});
```

### Accessibility Tests

```typescript
import { AccessibilityTestUtils } from "../utils/accessibility-test-utils";

test("homepage is accessible", async ({ page }) => {
  await page.goto("/");

  const accessibilityUtils = new AccessibilityTestUtils();
  const violations = await accessibilityUtils.testPageAccessibility(page);

  expect(violations.length).toBeLessThan(5);

  const keyboardResults = await accessibilityUtils.testKeyboardNavigation(page);
  expect(keyboardResults.canTabToElements).toBe(true);
});
```

### Visual Regression Tests

```typescript
import { VisualTestUtils } from "../visual-regression/visual-test-utils";

test("homepage visual consistency", async ({ page }) => {
  const visualUtils = new VisualTestUtils(page);

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await visualUtils.compareScreenshot("homepage", {
    fullPage: true,
    mask: ['[data-testid="dynamic-content"]', ".loading-spinner"],
  });
});
```

## Test Data Management

### Mock Data Generation

```typescript
import { TestDataGenerators } from "@/lib/test-utils/test-data-generators";

// Generate single items
const user = TestDataGenerators.generateUser();
const project = TestDataGenerators.generateProject({ featured: true });

// Generate multiple items
const projects = TestDataGenerators.generateMultiple(
  TestDataGenerators.generateProject,
  5,
  { status: "ACTIVE" }
);

// Generate API responses
const response = TestDataGenerators.generateApiResponse(projects, true, {
  page: 1,
  limit: 10,
  total: 25,
});
```

### Database Seeding

```typescript
import { TestSeeder } from "@/lib/test-utils/db-test-utils";

const testSeeder = new TestSeeder(db);

// Seed individual items
const user = await testSeeder.seedUser({ role: "ADMIN" });
const project = await testSeeder.seedProject({ authorId: user.id });

// Seed complete dataset
const data = await testSeeder.seedBasicData();
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports

- **HTML**: `coverage/lcov-report/index.html`
- **JSON**: `coverage/coverage-final.json`
- **LCOV**: `coverage/lcov.info`

## Performance Testing

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size Limits

- **Maximum bundle size**: 500KB
- **Maximum gzipped size**: 150KB

## Accessibility Standards

### WCAG Compliance

- **Level AA** compliance required
- **Level AAA** preferred where possible

### Testing Areas

- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management
- ARIA labels and roles

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci
        env:
          TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Reports

- **HTML reports**: `test-results/test-report.html`
- **JSON reports**: `test-results/test-report.json`
- **JUnit XML**: `test-results/junit.xml`

## Debugging Tests

### Jest Debugging

```bash
# Debug specific test
npm run test -- --testNamePattern="Button Component" --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Debugging

```bash
# Debug mode
npm run test:e2e:debug

# Headed mode
npm run test:e2e:headed

# Trace viewer
npx playwright show-trace test-results/trace.zip
```

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** and avoid shared state

### Test Data

1. **Use factories** for generating test data
2. **Avoid hardcoded values** where possible
3. **Clean up after tests** to prevent side effects
4. **Use realistic data** that matches production scenarios

### Assertions

1. **Be specific** with assertions
2. **Test behavior, not implementation**
3. **Use appropriate matchers** for better error messages
4. **Avoid testing multiple things** in one test

### Performance

1. **Run tests in parallel** when possible
2. **Use test.only sparingly** and remove before committing
3. **Mock external dependencies** to improve speed
4. **Clean up resources** after tests complete

## Troubleshooting

### Common Issues

#### Tests Timing Out

- Increase timeout values in configuration
- Check for infinite loops or hanging promises
- Use `waitFor` utilities for async operations

#### Database Connection Issues

- Verify TEST_DATABASE_URL is set correctly
- Ensure test database is running and accessible
- Check database permissions and schema

#### Flaky Tests

- Add proper wait conditions
- Mock time-dependent functionality
- Ensure tests are independent
- Use deterministic test data

#### Visual Test Failures

- Update snapshots when UI changes are intentional
- Check for dynamic content that should be masked
- Verify consistent test environment

### Getting Help

1. Check the test output and error messages
2. Review the test configuration files
3. Look at similar working tests for patterns
4. Check the documentation for testing libraries
5. Ask team members for assistance

## Maintenance

### Regular Tasks

1. **Update snapshots** when UI changes
2. **Review and update** test data generators
3. **Monitor coverage** and add tests for uncovered code
4. **Update dependencies** and fix breaking changes
5. **Review and refactor** slow or flaky tests

### Metrics to Monitor

- Test execution time
- Coverage percentages
- Flaky test frequency
- CI/CD pipeline success rate
- Accessibility violation trends
