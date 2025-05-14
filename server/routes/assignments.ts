import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware';
import { 
  assignedPathways, 
  customPathways,
  insertAssignedPathwaySchema,
  users,
  userConnections
} from '../../shared/schema';
import { and, eq, desc, ne, inArray } from 'drizzle-orm';
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
    
    // Get all assignments created by this user with related data
    const assignments = await db.query.assignedPathways.findMany({
      where: eq(assignedPathways.assignedBy, userId),
      orderBy: [desc(assignedPathways.createdAt)],
      with: {
        pathway: {
          with: {
            modules: true
          }
        },
        student: true
      }
    });
    
    // For each assignment, look up the connection information
    const enhancedAssignments = await Promise.all(assignments.map(async (assignment: typeof assignedPathways.$inferSelect & { 
      pathway: typeof customPathways.$inferSelect & { modules: any[] }, 
      student: typeof users.$inferSelect 
    }) => {
      // Find the connection for this mentor-student pair
      const connection = await db.query.userConnections.findFirst({
        where: and(
          eq(userConnections.mentorId, userId),
          eq(userConnections.studentId, assignment.studentId)
        )
      });
      
      // Return enhanced assignment with connection data
      return {
        ...assignment,
        connection: connection ? {
          id: connection.id,
          type: connection.connectionType,
          status: connection.status,
          accessLevel: connection.accessLevel,
          targetUser: assignment.student
        } : null
      };
    }));
    
    res.json(enhancedAssignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * Get metrics and overview of assignments for all students under this mentor
 * @route GET /api/assignments/metrics
 */
router.get('/metrics', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all connections where the user is a mentor
    const connections = await db.query.userConnections.findMany({
      where: and(
        eq(userConnections.mentorId, userId),
        eq(userConnections.status, 'active')
      ),
      with: {
        student: true
      }
    });
    
    if (connections.length === 0) {
      return res.json({
        totalAssignments: 0,
        activeAssignments: 0,
        completedAssignments: 0,
        studentMetrics: []
      });
    }
    
    // Get student IDs from connections, filtering out any null studentIds
    const studentIds = connections
      .filter(conn => conn.studentId !== null)
      .map(conn => conn.studentId);
    
    if (studentIds.length === 0) {
      return res.json({
        totalAssignments: 0,
        activeAssignments: 0,
        completedAssignments: 0,
        studentMetrics: []
      });
    }
    
    // Get aggregate assignment data
    const assignmentCounts = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.assignedBy, userId),
        inArray(assignedPathways.studentId, studentIds as number[])
      )
    });
    
    // Generate per-student metrics
    const studentMetrics = await Promise.all(connections
      .filter(connection => connection.studentId !== null)
      .map(async (connection) => {
        const studentAssignments = assignmentCounts.filter(
          assignment => assignment.studentId === connection.studentId
        );
        
        const activeCount = studentAssignments.filter(
          assignment => assignment.status === 'assigned' || assignment.status === 'in_progress'
        ).length;
        
        const completedCount = studentAssignments.filter(
          assignment => assignment.status === 'completed'
        ).length;
        
        return {
          connectionId: connection.id,
          student: connection.student,
          totalAssignments: studentAssignments.length,
          activeAssignments: activeCount,
          completedAssignments: completedCount
        };
    }));
    
    // Calculate overall metrics
    const totalAssignments = assignmentCounts.length;
    const activeAssignments = assignmentCounts.filter(
      assignment => assignment.status === 'assigned' || assignment.status === 'in_progress'
    ).length;
    const completedAssignments = assignmentCounts.filter(
      assignment => assignment.status === 'completed'
    ).length;
    
    res.json({
      totalAssignments,
      activeAssignments,
      completedAssignments,
      studentMetrics
    });
  } catch (error) {
    console.error('Error fetching assignment metrics:', error);
    res.status(500).json({ error: 'Failed to fetch assignment metrics' });
  }
});

/**
 * Get a specific assignment by ID
 * @route GET /api/assignments/:id
 */
