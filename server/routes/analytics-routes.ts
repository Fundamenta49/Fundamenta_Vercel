import { Router } from 'express';
import * as analyticsService from '../services/analytics-service.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth-middleware.js';

const router = Router();

// Apply authentication to all analytics routes
router.use(authenticateJWT);

// Get overview analytics data
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const overviewData = await analyticsService.getOverviewAnalytics();
    res.json(overviewData);
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({ error: 'Failed to fetch overview analytics' });
  }
});

// Get activity breakdown by category
router.get('/category-breakdown', requireAdmin, async (req, res) => {
  try {
    const categoryData = await analyticsService.getCategoryBreakdown();
    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch category breakdown' });
  }
});

// Get activity heatmap data
router.get('/activity-heatmap', requireAdmin, async (req, res) => {
  try {
    const heatmapData = await analyticsService.getActivityHeatmap();
    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching activity heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch activity heatmap data' });
  }
});

// Get student performance data
router.get('/student-performance', requireAdmin, async (req, res) => {
  try {
    const studentData = await analyticsService.getStudentPerformance();
    res.json(studentData);
  } catch (error) {
    console.error('Error fetching student performance data:', error);
    res.status(500).json({ error: 'Failed to fetch student performance data' });
  }
});

// Get real-time activity data
router.get('/real-time', requireAdmin, async (req, res) => {
  try {
    const realTimeData = await analyticsService.getRealTimeActivity();
    res.json(realTimeData);
  } catch (error) {
    console.error('Error fetching real-time activity data:', error);
    res.status(500).json({ error: 'Failed to fetch real-time activity data' });
  }
});

export default router;