import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware.js';
import { 
  assignedPathways, 
  customPathways, 
  customPathwayModules, 
  learningProgress, 
  users 
} from '../../shared/schema.js';
import { and, eq, asc, desc, ne, count, sum, avg, sql } from 'drizzle-orm';

const router = Router();

/**
 * Get all assignments for the current student
 */
router.get('/assignments', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all assignments for this student
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.studentId, userId),
        ne(assignedPathways.status, 'completed')
      ),
      orderBy: [
        desc(assignedPathways.createdAt),
      ],
      with: {
        pathway: {
          with: {
            modules: {
              orderBy: [asc(customPathwayModules.order)]
            }
          }
        },
        assignedBy: true
      }
    });
    
    // Fetch module completion status for each assignment
    const enhancedAssignments = await Promise.all(assignments.map(async (assignment) => {
      // Get progress for each module
      const moduleProgress = await db.query.learningProgress.findMany({
        where: and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.pathwayId, assignment.pathwayId.toString())
        )
      });
      
      // Add progress data to each module
      const enhancedModules = assignment.pathway.modules.map(module => {
        const progress = moduleProgress.find(p => p.moduleId === module.id.toString());
        return {
          ...module,
          completed: progress?.completed || false,
          lastAccessed: progress?.lastAccessedAt || null
        };
      });
      
      // Calculate overall progress based on completed modules
      const totalModules = enhancedModules.length;
      const completedModules = enhancedModules.filter(m => m.completed).length;
      const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
      
      // Update the assignment with the calculated progress
      return {
        ...assignment,
        pathway: {
          ...assignment.pathway,
          modules: enhancedModules
        },
        progress
      };
    }));
    
    res.json(enhancedAssignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * Get completed assignments for the current student
 */
router.get('/assignments/completed', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all completed assignments for this student
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.studentId, userId),
        eq(assignedPathways.status, 'completed')
      ),
      orderBy: [
        desc(assignedPathways.completedAt),
      ],
      with: {
        pathway: {
          with: {
            modules: {
              orderBy: [asc(customPathwayModules.order)]
            }
          }
        },
        assignedBy: true
      }
    });
    
    // Fetch module completion status for each assignment
    const enhancedAssignments = await Promise.all(assignments.map(async (assignment) => {
      // Get progress for each module
      const moduleProgress = await db.query.learningProgress.findMany({
        where: and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.pathwayId, assignment.pathwayId.toString())
        )
      });
      
      // Add progress data to each module
      const enhancedModules = assignment.pathway.modules.map(module => {
        const progress = moduleProgress.find(p => p.moduleId === module.id.toString());
        return {
          ...module,
          completed: progress?.completed || false,
          lastAccessed: progress?.lastAccessedAt || null
        };
      });
      
      return {
        ...assignment,
        pathway: {
          ...assignment.pathway,
          modules: enhancedModules
        },
        progress: 100 // Completed assignments are 100% by definition
      };
    }));
    
    res.json(enhancedAssignments);
  } catch (error) {
    console.error('Error fetching completed assignments:', error);
    res.status(500).json({ error: 'Failed to fetch completed assignments' });
  }
});

/**
 * Get learning statistics for the current student
 */
router.get('/statistics', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get module completion count
    const moduleCompletion = await db
      .select({ count: count() })
      .from(learningProgress)
      .where(and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.completed, true)
      ));
    
    const modulesCompleted = moduleCompletion[0]?.count || 0;
    
    // Get assignment statistics
    const assignmentStats = await db
      .select({
        total: count(),
        completed: count(assignedPathways.completedAt),
        avgScore: avg(assignedPathways.finalScore)
      })
      .from(assignedPathways)
      .where(eq(assignedPathways.studentId, userId));
    
    // Calculate learning streak (simplified - in a real app, this would be more complex)
    // For now, we'll just return a placeholder value
    const streak = 5; // This would be calculated based on daily learning activity
    
    // Get progress by category
    const categories = await db.query.customPathways.findMany({
      columns: {
        category: true,
      },
      with: {
        modules: {
          columns: {
            id: true,
          },
        },
      },
      where: sql`${customPathways.id} IN (
        SELECT ${assignedPathways.pathwayId} 
        FROM ${assignedPathways} 
        WHERE ${assignedPathways.studentId} = ${userId}
      )`,
    });
    
    // Transform the categories data
    const categoryStats = categories.reduce((acc, pathway) => {
      const category = pathway.category || 'Uncategorized';
      const existingCategory = acc.find(c => c.name === category);
      
      if (existingCategory) {
        existingCategory.totalModules += pathway.modules.length;
      } else {
        acc.push({
          name: category,
          totalModules: pathway.modules.length,
          completedModules: 0 // We'll calculate this next
        });
      }
      
      return acc;
    }, [] as Array<{name: string, totalModules: number, completedModules: number}>);
    
    // Get completed modules by category
    for (const category of categoryStats) {
      const completedModules = await db
        .select({ count: count() })
        .from(learningProgress)
        .where(and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.completed, true),
          sql`${learningProgress.pathwayId} IN (
            SELECT id::text FROM ${customPathways} 
            WHERE ${customPathways.category} = ${category.name}
          )`
        ));
      
      category.completedModules = completedModules[0]?.count || 0;
    }
    
    res.json({
      modulesCompleted,
      assignments: {
        total: assignmentStats[0]?.total || 0,
        completed: assignmentStats[0]?.completed || 0,
      },
      averageScore: assignmentStats[0]?.avgScore || null,
      streak,
      categories: categoryStats
    });
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    res.status(500).json({ error: 'Failed to fetch learning statistics' });
  }
});

