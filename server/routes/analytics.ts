import { Router } from 'express';
import { storage } from '../storage.js';
import { z } from 'zod';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { authenticated } from '../middleware/auth.js';

const router = Router();

/**
 * Error Handler Utility
 * Standardized error handling for all route handlers
 */
function handleErrors(res, error: any, defaultMessage = 'Internal server error') {
  console.error('Analytics API Error:', error);
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  
  return res.status(500).json({ error: error.message || defaultMessage });
}

/**
 * @route GET /api/analytics/mentor/:id
 * @desc Get analytics data for a mentor
 * @access Private (authenticated)
 */
router.get('/mentor/:id', authenticated, async (req, res) => {
  try {
    // Input validation with zod
    const schema = z.object({ id: z.coerce.number().int().positive() });
    const { id } = schema.parse({ id: req.params.id });
    
    // Optional authorization check to ensure mentors can only see their own data
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: You can only view your own analytics' });
    }
    
    const analytics = await storage.getMentorAnalytics(id);
    return res.json(analytics);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid mentor ID' });
    }
    return handleErrors(res, error, 'Failed to fetch mentor analytics');
  }
});

/**
 * @route GET /api/analytics/student/:id
 * @desc Get analytics data for a student
 * @access Private (authenticated)
 */
router.get('/student/:id', authenticated, async (req, res) => {
  try {
    // Input validation with zod
    const schema = z.object({ id: z.coerce.number().int().positive() });
    const { id } = schema.parse({ id: req.params.id });
    
    // Authorization check - students can only see their own data, mentors can see their students
    const isOwnData = req.user.id === id;
    
    // If not own data, check if user is a mentor with connection to this student
    if (!isOwnData && req.user.role !== 'admin') {
      const connections = await storage.getUserConnections(req.user.id, 'mentor');
      const isConnectedStudent = connections.some(conn => conn.studentId === id && conn.status === 'active');
      
      if (!isConnectedStudent) {
        return res.status(403).json({ error: 'Unauthorized: You do not have permission to view this student\'s analytics' });
      }
    }
    
    const analytics = await storage.getStudentAnalytics(id);
    return res.json(analytics);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    return handleErrors(res, error, 'Failed to fetch student analytics');
  }
});

/**
 * @route GET /api/analytics/pathway/:id
 * @desc Get analytics data for a learning pathway
 * @access Private (authenticated)
 */
router.get('/pathway/:id', authenticated, async (req, res) => {
  try {
    // Input validation with zod
    const schema = z.object({ id: z.coerce.number().int().positive() });
    const { id } = schema.parse({ id: req.params.id });
    
    // Verify pathway exists and user has permission to view it
    const pathway = await storage.getCustomPathway(id);
    
    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found' });
    }
    
    // Allow pathway creator, admins, or students assigned to the pathway
    const isCreator = pathway.creatorId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isCreator && !isAdmin) {
      // Check if pathway is assigned to the student
      const assignments = await storage.getAssignedPathways(req.user.id);
      const isAssigned = assignments.some(a => a.pathwayId === id);
      
      if (!isAssigned) {
        return res.status(403).json({ error: 'Unauthorized: You do not have permission to view this pathway analytics' });
      }
    }
    
    const analytics = await storage.getPathwayAnalytics(id);
    return res.json(analytics);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid pathway ID' });
    }
    return handleErrors(res, error, 'Failed to fetch pathway analytics');
  }
});

export default router;