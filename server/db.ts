import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure PostgreSQL pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Helper function to create tables and run migrations
export async function ensureTables() {
  try {
    console.log('Checking database tables...');
    
    // This simple query will verify if our users table exists and has the right columns
    // If not, it will throw an error that we can catch
    await db.select({ count: sql`count(*)` }).from(schema.users).execute();
    
    console.log('Database tables verified.');
    
    // Run any pending migrations
    console.log('Running database migrations...');
    try {
      // Import dynamically to avoid circular dependencies
      const { runAllMigrations } = await import('./db/index');
      await runAllMigrations();
    } catch (migrationError) {
      console.error('Error running migrations:', migrationError);
    }
    
  } catch (error) {
    console.error('Error checking database tables:', error);
    
    try {
      console.log('Attempting to push schema changes to the database...');
      
      // Manually create required tables if they don't exist
      // This is a simplified version of what drizzle-kit push would do
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          email_verified BOOLEAN DEFAULT false,
          privacy_consent BOOLEAN DEFAULT false,
          birth_year INTEGER,
          age_verified BOOLEAN DEFAULT false,
          is_minor BOOLEAN DEFAULT false,
          has_parental_consent BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS sessions (
          sid VARCHAR PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP NOT NULL
        );
      `);
      
      console.log('Schema changes applied successfully.');
      
      // Now run migrations to add any additional tables/columns
      console.log('Running database migrations...');
      try {
        // Import dynamically to avoid circular dependencies
        const { runAllMigrations } = await import('./db/index');
        await runAllMigrations();
      } catch (migrationError) {
        console.error('Error running migrations:', migrationError);
      }
    } catch (pushError) {
      console.error('Error applying schema changes:', pushError);
      console.error('Please run the migrations using drizzle-kit to create the tables');
    }
  }
}
