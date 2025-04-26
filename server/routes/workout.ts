import { Router } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generic workout generation endpoint that uses OpenAI to create custom workouts
router.post('/generate', async (req, res) => {
  try {
    const { activityType, activityProfile, fitnessProfile, preferences } = req.body;

    if (!activityType || !activityProfile) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: activityType and activityProfile are required',
      });
    }

    // Create a prompt for OpenAI based on the activity type and profile
    const prompt = createWorkoutPrompt(activityType, activityProfile, fitnessProfile, preferences);

    // Call OpenAI to generate the workout
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert fitness trainer specialized in creating personalized workout plans. Provide detailed, structured workouts in valid JSON format based on user profiles. Include exercise descriptions, sets, reps, durations, and proper form guidance."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Extract and parse the workout from OpenAI's response
    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from workout generation');
    }

    const workoutData = JSON.parse(responseText);

    // Add creation timestamp and ID
    workoutData.id = 'workout_' + Date.now();
    workoutData.createdAt = new Date();
    
    // Return the generated workout
    return res.json({
      success: true,
      workout: workoutData,
    });
    
  } catch (error: any) {
    console.error('Error generating workout:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate workout',
    });
  }
});

router.post('/recommendations', async (req, res) => {
  try {
    const { activityType, activityProfile, fitnessProfile, count = 3 } = req.body;

    if (!activityType || !activityProfile) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: activityType and activityProfile are required',
      });
    }

    // Create a prompt for OpenAI to generate workout recommendations
    const prompt = createRecommendationsPrompt(activityType, activityProfile, fitnessProfile, count);

    // Call OpenAI to generate the recommendations
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert fitness trainer specialized in recommending personalized workout options. Generate a list of diverse workout recommendations in valid JSON format based on user profiles."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    // Extract and parse the recommendations from OpenAI's response
    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from workout recommendations');
    }

    const recommendationsData = JSON.parse(responseText);
    
    // Add creation timestamps and IDs to each workout
    const workouts = recommendationsData.workouts.map((workout: any, index: number) => ({
      ...workout,
      id: \`workout_rec_\${Date.now()}_\${index}\`,
      createdAt: new Date(),
    }));
    
    // Return the generated recommendations
    return res.json({
      success: true,
      workouts,
    });
    
  } catch (error: any) {
    console.error('Error generating workout recommendations:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate workout recommendations',
    });
  }
});

// In a real app, these would connect to a database
// For now, we'll use in-memory storage for saved workouts
let savedWorkouts: any[] = [];

router.post('/save', (req, res) => {
  try {
    const { workout } = req.body;
    
    if (!workout) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: workout',
      });
    }
    
    // In a real app, we would save to a database
    savedWorkouts.push(workout);
    
    return res.json({
      success: true,
      message: 'Workout saved successfully',
    });
    
  } catch (error: any) {
    console.error('Error saving workout:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to save workout',
    });
  }
});

router.get('/saved', (req, res) => {
  try {
    const { type } = req.query;
    
    // Filter by activity type if provided
    const workouts = type 
      ? savedWorkouts.filter(workout => workout.activityType === type)
      : savedWorkouts;
    
    return res.json({
      success: true,
      workouts,
    });
    
  } catch (error: any) {
    console.error('Error getting saved workouts:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get saved workouts',
    });
  }
});

// Helper function to create prompts for workout generation
function createWorkoutPrompt(
  activityType: string,
  activityProfile: any,
  fitnessProfile: any,
  preferences: any
): string {
  let prompt = '';
  
  // Common info for all workout types
  prompt += \`Create a detailed ${activityType} workout plan based on the following user profile:\n\n\`;
  
  // Add fitness profile information if available
  if (fitnessProfile) {
    prompt += "Fitness Profile:\n";
    prompt += \`- Height: ${fitnessProfile.height} cm\n\`;
    prompt += \`- Weight: ${fitnessProfile.weight} kg\n\`;
    prompt += \`- Sex: ${fitnessProfile.sex}\n\`;
    prompt += \`- Fitness Level: ${fitnessProfile.fitnessLevel}\n\`;
    prompt += \`- Goals: ${fitnessProfile.goals.join(', ')}\n\n\`;
  }
  
  // Add activity-specific profile details
  prompt += "Activity Profile:\n";
  prompt += \`- Experience Level: ${activityProfile.experience}\n\`;
  prompt += \`- Time Available: ${activityProfile.timeAvailable} minutes\n\`;
  
  switch (activityType) {
    case 'yoga':
      prompt += \`- Focus Areas: ${activityProfile.focusAreas.join(', ')}\n\`;
      prompt += \`- Preferred Styles: ${activityProfile.preferredStyles.join(', ')}\n\`;
      prompt += \`- Practice Frequency: ${activityProfile.practiceFrequency}\n\`;
      if (activityProfile.injuryConsiderations?.length) {
        prompt += \`- Injury Considerations: ${activityProfile.injuryConsiderations.join(', ')}\n\`;
      }
      if (activityProfile.favoriteAsanas?.length) {
        prompt += \`- Favorite Poses: ${activityProfile.favoriteAsanas.join(', ')}\n\`;
      }
      break;
      
    case 'running':
      prompt += \`- Running Goals: ${activityProfile.runningGoals.join(', ')}\n\`;
      prompt += \`- Typical Distance: ${activityProfile.typicalDistance} km\n\`;
      prompt += \`- Typical Pace: ${activityProfile.typicalPace} min/km\n\`;
      prompt += \`- Preferred Terrain: ${activityProfile.preferredTerrain.join(', ')}\n\`;
      prompt += \`- Running Frequency: ${activityProfile.runningFrequency}\n\`;
      if (activityProfile.injuryConsiderations?.length) {
        prompt += \`- Injury Considerations: ${activityProfile.injuryConsiderations.join(', ')}\n\`;
      }
      break;
      
    case 'weightlifting':
      prompt += \`- Strength Goals: ${activityProfile.strengthGoals.join(', ')}\n\`;
      prompt += \`- Focus Muscle Groups: ${activityProfile.focusMuscleGroups.join(', ')}\n\`;
      prompt += \`- Preferred Equipment: ${activityProfile.preferredEquipment.join(', ')}\n\`;
      prompt += \`- Training Frequency: ${activityProfile.trainingFrequency}\n\`;
      if (activityProfile.injuryConsiderations?.length) {
        prompt += \`- Injury Considerations: ${activityProfile.injuryConsiderations.join(', ')}\n\`;
      }
      if (activityProfile.maxLifts && Object.keys(activityProfile.maxLifts).length) {
        prompt += "- Max Lifts:\n";
        for (const [exercise, weight] of Object.entries(activityProfile.maxLifts)) {
          prompt += \`  - ${exercise}: ${weight} lbs\n\`;
        }
      }
      break;
      
    // Add more cases for other activity types
    
    default:
      // General properties for any activity type
      for (const [key, value] of Object.entries(activityProfile)) {
        if (key !== 'experience' && key !== 'timeAvailable' && key !== 'lastUpdated') {
          if (Array.isArray(value) && value.length) {
            prompt += \`- ${key}: ${value.join(', ')}\n\`;
          } else if (typeof value === 'string' || typeof value === 'number') {
            prompt += \`- ${key}: ${value}\n\`;
          }
        }
      }
  }
  
  // Add any additional preferences
  if (preferences) {
    prompt += "\nAdditional Preferences:\n";
    if (preferences.duration) {
      prompt += \`- Preferred Duration: ${preferences.duration} minutes\n\`;
    }
    if (preferences.difficulty) {
      prompt += \`- Preferred Difficulty: ${preferences.difficulty}\n\`;
    }
    if (preferences.focus && preferences.focus.length) {
      prompt += \`- Focus Areas: ${preferences.focus.join(', ')}\n\`;
    }
    if (preferences.equipment && preferences.equipment.length) {
      prompt += \`- Available Equipment: ${preferences.equipment.join(', ')}\n\`;
    }
  }
  
  // Add output formatting instructions based on activity type
  prompt += "\nOutput format instructions:\n";
  prompt += "Provide the complete workout plan as a valid JSON object with the following structure:\n";
  
  switch (activityType) {
    case 'yoga':
      prompt += \`
{
  "title": "string", // A creative, engaging title for the workout
  "description": "string", // Brief description of the workout's benefits and focus
  "duration": number, // Total duration in minutes
  "difficultyLevel": "beginner" | "intermediate" | "advanced",
  "equipmentNeeded": ["string"], // Array of required equipment (e.g., "yoga mat", "blocks")
  "tags": ["string"], // Keywords describing the workout
  "poses": [ // Array of yoga poses (asanas)
    {
      "id": "string", // Unique identifier
      "name": "string", // Name of the pose (e.g., "Downward Dog")
      "description": "string", // Brief description of the pose
      "duration": number, // How long to hold in seconds
      "tips": ["string"], // Form guidance and advice
      "modifications": {
        "easier": "string", // Easier variation
        "harder": "string" // More challenging variation
      }
    }
  ],
  "focusAreas": ["string"], // Body areas or benefits targeted
  "breathworkIncluded": boolean,
  "meditationIncluded": boolean,
  "flowType": "string" // E.g., "Vinyasa", "Hatha", etc.
}
\`;
      break;
      
    case 'running':
      prompt += \`
{
  "title": "string", // A creative, engaging title for the workout
  "description": "string", // Brief description of the workout's benefits
  "duration": number, // Total duration in minutes
  "difficultyLevel": "beginner" | "intermediate" | "advanced",
  "equipmentNeeded": ["string"], // E.g., "running shoes", "GPS watch"
  "tags": ["string"], // Keywords describing the workout
  "distance": number, // Approximate distance in kilometers
  "segments": [ // Structured parts of the run
    {
      "type": "warmup" | "interval" | "steady" | "cooldown",
      "duration": number, // Duration in minutes
      "intensity": "low" | "medium" | "high",
      "description": "string" // Detailed instructions
    }
  ],
  "terrain": "string", // Recommended terrain
  "targetPace": number // Target pace in minutes per km
}
\`;
      break;
      
    case 'weightlifting':
      prompt += \`
{
  "title": "string", // A creative, engaging title for the workout
  "description": "string", // Brief description of the workout's benefits
  "duration": number, // Estimated duration in minutes
  "difficultyLevel": "beginner" | "intermediate" | "advanced",
  "equipmentNeeded": ["string"], // Required equipment
  "tags": ["string"], // Keywords describing the workout
  "exercises": [ // Array of exercises
    {
      "id": "string", // Unique identifier
      "name": "string", // Name of the exercise
      "description": "string", // How to perform the exercise
      "sets": number,
      "reps": number,
      "weight": number | string, // Specific weight or formula (e.g., "70% of 1RM")
      "restBetween": number, // Rest between sets in seconds
      "targetMuscles": ["string"], // Primary muscles worked
      "tips": ["string"], // Form guidance and advice
      "tempo": "string" // Optional timing pattern (e.g., "3-1-2-0")
    }
  ],
  "muscleGroups": ["string"], // Primary muscle groups targeted
  "splitType": "string" // E.g., "Full Body", "Upper/Lower", etc.
}
\`;
      break;
      
    // Add more cases for other activity types
    
    default:
      prompt += \`
{
  "title": "string", // A creative, engaging title for the workout
  "description": "string", // Brief description of the workout
  "duration": number, // Total duration in minutes
  "difficultyLevel": "beginner" | "intermediate" | "advanced",
  "equipmentNeeded": ["string"], // Required equipment
  "tags": ["string"], // Keywords describing the workout
  "exercises": [ // Array of exercises
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "duration": number // Time in seconds or minutes
    }
  ]
}
\`;
  }
  
  prompt += "\nMake sure to include detailed instructions for each exercise, proper form guidance, and create a workout that aligns with the user's goals, experience level, and any injury considerations. The output should be valid JSON that can be parsed directly.";
  
  return prompt;
}

// Function to generate workout recommendations prompt
function createRecommendationsPrompt(
  activityType: string,
  activityProfile: any,
  fitnessProfile: any,
  count: number
): string {
  let prompt = \`Generate ${count} varied ${activityType} workout recommendations based on this user profile:\n\n\`;
  
  // Add fitness profile information if available
  if (fitnessProfile) {
    prompt += "Fitness Profile:\n";
    prompt += \`- Fitness Level: ${fitnessProfile.fitnessLevel}\n\`;
    prompt += \`- Goals: ${fitnessProfile.goals.join(', ')}\n\n\`;
  }
  
  // Add key activity profile information
  prompt += "Activity Profile:\n";
  prompt += \`- Experience Level: ${activityProfile.experience}\n\`;
  prompt += \`- Time Available: ${activityProfile.timeAvailable} minutes\n\`;
  
  // Add activity-specific details
  for (const [key, value] of Object.entries(activityProfile)) {
    if (key !== 'experience' && key !== 'timeAvailable' && key !== 'lastUpdated') {
      if (Array.isArray(value) && value.length) {
        prompt += \`- ${key}: ${value.join(', ')}\n\`;
      } else if (typeof value === 'string' || typeof value === 'number') {
        prompt += \`- ${key}: ${value}\n\`;
      }
    }
  }
  
  // Output format instructions
  prompt += \`
Provide the workout recommendations as a valid JSON object with this structure:
{
  "workouts": [
    {
      "title": "string", // A catchy, descriptive title
      "description": "string", // Brief overview of workout benefits and style
      "duration": number, // Duration in minutes
      "difficultyLevel": "beginner" | "intermediate" | "advanced",
      "equipmentNeeded": ["string"], // Required equipment
      "tags": ["string"], // Keywords describing the workout
      "activityType": "${activityType}" // The activity type 
    },
    // Repeat for a total of ${count} different workouts
  ]
}

Make each workout unique with different focuses, styles, or goals. Only include summary information for each workout, without detailed exercise lists.
The workouts should vary in duration, focus, and style to give the user diverse options.
\`;

  return prompt;
}

export default router;