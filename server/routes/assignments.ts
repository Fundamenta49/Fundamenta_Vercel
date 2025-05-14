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
  connectionId: z.string().min(1),  // Connection ID from the frontend
  pathwayId: z.string().min(1),     // Pathway ID from the frontend
  deadline: z.string().optional(),  // Renamed from dueDate to match frontend
  messageToStudent: z.string().optional(), // Additional field from frontend
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
    
    // Parse IDs from strings to numbers
    const pathwayId = parseInt(validatedData.pathwayId);
    const connectionId = parseInt(validatedData.connectionId);
    
    if (isNaN(pathwayId) || isNaN(connectionId)) {
      return res.status(400).json({ error: 'Invalid pathway ID or connection ID' });
    }
    
    // Check if the pathway exists and belongs to the current user
    const pathway = await db.query.customPathways.findFirst({
      where: eq(customPathways.id, pathwayId)
    });
    
    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found' });
    }
    
    // Check if the user is the creator or has permission to assign this pathway
    if (pathway.creatorId !== userId && !pathway.isPublic) {
      return res.status(403).json({ error: 'You do not have permission to assign this pathway' });
    }
    
    // Get the connection to find the student ID
    // Assuming a connection table exists with fields mentorId, studentId, etc.
    const connection = await db.query.userConnections.findFirst({
      where: eq(userConnections.id, connectionId)
    });
    
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    
    // Verify the current user is the mentor in this connection
    if (connection.mentorId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to assign content to this student' });
    }
    
    // Create the assignment
    const newAssignment = await db.insert(assignedPathways).values({
      pathwayId,
      studentId: connection.studentId,
      assignedBy: userId,
      dueDate: validatedData.deadline ? new Date(validatedData.deadline) : null,
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