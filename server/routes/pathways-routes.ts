import express, { RequestHandler, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { authenticateJWT, requireUser, AuthenticatedRequest } from "../auth/auth-middleware";
import { createInsertSchema } from "drizzle-zod";
import { customPathways } from "@shared/schema";

const router = express.Router();

// Create schema for validating pathway creation request
const createPathwaySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  category: z.string().min(1, { message: "Category is required" }),
  isPublic: z.boolean().default(false)
});

// POST /api/pathways - Create a new learning pathway
router.post("/", authenticateJWT, requireUser, (async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Validate the request body
    const validatedData = createPathwaySchema.parse(req.body);
    
    // Extract user ID from the authenticated request
    const userId = req.user.id;
    
    // Create the pathway with the validated data
    const newPathway = await storage.createCustomPathway({
      ...validatedData,
      creatorId: userId,
      isTemplate: false, // Default value
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Return the created pathway
    res.status(201).json(newPathway);
  } catch (error) {
    console.error("Error creating pathway:", error);
    
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid input data", 
        errors: error.errors 
      });
    }
    
    // Generic error
    res.status(500).json({ message: "Failed to create pathway" });
  }
}) as RequestHandler);

// GET /api/pathways - Get all pathways for the current user
router.get("/", authenticateJWT, requireUser, (async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id;
    
    // Fetch pathways created by this user
    const userPathways = await storage.getCustomPathwaysByCreator(userId);
    
    // Sort by creation date (most recent first)
    userPathways.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Return the pathways list
    res.status(200).json(userPathways);
  } catch (error) {
    console.error("Error fetching pathways:", error);
    res.status(500).json({ message: "Failed to fetch pathways" });
  }
}) as RequestHandler);

// Add more pathway-related routes here...

export default router;