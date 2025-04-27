import { Router, Request, Response } from 'express';
import { db } from '../db';
import { isAuthenticated } from '../auth/auth-middleware';
import { customPathways, customPathwayModules } from '../../shared/schema';
import { and, eq, asc } from 'drizzle-orm';

const router = Router();

/**
 * Get all pathways for the current user
 */
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get all pathways created by this user
    const pathways = await db.query.customPathways.findMany({
      where: eq(customPathways.creatorId, userId),
      orderBy: [
        asc(customPathways.createdAt),
      ],
      with: {
        modules: {
          orderBy: [asc(customPathwayModules.order)]
        }
      }
    });
    
    res.json(pathways);
  } catch (error) {
    console.error('Error fetching pathways:', error);
    res.status(500).json({ error: 'Failed to fetch pathways' });
  }
});

/**
 * Create a new custom pathway
 */
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { title, description, category, isPublic } = req.body;
    const userId = req.user!.id;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Create the new pathway
    const result = await db.insert(customPathways).values({
      creatorId: userId,
      title,
      description,
      category,
      isPublic: isPublic || false,
    }).returning();
    
    const newPathway = result[0];
    
    res.status(201).json(newPathway);
  } catch (error) {
    console.error('Error creating pathway:', error);
    res.status(500).json({ error: 'Failed to create pathway' });
  }
});

/**
 * Get a specific pathway by ID
 */
router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const pathwayId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(pathwayId)) {
      return res.status(400).json({ error: 'Invalid pathway ID' });
    }
    
    const pathway = await db.query.customPathways.findFirst({
      where: and(
        eq(customPathways.id, pathwayId),
        eq(customPathways.creatorId, userId)
      ),
      with: {
        modules: {
          orderBy: [asc(customPathwayModules.order)]
        }
      }
    });
    
    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found' });
    }
    
    res.json(pathway);
  } catch (error) {
    console.error('Error fetching pathway:', error);
    res.status(500).json({ error: 'Failed to fetch pathway' });
  }
});

/**
 * Update a pathway
 */
router.patch('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const pathwayId = parseInt(req.params.id);
    const userId = req.user!.id;
    const updates = req.body;
    
    if (isNaN(pathwayId)) {
      return res.status(400).json({ error: 'Invalid pathway ID' });
    }
    
    // Check that pathway exists and belongs to this user
    const existingPathway = await db.query.customPathways.findFirst({
      where: and(
        eq(customPathways.id, pathwayId),
        eq(customPathways.creatorId, userId)
      )
    });
    
    if (!existingPathway) {
      return res.status(404).json({ error: 'Pathway not found or you do not have permission to edit it' });
    }
    
    // Update the pathway
    const result = await db.update(customPathways)
      .set({
        title: updates.title !== undefined ? updates.title : existingPathway.title,
        description: updates.description !== undefined ? updates.description : existingPathway.description,
        category: updates.category !== undefined ? updates.category : existingPathway.category,
        isPublic: updates.isPublic !== undefined ? updates.isPublic : existingPathway.isPublic,
        updatedAt: new Date()
      })
      .where(eq(customPathways.id, pathwayId))
      .returning();
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating pathway:', error);
    res.status(500).json({ error: 'Failed to update pathway' });
  }
});

/**
 * Delete a pathway
 */
router.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const pathwayId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(pathwayId)) {
      return res.status(400).json({ error: 'Invalid pathway ID' });
    }
    
    // Check that pathway exists and belongs to this user
    const existingPathway = await db.query.customPathways.findFirst({
      where: and(
        eq(customPathways.id, pathwayId),
        eq(customPathways.creatorId, userId)
      )
    });
    
    if (!existingPathway) {
      return res.status(404).json({ error: 'Pathway not found or you do not have permission to delete it' });
    }
    
    // First delete all modules associated with this pathway
    await db.delete(customPathwayModules)
      .where(eq(customPathwayModules.pathwayId, pathwayId));
    
    // Then delete the pathway itself
    await db.delete(customPathways)
      .where(eq(customPathways.id, pathwayId));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting pathway:', error);
    res.status(500).json({ error: 'Failed to delete pathway' });
  }
});

/**
 * Get all modules for a pathway
 */
router.get('/:id/modules', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const pathwayId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(pathwayId)) {
      return res.status(400).json({ error: 'Invalid pathway ID' });
    }
    
    // Check that pathway exists and belongs to this user
    const pathway = await db.query.customPathways.findFirst({
      where: and(
        eq(customPathways.id, pathwayId),
        eq(customPathways.creatorId, userId)
      )
    });
    
    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found or you do not have permission to access it' });
    }
    
    // Get all modules for this pathway
    const modules = await db.query.customPathwayModules.findMany({
      where: eq(customPathwayModules.pathwayId, pathwayId),
      orderBy: [asc(customPathwayModules.order)]
    });
    
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

/**
 * Create a new module for a pathway
 */
router.post('/:id/modules', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const pathwayId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { title, description, content, type, order, estimatedDuration, skillLevel } = req.body;
    
    if (isNaN(pathwayId)) {
      return res.status(400).json({ error: 'Invalid pathway ID' });
    }
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Check that pathway exists and belongs to this user
    const pathway = await db.query.customPathways.findFirst({
      where: and(
        eq(customPathways.id, pathwayId),
        eq(customPathways.creatorId, userId)
      )
    });
    
    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found or you do not have permission to modify it' });
    }
    
    // Get the current count of modules to determine default order if not provided
    const moduleCount = await db.select({ count: customPathwayModules }).from(customPathwayModules);
    
    // Create the new module
    const result = await db.insert(customPathwayModules).values({
      pathwayId,
      title,
      description,
      content,
      type,
      order: order !== undefined ? order : moduleCount.length,
      estimatedDuration,
      skillLevel
    }).returning();
    
    const newModule = result[0];
    
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
});

export default router;