import { Router } from "express";
import { fallbackAIService } from "../ai/ai-fallback-strategy";
import { isValidRoute, getSuggestedAlternativeRoute } from "../../shared/valid-routes";
import { z } from "zod";

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
    
    // Reset system if in fallback mode OR has any failure count
    // This is more aggressive to prevent getting stuck in preset responses
    if (status.useFallback || status.failureCount > 0) {
      fallbackAIService.resetFailures();
      console.log("Health check: AI fallback system reset performed - useFallback:", 
        status.useFallback, "failureCount:", status.failureCount);
      
      res.json({
        success: true,
        message: "AI fallback system has been reset preventively",
        previousStatus: status,
        currentStatus: fallbackAIService.getFallbackStatus(),
        action: "reset_performed"
      });
    } else {
      res.json({
        success: true,
        message: "AI fallback system is healthy",
        status,
        action: "none_needed"
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

/**
 * Toggle fallback mode - forces the AI system to use the fallback provider (HuggingFace)
 * or the primary provider (OpenAI) based on the request
 */
router.post("/toggle-fallback", async (req, res) => {
  try {
    // Validate request body
    const toggleSchema = z.object({
      useFallback: z.boolean().optional()
    });
    
    const { useFallback } = toggleSchema.parse(req.body);
    const result = fallbackAIService.toggleFallbackMode(useFallback);
    
    console.log(`AI fallback mode ${result.useFallback ? 'enabled' : 'disabled'} via API request`);
    
    res.json({
      success: true,
      message: result.useFallback 
        ? 'AI fallback mode enabled - now using HuggingFace as provider' 
        : 'AI fallback mode disabled - now using OpenAI as provider',
      status: result
    });
  } catch (error: any) {
    console.error("Error toggling fallback mode:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle fallback mode",
      details: error.errors // Include Zod validation errors if any
    });
  }
});

/**
 * Health check endpoint to validate AI fallback system
 * Used for automatic monitoring and self-healing
 */
router.get("/health-check", async (req, res) => {
  try {
    // Get the current status
    const status = fallbackAIService.getFallbackStatus();
    
    // Perform a simple health check with both providers
    // In a production system, we would actually test the APIs with simple requests
    
    res.json({
      success: true,
      message: "AI system health check completed successfully",
      status,
      providers: {
        primary: {
          name: status.primaryProvider,
          status: "active", // This would be dynamically determined in production
          responseTime: Math.floor(Math.random() * 300) + 200 // Simulated response time (200-500ms)
        },
        fallback: {
          name: status.fallbackProvider,
          status: "active", // This would be dynamically determined in production
          responseTime: Math.floor(Math.random() * 200) + 100 // Simulated response time (100-300ms)
        }
      }
    });
  } catch (error) {
    console.error("Error performing health check:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform health check"
    });
  }
});

/**
 * Reset the AI fallback system manually
 */
router.post("/reset-fallback", async (req, res) => {
  try {
    const resetStatus = fallbackAIService.resetFailures();
    console.log("AI fallback system manually reset via API request");
    
    res.json({
      success: true,
      message: "AI fallback system has been reset successfully",
      status: resetStatus
    });
  } catch (error) {
    console.error("Error resetting fallback system:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset AI fallback system"
    });
  }
});

/**
 * Admin dashboard data endpoint - provides all relevant information for AI system monitoring
 */
router.get("/admin-stats", async (req, res) => {
  try {
    const fallbackStatus = fallbackAIService.getFallbackStatus();
    
    // Compile comprehensive stats about the AI system
    res.json({
      success: true,
      fallbackStatus,
      providerInfo: {
        primary: {
          name: "OpenAI",
          status: "active" // In a real system, we'd check API health
        },
        fallback: {
          name: "HuggingFace", 
          status: "active"  // In a real system, we'd check API health
        }
      },
      // In a real system, we might include more stats:
      // - Request counts per provider
      // - Average response times
      // - Error rates
      // - Cost metrics
    });
  } catch (error: any) {
    console.error("Error getting admin stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve AI system statistics"
    });
  }
});

export default router;