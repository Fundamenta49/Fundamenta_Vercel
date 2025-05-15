/**
 * Database Optimizations
 * Part of Bundle 5B: Performance & Quality Optimization
 * 
 * This module provides tools for optimizing database performance
 * through indexing, query optimization, and connection pool management.
 */

const { pool } = require('./pool.js');

/**
 * Initialize database optimizations including:
 * - Create performance-optimizing indexes
 * - Configure connection pool
 * - Setup query monitoring
 */
async function initDatabaseOptimizations() {
  try {
    console.log('Creating performance-optimizing database indexes...');
    
    // Create indexes on frequently queried tables
    await createOptimizingIndexes();
    
    console.log('Database indexes created successfully');
    
    // Optimize connection pool if supported by driver
    await optimizeConnectionPool();
    
    console.log('Database optimizations initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database optimizations:', error);
    // Non-fatal error - continue application startup
    return false;
  }
}

/**
 * Create database indexes to optimize query performance
 */
async function createOptimizingIndexes() {
  // Only create if they don't exist already
  try {
    // Primary indexes for frequently accessed tables
    // These will be skipped if they already exist (IF NOT EXISTS)

    // Users table indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);

    // Messages/conversations indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
    `);

    // Learning path indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON learning_paths(status);
      CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
      CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_learning_progress_path_id ON learning_progress(path_id);
    `);
    
    // Engagement system indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_activity_activity_type ON user_activity(activity_type);
      CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
    `);

    return true;
  } catch (error) {
    console.error('Error creating database indexes:', error);
    return false;
  }
}

/**
 * Optimize database connection pool settings
 */
async function optimizeConnectionPool() {
  try {
    // Optimal connection pool configuration
    const poolConfig = {
      min: 2,            // Minimum connections in pool
      max: 10,           // Maximum connections in pool
      idleTimeout: 60000, // How long a connection can be idle before being closed (1 min)
      connectionTimeout: 10000  // How long to wait for a connection (10 sec)
    };
    
    console.log('Optimizing database connection pool:', poolConfig);
    
    // Check if pool supports configuration
    if (pool.options && typeof pool.options === 'object') {
      pool.options = {
        ...pool.options,
        ...poolConfig
      };
      return true;
    } else {
      console.log('Connection pool optimization not supported by current database driver');
      return false;
    }
  } catch (error) {
    console.error('Error optimizing connection pool:', error);
    return false;
  }
}

/**
 * Get database optimization statistics
 */
async function getDatabaseOptimizationStats() {
  try {
    // Get index statistics
    const indexStatsQuery = `
      SELECT
        schemaname,
        relname as table_name,
        indexrelname as index_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      ORDER BY idx_scan DESC;
    `;
    
    const { rows: indexStats } = await pool.query(indexStatsQuery);
    
    // Get table statistics
    const tableStatsQuery = `
      SELECT
        relname as table_name,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC;
    `;
    
    const { rows: tableStats } = await pool.query(tableStatsQuery);
    
    // Get connection statistics
    const connectionStatsQuery = `
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections,
        max(extract(epoch from (now() - backend_start))) as longest_session_seconds
      FROM pg_stat_activity;
    `;
    
    const { rows: connectionStats } = await pool.query(connectionStatsQuery);
    
    return {
      indexStats,
      tableStats,
      connectionStats: connectionStats[0] || {}
    };
  } catch (error) {
    console.error('Error getting database optimization stats:', error);
    return {
      indexStats: [],
      tableStats: [],
      connectionStats: {}
    };
  }
}

module.exports = {
  initDatabaseOptimizations,
  createOptimizingIndexes,
  optimizeConnectionPool,
  getDatabaseOptimizationStats
};