import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

// Configure WebSocket for Neon/Supabase serverless connections
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to add the Supabase connection string to your environment variables?"
  );
}

// Create connection pool for serverless environment
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Drizzle instance with our schema
export const db = drizzle(pool, { schema });

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    return { 
      connected: true, 
      timestamp: result.rows[0]?.now || new Date().toISOString(),
      message: 'Successfully connected to Supabase database'
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      connected: false, 
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Unknown database error',
      error: error 
    };
  }
}