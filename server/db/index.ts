import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from '../../shared/schema';
import ws from 'ws'; // WebSocket library for Node.js

// Configure Neon to use WebSocket in Node.js environment
// This must be set before creating any Pool instances
neonConfig.webSocketConstructor = ws;

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

// Create a Neon connection pool
const pool = new Pool({ 
  connectionString: connectionString as string
});

// Create drizzle instance for queries
export const db = drizzle(pool, { schema });

// For Neon Serverless, we're using a push-based approach rather than migrations
export async function pushSchema() {
  try {
    console.log('Pushing schema to database...');
    // We're not running traditional migrations, but if needed,
    // we could use drizzle-kit to push schema changes
    console.log('Schema push not implemented - tables should be created by drizzle-kit commands');
  } catch (error) {
    console.error('Error pushing schema:', error);
    throw error;
  }
}

// Alias for compatibility with existing code
export const runMigrations = pushSchema;

// Export the schema for use in other files
export { schema };