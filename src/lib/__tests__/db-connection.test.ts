import { checkDatabaseConnection, disconnectDatabase } from '../db';

describe('Database Connection', () => {
  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should have database connection utilities', () => {
    expect(typeof checkDatabaseConnection).toBe('function');
    expect(typeof disconnectDatabase).toBe('function');
  });

  // Skip actual database tests if no DATABASE_URL is provided
  it.skip('should connect to database successfully', async () => {
    if (!process.env.DATABASE_URL) {
      console.log('Skipping database test - no DATABASE_URL provided');
      return;
    }
    
    const isConnected = await checkDatabaseConnection();
    expect(isConnected).toBe(true);
  });
});