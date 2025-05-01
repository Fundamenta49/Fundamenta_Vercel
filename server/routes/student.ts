import { Router, Request, Response } from 'express';
import { db } from '../db';
import { isAuthenticated } from '../auth/auth-middleware';
import { 
  assignedPathways, 
  customPathways, 
  customPathwayModules, 
  learningProgress, 
  users 
} from '../../shared/schema';
import { and, eq, asc, desc, ne, count, sum, avg, sql } from 'drizzle-orm';

const router = Router();

/**
 * Get all assignments for the current student
 */
router.get('/assignments', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get all assignments for this student
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.studentId, userId),
        ne(assignedPathways.status, 'COMPLETED')
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
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * Get completed assignments for the current student
 */
router.get('/assignments/completed', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get all completed assignments for this student
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.studentId, userId),
        eq(assignedPathways.status, 'COMPLETED')
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
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching completed assignments:', error);
    res.status(500).json({ error: 'Failed to fetch completed assignments' });
  }
});

/**
 * Get learning statistics for the current student
 */
router.get('/statistics', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
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
router.get('/assignments/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const userId = req.user!.id;
    
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
router.post('/progress/:assignmentId/:moduleId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const moduleId = parseInt(req.params.moduleId);
    const userId = req.user!.id;
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
router.post('/assignments/:id/rate', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const userId = req.user!.id;
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
        eq(assignedPathways.status, 'COMPLETED')
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

export default router;