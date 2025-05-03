import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware';
import { 
  assignedPathways, 
  customPathways, 
  customPathwayModules, 
  learningProgress, 
  users 
} from '../../shared/schema';
import { and, eq, ne, count, sum, avg, sql, desc, asc } from 'drizzle-orm';

const router = Router();

/**
 * Get analytics for a specific user
 * @route GET /api/analytics/user/:userId
 */
router.get('/user/:userId', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Check if the user exists and is either the requesting user or an educator for this student
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all progress data for this user
    const progressData = await db.query.learningProgress.findMany({
      where: eq(learningProgress.userId, userId),
      orderBy: [desc(learningProgress.updatedAt)]
    });
    
    // Get all assigned pathways for this user
    const assignmentData = await db.query.assignedPathways.findMany({
      where: eq(assignedPathways.studentId, userId),
      with: {
        pathway: true
      }
    });
    
    // Calculate summary statistics
    const totalModules = progressData.length;
    const completedModules = progressData.filter(p => p.completed).length;
    const completionRate = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Calculate pathway-specific progress
    const pathwayProgress: Record<string, {
      totalModules: number;
      completedModules: number;
      completionRate: number;
      lastAccessedAt: Date | null;
    }> = {};
    
    // Group progress by pathway
    for (const progress of progressData) {
      if (!pathwayProgress[progress.pathwayId]) {
        pathwayProgress[progress.pathwayId] = {
          totalModules: 0,
          completedModules: 0,
          completionRate: 0,
          lastAccessedAt: null
        };
      }
      
      pathwayProgress[progress.pathwayId].totalModules++;
      
      if (progress.completed) {
        pathwayProgress[progress.pathwayId].completedModules++;
      }
      
      // Update last accessed date if newer
      if (!pathwayProgress[progress.pathwayId].lastAccessedAt || 
          (progress.lastAccessedAt && progress.lastAccessedAt > pathwayProgress[progress.pathwayId].lastAccessedAt!)) {
        pathwayProgress[progress.pathwayId].lastAccessedAt = progress.lastAccessedAt;
      }
    }
    
    // Calculate completion rates for each pathway
    for (const pathwayId in pathwayProgress) {
      const pathway = pathwayProgress[pathwayId];
      pathway.completionRate = pathway.totalModules > 0 
        ? Math.round((pathway.completedModules / pathway.totalModules) * 100) 
        : 0;
    }
    
    // Calculate activity timeline (modules completed per day)
    const activityMap: Record<string, number> = {};
    
    for (const progress of progressData) {
      if (progress.completed && progress.completedAt) {
        const dateStr = progress.completedAt.toISOString().split('T')[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      }
    }
    
    const activityTimeline = Object.entries(activityMap).map(([date, count]) => ({
      date,
      count
    }));
    
    // Get recently active categories/pathways
    const recentPathwayIds = progressData
      .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
      .map(p => p.pathwayId)
      .filter((id, index, self) => self.indexOf(id) === index)
      .slice(0, 3);
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (activityTimeline.length > 0) {
      // Sort dates in descending order
      const sortedDates = Object.keys(activityMap).sort().reverse();
      
      // Calculate current streak
      const today = new Date().toISOString().split('T')[0];
      let currentDate = new Date(today);
      
      for (let i = 0; i < sortedDates.length; i++) {
        const dateStr = sortedDates[i];
        const streakDate = new Date(dateStr);
        
        // Check if this date is consecutive with the previous one
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(currentDate.getDate() - 1);
        
        if (streakDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
          currentDate = streakDate;
        } else {
          break;
        }
      }
      
      // Calculate longest streak
      let tempStreak = 1;
      let previousDate = new Date(sortedDates[0]);
      
      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const expectedDate = new Date(previousDate);
        expectedDate.setDate(previousDate.getDate() - 1);
        
        if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
        
        previousDate = currentDate;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    // Combine all analytics data
    const analyticsData = {
      summary: {
        totalModules,
        completedModules,
        completionRate,
        currentStreak,
        longestStreak
      },
      pathwayProgress,
      activityTimeline,
      recentCategories: recentPathwayIds,
      assignments: {
        total: assignmentData.length,
        pending: assignmentData.filter(a => a.status === 'PENDING').length,
        inProgress: assignmentData.filter(a => a.status === 'IN_PROGRESS').length,
        completed: assignmentData.filter(a => a.status === 'COMPLETED').length
      }
    };
    
    res.json(analyticsData);
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

/**
 * Get analytics for learning pathways for educators
 * This endpoint provides aggregate data on pathway usage and performance
 * @route GET /api/analytics/pathways
 */
router.get('/pathways', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all pathways created by this educator
    const educatorPathways = await db.query.customPathways.findMany({
      where: eq(customPathways.creatorId, userId)
    });
    
    if (educatorPathways.length === 0) {
      return res.json({
        pathways: [],
        moduleUsage: [],
        totalAssignments: 0,
        totalStudents: 0,
        avgCompletionRate: 0
      });
    }
    
    const pathwayIds = educatorPathways.map(p => p.id);
    
    // Get all assignments for these pathways
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.createdBy, userId)
      )
    });
    
    // Calculate completion rates by pathway
    const pathwayAnalytics = [];
    
    for (const pathway of educatorPathways) {
      const pathwayAssignments = assignments.filter(a => a.pathwayId === pathway.id);
      
      const assignmentCount = pathwayAssignments.length;
      const completedCount = pathwayAssignments.filter(a => a.status === 'COMPLETED').length;
      const completionRate = assignmentCount > 0 ? (completedCount / assignmentCount) * 100 : 0;
      
      // Get unique students assigned to this pathway
      const studentIds = [...new Set(pathwayAssignments.map(a => a.studentId))];
      
      pathwayAnalytics.push({
        id: pathway.id,
        title: pathway.title,
        assignments: assignmentCount,
        completedAssignments: completedCount,
        completionRate,
        studentCount: studentIds.length,
        createdAt: pathway.createdAt
      });
    }
    
    // Get all unique students assigned to any pathway by this educator
    const uniqueStudents = [...new Set(assignments.map(a => a.studentId))];
    
    // Calculate overall stats
    const totalAssignments = assignments.length;
    const totalCompletedAssignments = assignments.filter(a => a.status === 'COMPLETED').length;
    const overallCompletionRate = totalAssignments > 0 
      ? (totalCompletedAssignments / totalAssignments) * 100 
      : 0;
    
    res.json({
      pathways: pathwayAnalytics,
      totalAssignments,
      totalStudents: uniqueStudents.length,
      avgCompletionRate: overallCompletionRate
    });
  } catch (error) {
    console.error('Error generating pathway analytics:', error);
    res.status(500).json({ error: 'Failed to generate pathway analytics' });
  }
});

export default router;