import { cleanupOldSessions, cleanupDuplicateSessions, cleanupAllButRecentSessions } from "./utils/session-cleanup";
import { log } from "./vite";

/**
 * Main database maintenance function that can be called manually or scheduled
 */
export async function performDatabaseMaintenance() {
  try {
    log("Starting database maintenance tasks...");

    // First clean up any old sessions
    const oldSessionsDeleted = await cleanupOldSessions(14); // Keep sessions from last 14 days
    log(`Deleted ${oldSessionsDeleted} old sessions`);

    // Then clean up duplicate sessions
    const duplicatesDeleted = await cleanupDuplicateSessions();
    log(`Deleted ${duplicatesDeleted} duplicate sessions`);

    log("Database maintenance tasks completed successfully");
  } catch (error) {
    log(`Database maintenance error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Aggressive cleanup function - use with caution as it will delete most sessions
 */
export async function performAggressiveCleanup() {
  try {
    log("Starting aggressive database cleanup...");

    // Keep only the 100 most recent sessions
    const sessionsDeleted = await cleanupAllButRecentSessions(100);
    log(`Aggressively deleted ${sessionsDeleted} sessions, kept 100 most recent`);

    log("Aggressive database cleanup completed successfully");
  } catch (error) {
    log(`Aggressive database cleanup error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// If this script is run directly (e.g. via 'node maintenance.js'), run the maintenance tasks
if (require.main === module) {
  (async () => {
    const isAggressive = process.argv.includes('--aggressive');
    
    if (isAggressive) {
      log("Running aggressive database cleanup (requested via command line)");
      await performAggressiveCleanup();
    } else {
      log("Running regular database maintenance");
      await performDatabaseMaintenance();
    }
    
    process.exit(0);
  })();
}