/**
 * Get details for a specific assignment
 */
router.get('/assignments/:id', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const userId = req.user.id;
    
    if (isNaN(assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment ID' });
    }
    
    const assignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.studentId, userId)
      ),
      with: {
        pathway: {
          with: {
            modules: {
              orderBy: [asc(customPathwayModules.order)]
            }
          }
        },
        assignedBy: true
      }
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Get progress for each module
    const moduleProgress = await db.query.learningProgress.findMany({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, assignment.pathway.id.toString())
      )
    });
    
    // Add progress data to each module
    const enhancedModules = assignment.pathway.modules.map(module => {
      const progress = moduleProgress.find(p => p.moduleId === module.id.toString());
      return {
        ...module,
        completed: progress?.completed || false,
        lastAccessed: progress?.lastAccessedAt || null
      };
    });
    
    // Return the assignment with enhanced module data
    res.json({
      ...assignment,
      pathway: {
        ...assignment.pathway,
        modules: enhancedModules
      }
    });
  } catch (error) {
    console.error('Error fetching assignment details:', error);
    res.status(500).json({ error: 'Failed to fetch assignment details' });
  }
});

/**
 * Update module progress
 */
router.post('/progress/:assignmentId/:moduleId', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const moduleId = parseInt(req.params.moduleId);
    const userId = req.user.id;
    const { completed } = req.body;
    
    if (isNaN(assignmentId) || isNaN(moduleId)) {
      return res.status(400).json({ error: 'Invalid assignment or module ID' });
    }
    
    // Verify the assignment exists and belongs to this user
    const assignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.studentId, userId)
      ),
      with: {
        pathway: true
      }
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Verify the module exists and belongs to this pathway
    const module = await db.query.customPathwayModules.findFirst({
      where: and(
        eq(customPathwayModules.id, moduleId),
        eq(customPathwayModules.pathwayId, assignment.pathway.id)
      )
    });
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // Update or create the progress record
    const existingProgress = await db.query.learningProgress.findFirst({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, assignment.pathway.id.toString()),
        eq(learningProgress.moduleId, moduleId.toString())
      )
    });
    
    if (existingProgress) {
      await db
        .update(learningProgress)
        .set({
          completed: completed,
          completedAt: completed ? new Date() : null,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(learningProgress.id, existingProgress.id));
    } else {
      await db.insert(learningProgress).values({
        userId,
        pathwayId: assignment.pathway.id.toString(),
        moduleId: moduleId.toString(),
        completed: completed,
        completedAt: completed ? new Date() : null,
        lastAccessedAt: new Date()
      });
    }
    
    // Update the assignment progress
    const allModules = await db.query.customPathwayModules.findMany({
      where: eq(customPathwayModules.pathwayId, assignment.pathway.id)
    });
    
    const completedModules = await db.query.learningProgress.findMany({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, assignment.pathway.id.toString()),
        eq(learningProgress.completed, true)
      )
    });
    
    const progress = Math.round((completedModules.length / Math.max(allModules.length, 1)) * 100);
    
    // Update assignment status and progress
    let assignmentUpdate: any = {
      progress,
      updatedAt: new Date()
    };
    
    // If this is the first time the user has marked a module as completed
    if (completed && assignment.status === 'NOT_STARTED') {
      assignmentUpdate.status = 'IN_PROGRESS';
      assignmentUpdate.startedAt = new Date();
    }
    
    // If all modules are completed, mark the assignment as completed
    if (completed && progress === 100) {
      assignmentUpdate.status = 'COMPLETED';
      assignmentUpdate.completedAt = new Date();
    }
    
    await db
      .update(assignedPathways)
      .set(assignmentUpdate)
      .where(eq(assignedPathways.id, assignmentId));
    
    res.json({ 
      success: true, 
      progress,
      status: assignmentUpdate.status || assignment.status
    });
  } catch (error) {
    console.error('Error updating module progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * Rate a completed assignment
 */
router.post('/assignments/:id/rate', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const userId = req.user.id;
    const { rating } = req.body;
    
    if (isNaN(assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment ID' });
    }
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }
    
    // Verify the assignment exists, belongs to this user, and is completed
    const assignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.studentId, userId),
        eq(assignedPathways.status, 'completed')
      )
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Completed assignment not found' });
    }
    
    // Update the assignment rating
    await db
      .update(assignedPathways)
      .set({
        rating,
        updatedAt: new Date()
      })
      .where(eq(assignedPathways.id, assignmentId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error rating assignment:', error);
    res.status(500).json({ error: 'Failed to rate assignment' });
  }
});

