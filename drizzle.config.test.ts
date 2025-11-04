import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('drizzle.config.ts', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // Clear the module cache to ensure fresh imports
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Configuration Structure', () => {
    it('should export a valid drizzle configuration object', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig).toBeDefined();
      expect(drizzleConfig).toHaveProperty('out');
      expect(drizzleConfig).toHaveProperty('schema');
      expect(drizzleConfig).toHaveProperty('dialect');
      expect(drizzleConfig).toHaveProperty('dbCredentials');
    });

    it('should have correct output directory path', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.out).toBe('./drizzle');
    });

    it('should point to the correct schema file', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.schema).toBe('./src/db/schema.ts');
    });

    it('should use postgresql dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.dialect).toBe('postgresql');
    });
  });

  describe('Database Credentials', () => {
    it('should use DATABASE_URL from environment variables', async () => {
      const testUrl = 'postgresql://testuser:testpass@testhost:5432/testdb';
      process.env.DATABASE_URL = testUrl;
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.dbCredentials).toBeDefined();
      expect(drizzleConfig.dbCredentials.url).toBe(testUrl);
    });

    it('should handle different DATABASE_URL formats', async () => {
      const testCases = [
        'postgresql://user:pass@localhost:5432/db',
        'postgresql://user@localhost/db',
        'postgres://user:pass@host.com:5432/database',
        'postgresql://user:pass@127.0.0.1:5432/mydb?schema=public',
      ];

      for (const url of testCases) {
        vi.resetModules();
        process.env.DATABASE_URL = url;
        
        const config = await import('./drizzle.config');
        const drizzleConfig = config.default;

        expect(drizzleConfig.dbCredentials.url).toBe(url);
      }
    });

    it('should accept URLs with special characters in password', async () => {
      const urlWithSpecialChars = 'postgresql://user:p@ss%23w0rd!@localhost:5432/db';
      process.env.DATABASE_URL = urlWithSpecialChars;
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.dbCredentials.url).toBe(urlWithSpecialChars);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined DATABASE_URL', async () => {
      delete process.env.DATABASE_URL;
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      // The config should still be created but url will be undefined
      expect(drizzleConfig.dbCredentials.url).toBeUndefined();
    });

    it('should handle empty DATABASE_URL', async () => {
      process.env.DATABASE_URL = '';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.dbCredentials.url).toBe('');
    });
  });

  describe('Configuration Immutability', () => {
    it('should produce consistent configuration across multiple imports', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config1 = await import('./drizzle.config');
      const config2 = await import('./drizzle.config');

      expect(config1.default.out).toBe(config2.default.out);
      expect(config1.default.schema).toBe(config2.default.schema);
      expect(config1.default.dialect).toBe(config2.default.dialect);
    });
  });

  describe('Path Resolution', () => {
    it('should use relative paths for out directory', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.out).toMatch(/^\.?\/?drizzle$/);
    });

    it('should use relative paths for schema file', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = await import('./drizzle.config');
      const drizzleConfig = config.default;

      expect(drizzleConfig.schema).toMatch(/^\.?\/?src\/db\/schema\.ts$/);
    });
  });
});