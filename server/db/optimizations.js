/**
 * Database Optimizations
 * 
 * This module provides functions to optimize database performance
 * by creating indexes and optimizing the connection pool.
 */

import { pool } from '../db.js';

/**
 * Initialize database optimizations
 * Creates necessary indexes and optimizes pooling
 */
export async function initDatabaseOptimizations() {
  console.log('Creating performance-optimizing database indexes...');
  
  try {
    // Create indexes for frequently queried tables
    await createPerformanceIndexes();
    console.log('Database indexes created successfully');
    
    // Optimize connection pool settings
    optimizeConnectionPool();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize database optimizations:', error);
    // Continue application startup even if optimizations fail
    return false;
  }
}

/**
 * Create performance-oriented database indexes
 * These indexes target the most frequently queried columns
 */
async function createPerformanceIndexes() {
  const indexQueries = [
    // User indexes
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)`,
    
    // Pathways indexes
    `CREATE INDEX IF NOT EXISTS idx_pathways_category ON pathways (category)`,
    `CREATE INDEX IF NOT EXISTS idx_pathways_created_at ON pathways (created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_pathways_is_public ON pathways (is_public)`,
    
    // Modules indexes
    `CREATE INDEX IF NOT EXISTS idx_modules_pathway_id ON modules (pathway_id)`,
    `CREATE INDEX IF NOT EXISTS idx_modules_order ON modules (pathway_id, "order")`,
    
    // Engagement indexes
    `CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities (user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities (created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON user_activities (activity_type)`,
    
    // User progress indexes
    `CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress (user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_progress_pathway_id ON user_progress (pathway_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress (module_id)`,
    
    // Achievement indexes
    `CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements (user_id)`,
    
    // Session-related indexes
    `CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions (expire)`,
    
    // Combined indexes for frequently joined queries
    `CREATE INDEX IF NOT EXISTS idx_user_progress_user_pathway ON user_progress (user_id, pathway_id)`,
    `CREATE INDEX IF NOT EXISTS idx_modules_pathway_visibility ON modules (pathway_id, is_visible)`,
  ];
  
  // Execute all index creation queries
  for (const query of indexQueries) {
    try {
      await pool.query(query);
    } catch (error) {
      // Some indexes might already exist or not be applicable
      // Log but continue with other optimizations
      console.warn(`Warning creating index: ${error.message}`);
    }
  }
  
  // Add statistics gathering for query planner
  try {
    await pool.query(`ANALYZE`);
  } catch (error) {
    console.warn('Warning analyzing database:', error.message);
  }
}

/**
 * Optimize connection pool settings
 */
function optimizeConnectionPool() {
  // Define optimal pool settings
  const optimalPoolSettings = {
    min: 2,        // Minimum connections in pool
    max: 10,       // Maximum connections in pool
    idleTimeout: 60000,       // 60 seconds
    connectionTimeout: 10000  // 10 seconds
  };
  
  console.log(`Optimizing database connection pool: ${JSON.stringify(optimalPoolSettings)}`);
  
  try {
    // Some database drivers don't allow dynamic reconfiguration
    // This is a safety check
    if (typeof pool.options === 'object' && pool.options) {
      // Reconfigure if the driver supports it
      if (typeof pool.options.min !== 'undefined') {
        pool.options.min = optimalPoolSettings.min;
      }
      
      if (typeof pool.options.max !== 'undefined') {
        pool.options.max = optimalPoolSettings.max;
      }
      
      if (typeof pool.options.idleTimeoutMillis !== 'undefined') {
        pool.options.idleTimeoutMillis = optimalPoolSettings.idleTimeout;
      }
      
      if (typeof pool.options.connectionTimeoutMillis !== 'undefined') {
        pool.options.connectionTimeoutMillis = optimalPoolSettings.connectionTimeout;
      }
      
      return true;
    } else {
      console.log('Connection pool optimization not supported by current database driver');
      return false;
    }
  } catch (error) {
    console.warn('Failed to optimize connection pool:', error.message);
    return false;
  }
}

/**
 * Monitor slow queries and log them for performance tuning
 * @param {string} query - SQL query to monitor
 * @param {Array} params - Query parameters
 * @param {Function} callback - Callback function to execute query
 * @returns {Promise<any>} - Query result
 */
export async function monitorQueryPerformance(query, params, callback) {
  const startTime = Date.now();
  
  try {
    // Execute the query
    const result = await callback();
    
    // Check execution time
    const duration = Date.now() - startTime;
    
    // Log slow queries (over 200ms)
    if (duration > 200) {
      console.warn(`Slow query detected (${duration}ms): ${query.substring(0, 100)}...`);
      
      // Sample query params for debugging (exclude sensitive data)
      const safeParams = Array.isArray(params) ? 
        params.map(p => typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p) : 
        'No params';
      
      console.warn(`Query params: ${JSON.stringify(safeParams)}`);
    }
    
    return result;
  } catch (error) {
    // Log failed queries
    console.error(`Query failed (${Date.now() - startTime}ms): ${query.substring(0, 100)}...`);
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

/**
 * Get database statistics for performance monitoring
 * @returns {Promise<Object>} - Database statistics
 */
export async function getDatabaseStats() {
  try {
    // Get table statistics
    const tableStatsQuery = `
      SELECT 
        relname as table_name, 
        n_live_tup as row_count,
        pg_size_pretty(pg_total_relation_size(relid)) as total_size
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC
    `;
    
    // Get index statistics
    const indexStatsQuery = `
      SELECT
        indexrelname as index_name,
        relname as table_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      ORDER BY idx_scan DESC
      LIMIT 10
    `;
    
    // Get connection statistics
    const connectionStatsQuery = `
      SELECT 
        count(*) as connection_count,
        count(*) FILTER (WHERE state = 'active') as active_connections
      FROM pg_stat_activity
      WHERE datname = current_database()
    `;
    
    // Execute all queries
    const [tableStats, indexStats, connectionStats] = await Promise.all([
      pool.query(tableStatsQuery).then(res => res.rows),
      pool.query(indexStatsQuery).then(res => res.rows),
      pool.query(connectionStatsQuery).then(res => res.rows[0])
    ]);
    
    return {
      tables: tableStats,
      indexes: indexStats,
      connections: connectionStats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      error: 'Failed to get database statistics',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Apply additional PostgreSQL-specific optimizations
 * @returns {Promise<boolean>} - Success status
 */
export async function applyOptimalPostgresSettings() {
  // These settings will be applied at runtime and don't persist across server restarts
  const optimizationQueries = [
    // Increase work_mem for complex sorting operations
    `SET work_mem = '4MB'`,
    
    // Optimize background writer to be less aggressive in flushing
    `SET bgwriter_delay = '200ms'`,
    
    // Increase maintenance_work_mem for faster vacuum and index creation
    `SET maintenance_work_mem = '64MB'`,
    
    // Set optimization level for the query planner
    `SET geqo_threshold = 12`,
    
    // Tune random page cost for SSD-based systems
    `SET random_page_cost = 1.1`,
  ];
  
  try {
    for (const query of optimizationQueries) {
      await pool.query(query);
    }
    return true;
  } catch (error) {
    console.warn('Failed to apply PostgreSQL optimizations:', error.message);
    return false;
  }
}

// Default export for the module
export default {
  initDatabaseOptimizations,
  monitorQueryPerformance,
  getDatabaseStats,
  applyOptimalPostgresSettings
};