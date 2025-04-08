import { Router } from "express";
import { fallbackAIService } from "../ai/ai-fallback-strategy";
import { isValidRoute, getSuggestedAlternativeRoute } from "../../shared/valid-routes";

const router = Router();

/**
 * Check the current fallback status of the AI system
 */
router.get("/fallback-status", async (req, res) => {
  try {
    const status = fallbackAIService.getFallbackStatus();
    res.json({
      success: true,
      status
    });
  } catch (error: any) {
    console.error("Error getting fallback status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get fallback status"
    });
  }
});

/**
 * Reset the AI fallback system manually
 */
router.post("/reset-fallback", async (req, res) => {
  try {
    fallbackAIService.resetFailures();
    res.json({
      success: true,
      message: "AI fallback system reset successfully"
    });
  } catch (error: any) {
    console.error("Error resetting fallback system:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset fallback system"
    });
  }
});

/**
 * Health check endpoint to validate AI fallback system
 * Used for automatic monitoring and self-healing
 */
router.get("/health-check", async (req, res) => {
  try {
    const status = fallbackAIService.getFallbackStatus();
    
    // If the system is in fallback mode (useFallback is true), reset it
    if (status.useFallback) {
      fallbackAIService.resetFailures();
      console.log("Health check: AI fallback system was in fallback mode - reset performed");
      
      res.json({
        success: true,
        message: "AI fallback system was in fallback mode and has been reset",
        previousStatus: status,
        currentStatus: fallbackAIService.getFallbackStatus()
      });
    } else {
      res.json({
        success: true,
        message: "AI fallback system is healthy",
        status
      });
    }
  } catch (error: any) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform health check"
    });
  }
});

/**
 * Check if a route is valid and get alternative suggestions if not
 */
router.get("/validate-route", async (req, res) => {
  try {
    const route = req.query.route as string;
    
    if (!route) {
      return res.status(400).json({
        success: false,
        error: "Route parameter is required"
      });
    }
    
    const isValid = isValidRoute(route);
    
    if (isValid) {
      return res.json({
        success: true,
        isValid: true,
        route
      });
    } else {
      const alternativeRoute = getSuggestedAlternativeRoute(route);
      return res.json({
        success: true,
        isValid: false,
        route,
        alternativeRoute,
        message: `The route '${route}' is not valid. Consider using '${alternativeRoute}' instead.`
      });
    }
  } catch (error: any) {
    console.error("Route validation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to validate route"
    });
  }
});

export default router;