router.get('/:id', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const assignmentId = parseInt(req.params.id);
    
    if (isNaN(assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment ID' });
    }
    
    // Get the assignment with related data
    const assignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.assignedBy, userId)
      ),
      with: {
        pathway: {
          with: {
            modules: true
          }
        },
        student: true
      }
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Get the connection for this assignment
    const connection = await db.query.userConnections.findFirst({
      where: and(
        eq(userConnections.mentorId, userId),
        eq(userConnections.studentId, assignment.studentId)
      )
    });
    
    // Return enhanced assignment with connection data
    res.json({
      ...assignment,
      connection: connection ? {
        id: connection.id,
        type: connection.connectionType,
        status: connection.status,
        accessLevel: connection.accessLevel,
        targetUser: assignment.student
      } : null
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

/**
 * Update an assignment
 * @route PATCH /api/assignments/:id
 */
router.patch('/:id', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const assignmentId = parseInt(req.params.id);
    
    if (isNaN(assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment ID' });
    }
    
    // Validate request body
    const updateSchema = z.object({
      deadline: z.string().optional(),
      messageToStudent: z.string().optional(),
      status: z.enum(['assigned', 'revoked']).optional()
    });
    
    const validatedData = updateSchema.parse(req.body);
    
    // Check if the assignment exists and belongs to the current user
    const existingAssignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.assignedBy, userId)
      )
    });
    
    if (!existingAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Update the assignment
    const [updatedAssignment] = await db.update(assignedPathways)
      .set({
        dueDate: validatedData.deadline ? new Date(validatedData.deadline) : existingAssignment.dueDate,
        status: validatedData.status || existingAssignment.status,
        updatedAt: new Date()
      })
      .where(eq(assignedPathways.id, assignmentId))
      .returning();
    
    if (validatedData.status === 'revoked') {
      // If the assignment is being revoked, you might want to notify the student
      // or perform additional cleanup...
      console.log(`Assignment ${assignmentId} revoked by user ${userId}`);
    }
    
    // Return the updated assignment
    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

/**
 * Delete an assignment
 * @route DELETE /api/assignments/:id
 */
router.delete('/:id', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const assignmentId = parseInt(req.params.id);
    
    if (isNaN(assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment ID' });
    }
    
    // Check if the assignment exists and belongs to the current user
    const existingAssignment = await db.query.assignedPathways.findFirst({
      where: and(
        eq(assignedPathways.id, assignmentId),
        eq(assignedPathways.assignedBy, userId)
      )
    });
    
    if (!existingAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Delete the assignment
    await db.delete(assignedPathways)
      .where(eq(assignedPathways.id, assignmentId));
    
    // Return a success message
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

/**
 * Get all assignments for a specific student
 * @route GET /api/assignments/student/:connectionId
 */
router.get('/student/:connectionId', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.connectionId);
    
    if (isNaN(connectionId)) {
      return res.status(400).json({ error: 'Invalid connection ID' });
    }
    
    // Get the connection to retrieve the student ID
    const connection = await db.query.userConnections.findFirst({
      where: and(
        eq(userConnections.id, connectionId),
        eq(userConnections.mentorId, userId)
      )
    });
    
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    
    // Get all assignments for this student and created by this mentor
    const assignments = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.studentId, connection.studentId),
        eq(assignedPathways.assignedBy, userId)
      ),
      orderBy: [desc(assignedPathways.createdAt)],
      with: {
        pathway: {
          with: {
            modules: true
          }
        }
      }
    });
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch student assignments' });
  }
});

/**
 * Get metrics and overview of assignments for all students under this mentor
 * @route GET /api/assignments/metrics
 */
router.get('/metrics', authenticateJWT, requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all connections where the user is a mentor
    const connections = await db.query.userConnections.findMany({
      where: and(
        eq(userConnections.mentorId, userId),
        eq(userConnections.status, 'active')
      ),
      with: {
        student: true
      }
    });
    
    if (connections.length === 0) {
      return res.json({
        totalAssignments: 0,
        activeAssignments: 0,
        completedAssignments: 0,
        studentMetrics: []
      });
    }
    
    // Get student IDs from connections, filtering out any null studentIds
    const studentIds = connections
      .filter(conn => conn.studentId !== null)
      .map(conn => conn.studentId);
    
    if (studentIds.length === 0) {
      return res.json({
        totalAssignments: 0,
        activeAssignments: 0,
        completedAssignments: 0,
        studentMetrics: []
      });
    }
    
    // Get aggregate assignment data
    const assignmentCounts = await db.query.assignedPathways.findMany({
      where: and(
        eq(assignedPathways.assignedBy, userId),
        inArray(assignedPathways.studentId, studentIds as number[])
      )
    });
    
    // Generate per-student metrics
    const studentMetrics = await Promise.all(connections
      .filter(connection => connection.studentId !== null)
      .map(async (connection) => {
        const studentAssignments = assignmentCounts.filter(
          assignment => assignment.studentId === connection.studentId
        );
        
        const activeCount = studentAssignments.filter(
          assignment => assignment.status === 'assigned' || assignment.status === 'in_progress'
        ).length;
        
        const completedCount = studentAssignments.filter(
          assignment => assignment.status === 'completed'
        ).length;
        
        return {
          connectionId: connection.id,
          student: connection.student,
          totalAssignments: studentAssignments.length,
          activeAssignments: activeCount,
          completedAssignments: completedCount
        };
    }));
    
    // Calculate overall metrics
    const totalAssignments = assignmentCounts.length;
    const activeAssignments = assignmentCounts.filter(
      assignment => assignment.status === 'assigned' || assignment.status === 'in_progress'
    ).length;
    const completedAssignments = assignmentCounts.filter(
      assignment => assignment.status === 'completed'
    ).length;
    
    res.json({
      totalAssignments,
      activeAssignments,
      completedAssignments,
      studentMetrics
    });
  } catch (error) {
    console.error('Error fetching assignment metrics:', error);
    res.status(500).json({ error: 'Failed to fetch assignment metrics' });
  }
});

export default router;