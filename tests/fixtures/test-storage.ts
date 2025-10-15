import { testDb } from "../setup/test-db";
import { DatabaseStorage } from "../../server/storage";
import type { IStorage } from "../../server/storage";

/**
 * Test-specific database storage that uses the test database connection
 * This ensures tests use the test DB instead of production DB
 */
export class TestDatabaseStorage extends DatabaseStorage {
  // Override the database connection to use testDb
  protected get db() {
    return testDb;
  }
}

/**
 * Create a test storage instance
 */
export function createTestStorage(): IStorage {
  return new TestDatabaseStorage();
}