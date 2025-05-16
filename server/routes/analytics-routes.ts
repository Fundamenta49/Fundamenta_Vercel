import express, { Request, Response } from "express";
import { analyticsService } from "../services/analytics-service";
import { authenticateJWT, requireAdmin } from "../middleware/auth-middleware";

const router = express.Router();

/**
 * Get general site metrics
 * @route GET /api/analytics/site-metrics
 * @access Admin only
 */
router.get(
  "/site-metrics",
  authenticateJWT,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const metrics = await analyticsService.getSiteMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching site metrics:", error);
      res.status(500).json({ error: "Failed to fetch site metrics" });
    }
  }
);

/**
 * Get pathway engagement statistics
 * @route GET /api/analytics/pathway-engagement
 * @access Admin only
 */
router.get(
  "/pathway-engagement",
  authenticateJWT,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const pathwayStats = await analyticsService.getPathwayEngagementStats(limit);
      res.json(pathwayStats);
    } catch (error) {
      console.error("Error fetching pathway engagement stats:", error);
      res.status(500).json({ error: "Failed to fetch pathway engagement statistics" });
    }
  }
);

/**
 * Get user activity timeline
 * @route GET /api/analytics/activity-timeline
 * @access Admin only
 */
router.get(
  "/activity-timeline",
  authenticateJWT,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 14;
      const timeline = await analyticsService.getActivityTimeline(days);
      res.json(timeline);
    } catch (error) {
      console.error("Error fetching activity timeline:", error);
      res.status(500).json({ error: "Failed to fetch activity timeline" });
    }
  }
);

/**
 * Get user engagement statistics
 * @route GET /api/analytics/user-engagement
 * @access Admin only
 */
router.get(
  "/user-engagement",
  authenticateJWT,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const timeframe = (req.query.timeframe as string) || "week";
      if (!["week", "month", "quarter"].includes(timeframe)) {
        return res.status(400).json({ 
          error: "Invalid timeframe. Use 'week', 'month', or 'quarter'" 
        });
      }
      
      const engagementStats = await analyticsService.getUserEngagementStats(timeframe);
      res.json(engagementStats);
    } catch (error) {
      console.error("Error fetching user engagement stats:", error);
      res.status(500).json({ error: "Failed to fetch user engagement statistics" });
    }
  }
);

/**
 * Clear analytics cache to force refresh
 * @route POST /api/analytics/clear-cache
 * @access Admin only
 */
router.post(
  "/clear-cache",
  authenticateJWT,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const result = analyticsService.clearCache();
      res.json(result);
    } catch (error) {
      console.error("Error clearing analytics cache:", error);
      res.status(500).json({ error: "Failed to clear analytics cache" });
    }
  }
);

export default router;