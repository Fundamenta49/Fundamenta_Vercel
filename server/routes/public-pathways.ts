import express, { Request, Response } from 'express';
import { db } from '../db';
import { authenticateJWT, requireUser, AuthenticatedRequest } from '../auth/auth-middleware';
import { eq, and, desc } from 'drizzle-orm';
import { customPathways as pathways, assignedPathways as userPathways } from '../../shared/schema';

const router = express.Router();

// Get all public pathways
router.get('/api/pathways/public', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Fetch public pathways
    const publicPathways = await db
      .select()
      .from(pathways)
      .where(eq(pathways.isPublic, true))
      .orderBy(desc(pathways.createdAt));

    // Include sample modules for each pathway
    const enhancedPathways = await Promise.all(
      publicPathways.map(async (pathway) => {
        // Get pathway modules
        const modules = await db
          .execute(
            `SELECT id, title FROM modules WHERE pathway_id = $1 ORDER BY position LIMIT 10`,
            [pathway.id]
          );

        // Get enrollment count
        const [enrollmentCount] = await db
          .execute(
            `SELECT COUNT(*) as count FROM user_pathways WHERE pathway_id = $1`,
            [pathway.id]
          );

        // Calculate completion rate (simplified example)
        const [completionData] = await db
          .execute(
            `SELECT AVG(progress) as avg_completion FROM user_pathways WHERE pathway_id = $1 AND progress > 0`,
            [pathway.id]
          );

        // Extract tags from metadata or provide defaults
        const tags = pathway.metadata?.tags || 
          pathway.keywords?.split(',').map(p => p.trim()) || 
          [pathway.category];

        // Convert module data to TypeScript friendly format
        const moduleList = modules.map(module => ({
          id: module.id,
          title: module.title
        }));

        // Author information (defaults to "Fundamenta Team" if not specified)
        const authorId = pathway.createdBy || 'system';
        const authorName = pathway.creatorName || 'Fundamenta Team';
        const authorRole = pathway.metadata?.authorRole || 'Instructor';

        return {
          ...pathway,
          modules: moduleList,
          enrollmentCount: parseInt(enrollmentCount?.count || '0'),
          completionRate: Math.round(parseFloat(completionData?.avg_completion || '0')),
          estimatedHours: pathway.metadata?.estimatedHours || 
            (pathway.difficulty === 'beginner' ? 2 : pathway.difficulty === 'intermediate' ? 4 : 6),
          tags: Array.isArray(tags) ? tags : [tags],
          rating: pathway.metadata?.rating || 4.5,
          author: {
            id: authorId,
            name: authorName,
            role: authorRole
          }
        };
      })
    );

    res.json(enhancedPathways);
  } catch (error) {
    console.error('Error fetching public pathways:', error);
    res.status(500).json({ error: 'Failed to fetch public pathways' });
  }
});

// Save a public pathway to user's collection
router.post('/api/pathways/save', requireUser, async (req: AuthenticatedRequest, res: Response) => {
  const { pathwayId } = req.body;
  const userId = req.user?.id;

  if (!pathwayId) {
    return res.status(400).json({ error: 'Pathway ID is required' });
  }

  try {
    // Check if the pathway exists and is public
    const [pathway] = await db
      .select()
      .from(pathways)
      .where(and(
        eq(pathways.id, pathwayId),
        eq(pathways.isPublic, true)
      ));

    if (!pathway) {
      return res.status(404).json({ error: 'Public pathway not found' });
    }

    // Check if user already has this pathway
    const [existingUserPathway] = await db
      .select()
      .from(userPathways)
      .where(and(
        eq(userPathways.userId, userId),
        eq(userPathways.pathwayId, pathwayId)
      ));

    if (existingUserPathway) {
      return res.status(200).json({ message: 'Pathway already in your collection' });
    }

    // Add pathway to user's collection
    await db.insert(userPathways).values({
      userId,
      pathwayId,
      progress: 0,
      lastAccessedAt: new Date(),
      status: 'active'
    });

    res.status(201).json({ message: 'Pathway added to your collection' });
  } catch (error) {
    console.error('Error saving pathway:', error);
    res.status(500).json({ error: 'Failed to save pathway' });
  }
});

export default router;