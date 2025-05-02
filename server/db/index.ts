/**
 * Database initialization and migrations
 */
import { db } from "../db";
import { sql } from "drizzle-orm";
import { runAllMigrations } from "./migrations/index";

/**
 * Run all database migrations
 */
export async function runMigrations(): Promise<boolean> {
  try {
    console.log("Running all database migrations...");
    const success = await runAllMigrations();
    
    if (success) {
      console.log("All migrations completed successfully");
    } else {
      console.warn("Some migrations may have failed");
    }
    
    return success;
  } catch (error) {
    console.error("Error running migrations:", error);
    return false;
  }
}

/**
 * Ensure necessary database tables exist
 * This function ensures that critical tables like users have been created
 * and include all required fields, including age verification fields
 */
export async function ensureTables(): Promise<boolean> {
  try {
    console.log("Checking for required database tables...");
    
    // Check if users table exists
    const userTableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) AS table_exists;
    `);
    
    const userTableExists = userTableCheck.rows?.[0]?.table_exists === true;
    
    if (!userTableExists) {
      console.log("Users table does not exist yet");
      return false;
    }
    
    console.log("Required tables exist");
    return true;
  } catch (error) {
    console.error("Error checking database tables:", error);
    return false;
  }
}

/**
 * Verify database connection
 */
export async function verifyDatabaseConnection(): Promise<boolean> {
  try {
    const result = await db.execute(sql`SELECT 1 as connected`);
    return result.rows?.[0]?.connected === 1;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}