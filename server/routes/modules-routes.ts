import express, { RequestHandler, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { authenticateJWT, requireUser, AuthenticatedRequest } from "../auth/auth-middleware";

const router = express.Router();

// Create schema for validating module creation request
const createModuleSchema = z.object({
  pathwayId: z.number().int().positive({ message: "Valid pathway ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  order: z.number().int().nonnegative({ message: "Order must be a non-negative integer" })
});

// POST /api/modules - Create a new module for a pathway
router.post("/", authenticateJWT, requireUser, (async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Validate the request body
    const validatedData = createModuleSchema.parse(req.body);
    
    // Extract user ID from the authenticated request
    const userId = req.user.id;
    
    // First, verify this user owns the pathway
    const pathway = await storage.getCustomPathway(validatedData.pathwayId);
    
    if (!pathway) {
      return res.status(404).json({ message: "Pathway not found" });
    }
    
    if (pathway.creatorId !== userId) {
      return res.status(403).json({ message: "You do not have permission to modify this pathway" });
    }
    
    // Create the module with the validated data
    const newModule = await storage.createCustomPathwayModule({
      pathwayId: validatedData.pathwayId,
      title: validatedData.title,
      description: "", // Optional field
      content: validatedData.content,
      order: validatedData.order,
      estimatedDuration: null, // Optional field
      skillLevel: "foundational", // Default value
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Return the created module
    res.status(201).json(newModule);
  } catch (error) {
    console.error("Error creating module:", error);
    
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid input data", 
        errors: error.errors 
      });
    }
    
    // Generic error
    res.status(500).json({ message: "Failed to create module" });
  }
}) as RequestHandler);

// GET /api/modules/:pathwayId - Get all modules for a specific pathway
router.get("/:pathwayId", authenticateJWT, requireUser, (async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id;
    
    // Validate and parse the pathwayId parameter
    const pathwayId = parseInt(req.params.pathwayId);
    
    if (isNaN(pathwayId)) {
      return res.status(400).json({ message: "Invalid pathway ID" });
    }
    
    // First, verify this user has access to the pathway
    const pathway = await storage.getCustomPathway(pathwayId);
    
    if (!pathway) {
      return res.status(404).json({ message: "Pathway not found" });
    }
    
    // Allow access if the user is the creator or if the pathway is public
    if (pathway.creatorId !== userId && !pathway.isPublic) {
      return res.status(403).json({ message: "You do not have permission to access this pathway" });
    }
    
    // Fetch all modules for this pathway
    const modules = await storage.getCustomPathwayModulesByPathway(pathwayId);
    
    // Sort by order field (ascending)
    modules.sort((a, b) => a.order - b.order);
    
    // Return the modules list
    res.status(200).json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Failed to fetch modules" });
  }
}) as RequestHandler);

// Add more module-related routes here...

export default router;