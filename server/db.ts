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

// Helper function to create tables
export async function ensureTables() {
  try {
    console.log('Checking database tables...');
    
    // This simple query will verify if our users table exists and has the right columns
    // If not, it will throw an error that we can catch
    await db.select({ count: sql`count(*)` }).from(schema.users).execute();
    
    console.log('Database tables verified.');
  } catch (error) {
    console.error('Error checking database tables:', error);
    // Here you would typically use a migration tool instead of manual table creation
    // But for simplicity, we'll just log the error
    console.error('Please run the migrations using drizzle-kit to create the tables');
  }
}
