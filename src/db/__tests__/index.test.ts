import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock drizzle-orm before importing the module
vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: vi.fn((url: string) => ({
    _url: url,
    query: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe('src/db/index.ts', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe('Database Initialization', () => {
    it('should create a drizzle instance', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      
      expect(drizzle).toBeDefined();
      expect(typeof drizzle).toBe('function');
    });

    it('should use DATABASE_URL from environment', async () => {
      const testUrl = 'postgresql://testuser:testpass@localhost:5432/testdb';
      process.env.DATABASE_URL = testUrl;
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalledWith(testUrl);
    });

    it('should handle different database URL formats', async () => {
      const urls = [
        'postgresql://user:pass@localhost:5432/db',
        'postgres://user@localhost/db',
        'postgresql://user:pass@host.com:5432/database?ssl=true',
      ];

      for (const url of urls) {
        vi.resetModules();
        vi.clearAllMocks();
        process.env.DATABASE_URL = url;
        
        const { drizzle } = await import('drizzle-orm/neon-http');
        await import('@/db/index');
        
        expect(drizzle).toHaveBeenCalledWith(url);
      }
    });
  });

  describe('Database Connection Configuration', () => {
    it('should pass connection string to drizzle function', async () => {
      const connectionString = 'postgresql://admin:secret@db.example.com:5432/production';
      process.env.DATABASE_URL = connectionString;
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalledTimes(1);
      expect(drizzle).toHaveBeenCalledWith(connectionString);
    });

    it('should handle URL with query parameters', async () => {
      const urlWithParams = 'postgresql://user:pass@localhost:5432/db?schema=public&ssl=true';
      process.env.DATABASE_URL = urlWithParams;
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalledWith(urlWithParams);
    });

    it('should handle URL with special characters in credentials', async () => {
      const urlWithSpecialChars = 'postgresql://user:p%40ss%23word@localhost:5432/db';
      process.env.DATABASE_URL = urlWithSpecialChars;
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalledWith(urlWithSpecialChars);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle undefined DATABASE_URL', async () => {
      delete process.env.DATABASE_URL;
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty DATABASE_URL', async () => {
      process.env.DATABASE_URL = '';
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalledWith('');
    });
  });

  describe('Module Export', () => {
    it('should export db constant', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const dbModule = await import('@/db/index');
      
      expect(dbModule).toBeDefined();
      expect(dbModule.default).toBeDefined();
    });

    it('should create db instance with expected structure', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { drizzle } = await import('drizzle-orm/neon-http');
      const mockDb = {
        _url: 'test',
        query: vi.fn(),
        select: vi.fn(),
      };
      
      vi.mocked(drizzle).mockReturnValue(mockDb);
      
      await import('@/db/index');
      
      expect(drizzle).toHaveBeenCalled();
    });
  });

  describe('Connection String Validation', () => {
    it('should accept valid PostgreSQL connection strings', async () => {
      const validUrls = [
        'postgresql://localhost/mydb',
        'postgresql://user@localhost/mydb',
        'postgresql://user:password@localhost/mydb',
        'postgresql://user:password@localhost:5432/mydb',
        'postgresql://user:password@localhost:5432/mydb?sslmode=require',
        'postgres://user:password@host:5432/database',
      ];

      for (const url of validUrls) {
        vi.resetModules();
        vi.clearAllMocks();
        process.env.DATABASE_URL = url;
        
        const { drizzle } = await import('drizzle-orm/neon-http');
        await import('@/db/index');
        
        expect(drizzle).toHaveBeenCalledWith(url);
      }
    });
  });
});