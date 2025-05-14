import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware';
import { 
  assignedPathways, 
  customPathways,
  insertAssignedPathwaySchema,
  users
} from '../../shared/schema';
import { and, eq, desc, ne } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Create assignment validation schema
const createAssignmentSchema = insertAssignedPathwaySchema.extend({
  studentId: z.number().int().positive(),
  pathwayId: z.number().int().positive(),
  dueDate: z.string().datetime().optional(),
});

/**
 * Create a new assignment
 * @route POST /api/assignments
 */
router.post('/', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Validate request body
    const validatedData = createAssignmentSchema.parse(req.body);
    
    // Check if the pathway exists and belongs to the current user
    const pathway = await db.query.customPathways.findFirst({
      where: eq(customPathways.id, validatedData.pathwayId)
    });
    
    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found' });
    }
    
    // Check if the user is the creator or has permission to assign this pathway
    if (pathway.creatorId !== userId && !pathway.isPublic) {
      return res.status(403).json({ error: 'You do not have permission to assign this pathway' });
    }
    
    // Check if the student exists
    const student = await db.query.users.findFirst({
      where: eq(users.id, validatedData.studentId)
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Create the assignment
    const newAssignment = await db.insert(assignedPathways).values({
      pathwayId: validatedData.pathwayId,
      studentId: validatedData.studentId,
      assignedBy: userId,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      status: 'assigned',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    // Return the created assignment
    res.status(201).json(newAssignment[0]);
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: error.errors 
      });
    }
    
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

/**
 * Get all assignments created by the authenticated user
 * @route GET /api/assignments
 */
router.get('/', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all assignments created by this user
    const assignments = await db.query.assignedPathways.findMany({
      where: eq(assignedPathways.assignedBy, userId),
      orderBy: [desc(assignedPathways.createdAt)],
      with: {
        pathway: true,
        student: true
      }
    });
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

export default router;