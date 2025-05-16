import { db } from '../db';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { 
  learningProgress, 
  assignedPathways, 
  customPathways, 
  customPathwayModules, 
  userActivities,
  progressNotes
} from '../../shared/schema';
import NodeCache from 'node-cache';

// Configure cache with 5-minute TTL by default
const progressCache = new NodeCache({
  stdTTL: 300, // 5 minutes cache
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false
});

interface ProgressStats {
  modulesCompleted: number;
  totalModules: number;
  completionRate: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  streak: number;
  recentActivity: any[];
  categoryProgress: Record<string, number>;
}

/**
 * Optimized service for tracking and retrieving student progress
 */
export class StudentProgressService {
  /**
   * Get comprehensive learning statistics for a student
   * @param userId The student's user ID
   * @returns Promise with aggregated progress statistics
   */
  async getStudentStatistics(userId: number): Promise<ProgressStats> {
    // Try to get from cache first
    const cacheKey = `student-stats-${userId}`;
    const cachedStats = progressCache.get<ProgressStats>(cacheKey);
    
    if (cachedStats) {
      return cachedStats;
    }
    
    // If not in cache, fetch from database
    try {
      // Using a single query to get module completion count
      const moduleCompletion = await db
        .select({ count: count() })
        .from(learningProgress)
        .where(and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.completed, true)
        ));
      
      const modulesCompleted = moduleCompletion[0]?.count || 0;
      
      // Get total assigned modules
      const totalAssignedModulesQuery = await db.execute(sql`
        SELECT COUNT(cpm.id) as total_modules
        FROM ${assignedPathways} ap
        JOIN ${customPathways} cp ON ap.pathway_id = cp.id
        JOIN ${customPathwayModules} cpm ON cpm.pathway_id = cp.id
        WHERE ap.student_id = ${userId}
      `);
      
      const totalModules = totalAssignedModulesQuery[0]?.total_modules || 0;
      
      // Get assignment statistics
      const assignmentStats = await db
        .select({
          total: count(),
          completed: count(assignedPathways.completedAt)
        })
        .from(assignedPathways)
        .where(eq(assignedPathways.studentId, userId));
      
      // Calculate learning streak from activity data
      const streak = await this.calculateLearningStreak(userId);
      
      // Get progress by category with optimized query
      const categoryProgressQuery = await db.execute(sql`
        WITH category_modules AS (
          SELECT 
            cp.category, 
            COUNT(cpm.id) AS total_modules
          FROM ${assignedPathways} ap
          JOIN ${customPathways} cp ON ap.pathway_id = cp.id
          JOIN ${customPathwayModules} cpm ON cpm.pathway_id = cp.id
          WHERE ap.student_id = ${userId}
          GROUP BY cp.category
        ),
        completed_modules AS (
          SELECT 
            cp.category, 
            COUNT(lp.id) AS completed_count
          FROM ${learningProgress} lp
          JOIN ${customPathways} cp ON lp.pathway_id = cp.id::text
          WHERE lp.user_id = ${userId} AND lp.completed = true
          GROUP BY cp.category
        )
        SELECT 
          cm.category,
          cm.total_modules,
          COALESCE(comp.completed_count, 0) AS completed_count,
          CASE 
            WHEN cm.total_modules > 0 
            THEN ROUND((COALESCE(comp.completed_count, 0)::float / cm.total_modules) * 100, 1)
            ELSE 0 
          END AS completion_rate
        FROM category_modules cm
        LEFT JOIN completed_modules comp ON cm.category = comp.category
      `);
      
      // Get recent activity
      const recentActivity = await db
        .select()
        .from(userActivities)
        .where(eq(userActivities.userId, userId))
        .orderBy(desc(userActivities.timestamp))
        .limit(10);
      
      // Format category progress for easy consumption
      const categoryProgress: Record<string, number> = {};
      for (const row of categoryProgressQuery) {
        categoryProgress[row.category] = parseFloat(row.completion_rate) || 0;
      }
      
