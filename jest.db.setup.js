// Database-specific Jest setup
import { TestDatabaseUtils } from './src/lib/test-utils/db-test-utils';

// Global setup for database tests
beforeAll(async () => {
  await TestDatabaseUtils.setup();
});

afterAll(async () => {
  await TestDatabaseUtils.teardown();
});

// Set longer timeout for database operations
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_brutalist_portfolio';

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});