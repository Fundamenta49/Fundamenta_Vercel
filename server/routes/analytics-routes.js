/**
 * Analytics Routes
 * 
 * These routes provide access to analytics data with strict role-based access control.
 * Regular users can only access their own analytics, while admin users can access
 * platform-wide analytics data.
 */

const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics-service');
const { isAuthenticated, isAdmin, hasAccess } = require('../middleware/auth-middleware');

// User-specific analytics routes (authenticated users can only see their own data)
router.get('/user/:userId', isAuthenticated, hasAccess, async (req, res) => {
  try {
    const { userId } = req.params;
    const userAnalytics = await analyticsService.getUserAnalytics(userId);
    res.json(userAnalytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Current user's analytics (shorthand for logged-in user)
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const userAnalytics = await analyticsService.getUserAnalytics(userId);
    res.json(userAnalytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Platform-wide analytics (admin only)
router.get('/platform', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const platformAnalytics = await analyticsService.getPlatformAnalytics();
    res.json(platformAnalytics);
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    res.status(500).json({ error: 'Failed to fetch platform analytics' });
  }
});

// Get user activity history (self or admin only)
router.get('/user/:userId/activity', isAuthenticated, hasAccess, async (req, res) => {
  try {
    const { userId } = req.params;
    const { from, to, category, limit } = req.query;
    
    // These parameters would be passed to a real service function
    const activities = await analyticsService.getUserRecentActivities(userId);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// Get user path progress (self or admin only)
router.get('/user/:userId/paths', isAuthenticated, hasAccess, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const pathProgress = await analyticsService.getUserPathProgress(userId);
    res.json(pathProgress);
  } catch (error) {
    console.error('Error fetching path progress:', error);
    res.status(500).json({ error: 'Failed to fetch path progress' });
  }
});

// Get user time spent statistics (self or admin only)
router.get('/user/:userId/time', isAuthenticated, hasAccess, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const timeStats = await analyticsService.getUserTimeSpentStats(userId);
    res.json(timeStats);
  } catch (error) {
    console.error('Error fetching time statistics:', error);
    res.status(500).json({ error: 'Failed to fetch time statistics' });
  }
});

module.exports = router;