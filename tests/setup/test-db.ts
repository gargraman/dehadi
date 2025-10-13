import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../../shared/schema';
import { sql } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

// Use test database URL or fallback to regular database
const testDatabaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error('DATABASE_URL or TEST_DATABASE_URL must be set for tests');
}

export const testPool = new Pool({ connectionString: testDatabaseUrl });
export const testDb = drizzle({ client: testPool, schema });

// Cleanup all tables - used before/after tests
export async function cleanupDatabase() {
  await testDb.delete(schema.payments);
  await testDb.delete(schema.messages);
  await testDb.delete(schema.jobApplications);
  await testDb.delete(schema.jobs);
  await testDb.delete(schema.users);
}

// Close database connection - used in afterAll
export async function closeDatabase() {
  await testPool.end();
}

// Reset auto-increment sequences (if needed for serial IDs)
export async function resetSequences() {
  // This is for UUID-based IDs, so sequences don't apply
  // Keep this function for future use if serial IDs are added
}

// Check database connection
export async function checkDatabaseConnection() {
  try {
    await testDb.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
