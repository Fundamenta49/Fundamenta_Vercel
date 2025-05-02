/**
 * Database Migrations
 * 
 * This file orchestrates all database migrations to ensure schema consistency.
 * Individual migrations are imported and run in sequence.
 */

import { addAgeVerificationFields } from './add-age-verification-fields';

/**
 * Run all migrations in sequence
 * 
 * @returns Promise that resolves when all migrations are complete
 */
export async function runAllMigrations(): Promise<boolean> {
  try {
    console.log('Starting database migrations...');
    
    // Run migrations in sequence
    await addAgeVerificationFields();
    
    console.log('All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}