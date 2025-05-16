import { Router, Response } from 'express';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware.js';
import { studentProgressService } from '../services/student-progress-service.js';
import { db } from '../db.js';
import { assignedPathways, customPathways } from '../../shared/schema.js';
import { and, eq, desc } from 'drizzle-orm';

const router = Router();

/**
 * Get all assignments for the current student with optimized data loading
 */
router.get('/assignments', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { includeCompleted } = req.query;
    
    // Get all active assignments initially
    const assignments = await db.query.assignedPathways.findMany({
      where: includeCompleted === 'true' ? 
        eq(assignedPathways.studentId, userId) :
        and(
          eq(assignedPathways.studentId, userId),
          eq(assignedPathways.status, 'completed').not()
        ),
      orderBy: [desc(assignedPathways.createdAt)],
      with: {
        pathway: true,
        assignedBy: true
      }
    });
    
    // Process each assignment with optimized pathway progress retrieval
    const enhancedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const pathwayProgress = await studentProgressService.getPathwayProgress(
          userId, 
          assignment.pathwayId
        );
        
        return {
          ...assignment,
          pathway: pathwayProgress.pathway,
          progress: pathwayProgress.progress
        };
      })
    );
    
    res.json(enhancedAssignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * Get completed assignments for the current student with better performance
 */
router.get('/assignments/completed', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Optimized query - only get completed assignments
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.studentId, userId),
        eq(assignedPathways.status, 'completed')
      ),
      orderBy: [desc(assignedPathways.completedAt)],
      with: {
        pathway: true,
        assignedBy: true
      }
    });
    
    // Use the service to get progress data for each pathway
    const enhancedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const pathwayProgress = await studentProgressService.getPathwayProgress(
          userId, 
          assignment.pathwayId
        );
        
        return {
          ...assignment,
          pathway: pathwayProgress.pathway,
          progress: pathwayProgress.progress,
          completedAt: assignment.completedAt
        };
      })
    );
    
    res.json(enhancedAssignments);
  } catch (error) {
    console.error('Error fetching completed assignments:', error);
    res.status(500).json({ error: 'Failed to fetch completed assignments' });
  }
});

/**
 * Update progress for a specific module
 */
router.post('/progress/:pathwayId/:moduleId', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { pathwayId, moduleId } = req.params;
    const { completed, metadata } = req.body;
    
    // Use the service to update module progress
    await studentProgressService.updateModuleProgress(
      userId,
      pathwayId,
      moduleId,
      completed,
      metadata
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating module progress:', error);
    res.status(500).json({ error: 'Failed to update module progress' });
  }
});

/**
 * Get learning statistics for the current student - optimized performance
 */
router.get('/statistics', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Use the optimized service to get statistics
    const statistics = await studentProgressService.getStudentStatistics(userId);
    
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * Get detailed progress for a specific pathway
 */
router.get('/pathway-progress/:pathwayId', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const pathwayId = parseInt(req.params.pathwayId);
    
    // Use the service to get pathway progress
    const progress = await studentProgressService.getPathwayProgress(userId, pathwayId);
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching pathway progress:', error);
    res.status(500).json({ error: 'Failed to fetch pathway progress' });
  }
});

/**
 * Manually invalidate cache for the current user
 * Used when data consistency is critical
 */
router.post('/invalidate-cache', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Invalidate cache for this user
    studentProgressService.invalidateUserCache(userId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error invalidating cache:', error);
    res.status(500).json({ error: 'Failed to invalidate cache' });
  }
});

export default router;