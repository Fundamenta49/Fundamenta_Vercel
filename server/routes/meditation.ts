import express from 'express';
import OpenAI from 'openai';

// Initialize OpenAI with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create router
const router = express.Router();

/**
 * Generate meditation script based on user preferences
 */
router.post('/generate', async (req, res) => {
  const { duration, focus, experience, additionalInstructions } = req.body;
  
  try {
    // Validate required fields
    if (!duration || !focus || !experience) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: duration, focus, or experience level'
      });
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert meditation guide with years of experience creating personalized meditation scripts. 
          Create a guided meditation script that is specifically designed for a ${duration}-minute meditation 
          focusing on ${focus}. The script should be appropriate for someone with ${experience} experience level.
          ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}
          
          Format your response as JSON with the following structure:
          {
            "title": "Title of the meditation",
            "introduction": "A brief introduction to prepare the meditator",
            "guidedPractice": ["Step 1...", "Step 2...", ...], 
            "conclusion": "A gentle conclusion to bring the meditation to a close",
            "benefits": ["Benefit 1", "Benefit 2", ...],
            "duration": number (in minutes),
            "focusArea": "Main focus area",
            "difficultyLevel": "Experience level"
          }
          
          Make sure the guided practice is broken into appropriate steps for the given duration.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content || '{}';
    const meditationScript = JSON.parse(content);
    
    res.json(meditationScript);
  } catch (error) {
    console.error('Error generating meditation script:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate meditation script'
    });
  }
});

/**
 * Analyze user feedback about their meditation practice
 */
router.post('/analyze-feedback', async (req, res) => {
  const { feedback } = req.body;
  
  try {
    if (!feedback) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing feedback'
      });
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an experienced meditation coach who provides empathetic and insightful feedback to help meditators improve their practice.
          Analyze the following feedback about a meditation session and provide personalized insights, suggestions, and encouragement.
          Be warm, supportive, and specific in your response. Identify any challenges they might be facing and offer practical solutions.`
        },
        {
          role: "user",
          content: feedback
        }
      ]
    });
    
    res.json({ 
      content: response.choices[0].message.content, 
      success: true 
    });
  } catch (error) {
    console.error('Error analyzing meditation feedback:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze meditation feedback'
    });
  }
});

/**
 * Get personalized meditation recommendations
 */
router.post('/recommendations', async (req, res) => {
  const { 
    recentPractices = [], 
    goals = [], 
    timeAvailable, 
    stressLevel, 
    focusAreas = [] 
  } = req.body;
  
  try {
    if (!timeAvailable) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing timeAvailable field'
      });
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI meditation coach that provides personalized meditation recommendations based on user preferences.
          Consider the following information to make your recommendations:
          - Recent meditation practices: ${JSON.stringify(recentPractices)}
          - Meditation goals: ${JSON.stringify(goals)}
          - Time available: ${timeAvailable} minutes
          - Current stress level (1-10): ${stressLevel || 'Not specified'}
          - Areas of focus: ${JSON.stringify(focusAreas)}
          
          Provide 3-5 specific meditation recommendations that would be most beneficial given the above information.
          For each recommendation, include:
          1. The type of meditation
          2. Duration
          3. Focus area
          4. Why it would be beneficial
          5. A short description of what the practice entails`
        }
      ]
    });
    
    res.json({ 
      content: response.choices[0].message.content, 
      success: true 
    });
  } catch (error) {
    console.error('Error getting meditation recommendations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get meditation recommendations'
    });
  }
});

/**
 * Answer meditation questions
 */
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  
  try {
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing question'
      });
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a meditation expert who provides clear, concise, and helpful answers to questions about meditation practices, techniques, benefits, and challenges.
          Provide an informative and supportive answer that reflects both scientific understanding and practical wisdom from meditation traditions.`
        },
        {
          role: "user",
          content: question
        }
      ]
    });
    
    res.json({ 
      content: response.choices[0].message.content, 
      success: true 
    });
  } catch (error) {
    console.error('Error answering meditation question:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to answer meditation question'
    });
  }
});

export default router;