// Database adapter for supporting multiple database environments
// This file automatically switches between local and Supabase connections

import { Pool } from 'pg';
import * as schema from '../shared/schema.js';
import { drizzle } from 'drizzle-orm/node-postgres';

// Initialize environment settings
const isSupabase = process.env.USE_SUPABASE === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Log the environment configuration for debugging
console.log(`Database adapter: ${isSupabase ? 'Supabase' : 'Standard Postgres'}`);
console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`Platform: ${isVercel ? 'Vercel' : 'Other'}`);

// Get database connection string
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Configure connection pool
let poolConfig: any = {
  connectionString,
  max: isProduction ? 10 : 3,
  idleTimeoutMillis: 30000,
};

// Add SSL options for production environments
if (isProduction || isSupabase) {
  poolConfig.ssl = {
    rejectUnauthorized: false // Required for Supabase connections
  };
}

// Create connection pool
export const pool = new Pool(poolConfig);

// Create Drizzle ORM instance with our schema
export const db = drizzle(pool, { schema });

// Clean up pool on application shutdown
process.on('SIGINT', () => {
  pool.end();
  console.log('Database pool has ended');
  process.exit(0);
});

// Database connection health check
export async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    return { 
      connected: true, 
      timestamp: result.rows[0]?.now || new Date().toISOString(),
      environment: {
        isSupabase,
        isProduction,
        isVercel
      }
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      connected: false, 
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Unknown database error',
      environment: {
        isSupabase,
        isProduction,
        isVercel
      }
    };
  }
}