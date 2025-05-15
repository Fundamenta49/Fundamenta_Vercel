import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware';
import { customPathways, customPathwayModules, users } from '../../shared/schema';
import { and, eq, asc, desc, isNull, isNotNull, sql } from 'drizzle-orm';

const router = Router();

// Get public pathways
router.get('/api/pathways/public', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Filter for public pathways only
    const publicPathways = await db.select({
      id: customPathways.id,
      title: customPathways.title,
      description: customPathways.description,
      category: customPathways.category,
      isTemplate: customPathways.isTemplate,
      creatorId: customPathways.creatorId,
      creatorName: users.name,
      createdAt: customPathways.createdAt,
      updatedAt: customPathways.updatedAt,
    })
    .from(customPathways)
    .leftJoin(users, eq(customPathways.creatorId, users.id))
    .where(eq(customPathways.isPublic, true))
    .orderBy(desc(customPathways.createdAt));

    // Get all modules for these pathways
    const pathwayIds = publicPathways.map(p => p.id);
    
    if (pathwayIds.length === 0) {
      return res.json([]);
    }
    
    const modules = await db.select()
      .from(customPathwayModules)
      .where(sql`${customPathwayModules.pathwayId} IN ${pathwayIds}`)
      .orderBy(asc(customPathwayModules.order));
      
    // Group modules by pathway ID
    const modulesByPathway: Record<number, any[]> = {};
    modules.forEach(module => {
      if (!modulesByPathway[module.pathwayId]) {
        modulesByPathway[module.pathwayId] = [];
      }
      modulesByPathway[module.pathwayId].push(module);
    });
    
    // Attach modules to their respective pathways
    const pathwaysWithModules = publicPathways.map(pathway => ({
      ...pathway,
      modules: modulesByPathway[pathway.id] || [],
    }));
    
    res.json(pathwaysWithModules);
  } catch (error) {
    console.error('Error fetching public pathways:', error);
    res.status(500).json({ message: 'Failed to fetch public pathways' });
  }
});

// Save public pathway to my path
router.post('/api/pathways/save', requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { pathwayId } = req.body;
    const userId = req.user!.id;
    
    // Verify the pathway exists and is public
    const [pathway] = await db.select()
      .from(customPathways)
      .where(and(
        eq(customPathways.id, pathwayId),
        eq(customPathways.isPublic, true)
      ));
    
    if (!pathway) {
      return res.status(404).json({ message: 'Pathway not found or not public' });
    }
    
    // Create a new assignment for the current user
    const [assignment] = await db.insert({
      pathwayId: pathwayId,
      studentId: userId,
      assignedBy: userId, // Self-assigned
      status: 'assigned',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
    
    res.status(200).json({ 
      message: 'Pathway saved successfully',
      assignment 
    });
  } catch (error) {
    console.error('Error saving pathway:', error);
    res.status(500).json({ message: 'Failed to save pathway' });
  }
});

export default router;