const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  displayName: 'Database Tests',
  setupFilesAfterEnv: ['<rootDir>/jest.db.setup.js'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.db.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/db/**/*.test.{js,jsx,ts,tsx}',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  collectCoverageFrom: [
    'src/lib/db*.ts',
    'src/lib/test-utils/db*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage/db',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000, // 30 seconds for database operations
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)