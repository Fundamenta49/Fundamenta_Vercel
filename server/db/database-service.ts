import { createDatabaseAdapter, DatabaseAdapter } from './adapters/connection-adapter';
import { createSessionAdapter, SessionStoreAdapter } from './adapters/session-adapter';

/**
 * Centralized database service to handle all database operations
 * This service uses the adapter pattern to abstract database provider details
 */
class DatabaseService {
  private static instance: DatabaseService;
  private dbAdapter: DatabaseAdapter;
  private sessionAdapter: SessionStoreAdapter;
  private initialized: boolean = false;
  
  private constructor() {
    // Initialize with the appropriate adapter
    this.dbAdapter = createDatabaseAdapter();
    this.sessionAdapter = createSessionAdapter(this.dbAdapter.pool);
  }
  
  /**
   * Get the singleton instance of the database service
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  /**
   * Initialize the database service
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('Database service already initialized');
      return;
    }
    
    console.log('Initializing database service...');
    
    try {
      // Ensure database tables exist
      await this.dbAdapter.ensureTables();
      
      // Run any pending migrations
      await this.dbAdapter.runMigrations();
      
      this.initialized = true;
      console.log('Database service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database service:', error);
      throw error;
    }
  }
  
  /**
   * Get the database adapter
   */
  public getDbAdapter(): DatabaseAdapter {
    return this.dbAdapter;
  }
  
  /**
   * Get the database pool
   */
  public getPool() {
    return this.dbAdapter.pool;
  }
  
  /**
   * Get the database instance
   */
  public getDb() {
    return this.dbAdapter.db;
  }
  
  /**
   * Get the session adapter
   */
  public getSessionAdapter(): SessionStoreAdapter {
    return this.sessionAdapter;
  }
  
  /**
   * Create a session store for Express
   */
  public createSessionStore(session: any) {
    return this.sessionAdapter.createSessionStore(session);
  }
  
  /**
   * Get session options for Express
   */
  public getSessionOptions() {
    return this.sessionAdapter.getSessionOptions();
  }
}

// Export a singleton instance of the database service
export const databaseService = DatabaseService.getInstance();

// Convenience exports for common operations
export const db = databaseService.getDb();
export const pool = databaseService.getPool();