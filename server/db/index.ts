import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '../../shared/schema';
import ws from 'ws'; // Add WebSocket library import

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

// Create a Neon connection pool with WebSocket configuration for Node.js environment
const pool = new Pool({ 
  connectionString: connectionString as string,
  // Add WebSocket constructor for Node.js environment
  webSocketConstructor: ws
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