import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { storage } from "../storage";

// Extended Request type with user property
interface AuthRequest extends Request {
  user: any;
  isAuthenticated(): boolean;
}
import { 
  connectionTypes, 
  insertUserConnectionSchema,
  insertCustomPathwaySchema,
  insertCustomPathwayModuleSchema,
  insertAssignedPathwaySchema,
  insertProgressNoteSchema
} from "@shared/schema";
import { randomBytes } from "crypto";

// Authentication middleware
function isAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// Role check middleware
function hasRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (roles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
  };
}

export default function registerMentorshipRoutes(router: Router) {
  
  // ==========================================
  // Connection Management Routes
  // ==========================================
  
  // Generate a connection code for a student
  router.post("/api/connections/generate-code", isAuthenticated, async (req, res) => {
    try {
      const mentorId = req.user.id;
      const { studentName } = req.body;
      
      // Generate a 6-digit alphanumeric code
      const connectionCode = randomBytes(3).toString("hex").toUpperCase();
      
      // Create a pending connection with this code
      const connection = await storage.createUserConnection({
        mentorId,
        studentId: 0, // Will be filled when a student uses the code
        connectionType: req.body.connectionType || connectionTypes.PARENT_CHILD,
        status: "pending",
        connectionCode,
        accessLevel: req.body.accessLevel || "standard",
      });
      
      res.status(200).json({ 
        connectionCode,
        expiresIn: "24 hours"
      });
    } catch (error) {
      console.error("Error generating connection code:", error);
      res.status(500).json({ message: "Failed to generate connection code" });
    }
  });
  
  // Verify and activate a connection using a code
  router.post("/api/connections/verify-code", isAuthenticated, async (req, res) => {
    try {
      const studentId = req.user.id;
      const { connectionCode } = req.body;
      
      if (!connectionCode) {
        return res.status(400).json({ message: "Connection code is required" });
      }
      
      // Look up the connection by code
      const connection = await storage.getUserConnectionByCode(connectionCode);
      
      if (!connection) {
        return res.status(404).json({ message: "Invalid connection code" });
      }
      
      if (connection.status !== "pending") {
        return res.status(400).json({ message: "This code has already been used" });
      }
      
      // Update the connection with the student's ID and activate it
      const updatedConnection = await storage.updateUserConnection(connection.id, {
        studentId,
        status: "active",
        connectionCode: null, // Clear the code after use
      });
      
      res.status(200).json({ 
        connection: updatedConnection,
        message: "Connection established successfully"
      });
    } catch (error) {
      console.error("Error verifying connection code:", error);
      res.status(500).json({ message: "Failed to verify connection code" });
    }
  });
  
  // Get all connections for a user (either as mentor or student)
  router.get("/api/connections", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const role = req.query.role as string || "mentor";
      
      if (role !== "mentor" && role !== "student") {
        return res.status(400).json({ message: "Invalid role parameter" });
      }
      
      const connections = await storage.getUserConnections(userId, role as 'mentor' | 'student');
      
      // If getting connections as a mentor, include student details
      // If getting connections as a student, include mentor details
      const enhancedConnections = await Promise.all(connections.map(async (conn) => {
        const otherUserId = role === "mentor" ? conn.studentId : conn.mentorId;
        const otherUser = await storage.getUser(otherUserId);
        
        return {
          ...conn,
          otherUser: otherUser ? {
            id: otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
            role: otherUser.role,
          } : null
        };
      }));
      
      res.status(200).json(enhancedConnections);
    } catch (error) {
      console.error("Error getting connections:", error);
      res.status(500).json({ message: "Failed to get connections" });
    }
  });
  
  // Update a connection (e.g., change access level or status)
  router.put("/api/connections/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const connectionId = parseInt(req.params.id);
      
      // Check if the connection exists and the user is authorized to modify it
      const connection = await storage.getUserConnections(userId, "mentor")
        .then(conns => conns.find(c => c.id === connectionId)) || 
        await storage.getUserConnections(userId, "student")
          .then(conns => conns.find(c => c.id === connectionId));
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found or you're not authorized" });
      }
      
      // Update the connection
      const updatedConnection = await storage.updateUserConnection(connectionId, {
        status: req.body.status,
        accessLevel: req.body.accessLevel
      });
      
      res.status(200).json(updatedConnection);
    } catch (error) {
      console.error("Error updating connection:", error);
      res.status(500).json({ message: "Failed to update connection" });
    }
  });
  
  // Delete a connection
  router.delete("/api/connections/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const connectionId = parseInt(req.params.id);
      
      // Check if the connection exists and the user is authorized to delete it
      const connection = await storage.getUserConnections(userId, "mentor")
        .then(conns => conns.find(c => c.id === connectionId)) || 
        await storage.getUserConnections(userId, "student")
          .then(conns => conns.find(c => c.id === connectionId));
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found or you're not authorized" });
      }
      
      // Delete the connection
      await storage.deleteUserConnection(connectionId);
      
      res.status(200).json({ message: "Connection deleted successfully" });
    } catch (error) {
      console.error("Error deleting connection:", error);
      res.status(500).json({ message: "Failed to delete connection" });
    }
  });
  
  // ==========================================
  // Custom Learning Pathway Routes
  // ==========================================
  
  // Create a new custom pathway
  router.post("/api/pathways", isAuthenticated, async (req, res) => {
    try {
      const creatorId = req.user.id;
      
      // Validate the request body
      const pathwayData = insertCustomPathwaySchema.parse({
        ...req.body,
        creatorId
      });
      
      // Create the pathway
      const newPathway = await storage.createCustomPathway(pathwayData);
      
      res.status(201).json(newPathway);
    } catch (error) {
      console.error("Error creating custom pathway:", error);
      res.status(500).json({ message: "Failed to create custom pathway" });
    }
  });
  
  // Get all pathways created by the user
  router.get("/api/pathways", isAuthenticated, async (req, res) => {
    try {
      const creatorId = req.user.id;
      const pathways = await storage.getCustomPathwaysByCreator(creatorId);
      
      res.status(200).json(pathways);
    } catch (error) {
      console.error("Error getting custom pathways:", error);
      res.status(500).json({ message: "Failed to get custom pathways" });
    }
  });
  
  // Get a specific pathway by ID
  router.get("/api/pathways/:id", isAuthenticated, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getCustomPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user has access to this pathway
      if (pathway.creatorId !== req.user.id && !pathway.isPublic) {
        // Check if the user is a student with this pathway assigned to them
        const assignments = await storage.getAssignedPathways(req.user.id);
        const isAssigned = assignments.some(a => a.pathwayId === pathwayId);
        
        if (!isAssigned) {
          return res.status(403).json({ message: "You don't have access to this pathway" });
        }
      }
      
      // Get the modules for this pathway
      const modules = await storage.getCustomPathwayModules(pathwayId);
      
      res.status(200).json({
        ...pathway,
        modules
      });
    } catch (error) {
      console.error("Error getting pathway:", error);
      res.status(500).json({ message: "Failed to get pathway" });
    }
  });
  
  // Update a pathway
  router.put("/api/pathways/:id", isAuthenticated, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getCustomPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user is the creator
      if (pathway.creatorId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this pathway" });
      }
      
      // Update the pathway
      const updatedPathway = await storage.updateCustomPathway(pathwayId, req.body);
      
      res.status(200).json(updatedPathway);
    } catch (error) {
      console.error("Error updating pathway:", error);
      res.status(500).json({ message: "Failed to update pathway" });
    }
  });
  
  // Delete a pathway
  router.delete("/api/pathways/:id", isAuthenticated, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getCustomPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user is the creator
      if (pathway.creatorId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this pathway" });
      }
      
      // Delete the pathway
      await storage.deleteCustomPathway(pathwayId);
      
      res.status(200).json({ message: "Pathway deleted successfully" });
    } catch (error) {
      console.error("Error deleting pathway:", error);
      res.status(500).json({ message: "Failed to delete pathway" });
    }
  });
  
  // ==========================================
  // Pathway Module Routes
  // ==========================================
  
  // Add a module to a pathway
  router.post("/api/pathways/:id/modules", isAuthenticated, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getCustomPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user is the creator
      if (pathway.creatorId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to add modules to this pathway" });
      }
      
      // Get current modules to determine the next order value
      const existingModules = await storage.getCustomPathwayModules(pathwayId);
      const nextOrder = existingModules.length > 0 
        ? Math.max(...existingModules.map(m => m.order)) + 1 
        : 1;
      
      // Create the module
      const moduleData = insertCustomPathwayModuleSchema.parse({
        ...req.body,
        pathwayId,
        order: req.body.order || nextOrder
      });
      
      const newModule = await storage.createCustomPathwayModule(moduleData);
      
      res.status(201).json(newModule);
    } catch (error) {
      console.error("Error adding module:", error);
      res.status(500).json({ message: "Failed to add module" });
    }
  });
  
  // Update a module
  router.put("/api/modules/:id", isAuthenticated, async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.customPathwayModules.get(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Get the pathway to check ownership
      const pathway = await storage.getCustomPathway(module.pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user is the creator of the pathway
      if (pathway.creatorId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this module" });
      }
      
      // Update the module
      const updatedModule = await storage.updateCustomPathwayModule(moduleId, req.body);
      
      res.status(200).json(updatedModule);
    } catch (error) {
      console.error("Error updating module:", error);
      res.status(500).json({ message: "Failed to update module" });
    }
  });
  
  // Delete a module
  router.delete("/api/modules/:id", isAuthenticated, async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.customPathwayModules.get(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Get the pathway to check ownership
      const pathway = await storage.getCustomPathway(module.pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user is the creator of the pathway
      if (pathway.creatorId !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this module" });
      }
      
      // Delete the module
      await storage.deleteCustomPathwayModule(moduleId);
      
      res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(500).json({ message: "Failed to delete module" });
    }
  });
  
  // ==========================================
  // Pathway Assignment Routes
  // ==========================================
  
  // Assign a pathway to a student
  router.post("/api/pathways/:id/assign", isAuthenticated, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.id);
      const assignerId = req.user.id;
      const { studentId, dueDate } = req.body;
      
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
      }
      
      // Check if the pathway exists
      const pathway = await storage.getCustomPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      // Check if user is the creator or has permission to assign
      if (pathway.creatorId !== assignerId && !pathway.isPublic) {
        return res.status(403).json({ message: "You are not authorized to assign this pathway" });
      }
      
      // Check if the student is connected to the assigner
      const connections = await storage.getUserConnections(assignerId, "mentor");
      const isConnected = connections.some(conn => 
        conn.studentId === studentId && conn.status === "active"
      );
      
      if (!isConnected) {
        return res.status(403).json({ message: "You must be connected to the student to assign pathways" });
      }
      
      // Create the assignment
      const assignment = await storage.assignPathway({
        pathwayId,
        studentId,
        assignedBy: assignerId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: "assigned"
      });
      
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error assigning pathway:", error);
      res.status(500).json({ message: "Failed to assign pathway" });
    }
  });
  
  // Get assignments for a student
  router.get("/api/students/:id/assignments", isAuthenticated, async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // If requesting assignments for another user, check permission
      if (studentId !== userId) {
        // Check if the user is connected to the student
        const connections = await storage.getUserConnections(userId, "mentor");
        const isConnected = connections.some(conn => 
          conn.studentId === studentId && conn.status === "active"
        );
        
        if (!isConnected) {
          return res.status(403).json({ message: "You don't have permission to view this student's assignments" });
        }
      }
      
      // Get assignments
      const assignments = await storage.getAssignedPathways(studentId);
      
      // Enrich with pathway data
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const pathway = await storage.getCustomPathway(assignment.pathwayId);
        return {
          ...assignment,
          pathway: pathway ? {
            id: pathway.id,
            title: pathway.title,
            description: pathway.description,
            category: pathway.category
          } : null
        };
      }));
      
      res.status(200).json(enrichedAssignments);
    } catch (error) {
      console.error("Error getting assignments:", error);
      res.status(500).json({ message: "Failed to get assignments" });
    }
  });
  
  // Update assignment status/progress
  router.put("/api/assignments/:id", isAuthenticated, async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      const userId = req.user.id;
      const { status, progress } = req.body;
      
      // Get the assignment
      const assignments = await storage.getAssignedPathways(userId);
      const assignment = assignments.find(a => a.id === assignmentId);
      
      // If user is the student, they can only update progress
      if (assignment && assignment.studentId === userId) {
        const updatedAssignment = await storage.updateAssignedPathwayStatus(
          assignmentId, 
          status || assignment.status,
          progress
        );
        return res.status(200).json(updatedAssignment);
      }
      
      // If user is the assigner, they can update status and progress
      const assignedByUser = await storage.getAssignedPathwaysByAssigner(userId);
      const isAssigner = assignedByUser.some(a => a.id === assignmentId);
      
      if (isAssigner) {
        const updatedAssignment = await storage.updateAssignedPathwayStatus(
          assignmentId, 
          status || assignment?.status || "assigned",
          progress
        );
        return res.status(200).json(updatedAssignment);
      }
      
      return res.status(403).json({ message: "You are not authorized to update this assignment" });
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ message: "Failed to update assignment" });
    }
  });
  
  // ==========================================
  // Progress Notes Routes
  // ==========================================
  
  // Add a progress note for a student
  router.post("/api/students/:id/notes", isAuthenticated, async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const authorId = req.user.id;
      
      // Check if the author is connected to the student
      const connections = await storage.getUserConnections(authorId, "mentor");
      const isConnected = connections.some(conn => 
        conn.studentId === studentId && conn.status === "active"
      );
      
      if (!isConnected) {
        return res.status(403).json({ message: "You must be connected to the student to add progress notes" });
      }
      
      // Create the note
      const note = await storage.addProgressNote({
        studentId,
        authorId,
        pathwayId: req.body.pathwayId,
        moduleId: req.body.moduleId,
        note: req.body.note,
        visibility: req.body.visibility || "mentor_only"
      });
      
      res.status(201).json(note);
    } catch (error) {
      console.error("Error adding progress note:", error);
      res.status(500).json({ message: "Failed to add progress note" });
    }
  });
  
  // Get progress notes for a student
  router.get("/api/students/:id/notes", isAuthenticated, async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const userId = req.user.id;
      const pathwayId = req.query.pathwayId ? parseInt(req.query.pathwayId as string) : undefined;
      
      // If requesting notes for another user, check permission
      if (studentId !== userId) {
        // Check if the user is connected to the student
        const connections = await storage.getUserConnections(userId, "mentor");
        const isConnected = connections.some(conn => 
          conn.studentId === studentId && conn.status === "active"
        );
        
        if (!isConnected) {
          return res.status(403).json({ message: "You don't have permission to view this student's notes" });
        }
        
        // Mentors can see all notes
        const notes = await storage.getProgressNotes(studentId, pathwayId);
        return res.status(200).json(notes);
      }
      
      // Students can only see notes marked as visible to them
      const allNotes = await storage.getProgressNotes(studentId, pathwayId);
      const visibleNotes = allNotes.filter(note => note.visibility === "student_visible");
      
      res.status(200).json(visibleNotes);
    } catch (error) {
      console.error("Error getting progress notes:", error);
      res.status(500).json({ message: "Failed to get progress notes" });
    }
  });
}