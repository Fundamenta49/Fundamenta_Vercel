/**
 * Content Moderation Service
 * 
 * Provides centralized logging and tracking of content moderation activity
 * to help identify patterns of inappropriate use and improve filtering.
 */

import fs from 'fs';
import path from 'path';
import { ContentFilterResult, ContentFilterSeverity } from '../utils/content-filter';

// Log structure for content moderation events
interface ContentModerationLog {
  timestamp: string;
  userInput: string; // Truncated/sanitized version
  filteredCategories: string[];
  severity: ContentFilterSeverity;
  action: 'blocked' | 'warned' | 'allowed';
}

// In-memory cache of recent moderation events to detect patterns
const recentModerationEvents: ContentModerationLog[] = [];
const MAX_CACHED_EVENTS = 100;

/**
 * Log a content moderation event
 * 
 * @param userInput Original user input (will be sanitized)
 * @param filterResult Filter result from content filter
 * @param action Action taken by the system
 */
export function logModerationEvent(
  userInput: string,
  filterResult: ContentFilterResult,
  action: 'blocked' | 'warned' | 'allowed'
): void {
  // Sanitize user input for logging (only store first 50 chars)
  const sanitizedInput = userInput.substring(0, 50) + (userInput.length > 50 ? '...' : '');
  
  // Create log entry
  const logEntry: ContentModerationLog = {
    timestamp: new Date().toISOString(),
    userInput: sanitizedInput,
    filteredCategories: filterResult.categories,
    severity: filterResult.severity,
    action
  };
  
  // Add to in-memory cache (for pattern detection)
  recentModerationEvents.unshift(logEntry);
  if (recentModerationEvents.length > MAX_CACHED_EVENTS) {
    recentModerationEvents.pop();
  }
  
  // Log to console
  console.log(`[Content Moderation] ${action.toUpperCase()} - Categories: ${filterResult.categories.join(', ')} - Severity: ${filterResult.severity}`);
  
  // In production, would write to database or secured log file
  // For now, just log to console to avoid overhead
}

/**
 * Detect patterns of repeated inappropriate content
 * Returns true if a concerning pattern is detected
 */
export function detectInappropriatePatterns(): { 
  isPatternDetected: boolean;
  patternDetails?: string;
} {
  // This is a simple implementation - would be more sophisticated in production
  
  // Count blocked events in last 10 events
  const recentBlocked = recentModerationEvents
    .slice(0, 10)
    .filter(event => event.action === 'blocked');
  
  // If more than 3 blocked events in last 10, consider it a pattern
  if (recentBlocked.length >= 3) {
    const categories = recentBlocked
      .flatMap(event => event.filteredCategories)
      .reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    // Determine most frequent category
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length > 0) {
      return {
        isPatternDetected: true,
        patternDetails: `Repeated ${sortedCategories[0][0]} content detected (${sortedCategories[0][1]} times)`
      };
    }
    
    return { isPatternDetected: true, patternDetails: 'Multiple blocked content attempts' };
  }
  
  return { isPatternDetected: false };
}

/**
 * Get moderation statistics
 */
export function getModerationStats(): {
  totalFiltered: number;
  blockedCount: number;
  warnedCount: number;
  allowedCount: number;
  byCategoryCount: Record<string, number>;
} {
  // Count by action
  const blockedCount = recentModerationEvents.filter(e => e.action === 'blocked').length;
  const warnedCount = recentModerationEvents.filter(e => e.action === 'warned').length;
  const allowedCount = recentModerationEvents.filter(e => e.action === 'allowed').length;
  
  // Count by category
  const byCategoryCount: Record<string, number> = {};
  recentModerationEvents.forEach(event => {
    event.filteredCategories.forEach(category => {
      byCategoryCount[category] = (byCategoryCount[category] || 0) + 1;
    });
  });
  
  return {
    totalFiltered: recentModerationEvents.length,
    blockedCount,
    warnedCount,
    allowedCount,
    byCategoryCount
  };
}