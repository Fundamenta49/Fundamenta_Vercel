/**
 * Database Optimization Functions
 * 
 * This module provides utilities for improving database performance:
 * 1. Adding database indexes for frequently queried fields
 * 2. Optimizing common query patterns
 * 3. Implementing query batching for bulk operations
 */

import { db, pool } from '../db.js';
import { sql } from 'drizzle-orm';
import * as schema from '../../shared/schema.js';

/**
 * Create needed database indexes for performance optimization
 * Indexes improve query speed but add overhead to write operations
 */
export async function createDatabaseIndexes() {
  console.log('Creating performance-optimizing database indexes...');
  
  try {
    // Create indexes for user search performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
    `);
    
    // Create indexes for learning progress queries
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress (user_id);
      CREATE INDEX IF NOT EXISTS idx_learning_progress_pathway ON learning_progress (pathway_id);
      CREATE INDEX IF NOT EXISTS idx_learning_progress_module ON learning_progress (module_id);
      CREATE INDEX IF NOT EXISTS idx_learning_progress_completed ON learning_progress (completed);
    `);
    
    // Create indexes for session query performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions (expire);
    `);
    
    // Create indexes for user connections
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_connections_mentor ON user_connections (mentor_id);
      CREATE INDEX IF NOT EXISTS idx_user_connections_student ON user_connections (student_id);
    `);
    
    // Create indexes for conversations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations (user_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations (last_message_at);
    `);
    
    // Create indexes for messages
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_category ON messages (category);
    `);
    
    console.log('Database indexes created successfully');
    return true;
  } catch (error) {
    console.error('Error creating database indexes:', error);
    return false;
  }
}

/**
 * Optimize database connection pool settings
 * @param {Object} options - Configuration options
 */
export function optimizeConnectionPool(options = {}) {
  const defaultOptions = {
    min: 2,           // Minimum connections in pool
    max: 10,          // Maximum connections in pool
    idleTimeout: 60000, // Close idle connections after 1 minute
    connectionTimeout: 10000 // Wait max 10 seconds for connection
  };
  
  const poolOptions = { ...defaultOptions, ...options };
  
  console.log('Optimizing database connection pool:', poolOptions);
  
  // Configure connection pool if supported by adapter
  if (pool && typeof pool.configure === 'function') {
    pool.configure(poolOptions);
    console.log('Database connection pool optimized');
  } else {
    console.log('Connection pool optimization not supported by current database driver');
  }
}

/**
 * Fast retrieval of user with minimal fields
 * Optimized for authentication and permission checks
 * @param {number} userId - User ID to retrieve
 * @returns {Object|null} User object or null
 */
export async function fastUserLookup(userId) {
  try {
    const [user] = await db
      .select({
        id: schema.users.id,
        role: schema.users.role,
        emailVerified: schema.users.emailVerified
      })
      .from(schema.users)
      .where(sql`${schema.users.id} = ${userId}`)
      .limit(1);
    
    return user || null;
  } catch (error) {
    console.error('Fast user lookup failed:', error);
    return null;
  }
}

/**
 * Batch insert multiple records efficiently
 * @param {string} table - Table name
 * @param {Array} records - Array of records to insert
 * @returns {Array} Inserted records
 */
export async function batchInsert(table, records) {
  if (!records || !records.length) {
    return [];
  }
  
  try {
    // Use the appropriate table schema
    const tableSchema = schema[table];
    if (!tableSchema) {
      throw new Error(`Table schema not found for: ${table}`);
    }
    
    // Insert all records in a single operation
    const inserted = await db.insert(tableSchema).values(records).returning();
    return inserted;
  } catch (error) {
    console.error(`Batch insert failed for ${table}:`, error);
    throw error;
  }
}

/**
 * Efficiently retrieve user learning progress across all pathways
 * @param {number} userId - User ID
 * @returns {Object} User learning progress data
 */
export async function getUserLearningDashboard(userId) {
  try {
    // Efficiently query all needed data in a single operation
    const progress = await db
      .select({
        pathwayId: schema.learningProgress.pathwayId,
        moduleId: schema.learningProgress.moduleId,
        completed: schema.learningProgress.completed,
        completedAt: schema.learningProgress.completedAt,
        lastAccessedAt: schema.learningProgress.lastAccessedAt
      })
      .from(schema.learningProgress)
      .where(sql`${schema.learningProgress.userId} = ${userId}`)
      .orderBy(schema.learningProgress.lastAccessedAt);
    
    // Process results into a more usable format
    const byPathway = {};
    let totalCompleted = 0;
    let totalModules = 0;
    
    for (const item of progress) {
      if (!byPathway[item.pathwayId]) {
        byPathway[item.pathwayId] = {
          modules: {},
          completedCount: 0,
          totalCount: 0,
          lastAccessed: null
        };
      }
      
      const pathway = byPathway[item.pathwayId];
      pathway.modules[item.moduleId] = item;
      pathway.totalCount++;
      totalModules++;
      
      if (item.completed) {
        pathway.completedCount++;
        totalCompleted++;
      }
      
      // Track most recent activity
      const accessDate = new Date(item.lastAccessedAt);
      if (!pathway.lastAccessed || accessDate > pathway.lastAccessed) {
        pathway.lastAccessed = accessDate;
      }
    }
    
    return {
      pathways: byPathway,
      stats: {
        totalCompleted,
        totalModules,
        completionRate: totalModules > 0 ? (totalCompleted / totalModules) : 0
      }
    };
  } catch (error) {
    console.error('Error retrieving user learning dashboard:', error);
    throw error;
  }
}

/**
 * Initialize all database optimizations
 */
export async function initDatabaseOptimizations() {
  try {
    // Create performance indexes
    await createDatabaseIndexes();
    
    // Optimize connection pool
    optimizeConnectionPool();
    
    console.log('Database optimizations initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database optimizations:', error);
    return false;
  }
}