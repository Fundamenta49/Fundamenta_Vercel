import express from 'express';
import { storage } from '../storage';
import { z } from 'zod';

const router = express.Router();

// Middleware to ensure user is authenticated
const ensureAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get user engagement data
router.get('/engagement', ensureAuth, async (req, res) => {
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

export default router;