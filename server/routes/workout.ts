import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
router.post('/generate-workout', async (req, res) => {
  try {
    const { profile } = req.body;

    const prompt = `Create a personalized workout plan for a ${profile.fitnessLevel} level person with the following fitness goals: ${profile.goals.join(', ')}. 
    Include specific exercises with sets and reps, recommended YouTube tutorial video IDs, and helpful tips.
    For video IDs, prefer videos from reputable fitness channels that demonstrate proper form. For common exercises like push-ups and planks, use these reliable video IDs:
    - Push-ups: "IODxDxX7oi4"
    - Plank: "ASdvN_XEl_c"
    - Squats: "YaXPRqUwItQ"

    Format the response as a JSON object with the following structure:
    {
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": number,
          "description": string,
          "videoId": string (YouTube video ID)
        }
      ],
      "schedule": string,
      "tips": string[]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional fitness trainer experienced in creating personalized workout plans." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const workoutPlan = JSON.parse(response.choices[0].message.content || "{}");
    res.json(workoutPlan);

  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
});

export default router;