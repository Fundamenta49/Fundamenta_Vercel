import { Router } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validation schemas
const generateWorkoutSchema = z.object({
  activityType: z.string(),
  activityProfile: z.record(z.any()),
  fitnessProfile: z.record(z.any()).optional(),
});

const recommendationsSchema = z.object({
  activityType: z.string(),
  activityProfile: z.record(z.any()),
  fitnessProfile: z.record(z.any()).optional(),
  count: z.number().min(1).max(5).default(3),
});

const saveWorkoutSchema = z.object({
  workout: z.record(z.any()),
});

// Get OpenAI model based on environment
const getOpenAIModel = () => {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  return 'gpt-4o';
};

// Endpoint to generate a personalized workout
router.post('/generate', async (req, res) => {
  try {
    // Validate request body
    const { activityType, activityProfile, fitnessProfile } = generateWorkoutSchema.parse(req.body);
    
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'OpenAI API key is not configured'
      });
    }
    
    // Create system message with instructions for workout generation
    const systemMessage = `You are an AI fitness coach specialized in creating personalized workouts. 
    Your task is to create a detailed, safe, and effective workout plan based on the user's activity type and profile information.
    The workout should be tailored to their experience level, goals, preferences, and any injury considerations.
    For each workout, include:
    - A catchy, motivating title
    - A brief description explaining benefits and focus
    - Appropriate duration based on their available time
    - Equipment that matches their preferences
    - Difficulty level matching their experience
    - Relevant tags for categorization
    - Activity-specific details like exercises, poses, segments, etc.
    
    Respond in a structured JSON format without any explanations. Use this schema:
    {
      "workout": {
        "id": "unique-string",
        "title": "Workout Title",
        "description": "Brief description",
        "duration": number-of-minutes,
        "difficultyLevel": "beginner/intermediate/advanced",
        "equipmentNeeded": ["item1", "item2"],
        "tags": ["tag1", "tag2"],
        "createdAt": "current-date",
        // Activity-specific fields will vary based on activity type
      }
    }`;
    
    // Creating a comprehensive user message that includes all profile details
    let userMessage = `Please create a personalized ${activityType} workout for me. 
    
    My ${activityType} profile:
    ${JSON.stringify(activityProfile, null, 2)}
    `;
    
    // Add general fitness profile if available
    if (fitnessProfile) {
      userMessage += `\n\nMy general fitness profile:
      ${JSON.stringify(fitnessProfile, null, 2)}
      `;
    }
    
    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }
    
    const parsedResponse = JSON.parse(content);
    
    // Generate a unique ID if one wasn't provided
    if (parsedResponse.workout && !parsedResponse.workout.id) {
      parsedResponse.workout.id = crypto.randomUUID();
    }
    
    // Set creation date if not provided
    if (parsedResponse.workout && !parsedResponse.workout.createdAt) {
      parsedResponse.workout.createdAt = new Date().toISOString();
    }
    
    // Return the workout
    return res.json({
      success: true,
      workout: parsedResponse.workout
    });
    
  } catch (error) {
    console.error('Error generating workout:', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Endpoint to get workout recommendations
router.post('/recommendations', async (req, res) => {
  try {
    // Validate request body
    const { activityType, activityProfile, fitnessProfile, count } = recommendationsSchema.parse(req.body);
    
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'OpenAI API key is not configured'
      });
    }
    
    // Create system message with instructions for workout recommendations
    const systemMessage = `You are an AI fitness coach specialized in creating personalized workout recommendations. 
    Your task is to create ${count} different workout options based on the user's activity type and profile information.
    Each workout should be tailored to their experience level, goals, preferences, and any injury considerations.
    Provide variety in the recommendations to give the user different options to choose from.
    
    For each workout, include:
    - A catchy, motivating title
    - A brief description explaining benefits and focus
    - Appropriate duration based on their available time
    - Equipment that matches their preferences
    - Difficulty level matching their experience
    - Relevant tags for categorization
    - Activity-specific details like exercises, poses, segments, etc.
    
    Respond in a structured JSON format without any explanations. Use this schema:
    {
      "recommendations": [
        {
          "id": "unique-string-1",
          "title": "Workout Title 1",
          "description": "Brief description",
          "duration": number-of-minutes,
          "difficultyLevel": "beginner/intermediate/advanced",
          "equipmentNeeded": ["item1", "item2"],
          "tags": ["tag1", "tag2"],
          "createdAt": "current-date",
          // Activity-specific fields will vary based on activity type
        },
        // More workout recommendations...
      ]
    }`;
    
    // Creating a comprehensive user message that includes all profile details
    let userMessage = `Please recommend ${count} different ${activityType} workouts for me. 
    
    My ${activityType} profile:
    ${JSON.stringify(activityProfile, null, 2)}
    `;
    
    // Add general fitness profile if available
    if (fitnessProfile) {
      userMessage += `\n\nMy general fitness profile:
      ${JSON.stringify(fitnessProfile, null, 2)}
      `;
    }
    
    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }
    
    const parsedResponse = JSON.parse(content);
    
    // Generate unique IDs and set creation dates if needed
    if (parsedResponse.recommendations) {
      parsedResponse.recommendations.forEach((workout: any) => {
        if (!workout.id) {
          workout.id = crypto.randomUUID();
        }
        if (!workout.createdAt) {
          workout.createdAt = new Date().toISOString();
        }
      });
    }
    
    // Return the recommendations
    return res.json({
      success: true,
      recommendations: parsedResponse.recommendations || []
    });
    
  } catch (error) {
    console.error('Error getting workout recommendations:', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// In-memory storage for saved workouts
// In a production app, this would be stored in a database
const savedWorkouts = new Map<string, any>();

// Endpoint to save a workout
router.post('/save', (req, res) => {
  try {
    // Validate request body
    const { workout } = saveWorkoutSchema.parse(req.body);
    
    // Generate an ID if not provided
    const workoutId = workout.id || crypto.randomUUID();
    workout.id = workoutId;
    
    // Save the workout
    savedWorkouts.set(workoutId, workout);
    
    return res.json({
      success: true,
      message: 'Workout saved successfully',
      workoutId
    });
  } catch (error) {
    console.error('Error saving workout:', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Endpoint to get saved workouts
router.get('/saved', (req, res) => {
  try {
    const { activityType } = req.query;
    
    // Convert Map to array
    const workouts = Array.from(savedWorkouts.values());
    
    // Filter by activity type if provided
    const filteredWorkouts = activityType
      ? workouts.filter(workout => {
          // Determine activity type from the workout object structure
          if ('poses' in workout) return activityType === 'yoga';
          if ('segments' in workout) return activityType === 'running';
          if ('exercises' in workout && 'supersets' in workout) return activityType === 'weightlifting';
          if ('rounds' in workout) return activityType === 'hiit';
          if ('stretches' in workout) return activityType === 'stretch';
          if ('phases' in workout) return activityType === 'meditation';
          return false;
        })
      : workouts;
    
    return res.json({
      success: true,
      workouts: filteredWorkouts
    });
  } catch (error) {
    console.error('Error getting saved workouts:', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Endpoint to delete a saved workout
router.delete('/saved/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if workout exists
    if (!savedWorkouts.has(id)) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    // Delete the workout
    savedWorkouts.delete(id);
    
    return res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting saved workout:', error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;