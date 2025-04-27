import express, { RequestHandler, Request } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../storage";
import { isAuthenticated } from "../auth/auth-middleware";
import { connectionTypes, connectionStatuses, userRoles } from "@shared/schema";

// Extended Request type with user property
interface AuthRequest extends Request {
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
}

const router = express.Router();

// Validate connection pairing code format
const pairingCodeSchema = z.string().length(8);

// Generate a random pairing code (8 characters alphanumeric)
function generatePairingCode(): string {
  // Use first 8 chars of a UUID (without dashes)
  return uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
}

// Get all connections for the current user (both as mentor and student)
router.get("/connections", isAuthenticated, (async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;

    // Get connections where user is the mentor
    const mentorConnections = await storage.getConnectionsByMentorId(userId);
    
    // Get connections where user is the student
    const studentConnections = await storage.getConnectionsByStudentId(userId);

    // For each connection, fetch the related user details
    const enrichedMentorConnections = await Promise.all(
      mentorConnections.map(async (connection) => {
        // Only fetch target user if studentId is not null
        const targetUser = connection.studentId ? await storage.getUser(connection.studentId) : null;
        return {
          ...connection,
          targetUser: targetUser ? {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role,
          } : null,
          role: "mentor"
        };
      })
    );

    const enrichedStudentConnections = await Promise.all(
      studentConnections.map(async (connection) => {
        const sourceUser = connection.mentorId ? await storage.getUser(connection.mentorId) : null;
        return {
          ...connection,
          sourceUser: sourceUser ? {
            id: sourceUser.id,
            name: sourceUser.name,
            email: sourceUser.email,
            role: sourceUser.role,
          } : null,
          role: "student"
        };
      })
    );

    // Combine both types of connections
    const allConnections = {
      asMentor: enrichedMentorConnections,
      asStudent: enrichedStudentConnections,
    };

    res.status(200).json(allConnections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
}) as RequestHandler);

// Get pending connection requests for a user
router.get("/connections/pending", isAuthenticated, (async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    
    // Get pending connections where user is the student
    const pendingConnections = await storage.getPendingConnectionsByStudentId(userId);
    
    // Enrich with mentor details
    const enrichedPendingConnections = await Promise.all(
      pendingConnections.map(async (connection) => {
        const mentorUser = connection.mentorId ? await storage.getUser(connection.mentorId) : null;
        return {
          ...connection,
          mentor: mentorUser ? {
            id: mentorUser.id,
            name: mentorUser.name,
            email: mentorUser.email,
            role: mentorUser.role,
          } : null,
        };
      })
    );
    
    res.status(200).json(enrichedPendingConnections);
  } catch (error) {
    console.error("Error fetching pending connections:", error);
    res.status(500).json({ message: "Failed to fetch pending connections" });
  }
}) as RequestHandler);

// Create a new connection with a pairing code
router.post("/connections/create", isAuthenticated, (async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const { connectionType, studentEmail } = req.body;
    
    // Validate the connection type
    if (!Object.keys(connectionTypes).includes(connectionType)) {
      return res.status(400).json({ message: "Invalid connection type" });
    }
    
    // Generate a random pairing code
    const connectionCode = generatePairingCode();
    
    // If studentEmail is provided, try to find that student
    let studentId: number | null = null;
    if (studentEmail) {
      const student = await storage.getUserByEmail(studentEmail);
      if (student) {
        studentId = student.id;
      } else {
        // Create an invitation for a non-registered user
        // (This would typically involve sending an email, but we'll just create the connection for now)
        return res.status(404).json({ 
          message: "Student not found with that email. Invite them to register first.",
          connectionCode 
        });
      }
    }
    
    // Create a new connection
    const newConnection = await storage.createConnection({
      mentorId: userId,
      studentId, // Will be null if no student found
      connectionType,
      status: studentId ? connectionStatuses.PENDING : connectionStatuses.PENDING,
      connectionCode,
    });
    
    res.status(201).json({ 
      message: "Connection created successfully",
      connection: newConnection,
      connectionCode
    });
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ message: "Failed to create connection" });
  }
}) as RequestHandler);

// Join a connection using a pairing code
router.post("/connections/join", isAuthenticated, (async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const { connectionCode } = req.body;
    
    // Validate the pairing code format
    try {
      pairingCodeSchema.parse(connectionCode);
    } catch (error) {
      return res.status(400).json({ message: "Invalid pairing code format" });
    }
    
    // Look up the connection by code
    const connection = await storage.getConnectionByCode(connectionCode);
    
    if (!connection) {
      return res.status(404).json({ message: "Connection not found with that code" });
    }
    
    if (connection.status === connectionStatuses.ACTIVE) {
      return res.status(409).json({ message: "This connection code has already been used" });
    }
    
    // Update the connection with the student id and set status to active
    const updatedConnection = await storage.updateConnection(connection.id, {
      studentId: userId,
      status: connectionStatuses.ACTIVE,
      connectionCode: null, // Clear the code once used
    });
    
    res.status(200).json({ 
      message: "Successfully joined connection",
      connection: updatedConnection
    });
  } catch (error) {
    console.error("Error joining connection:", error);
    res.status(500).json({ message: "Failed to join connection" });
  }
}) as RequestHandler);

// Respond to a connection request (accept or reject)
router.post("/connections/:connectionId/respond", isAuthenticated, (async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.connectionId);
    const { accept } = req.body;
    
    // Get the connection
    const connection = await storage.getConnection(connectionId);
    
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    
    // Make sure the user is the student for this connection
    if (connection.studentId !== userId) {
      return res.status(403).json({ message: "Not authorized to respond to this connection" });
    }
    
    // Update the connection status based on response
    const status = accept ? connectionStatuses.ACTIVE : connectionStatuses.REJECTED;
    const updatedConnection = await storage.updateConnection(connectionId, { status });
    
    res.status(200).json({ 
      message: accept ? "Connection accepted" : "Connection rejected",
      connection: updatedConnection 
    });
  } catch (error) {
    console.error("Error responding to connection:", error);
    res.status(500).json({ message: "Failed to respond to connection" });
  }
}) as RequestHandler);

// Delete a connection
router.delete("/connections/:connectionId", isAuthenticated, (async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.connectionId);
    
    // Get the connection
    const connection = await storage.getConnection(connectionId);
    
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    
    // Make sure the user is either the mentor or student for this connection
    if (connection.mentorId !== userId && connection.studentId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this connection" });
    }
    
    // Delete the connection
    await storage.deleteConnection(connectionId);
    
    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    console.error("Error deleting connection:", error);
    res.status(500).json({ message: "Failed to delete connection" });
  }
}) as RequestHandler);

export default router;