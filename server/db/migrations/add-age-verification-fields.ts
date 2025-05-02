import { db, pool } from "../../db";
import { sql } from "drizzle-orm";

/**
 * This migration adds age verification fields to the users table
 * Required for COPPA compliance and child safety
 */
export async function addAgeVerificationFields() {
  console.log("Starting migration: Adding age verification fields to users table");
  
  try {
    // Check if columns already exist to avoid errors
    const columns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND (
        column_name = 'birth_year' OR 
        column_name = 'age_verified' OR
        column_name = 'is_minor' OR
        column_name = 'has_parental_consent'
      )
    `);
    
    const existingColumns = columns.rows.map(row => row.column_name);
    console.log("Existing age verification columns:", existingColumns);
    
    // Begin transaction
    await db.execute(sql`BEGIN`);
    
    // Add birth_year column if it doesn't exist
    if (!existingColumns.includes('birth_year')) {
      console.log("Adding birth_year column");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN birth_year INTEGER
      `);
    }
    
    // Add age_verified column if it doesn't exist
    if (!existingColumns.includes('age_verified')) {
      console.log("Adding age_verified column");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN age_verified BOOLEAN DEFAULT false
      `);
    }
    
    // Add is_minor column if it doesn't exist
    if (!existingColumns.includes('is_minor')) {
      console.log("Adding is_minor column");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN is_minor BOOLEAN DEFAULT false
      `);
    }
    
    // Add has_parental_consent column if it doesn't exist
    if (!existingColumns.includes('has_parental_consent')) {
      console.log("Adding has_parental_consent column");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN has_parental_consent BOOLEAN DEFAULT false
      `);
    }
    
    // Commit transaction
    await db.execute(sql`COMMIT`);
    console.log("Migration completed: Successfully added age verification fields");
    
    return true;
  } catch (error) {
    // Rollback transaction in case of error
    await db.execute(sql`ROLLBACK`);
    console.error("Migration failed:", error);
    throw error;
  }
}