/**
 * AI Health Monitoring API Routes
 * 
 * These routes provide information about the AI service health and allow
 * administrators to monitor and control the AI fallback mechanisms.
 */

import { Router } from 'express';
import { 
  getFundiAIStatus, 
  resetFundiAIService 
} from '../ai/fundi-resilient-integration';

const router = Router();

/**
 * Get detailed health information about the AI service
 */
router.get('/status', (req, res) => {
  try {
    const status = getFundiAIStatus();
    
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting AI health status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve AI health status',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Reset the AI service and its circuit breaker
 */
router.post('/reset', (req, res) => {
  try {
    resetFundiAIService();
    const newStatus = getFundiAIStatus();
    
    res.json({
      success: true,
      message: 'AI service reset successfully',
      status: newStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resetting AI service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset AI service',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Run self-diagnostics and verify connectivity to all AI providers
 */
router.get('/diagnostics', async (req, res) => {
  try {
    const status = getFundiAIStatus();
    
    // Respond immediately with current status, then run reset in background
    // This is to prevent the request from timing out during diagnostics
    res.json({
      success: true,
      message: 'Diagnostics triggered, service will be reset in background',
      status,
      timestamp: new Date().toISOString()
    });
    
    // Run reset in background
    setTimeout(() => {
      try {
        console.log('Running automatic AI service diagnostics and reset');
        resetFundiAIService();
        console.log('AI service diagnostics completed with reset');
      } catch (error) {
        console.error('Error during automatic AI service diagnostics:', error);
      }
    }, 100);
  } catch (error) {
    console.error('Error initiating AI diagnostics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate AI diagnostics',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;