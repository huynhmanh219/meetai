import { beforeAll, afterAll, afterEach } from 'vitest';

// Setup environment variables for testing
beforeAll(() => {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
});

afterAll(() => {
  // Clean up any resources if needed
});

afterEach(() => {
  // Reset mocks after each test
});