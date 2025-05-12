import { SessionOptions } from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from '@neondatabase/serverless';

/**
 * Session store adapter interface
 * This adapter allows us to swap between different session stores
 * without changing the application code.
 */
export interface SessionStoreAdapter {
  createSessionStore: (session: any) => any;
  getSessionOptions: () => SessionOptions;
}

// Class to handle Neon-based sessions (currently used)
export class NeonSessionAdapter implements SessionStoreAdapter {
  private pool: Pool;
  private sessionSecret: string;
  
  constructor(pool: Pool, sessionSecret: string = 'fundi-ai-secret-key') {
    this.pool = pool;
    this.sessionSecret = sessionSecret;
  }
  
  createSessionStore(session: any): any {
    const PgSession = connectPgSimple(session);
    return new PgSession({
      pool: this.pool,
      tableName: 'sessions', // Use the table name defined in our schema
      createTableIfMissing: true,
    });
  }
  
  getSessionOptions(): SessionOptions {
    return {
      secret: this.sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }
    };
  }
}

// Class to handle Supabase-based sessions (for future use)
export class SupabaseSessionAdapter implements SessionStoreAdapter {
  private pool: Pool;
  private sessionSecret: string;
  
  constructor(pool: Pool, sessionSecret: string = 'fundi-ai-secret-key') {
    this.pool = pool;
    this.sessionSecret = sessionSecret;
  }
  
  createSessionStore(session: any): any {
    const PgSession = connectPgSimple(session);
    return new PgSession({
      pool: this.pool,
      tableName: 'sessions', // Use the table name defined in our schema
      createTableIfMissing: true,
      // Supabase-specific optimizations
      pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
      // Use a transaction for session operations for better reliability
      errorOnPrune: false, // Don't crash the server if pruning fails
    });
  }
  
  getSessionOptions(): SessionOptions {
    return {
      secret: this.sessionSecret,
      resave: false,
      saveUninitialized: false, // More efficient - don't save empty sessions
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // Additional security options for Vercel deployment
        httpOnly: true,
      },
      // Vercel-specific optimizations
      rolling: true, // Refresh the cookie on each request to prevent expiry
    };
  }
}

// Factory function to create the appropriate session store adapter
export function createSessionAdapter(pool: Pool): SessionStoreAdapter {
  const sessionSecret = process.env.SESSION_SECRET || 'fundi-ai-secret-key';
  const connectionString = process.env.DATABASE_URL;
  
  // Determine which provider to use based on environment or connection string
  const isSupabase = process.env.USE_SUPABASE === 'true' || 
                    (connectionString && connectionString.includes('supabase'));
  
  if (isSupabase) {
    console.log('Using Supabase session adapter');
    return new SupabaseSessionAdapter(pool, sessionSecret);
  } else {
    console.log('Using Neon session adapter');
    return new NeonSessionAdapter(pool, sessionSecret);
  }
}