      const stats: ProgressStats = {
        modulesCompleted,
        totalModules,
        completionRate: totalModules > 0 ? (modulesCompleted / totalModules) * 100 : 0,
        assignmentsCompleted: assignmentStats[0]?.completed || 0,
        totalAssignments: assignmentStats[0]?.total || 0,
        streak,
        recentActivity,
        categoryProgress
      };
      
      // Cache the result
      progressCache.set(cacheKey, stats);
      
      return stats;
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      throw new Error(`Failed to get student statistics: ${error.message}`);
    }
  }
  
  /**
   * Get detailed progress data for a specific pathway
   * @param userId The student's user ID
   * @param pathwayId The pathway ID
   * @returns Detailed progress data for the pathway
   */
  async getPathwayProgress(userId: number, pathwayId: number): Promise<any> {
    const cacheKey = `pathway-progress-${userId}-${pathwayId}`;
    const cachedProgress = progressCache.get(cacheKey);
    
    if (cachedProgress) {
      return cachedProgress;
    }
    
    try {
      // Get pathway details
      const pathway = await db.query.customPathways.findFirst({
        where: eq(customPathways.id, pathwayId),
        with: {
          modules: {
            orderBy: (modules) => [modules.order]
          }
        }
      });
      
      if (!pathway) {
        throw new Error(`Pathway ${pathwayId} not found`);
      }
      
      // Get assignment status
      const assignment = await db.query.assignedPathways.findFirst({
        where: and(
          eq(assignedPathways.pathwayId, pathwayId),
          eq(assignedPathways.studentId, userId)
        )
      });
      
      // Get progress for each module
      const moduleProgress = await db.query.learningProgress.findMany({
        where: and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.pathwayId, pathwayId.toString())
        )
      });
      
      // Add progress data to each module
      const enhancedModules = pathway.modules.map(module => {
        const progress = moduleProgress.find(p => p.moduleId === module.id.toString());
        return {
          ...module,
          completed: progress?.completed || false,
          lastAccessed: progress?.lastAccessedAt || null,
          completedAt: progress?.completedAt || null,
          metadata: progress?.metadata || {}
        };
      });
      
      // Calculate overall progress
      const totalModules = enhancedModules.length;
      const completedModules = enhancedModules.filter(m => m.completed).length;
      const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
      
      const result = {
        pathway: {
          ...pathway,
          modules: enhancedModules
        },
        assignment: assignment || null,
        progress: {
          completedModules,
          totalModules,
          completionRate
        }
      };
      
      // Cache results
      progressCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error fetching pathway progress:', error);
      throw new Error(`Failed to get pathway progress: ${error.message}`);
    }
  }
  
  /**
   * Calculate user's learning streak from activity data
   * @param userId The student's user ID
   */
  private async calculateLearningStreak(userId: number): Promise<number> {
    try {
      // Get activity dates ordered by most recent
      const activityQuery = await db
        .select({
          date: sql<string>`DATE(timestamp)`
        })
        .from(userActivities)
        .where(eq(userActivities.userId, userId))
        .orderBy(desc(sql`DATE(timestamp)`));
      
      if (!activityQuery.length) {
        return 0;
      }
      
      // Extract unique dates
      const uniqueDates = Array.from(new Set(
        activityQuery.map(row => row.date)
      ));
      
      if (!uniqueDates.length) {
        return 0;
      }
      
      // Count streak by checking consecutive days
      let streak = 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const mostRecentDate = new Date(uniqueDates[0]);
      
      // Check if the most recent activity was today or yesterday
      const dayDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If most recent activity is more than 1 day ago, streak is broken
      if (dayDiff > 1) {
        return 0;
      }
      
      // Count consecutive days
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const prevDate = new Date(uniqueDates[i-1]);
        
        const diffTime = prevDate.getTime() - currentDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }
  
  /**
   * Invalidate cache for a specific user
   * @param userId The student's user ID
   */
  invalidateUserCache(userId: number): void {
    // Get all keys in cache
    const keys = progressCache.keys();
    
    // Find and delete all keys related to this user
    const userKeys = keys.filter(key => key.includes(`-${userId}-`) || key.endsWith(`-${userId}`));
    
    if (userKeys.length > 0) {
      progressCache.del(userKeys);
    }
  }
  
  /**
   * Update progress for a specific module
   * @param userId The student's user ID
   * @param pathwayId The pathway ID
   * @param moduleId The module ID
   * @param completed Whether the module is completed
   * @param metadata Optional metadata to store with the progress
   */
  async updateModuleProgress(
    userId: number, 
    pathwayId: string, 
    moduleId: string, 
    completed: boolean,
    metadata?: any
  ): Promise<void> {
    try {
      // Check if progress record exists
      const existingProgress = await db.query.learningProgress.findFirst({
        where: and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.pathwayId, pathwayId),
          eq(learningProgress.moduleId, moduleId)
        )
      });
      
      const now = new Date();
      
      if (existingProgress) {
        // Update existing record
        await db
          .update(learningProgress)
          .set({ 
            completed,
            completedAt: completed ? now : null,
            metadata: metadata || existingProgress.metadata,
            lastAccessedAt: now,
            updatedAt: now
          })
          .where(eq(learningProgress.id, existingProgress.id));
      } else {
        // Create new record
        await db
          .insert(learningProgress)
          .values({
            userId,
            pathwayId,
            moduleId,
            completed,
            completedAt: completed ? now : null,
            metadata: metadata || {},
            lastAccessedAt: now,
            createdAt: now,
            updatedAt: now
          });
      }
      
      // Record activity for streak tracking
      await db
        .insert(userActivities)
        .values({
          userId,
          activityType: completed ? 'module_completed' : 'module_progress',
          activityData: {
            pathwayId,
            moduleId
          },
          timestamp: now
        });
      
      // Check if all modules in pathway are completed, update assignment status if needed
      if (completed) {
        await this.checkPathwayCompletion(userId, parseInt(pathwayId));
      }
      
      // Invalidate cache for this user
      this.invalidateUserCache(userId);
    } catch (error) {
      console.error('Error updating module progress:', error);
      throw new Error(`Failed to update module progress: ${error.message}`);
    }
  }
  
  /**
   * Check if all modules in a pathway are completed and update assignment status
   * @param userId The student's user ID
   * @param pathwayId The pathway ID
   */
  private async checkPathwayCompletion(userId: number, pathwayId: number): Promise<void> {
    try {
      // Get all modules for the pathway
      const modules = await db.query.customPathwayModules.findMany({
        where: eq(customPathwayModules.pathwayId, pathwayId)
      });
      
      if (!modules.length) {
        return;
      }
      
      // Check progress for each module
      const moduleIds = modules.map(m => m.id.toString());
      
      const progress = await db.query.learningProgress.findMany({
        where: and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.pathwayId, pathwayId.toString()),
          sql`${learningProgress.moduleId} IN (${moduleIds.join(',')})`
        )
      });
      
      // Check if all modules are completed
      const allCompleted = modules.every(module => 
        progress.some(p => 
          p.moduleId === module.id.toString() && p.completed
        )
      );
      
      if (allCompleted) {
        // Update assignment status
        await db
          .update(assignedPathways)
          .set({ 
            status: 'completed',
            completedAt: new Date()
          })
          .where(and(
            eq(assignedPathways.studentId, userId),
            eq(assignedPathways.pathwayId, pathwayId)
          ));
      }
    } catch (error) {
      console.error('Error checking pathway completion:', error);
    }
  }
}

// Create singleton instance
export const studentProgressService = new StudentProgressService();