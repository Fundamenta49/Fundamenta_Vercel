import axios from 'axios';

// Interface for OpenAI responses
export interface OpenAIResponse {
  content: string;
  success: boolean;
  error?: string;
}

// Interface for meditation generation request
export interface MeditationGenerationRequest {
  duration: number; // in minutes
  focus: string; // e.g., "stress relief", "sleep", "focus", "mindfulness"
  experience: string; // "beginner", "intermediate", "advanced"
  additionalInstructions?: string; // any specific requirements
}

// Interface for meditation generation response
export interface MeditationScript {
  title: string;
  introduction: string;
  guidedPractice: string[];
  conclusion: string;
  benefits: string[];
  duration: number;
  focusArea: string;
  difficultyLevel: string;
}

/**
 * Generates a guided meditation script based on user preferences
 */
export const generateMeditationScript = async (
  request: MeditationGenerationRequest
): Promise<MeditationScript> => {
  try {
    const response = await axios.post('/api/meditation/generate', request);
    return response.data;
  } catch (error: any) {
    console.error('Error generating meditation script:', error);
    throw new Error('Failed to generate meditation script. Please try again later.');
  }
};

/**
 * Analyzes meditation practice feedback and provides personalized insights
 */
export const analyzeMeditationFeedback = async (
  feedback: string
): Promise<OpenAIResponse> => {
  try {
    const response = await axios.post('/api/meditation/analyze-feedback', { feedback });
    return response.data;
  } catch (error: any) {
    console.error('Error analyzing meditation feedback:', error);
    return {
      content: 'Unable to analyze your feedback at this time. Please try again later.',
      success: false,
      error: error?.message || 'Unknown error'
    };
  }
};

/**
 * Gets personalized meditation recommendations based on user preferences and history
 */
export const getMeditationRecommendations = async (
  preferences: {
    recentPractices?: string[];
    goals?: string[];
    timeAvailable: number;
    stressLevel?: number;
    focusAreas?: string[];
  }
): Promise<OpenAIResponse> => {
  try {
    const response = await axios.post('/api/meditation/recommendations', preferences);
    return response.data;
  } catch (error: any) {
    console.error('Error getting meditation recommendations:', error);
    return {
      content: 'Unable to generate recommendations at this time. Please try again later.',
      success: false,
      error: error?.message || 'Unknown error'
    };
  }
};

/**
 * Gets answers to meditation questions from AI
 */
export const askMeditationQuestion = async (
  question: string
): Promise<OpenAIResponse> => {
  try {
    const response = await axios.post('/api/meditation/ask', { question });
    return response.data;
  } catch (error: any) {
    console.error('Error asking meditation question:', error);
    return {
      content: 'I apologize, but I cannot answer your question at this time. Please try again later.',
      success: false,
      error: error?.message || 'Unknown error'
    };
  }
};