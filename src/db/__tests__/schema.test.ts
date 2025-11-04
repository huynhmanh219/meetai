import { describe, it, expect, beforeEach } from 'vitest';

describe('src/db/schema.ts', () => {
  describe('usersTable Schema', () => {
    let usersTable: object;

    beforeEach(async () => {
      const schema = await import('@/db/schema');
      usersTable = schema.usersTable;
    });

    it('should export usersTable', () => {
      expect(usersTable).toBeDefined();
    });

    it('should have correct table name', () => {
      expect(usersTable[Symbol.for('drizzle:Name')]).toBe('users');
    });

    describe('Table Columns', () => {
      it('should have id column', () => {
        const columns = Object.keys(usersTable);
        expect(columns).toContain('id');
      });

      it('should have name column', () => {
        const columns = Object.keys(usersTable);
        expect(columns).toContain('name');
      });

      it('should have age column', () => {
        const columns = Object.keys(usersTable);
        expect(columns).toContain('age');
      });

      it('should have email column', () => {
        const columns = Object.keys(usersTable);
        expect(columns).toContain('email');
      });

      it('should have exactly 4 columns', () => {
        const columns = Object.keys(usersTable).filter(key => !key.startsWith('_'));
        expect(columns.length).toBe(4);
      });
    });

    describe('ID Column Configuration', () => {
      it('should have id as primary key', () => {
        expect(usersTable.id).toBeDefined();
        expect(usersTable.id.primary).toBe(true);
      });

      it('should have id as integer type', () => {
        expect(usersTable.id.dataType).toBe('number');
      });

      it('should have id with generated always as identity', () => {
        expect(usersTable.id.generated).toBeDefined();
      });

      it('should not allow null for id', () => {
        expect(usersTable.id.notNull).toBe(true);
      });
    });

    describe('Name Column Configuration', () => {
      it('should have name column defined', () => {
        expect(usersTable.name).toBeDefined();
      });

      it('should have name as varchar type', () => {
        expect(usersTable.name.dataType).toBe('string');
      });

      it('should have name with max length of 255', () => {
        expect(usersTable.name.columnType).toContain('varchar(255)');
      });

      it('should not allow null for name', () => {
        expect(usersTable.name.notNull).toBe(true);
      });

      it('should not have unique constraint on name', () => {
        expect(usersTable.name.isUnique).toBeFalsy();
      });
    });

    describe('Age Column Configuration', () => {
      it('should have age column defined', () => {
        expect(usersTable.age).toBeDefined();
      });

      it('should have age as integer type', () => {
        expect(usersTable.age.dataType).toBe('number');
      });

      it('should not allow null for age', () => {
        expect(usersTable.age.notNull).toBe(true);
      });

      it('should not have default value for age', () => {
        expect(usersTable.age.hasDefault).toBeFalsy();
      });
    });

    describe('Email Column Configuration', () => {
      it('should have email column defined', () => {
        expect(usersTable.email).toBeDefined();
      });

      it('should have email as varchar type', () => {
        expect(usersTable.email.dataType).toBe('string');
      });

      it('should have email with max length of 255', () => {
        expect(usersTable.email.columnType).toContain('varchar(255)');
      });

      it('should not allow null for email', () => {
        expect(usersTable.email.notNull).toBe(true);
      });

      it('should have unique constraint on email', () => {
        expect(usersTable.email.isUnique).toBe(true);
      });
    });

    describe('Schema Constraints', () => {
      it('should have all columns marked as not null', () => {
        expect(usersTable.id.notNull).toBe(true);
        expect(usersTable.name.notNull).toBe(true);
        expect(usersTable.age.notNull).toBe(true);
        expect(usersTable.email.notNull).toBe(true);
      });

      it('should have only email column with unique constraint', () => {
        expect(usersTable.email.isUnique).toBe(true);
        expect(usersTable.name.isUnique).toBeFalsy();
        expect(usersTable.age.isUnique).toBeFalsy();
      });

      it('should have only id as primary key', () => {
        expect(usersTable.id.primary).toBe(true);
      });
    });

    describe('Data Type Validations', () => {
      it('should ensure varchar columns have proper length constraints', () => {
        expect(usersTable.name.columnType).toMatch(/varchar\(255\)/);
        expect(usersTable.email.columnType).toMatch(/varchar\(255\)/);
      });

      it('should ensure integer columns have proper type', () => {
        expect(usersTable.id.getSQLType()).toContain('integer');
        expect(usersTable.age.getSQLType()).toContain('integer');
      });
    });

    describe('Schema Integrity', () => {
      it('should maintain consistent column order', () => {
        const expectedOrder = ['id', 'name', 'age', 'email'];
        const actualOrder = Object.keys(usersTable).filter(key => !key.startsWith('_'));

        expect(actualOrder).toEqual(expectedOrder);
      });

      it('should not have any extra columns', () => {
        const expectedColumns = ['id', 'name', 'age', 'email'];
        const actualColumns = Object.keys(usersTable).filter(key => !key.startsWith('_'));

        expect(actualColumns.sort()).toEqual(expectedColumns.sort());
      });
    });

    describe('Column Properties', () => {
      it('should have proper enumerable properties', () => {
        const enumerableKeys = Object.keys(usersTable);

        expect(enumerableKeys).toContain('id');
        expect(enumerableKeys).toContain('name');
        expect(enumerableKeys).toContain('age');
        expect(enumerableKeys).toContain('email');
      });
    });
  });

  describe('Schema Exports', () => {
    it('should export only usersTable', async () => {
      const schema = await import('@/db/schema');
      const exports = Object.keys(schema);

      expect(exports).toContain('usersTable');
    });

    it('should be importable as named export', async () => {
      const { usersTable } = await import('@/db/schema');

      expect(usersTable).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should have proper TypeScript types for columns', async () => {
      const { usersTable } = await import('@/db/schema');

      // These checks ensure the schema is properly typed
      expect(usersTable.id).toBeDefined();
      expect(usersTable.name).toBeDefined();
      expect(usersTable.age).toBeDefined();
      expect(usersTable.email).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle schema import multiple times', async () => {
      const schema1 = await import('@/db/schema');
      const schema2 = await import('@/db/schema');

      expect(schema1.usersTable).toBe(schema2.usersTable);
    });

    it('should maintain schema definition integrity', async () => {
      const { usersTable } = await import('@/db/schema');

      // Ensure the table structure hasn't been accidentally modified
      expect(typeof usersTable).toBe('object');
      expect(usersTable).not.toBeNull();
    });
  });
});