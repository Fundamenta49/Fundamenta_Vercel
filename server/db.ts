import { sql } from 'drizzle-orm';
import { databaseService, db, pool } from './db/database-service';
import * as schema from "@shared/schema";

// Backward compatibility exports
export { db, pool };

/**
 * Helper function to create tables and run migrations
 * This is kept for backward compatibility with existing code
 */
export async function ensureTables() {
  console.log('Using new database service architecture');
  await databaseService.initialize();
}
