import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * Migration to add age verification fields to the users table
 * 
 * This migration adds the following fields:
 * - birth_year: Integer to store the birth year of users
 * - age_verified: Boolean to indicate if age has been verified
 * - is_minor: Boolean to indicate if user is under 18
 * - has_parental_consent: Boolean to indicate if a minor has parental consent
 */
export async function addAgeVerificationFields() {
  try {
    console.log("Adding age verification fields to users table...");
    
    // Check if fields already exist
    const checkResult = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('birth_year', 'age_verified', 'is_minor', 'has_parental_consent');
    `);
    
    const existingColumns = checkResult.rows.map(row => row.column_name);
    
    // Add fields that don't already exist
    if (!existingColumns.includes('birth_year')) {
      await db.execute(sql`ALTER TABLE users ADD COLUMN birth_year INTEGER;`);
      console.log("- Added birth_year column");
    }
    
    if (!existingColumns.includes('age_verified')) {
      await db.execute(sql`ALTER TABLE users ADD COLUMN age_verified BOOLEAN DEFAULT false;`);
      console.log("- Added age_verified column");
    }
    
    if (!existingColumns.includes('is_minor')) {
      await db.execute(sql`ALTER TABLE users ADD COLUMN is_minor BOOLEAN DEFAULT false;`);
      console.log("- Added is_minor column");
    }
    
    if (!existingColumns.includes('has_parental_consent')) {
      await db.execute(sql`ALTER TABLE users ADD COLUMN has_parental_consent BOOLEAN DEFAULT false;`);
      console.log("- Added has_parental_consent column");
    }
    
    console.log("Age verification fields migration completed successfully");
    
    // Update existing users' age-related fields based on birth year if available
    await db.execute(sql`
      UPDATE users
      SET is_minor = EXTRACT(YEAR FROM CURRENT_DATE) - birth_year < 18,
          age_verified = CASE
            WHEN birth_year IS NOT NULL THEN true
            ELSE age_verified
          END
      WHERE birth_year IS NOT NULL;
    `);
    
    console.log("Updated age-related fields for existing users");
    
    return true;
  } catch (error) {
    console.error("Error adding age verification fields:", error);
    return false;
  }
}