/**
 * Update module completion status
 */
router.patch('/assignments/:assignmentId/modules/:moduleId', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const moduleId = parseInt(req.params.moduleId);
    const userId = req.user.id;
    const { completed } = req.body;
    
    if (isNaN(assignmentId) || isNaN(moduleId)) {
      return res.status(400).json({ error: 'Invalid assignment ID or module ID' });
    }
    
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed status must be a boolean' });
    }
    
    // Verify the assignment exists and belongs to this user
    const assignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.studentId, userId)
      ),
      with: {
        pathway: true
      }
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Verify the module belongs to the pathway
    const module = await db.query.customPathwayModules.findFirst({
      where: and(
        eq(customPathwayModules.id, moduleId),
        eq(customPathwayModules.pathwayId, assignment.pathwayId)
      )
    });
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found in this pathway' });
    }
    
    // Update or create progress record
    const existingProgress = await db.query.learningProgress.findFirst({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, assignment.pathwayId.toString()),
        eq(learningProgress.moduleId, moduleId.toString())
      )
    });
    
    if (existingProgress) {
      // Update existing record
      await db
        .update(learningProgress)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.pathwayId, assignment.pathwayId.toString()),
          eq(learningProgress.moduleId, moduleId.toString())
        ));
    } else {
      // Create new progress record
      await db.insert(learningProgress).values({
        userId,
        pathwayId: assignment.pathwayId.toString(),
        moduleId: moduleId.toString(),
        completed,
        completedAt: completed ? new Date() : null,
        lastAccessedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Get all modules for this pathway
    const allModules = await db.query.customPathwayModules.findMany({
      where: eq(customPathwayModules.pathwayId, assignment.pathwayId)
    });
    
    // Get all progress records for this pathway
    const allProgress = await db.query.learningProgress.findMany({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, assignment.pathwayId.toString())
      )
    });
    
    // Calculate progress percentage
    const totalModules = allModules.length;
    const completedModules = allProgress.filter(p => p.completed).length;
    const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Update assignment status and progress
    let status = assignment.status;
    
    // If this is the first completed module, update status to in_progress
    if (completed && status === 'assigned' && completedModules > 0) {
      status = 'in_progress';
    }
    
    // If all modules are completed, update status to completed
    if (completed && completedModules === totalModules) {
      status = 'completed';
    }
    
    await db
      .update(assignedPathways)
      .set({
        status,
        progress: progressPercentage,
        startedAt: status !== 'assigned' && !assignment.startedAt ? new Date() : assignment.startedAt,
        completedAt: status === 'completed' && !assignment.completedAt ? new Date() : assignment.completedAt,
        updatedAt: new Date()
      })
      .where(eq(assignedPathways.id, assignmentId));
    
    // Return updated assignment data
    const updatedAssignment = await db.query.assignedPathways.findFirst({
      where: eq(assignedPathways.id, assignmentId),
      with: {
        pathway: {
          with: {
            modules: {
              orderBy: [asc(customPathwayModules.order)]
            }
          }
        }
      }
    });
    
    // Add module completion information
    const moduleProgress = await db.query.learningProgress.findMany({
      where: and(
        eq(learningProgress.userId, userId),
        eq(learningProgress.pathwayId, assignment.pathwayId.toString())
      )
    });
    
    const enhancedModules = updatedAssignment.pathway.modules.map(module => {
      const progress = moduleProgress.find(p => p.moduleId === module.id.toString());
      return {
        ...module,
        completed: progress?.completed || false,
        lastAccessed: progress?.lastAccessedAt || null
      };
    });
    
    const result = {
      ...updatedAssignment,
      pathway: {
        ...updatedAssignment.pathway,
        modules: enhancedModules
      }
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error updating module completion:', error);
    res.status(500).json({ error: 'Failed to update module completion' });
  }
});

export default router;