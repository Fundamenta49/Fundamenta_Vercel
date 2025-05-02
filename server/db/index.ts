/**
 * Database migration runner
 */
import { pool, db } from '../db';
import { runLegalComplianceMigrations } from './migrations/add-legal-tables';

const migrations = [
  runLegalComplianceMigrations,
];

export async function runAllMigrations() {
  console.log('Running all database migrations...');
  
  try {
    for (const migration of migrations) {
      console.log(`Starting database migrations...`);
      await migration();
    }
    console.log('All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}

// Export references to pool and db for use in migrations
export { pool, db };