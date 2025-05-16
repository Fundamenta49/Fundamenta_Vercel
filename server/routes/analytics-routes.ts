import { Router } from 'express';
import * as analyticsService from '../services/analytics-service.js';
import { authenticateJWT, requireAdmin, requireUser } from '../middleware/auth-middleware.js';

const router = Router();

// Apply authentication to all analytics routes
router.use(authenticateJWT);

// ===== ADMIN ROUTES =====
// These routes provide platform-wide analytics and are restricted to admins only

// Get platform overview analytics data (admin only)
router.get('/admin/overview', requireAdmin, async (req, res) => {
  try {
    const overviewData = await analyticsService.getOverviewAnalytics();
    res.json(overviewData);
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({ error: 'Failed to fetch overview analytics' });
  }
});

// Get platform-wide activity breakdown by category (admin only)
router.get('/admin/category-breakdown', requireAdmin, async (req, res) => {
  try {
    const categoryData = await analyticsService.getCategoryBreakdown();
    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch category breakdown' });
  }
});

// Get platform-wide activity heatmap data (admin only)
router.get('/admin/activity-heatmap', requireAdmin, async (req, res) => {
  try {
    const heatmapData = await analyticsService.getActivityHeatmap();
    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching activity heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch activity heatmap data' });
  }
});

// Get platform-wide student performance data (admin only)
router.get('/admin/student-performance', requireAdmin, async (req, res) => {
  try {
    const studentData = await analyticsService.getStudentPerformance();
    res.json(studentData);
  } catch (error) {
    console.error('Error fetching student performance data:', error);
    res.status(500).json({ error: 'Failed to fetch student performance data' });
  }
});

// Get platform-wide real-time activity data (admin only)
router.get('/admin/real-time', requireAdmin, async (req, res) => {
  try {
    const realTimeData = await analyticsService.getRealTimeActivity();
    res.json(realTimeData);
  } catch (error) {
    console.error('Error fetching real-time activity data:', error);
    res.status(500).json({ error: 'Failed to fetch real-time activity data' });
  }
});

// ===== USER ROUTES =====
// These routes provide user-specific analytics and are available to all authenticated users

// Get user-specific learning progress
router.get('/user/learning-progress', requireUser, async (req, res) => {
  try {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not available' });
    }
    
    const progressData = await analyticsService.getUserLearningProgress(userId);
    res.json(progressData);
  } catch (error) {
    console.error('Error fetching user learning progress:', error);
    res.status(500).json({ error: 'Failed to fetch learning progress' });
  }
});

// Get user-specific activity history
router.get('/user/activity-history', requireUser, async (req, res) => {
  try {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not available' });
    }
    
    const activityData = await analyticsService.getUserActivityHistory(userId);
    res.json(activityData);
  } catch (error) {
    console.error('Error fetching user activity history:', error);
    res.status(500).json({ error: 'Failed to fetch activity history' });
  }
});

// Get user-specific completion rates for paths/modules
router.get('/user/completion-rates', requireUser, async (req, res) => {
  try {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not available' });
    }
    
    const completionData = await analyticsService.getUserCompletionRates(userId);
    res.json(completionData);
  } catch (error) {
    console.error('Error fetching user completion rates:', error);
    res.status(500).json({ error: 'Failed to fetch completion rates' });
  }
});

// Get user-specific time spent on learning activities
router.get('/user/time-spent', requireUser, async (req, res) => {
  try {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not available' });
    }
    
    const timeData = await analyticsService.getUserTimeSpent(userId);
    res.json(timeData);
  } catch (error) {
    console.error('Error fetching user time spent data:', error);
    res.status(500).json({ error: 'Failed to fetch time spent data' });
  }
});

export default router;