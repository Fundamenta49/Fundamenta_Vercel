import { Router } from 'express';
import { z } from 'zod';
import fitnessApiService from '../services/fitness-api-service';

const router = Router();

// Get a list of exercises based on filters
router.get('/exercises', async (req, res) => {
  try {
    const querySchema = z.object({
      muscleGroup: z.string().optional(),
      equipment: z.string().optional(),
      difficulty: z.string().optional(),
      category: z.string().optional(),
      keyword: z.string().optional(),
      limit: z.string().transform(val => parseInt(val)).optional(),
    });

    const query = querySchema.parse(req.query);
    
    const exercises = await fitnessApiService.getExercises({
      muscleGroup: query.muscleGroup,
      equipment: query.equipment,
      difficulty: query.difficulty,
      category: query.category,
      keyword: query.keyword,
      limit: query.limit,
    });

    res.json({ success: true, exercises });
  } catch (error) {
    console.error('Error in /api/fitness/exercises:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch exercises'
    });
  }
});

// Get available workout categories
router.get('/categories', async (_req, res) => {
  try {
    const categories = await fitnessApiService.getWorkoutCategories();
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error in /api/fitness/categories:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch workout categories'
    });
  }
});

// Get workout plans for a specific category
router.get('/workout-plans/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { level } = req.query;
    
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category parameter is required'
      });
    }

    const workoutPlans = await fitnessApiService.getWorkoutPlans(
      category, 
      level as string | undefined
    );
    
    res.json({ success: true, workoutPlans });
  } catch (error) {
    console.error('Error in /api/fitness/workout-plans:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch workout plans'
    });
  }
});

// Get details for a specific exercise
router.get('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Exercise ID is required'
      });
    }

    const exercise = await fitnessApiService.getExerciseDetails(id);
    
    if (!exercise) {
      return res.status(404).json({ 
        success: false, 
        error: 'Exercise not found'
      });
    }
    
    res.json({ success: true, exercise });
  } catch (error) {
    console.error('Error in /api/fitness/exercises/:id:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch exercise details'
    });
  }
});

// Get exercises by specific category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { limit } = req.query;
    
    if (!categoryName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category name is required'
      });
    }

    const limitNumber = limit ? parseInt(limit as string) : 20;
    const exercises = await fitnessApiService.getExercisesByCategory(categoryName, limitNumber);
    
    res.json({ success: true, exercises });
  } catch (error) {
    console.error('Error in /api/fitness/category/:categoryName:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch exercises for category'
    });
  }
});

// Get exercises by muscle group
router.get('/muscle/:muscleName', async (req, res) => {
  try {
    const { muscleName } = req.params;
    const { limit } = req.query;
    
    if (!muscleName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Muscle name is required'
      });
    }

    const limitNumber = limit ? parseInt(limit as string) : 20;
    const exercises = await fitnessApiService.getExercisesByMuscleGroup(muscleName, limitNumber);
    
    res.json({ success: true, exercises });
  } catch (error) {
    console.error('Error in /api/fitness/muscle/:muscleName:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch exercises for muscle group'
    });
  }
});

// Get beginner-friendly exercises
router.get('/beginner', async (req, res) => {
  try {
    const { limit } = req.query;
    const limitNumber = limit ? parseInt(limit as string) : 20;
    
    const exercises = await fitnessApiService.getBeginnerExercises(limitNumber);
    
    res.json({ success: true, exercises });
  } catch (error) {
    console.error('Error in /api/fitness/beginner:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch beginner exercises'
    });
  }
});

export default router;