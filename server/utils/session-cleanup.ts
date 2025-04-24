import { db } from "../db";
import { sessions } from "@shared/schema";
import { sql } from "drizzle-orm";
import { log } from "../vite";

/**
 * Clean up old sessions to prevent database bloat
 * @param daysToKeep Number of days of sessions to keep (default: 7)
 * @returns Number of deleted sessions
 */
export async function cleanupOldSessions(daysToKeep: number = 7): Promise<number> {
  try {
    // Only keep sessions from the last X days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    log(`Session cleanup: Starting cleanup of sessions older than ${daysToKeep} days (before ${cutoffDate.toISOString()})`);
    
    // For Neon database, use parameterized query with sql template literal
    const result = await db.execute(
      sql`DELETE FROM sessions WHERE expire < ${cutoffDate}`
    );
    
    const deletedCount = result.rowCount || 0;
    log(`Session cleanup: Successfully deleted ${deletedCount} expired sessions`);
    
    return deletedCount;
  } catch (error) {
    log(`Session cleanup error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Clean up duplicate sessions for the same client
 * This keeps only the most recent session for each client based on session cookie
 * @returns Number of deleted duplicate sessions
 */
export async function cleanupDuplicateSessions(): Promise<number> {
  try {
    log(`Session cleanup: Starting cleanup of duplicate sessions`);
    
    // This complex query deletes duplicate sessions while keeping the most recent one
    // We use a CTE (Common Table Expression) to identify duplicates
    const result = await db.execute(sql`
      WITH DuplicatesToDelete AS (
        SELECT sid
        FROM (
          SELECT 
            sid,
            sess->'cookie'->>'originalMaxAge' as cookie_id,
            ROW_NUMBER() OVER (
              PARTITION BY sess->'cookie'->>'originalMaxAge' 
              ORDER BY expire DESC
            ) as row_num
          FROM sessions
          WHERE sess->'cookie'->>'originalMaxAge' IS NOT NULL
        ) ranked
        WHERE row_num > 1
      )
      DELETE FROM sessions
      WHERE sid IN (SELECT sid FROM DuplicatesToDelete)
    `);
    
    const deletedCount = result.rowCount || 0;
    log(`Session cleanup: Successfully deleted ${deletedCount} duplicate sessions`);
    
    return deletedCount;
  } catch (error) {
    log(`Session cleanup error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Clean up all sessions except for the most recent ones
 * This is a more aggressive cleanup that only keeps a maximum number of most recent sessions
 * @param keepCount Number of most recent sessions to keep (default: 100)
 * @returns Number of deleted sessions
 */
export async function cleanupAllButRecentSessions(keepCount: number = 100): Promise<number> {
  try {
    log(`Session cleanup: Starting aggressive cleanup, keeping only ${keepCount} most recent sessions`);
    
    // First get the cutoff session (the Nth most recent one)
    const recentSessions = await db.execute(sql`
      SELECT expire 
      FROM sessions 
      ORDER BY expire DESC 
      LIMIT 1 OFFSET ${keepCount - 1}
    `);
    
    // If we have fewer sessions than keepCount, no cleanup needed
    if (recentSessions.rows.length === 0) {
      log('Session cleanup: No cleanup needed (fewer sessions than keepCount)');
      return 0;
    }
    
    const cutoffDate = recentSessions.rows[0].expire;
    
    // Delete all sessions older than the cutoff date
    const result = await db.execute(sql`
      DELETE FROM sessions 
      WHERE expire < ${cutoffDate}
    `);
    
    const deletedCount = result.rowCount || 0;
    log(`Session cleanup: Successfully deleted ${deletedCount} sessions, keeping the ${keepCount} most recent`);
    
    return deletedCount;
  } catch (error) {
    log(`Session cleanup error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}