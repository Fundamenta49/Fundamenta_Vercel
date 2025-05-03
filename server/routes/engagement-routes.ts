import express, { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

// Add Express session augmentation for auth typing
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: number;
    };
  }
}

// Add Express user augmentation
declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      [key: string]: any;
    }
  }
}

const router = express.Router();

// Middleware to ensure user is authenticated
const ensureAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get user engagement data (streaks, points, level)
router.get('/', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    let engagement = await storage.getUserEngagement(userId);
    
    // If user doesn't have engagement data yet, create it
    if (!engagement) {
      engagement = await storage.createUserEngagement(userId);
    }
    
    res.json(engagement);
  } catch (error) {
    console.error('Error getting user engagement:', error);
    res.status(500).json({ error: 'Failed to get engagement data' });
  }
});

// Daily check-in endpoint
router.post('/check-in', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const engagement = await storage.checkInUser(userId);
    
    res.json(engagement);
  } catch (error) {
    console.error('Error checking in user:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// Get user streak
router.get('/streak', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const streak = await storage.getStreak(userId);
    
    res.json({ streak });
  } catch (error) {
    console.error('Error getting user streak:', error);
    res.status(500).json({ error: 'Failed to get streak' });
  }
});

// Get user achievements
router.get('/achievements', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const achievements = await storage.getUserAchievements(userId);
    
    res.json(achievements);
  } catch (error) {
    console.error('Error getting user achievements:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

// Get achievement summary (counts by type)
router.get('/achievement-summary', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const achievements = await storage.getUserAchievements(userId);
    
    // Group achievements by type and count them
    const summary = achievements.reduce((acc, achievement) => {
      const type = achievement.type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type]++;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate total earned points
    const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
    
    res.json({
      summary,
      totalAchievements: achievements.length,
      totalPoints,
      recentAchievements: achievements.slice(0, 5) // Return 5 most recent achievements
    });
  } catch (error) {
    console.error('Error getting achievement summary:', error);
    res.status(500).json({ error: 'Failed to get achievement summary' });
  }
});

// Get user activity history
router.get('/activities', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const activities = await storage.getUserActivities(userId, limit);
    
    res.json(activities);
  } catch (error) {
    console.error('Error getting user activities:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

// Get aggregated activity stats by type
router.get('/activity-stats', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const activities = await storage.getUserActivities(userId, 500); // Get a larger sample for stats
    
    // Group activities by type and count
    const activityStats = activities.reduce((acc: Record<string, any>, activity) => {
      const type = activity.type;
      
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalPoints: 0,
          latestTimestamp: null
        };
      }
      
      acc[type].count++;
      acc[type].totalPoints += activity.pointsEarned || 0;
      
      // Track the most recent activity of this type
      if (!acc[type].latestTimestamp || new Date(activity.timestamp) > new Date(acc[type].latestTimestamp)) {
        acc[type].latestTimestamp = activity.timestamp;
      }
      
      return acc;
    }, {});
    
    // Calculate total activities and points
    const totalActivities = activities.length;
    const totalPoints = activities.reduce((sum, activity) => sum + (activity.pointsEarned || 0), 0);
    
    res.json({
      activityStats,
      totalActivities,
      totalPoints,
      distinctActivityTypes: Object.keys(activityStats).length
    });
  } catch (error) {
    console.error('Error getting activity stats:', error);
    res.status(500).json({ error: 'Failed to get activity statistics' });
  }
});

// Record a user activity (for actions other than check-ins)
router.post('/activity', ensureAuth, async (req, res) => {
  try {
    const activitySchema = z.object({
      type: z.string(),
      data: z.record(z.any()).optional(),
      pointsEarned: z.number().optional()
    });
    
    const validationResult = activitySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid activity data', details: validationResult.error });
    }
    
    const { type, data, pointsEarned } = validationResult.data;
    const userId = req.user!.id;
    
    const activity = await storage.recordUserActivity(userId, type, data, pointsEarned);
    
    res.json(activity);
  } catch (error) {
    console.error('Error recording activity:', error);
    res.status(500).json({ error: 'Failed to record activity' });
  }
});

// Get comprehensive engagement summary - combines multiple metrics
router.get('/summary', ensureAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    // Get all needed data in parallel for performance
    const [
      engagement,
      achievements,
      recentActivities
    ] = await Promise.all([
      storage.getUserEngagement(userId),
      storage.getUserAchievements(userId),
      storage.getUserActivities(userId, 10)
    ]);
    
    if (!engagement) {
      return res.status(404).json({ error: 'User engagement not found' });
    }
    
    // Group achievements by type
    const achievementsByType = achievements.reduce((acc, achievement) => {
      const type = achievement.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(achievement);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Calculate achievement counts by type
    const achievementCounts = Object.keys(achievementsByType).reduce((acc, type) => {
      acc[type] = achievementsByType[type].length;
      return acc;
    }, {} as Record<string, number>);
    
    // Create engagement summary response
    const summary = {
      user: {
        id: userId,
        level: engagement.level,
        totalPoints: engagement.totalPoints,
      },
      streak: {
        current: engagement.currentStreak,
        longest: engagement.longestStreak,
        lastCheckIn: engagement.lastCheckIn,
      },
      achievements: {
        total: achievements.length,
        byType: achievementCounts,
        recent: achievements.slice(0, 5),
      },
      activities: {
        recent: recentActivities,
      },
      levelProgress: {
        current: engagement.level,
        pointsToNextLevel: calculatePointsToNextLevel(engagement.level, engagement.totalPoints),
        progressPercent: calculateLevelProgress(engagement.level, engagement.totalPoints),
      }
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error getting engagement summary:', error);
    res.status(500).json({ error: 'Failed to get engagement summary' });
  }
});

// Helper function to calculate points needed for next level
function calculatePointsToNextLevel(currentLevel: number, currentPoints: number): number {
  const nextLevel = currentLevel + 1;
  const pointsNeeded = Math.pow(nextLevel, 2) * 100; // Same formula as in checkForLevelUp
  return Math.max(0, pointsNeeded - currentPoints);
}

// Helper function to calculate percentage progress to the next level
function calculateLevelProgress(currentLevel: number, currentPoints: number): number {
  const currentLevelThreshold = Math.pow(currentLevel, 2) * 100;
  const nextLevelThreshold = Math.pow(currentLevel + 1, 2) * 100;
  const pointsInCurrentLevel = currentPoints - currentLevelThreshold;
  const pointsNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progressPercent = Math.min(100, Math.floor((pointsInCurrentLevel / pointsNeededForNextLevel) * 100));
  return progressPercent;
}

export default router;