import { db } from "../db";
import NodeCache from "node-cache";
import { 
  userActivities, 
  userEngagement, 
  users, 
  customPathways, 
  assignedPathways, 
  learningProgress 
} from "@shared/schema";
import { eq, count, sql, and, desc, gte, lt } from "drizzle-orm";

// Cache for analytics data with TTL of 5 minutes
const analyticsCache = new NodeCache({ stdTTL: 300 });

interface PathwayEngagementStats {
  pathwayId: number;
  pathwayName: string;
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageScore: number | null;
}

interface UserActivityStats {
  date: string;
  totalActivities: number;
  uniqueUsers: number;
  learningActivities: number;
}

/**
 * Analytics Service
 * 
 * Provides methods for retrieving analytics data about platform usage,
 * user engagement, and learning progress. Uses caching to improve
 * performance and reduce database load.
 */
export class AnalyticsService {
  /**
   * Get site-wide usage metrics
   */
  async getSiteMetrics() {
    const cacheKey = "site-metrics";
    const cachedData = analyticsCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Get total counts
    const [userCount] = await db
      .select({ count: count() })
      .from(users);
      
    const [pathwayCount] = await db
      .select({ count: count() })
      .from(customPathways);
      
    const [assignmentCount] = await db
      .select({ count: count() })
      .from(assignedPathways);
      
    const [completedCount] = await db
      .select({ count: count() })
      .from(assignedPathways)
      .where(sql`${assignedPathways.completedAt} IS NOT NULL`);
      
    // Get activity metrics for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [recentActivityCount] = await db
      .select({ count: count() })
      .from(userActivities)
      .where(gte(userActivities.createdAt, thirtyDaysAgo));
      
    const metrics = {
      totalUsers: userCount?.count || 0,
      totalPathways: pathwayCount?.count || 0,
      totalAssignments: assignmentCount?.count || 0,
      completedAssignments: completedCount?.count || 0,
      completionRate: assignmentCount?.count 
        ? Math.round((completedCount?.count / assignmentCount?.count) * 100) 
        : 0,
      last30DaysActivities: recentActivityCount?.count || 0
    };
    
    // Cache the result
    analyticsCache.set(cacheKey, metrics);
    
    return metrics;
  }
  
  /**
   * Get detailed pathway engagement statistics
   */
  async getPathwayEngagementStats(limit = 10): Promise<PathwayEngagementStats[]> {
    const cacheKey = `pathway-stats-${limit}`;
    const cachedData = analyticsCache.get<PathwayEngagementStats[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Get pathway stats with student counts and completion rates
    const pathwayStats = await db.execute<PathwayEngagementStats>(sql`
      WITH pathway_metrics AS (
        SELECT 
          cp.id as pathway_id,
          cp.title as pathway_name,
          COUNT(DISTINCT ap.student_id) as total_students,
          COUNT(DISTINCT CASE WHEN ap.last_accessed_at > NOW() - INTERVAL '30 days' THEN ap.student_id END) as active_students,
          COUNT(DISTINCT CASE WHEN ap.completed_at IS NOT NULL THEN ap.student_id END) as completed_students,
          AVG(ap.final_score::float) as average_score
        FROM 
          ${customPathways} cp
        LEFT JOIN 
          ${assignedPathways} ap ON cp.id = ap.pathway_id
        GROUP BY 
          cp.id, cp.title
      )
      SELECT 
        pathway_id as "pathwayId",
        pathway_name as "pathwayName",
        total_students as "totalStudents",
        active_students as "activeStudents",
        CASE 
          WHEN total_students > 0 THEN ROUND((completed_students::float / total_students) * 100)
          ELSE 0
        END as "completionRate",
        average_score as "averageScore"
      FROM 
        pathway_metrics
      ORDER BY 
        total_students DESC, pathway_name ASC
      LIMIT ${limit}
    `);
    
    // Cache the result
    analyticsCache.set(cacheKey, pathwayStats);
    
    return pathwayStats;
  }
  
  /**
   * Get daily activity statistics for the specified date range
   */
  async getActivityTimeline(days = 14): Promise<UserActivityStats[]> {
    const cacheKey = `activity-timeline-${days}`;
    const cachedData = analyticsCache.get<UserActivityStats[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Generate date series for the full range
    const dateRange: UserActivityStats[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      dateRange.push({
        date: dateStr,
        totalActivities: 0,
        uniqueUsers: 0,
        learningActivities: 0
      });
    }
    
    // Get activity data from database
    const activityData = await db.execute<{
      date: string;
      total_activities: number;
      unique_users: number;
      learning_activities: number;
    }>(sql`
      WITH date_series AS (
        SELECT 
          generate_series(
            ${startDate.toISOString()}::date, 
            CURRENT_DATE, 
            '1 day'::interval
          )::date as date
      ),
      daily_stats AS (
        SELECT 
          DATE(created_at) as activity_date,
          COUNT(*) as total_activities,
          COUNT(DISTINCT user_id) as unique_users,
          SUM(CASE WHEN activity_type = 'learning_progress' THEN 1 ELSE 0 END) as learning_activities
        FROM 
          ${userActivities}
        WHERE 
          created_at >= ${startDate.toISOString()}
        GROUP BY 
          DATE(created_at)
      )
      SELECT 
        ds.date::text as "date",
        COALESCE(dst.total_activities, 0) as "total_activities",
        COALESCE(dst.unique_users, 0) as "unique_users",
        COALESCE(dst.learning_activities, 0) as "learning_activities"
      FROM 
        date_series ds
      LEFT JOIN 
        daily_stats dst ON ds.date = dst.activity_date
      ORDER BY 
        ds.date ASC
    `);
    
    // Merge query results with date range template
    const activityMap = new Map<string, UserActivityStats>();
    dateRange.forEach(item => {
      activityMap.set(item.date, item);
    });
    
    activityData.forEach(item => {
      if (activityMap.has(item.date)) {
        activityMap.set(item.date, {
          date: item.date,
          totalActivities: Number(item.total_activities),
          uniqueUsers: Number(item.unique_users),
          learningActivities: Number(item.learning_activities)
        });
      }
    });
    
    const result = Array.from(activityMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Cache the result
    analyticsCache.set(cacheKey, result);
    
    return result;
  }
  
  /**
   * Get user engagement statistics
   */
  async getUserEngagementStats(timeframe = 'week') {
    const cacheKey = `user-engagement-${timeframe}`;
    const cachedData = analyticsCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    let startDate = new Date();
    
    // Set start date based on timeframe
    if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === 'quarter') {
      startDate.setMonth(startDate.getMonth() - 3);
    }
    
    // Get engagement metrics
    const [newUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startDate));
      
    const [activeUsers] = await db
      .select({ count: count(sql`DISTINCT ${userActivities.userId}`) })
      .from(userActivities)
      .where(gte(userActivities.createdAt, startDate));
      
    const [completedAssignments] = await db
      .select({ count: count() })
      .from(assignedPathways)
      .where(
        and(
          gte(assignedPathways.completedAt, startDate),
          sql`${assignedPathways.completedAt} IS NOT NULL`
        )
      );
      
    const engagementStats = {
      newUsers: newUsers?.count || 0,
      activeUsers: activeUsers?.count || 0,
      completedAssignments: completedAssignments?.count || 0,
      timeframe
    };
    
    // Cache the result
    analyticsCache.set(cacheKey, engagementStats);
    
    return engagementStats;
  }
  
  /**
   * Clear all analytics caches to force data refresh
   */
  clearCache() {
    analyticsCache.flushAll();
    return { success: true, message: "Analytics cache cleared" };
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();