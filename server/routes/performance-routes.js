/**
 * Performance Monitoring Routes
 * 
 * Endpoints for monitoring application performance metrics.
 * These routes are protected and only accessible by administrators.
 */

import express from 'express';
import { getPerformanceReport, resetPerformanceMetrics } from '../utils/performance-monitor.js';
import { cacheManager } from '../utils/cache-manager.js';
import { authenticateJWT, requireAdmin } from '../auth/auth-middleware.js';

const router = express.Router();

// Get current performance metrics
router.get('/metrics', authenticateJWT, requireAdmin, (req, res) => {
  try {
    const report = getPerformanceReport();
    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating performance report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate performance report'
    });
  }
});

// Get cache statistics
router.get('/cache', authenticateJWT, requireAdmin, (req, res) => {
  try {
    const stats = cacheManager.getStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving cache statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cache statistics'
    });
  }
});

// Reset performance metrics
router.post('/reset', authenticateJWT, requireAdmin, (req, res) => {
  try {
    resetPerformanceMetrics();
    res.json({
      success: true,
      message: 'Performance metrics have been reset'
    });
  } catch (error) {
    console.error('Error resetting performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset performance metrics'
    });
  }
});

// Reset cache
router.post('/cache/flush', authenticateJWT, requireAdmin, (req, res) => {
  try {
    cacheManager.flush();
    res.json({
      success: true,
      message: 'Cache has been flushed'
    });
  } catch (error) {
    console.error('Error flushing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to flush cache'
    });
  }
});

// Health check endpoint (does not require authentication)
router.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;