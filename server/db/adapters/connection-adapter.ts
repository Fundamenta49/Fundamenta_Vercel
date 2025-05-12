import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "../../../shared/schema.js";

// Configure websocket for Neon (needed in serverless environments)
neonConfig.webSocketConstructor = ws;

/**
 * Connection adapter for database operations
 * This adapter layer allows us to swap between different database providers
 * without changing the application code.
 */
export interface DatabaseAdapter {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
  ensureTables: () => Promise<void>;
  runMigrations: () => Promise<void>;
}

// Class to handle Neon database connections (currently used)
export class NeonDatabaseAdapter implements DatabaseAdapter {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
  
  constructor(connectionString: string) {
    if (!connectionString) {
      throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
    
    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool, { schema });
  }
  
  async ensureTables(): Promise<void> {
    try {
      console.log('Checking database tables...');
      
      // This simple query will verify if our users table exists and has the right columns
      await this.db.select({ count: sql`count(*)` }).from(schema.users).execute();
      
      console.log('Database tables verified.');
    } catch (error) {
      console.error('Error checking database tables:', error);
      
      try {
        console.log('Attempting to push schema changes to the database...');
        
        // Manually create required tables if they don't exist
        await this.db.execute(sql`
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
      } catch (pushError) {
        console.error('Error applying schema changes:', pushError);
        console.error('Please run the migrations using drizzle-kit to create the tables');
      }
    }
  }
  
  async runMigrations(): Promise<void> {
    try {
      // Import dynamically to avoid circular dependencies
      const { runAllMigrations } = await import('../index.js');
      await runAllMigrations();
    } catch (migrationError) {
      console.error('Error running migrations:', migrationError);
    }
  }
}

// Class to handle Supabase PostgreSQL connections (for future use)
export class SupabaseDatabaseAdapter implements DatabaseAdapter {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
  
  constructor(connectionString: string) {
    if (!connectionString) {
      throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
    
    // Supabase uses PostgreSQL, so we can use the same Pool and drizzle setup
    // The only difference is connection configuration and connection pooling settings
    this.pool = new Pool({ 
      connectionString,
      max: 10, // Adjust connection pool size for Supabase
      idleTimeoutMillis: 30000, // Keep connections open for longer
      connectionTimeoutMillis: 5000 // Timeout after 5s if can't connect
    });
    
    this.db = drizzle(this.pool, { schema });
  }
  
  async ensureTables(): Promise<void> {
    try {
      console.log('Checking database tables on Supabase...');
      
      // This simple query will verify if our users table exists and has the right columns
      await this.db.select({ count: sql`count(*)` }).from(schema.users).execute();
      
      console.log('Supabase database tables verified.');
    } catch (error) {
      console.error('Error checking Supabase database tables:', error);
      
      try {
        console.log('Attempting to push schema changes to Supabase...');
        
        // Manually create required tables if they don't exist
        await this.db.execute(sql`
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
        
        console.log('Schema changes applied successfully to Supabase.');
      } catch (pushError) {
        console.error('Error applying schema changes to Supabase:', pushError);
        console.error('Please run the migrations using drizzle-kit to create the tables');
      }
    }
  }
  
  async runMigrations(): Promise<void> {
    try {
      // Import dynamically to avoid circular dependencies
      const { runAllMigrations } = await import('../index');
      await runAllMigrations();
    } catch (migrationError) {
      console.error('Error running migrations for Supabase:', migrationError);
    }
  }
}

// Factory function to create the appropriate database adapter
export function createDatabaseAdapter(): DatabaseAdapter {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  // Determine which database provider to use based on environment or connection string
  const isSupabase = process.env.USE_SUPABASE === 'true' || 
                     connectionString.includes('supabase');
  
  if (isSupabase) {
    console.log('Using Supabase database adapter');
    return new SupabaseDatabaseAdapter(connectionString);
  } else {
    console.log('Using Neon database adapter');
    return new NeonDatabaseAdapter(connectionString);
  }
}