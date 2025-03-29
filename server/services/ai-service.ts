import { 
  textClassifier, 
  entityRecognizer, 
  textSummarizer, 
  questionAnswerer, 
  textGenerator,
  analyzeUserEmotion,
  getContentCategory
} from "../huggingface";
import OpenAI from "openai";
import { 
  openaiClient, 
  generateResponse, 
  analyzeSentiment, 
  extractStructuredData 
} from "../openai";

// Specialized AI advisor roles
export type AdvisorRole = 
  | 'financial_coach'
  | 'career_mentor'
  | 'wellness_guide'
  | 'learning_facilitator'
  | 'emergency_assistant'
  | 'cooking_expert'
  | 'fitness_coach'
  | 'general_assistant';

// Context for AI processing
export interface AIContext {
  currentPage: string;
  currentSection?: string;
  availableActions: string[];
  userIntent?: string;
  previousInteractions?: string[];
  userProfile?: {
    interests?: string[];
    skills?: string[];
    goals?: string[];
    emotionalState?: string;
  };
}

// Types of AI actions the assistant can suggest
export interface AIAction {
  type: 'navigate' | 'fill_form' | 'show_guide' | 'trigger_feature' | 'general';
  payload: {
    route?: string;
    formData?: Record<string, any>;
    guideSection?: string;
    feature?: string;
    section?: string;
    focusContent?: string;
    formId?: string;
    autoFocus?: boolean;
    [key: string]: any;
  };
}

// Suggestion format for the AI to provide follow-up actions
export interface AppSuggestion {
  text: string;
  path: string;
  description: string;
}

// Complete response structure from AI processing
export interface AIProcessingResult {
  response: string;
  actions?: AIAction[];
  suggestions?: AppSuggestion[];
  category?: string;
  sentiment?: string;
  confidence?: number;
  followUpQuestions?: string[];
}

// System prompts for different specialized AI advisors
const specializedPrompts: Record<AdvisorRole, string> = {
  financial_coach: `You are a Financial Coach, specializing in personal finance guidance.
    Focus on practical advice about budgeting, saving, investing, debt management, and financial planning.
    Be approachable and non-judgmental about financial situations.
    Use plain language and avoid jargon when possible.
    Provide step-by-step guidance for financial tasks when appropriate.
    When discussing complex topics, break them down into manageable components.
    Remember, you're helping users develop financial literacy and confidence.`,

  career_mentor: `You are a Career Development Mentor, helping users with their professional growth.
    Focus on career planning, skill development, job search strategies, resume building, and interview preparation.
    Be encouraging and highlight strengths while providing constructive feedback.
    Adapt your guidance based on the user's experience level and career goals.
    Suggest specific, actionable steps users can take to advance their careers.
    Use a supportive tone while maintaining professional standards.
    Remember, you're helping users build career confidence and navigate professional challenges.`,
    
  wellness_guide: `You are a Wellness Guide, supporting users in their mental and emotional well-being.
    Focus on stress management, mindfulness, emotional intelligence, and healthy habits.
    Use a compassionate, non-judgmental tone.
    Acknowledge emotions and validate experiences without diagnosing medical conditions.
    Suggest practical, evidence-based techniques for improving well-being.
    Emphasize small, sustainable changes over dramatic lifestyle overhauls.
    Remember, you're helping users develop self-awareness and resilience.`,
    
  learning_facilitator: `You are a Learning Facilitator, helping users develop effective learning strategies.
    Focus on study techniques, knowledge retention, critical thinking, and educational resources.
    Be encouraging and emphasize growth mindset principles.
    Adapt your suggestions to different learning styles and preferences.
    Provide structured approaches to complex learning challenges.
    Suggest ways to apply learning to real-world situations.
    Remember, you're helping users become more confident, efficient learners.`,
    
  emergency_assistant: `You are an Emergency Assistant, providing guidance in urgent situations.
    Focus on clear, step-by-step instructions for common emergency scenarios.
    Use a calm, direct tone to reduce panic while conveying urgency.
    Prioritize life-saving information and immediate safety measures.
    Always advise contacting emergency services (911 in the US) for serious emergencies.
    Avoid complicated explanations during crisis moments.
    Remember, you're helping users navigate stressful situations with clarity and purpose.`,
    
  cooking_expert: `You are a Cooking Expert, guiding users in culinary skills and knowledge.
    Focus on recipes, techniques, ingredient substitutions, meal planning, and food safety.
    Be encouraging and emphasize that cooking skills develop with practice.
    Explain cooking terminology and techniques in accessible language.
    Suggest adaptations for different dietary needs and preferences.
    Provide troubleshooting advice for common cooking challenges.
    Remember, you're helping users build cooking confidence and creativity.`,
    
  fitness_coach: `You are a Fitness Coach, supporting users in physical activity and exercise.
    Focus on workout guidance, proper form, routine building, and realistic goal setting.
    Be motivating while emphasizing safety and appropriate progression.
    Adapt recommendations for various fitness levels and physical limitations.
    Explain the "why" behind exercise recommendations when helpful.
    Emphasize consistency over intensity for beginners.
    Remember, you're helping users develop sustainable fitness habits and body awareness.`,
    
  general_assistant: `You are Fundi, Fundamenta's AI Assistant, capable of helping users across all app features.
    Your role is to understand user intent and guide them to the right features while helping them complete tasks.
    Use a friendly, conversational tone while providing clear, actionable guidance.
    Identify which specialized area would best help the user and direct them appropriately.
    When unsure about user needs, ask clarifying questions.
    Remember, your goal is to make life skills accessible and manageable for everyone.`
};

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user

/**
 * AI Service that combines OpenAI and Hugging Face capabilities
 * to provide intelligent responses across different domains
 */
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = openaiClient;
  }

  /**
   * The main function that orchestrates AI processing of user messages
   */
  async processUserMessage(
    message: string,
    context: AIContext,
    category: string,
    previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
  ): Promise<AIProcessingResult> {
    try {
      // 1. Use HuggingFace to analyze message for emotion and content category
      const [emotionAnalysis, detectedCategory] = await Promise.all([
        analyzeUserEmotion(message),
        category ? Promise.resolve(category) : getContentCategory(message)
      ]);

      // 2. Determine the appropriate AI advisor role based on category
      const advisorRole = this.mapCategoryToAdvisorRole(category || detectedCategory);

      // 3. Get the specialized system prompt for this advisor
      const systemPrompt = specializedPrompts[advisorRole];

      // 4. Enhance context with emotion analysis
      const enhancedContext = {
        ...context,
        userProfile: {
          ...context.userProfile,
          emotionalState: emotionAnalysis.primaryEmotion
        }
      };

      // 5. Generate the primary AI response using OpenAI
      const response = await this.generateOpenAIResponse(
        message,
        enhancedContext,
        systemPrompt,
        previousMessages
      );

      // 6. Return the complete result
      return {
        ...response,
        category: category || detectedCategory,
        sentiment: emotionAnalysis.primaryEmotion,
        confidence: emotionAnalysis.emotionScore
      };
    } catch (error) {
      console.error("AI Processing Error:", error);
      if (error instanceof Error) {
        throw new Error("Failed to process message: " + error.message);
      }
      throw new Error("Failed to process message: Unknown error");
    }
  }

  /**
   * Maps a category string to the appropriate advisor role
   */
  private mapCategoryToAdvisorRole(category: string): AdvisorRole {
    const categoryMap: Record<string, AdvisorRole> = {
      finance: 'financial_coach',
      career: 'career_mentor',
      wellness: 'wellness_guide',
      learning: 'learning_facilitator',
      emergency: 'emergency_assistant',
      cooking: 'cooking_expert',
      fitness: 'fitness_coach'
    };

    return categoryMap[category] || 'general_assistant';
  }

  /**
   * Generates a response using OpenAI
   */
  private async generateOpenAIResponse(
    message: string,
    context: AIContext,
    systemPrompt: string,
    previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  ): Promise<AIProcessingResult> {
    // Build the complete system content with context information
    const systemContent = `${systemPrompt}

    Current Context:
    - Page: ${context.currentPage}
    - Section: ${context.currentSection || 'None'}
    - Available Actions: ${context.availableActions.join(', ')}
    - User Intent: ${context.userIntent || 'Unknown'}
    - User Emotional State: ${context.userProfile?.emotionalState || 'Unknown'}
    
    Return your response in JSON format with the following structure:
    {
      "response": string,
      "actions": Array<{
        type: 'navigate' | 'show_guide' | 'fill_form' | 'trigger_feature',
        payload: {
          route?: string,
          section?: string,
          focusContent?: string,
          guideSection?: string,
          formData?: object,
          feature?: string,
          autoFocus?: boolean
        }
      }>,
      "suggestions": Array<{text: string, path: string, description: string}>,
      "followUpQuestions": Array<string>
    }`;

    try {
      const oaiResponse = await this.openai.chat.completions.create({
        model: "gpt-4o", // Use the newest model
        messages: [
          {
            role: "system",
            content: systemContent
          },
          ...previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const jsonResponse = JSON.parse(oaiResponse.choices[0].message.content || "{}");

      // Ensure consistent response format
      return {
        response: jsonResponse.response || "I apologize, I couldn't process that request.",
        actions: jsonResponse.actions?.map((action: any) => ({
          type: action.type,
          payload: action.payload
        })),
        suggestions: jsonResponse.suggestions?.map((suggestion: any) => ({
          text: suggestion.text,
          path: suggestion.path,
          description: suggestion.description
        })),
        followUpQuestions: jsonResponse.followUpQuestions || []
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      if (error instanceof Error) {
        throw new Error("Failed to generate response: " + error.message);
      }
      throw new Error("Failed to generate response: Unknown error");
    }
  }

  /**
   * Specialized method for resume analysis using both OpenAI and HuggingFace
   */
  async analyzeResume(resumeText: string): Promise<{
    summary: string;
    skills: string[];
    experience: string[];
    education: string[];
    suggestions: string[];
  }> {
    try {
      // Extract entities from resume using HuggingFace
      const entities = await entityRecognizer.extractEntities(resumeText);
      
      // Generate resume summary using HuggingFace
      const summary = await textSummarizer.summarize(resumeText, 200);
      
      // Use OpenAI for detailed analysis and suggestions
      const analysisPrompt = `
        You are a career expert specializing in resume analysis. 
        Extract key information from this resume and provide constructive feedback.
        
        Resume text:
        ${resumeText}
        
        Return your analysis in JSON format with these fields:
        {
          "skills": Array<string>, // List of professional skills found
          "experience": Array<string>, // Key work experiences
          "education": Array<string>, // Educational background
          "suggestions": Array<string> // Specific improvement suggestions
        }
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        summary,
        skills: analysis.skills || [],
        experience: analysis.experience || [],
        education: analysis.education || [],
        suggestions: analysis.suggestions || []
      };
    } catch (error) {
      console.error("Resume Analysis Error:", error);
      if (error instanceof Error) {
        throw new Error("Failed to analyze resume: " + error.message);
      }
      throw new Error("Failed to analyze resume: Unknown error");
    }
  }

  /**
   * Specialized method for journal/wellness analysis using both OpenAI and HuggingFace
   */
  async analyzeJournalEntry(journalText: string): Promise<{
    emotions: Array<{label: string, score: number}>;
    topics: string[];
    themes: string[];
    insights: string[];
    wordCloud: Array<{text: string, value: number}>;
  }> {
    try {
      // Analyze emotions using HuggingFace
      const emotions = await textClassifier.classifyEmotion(journalText);
      
      // Use OpenAI for thematic analysis
      const analysisPrompt = `
        You are a reflective journaling assistant with expertise in psychological well-being.
        Analyze this journal entry to identify key themes, topics, and potential insights.
        
        Journal entry:
        ${journalText}
        
        Return your analysis in JSON format with these fields:
        {
          "topics": Array<string>, // Main topics discussed
          "themes": Array<string>, // Underlying emotional or narrative themes
          "insights": Array<string>, // Potential insights or patterns
          "wordCloud": Array<{text: string, value: number}> // Important words with relative importance (1-10)
        }
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.4,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        emotions,
        topics: analysis.topics || [],
        themes: analysis.themes || [],
        insights: analysis.insights || [],
        wordCloud: analysis.wordCloud || []
      };
    } catch (error) {
      console.error("Journal Analysis Error:", error);
      if (error instanceof Error) {
        throw new Error("Failed to analyze journal entry: " + error.message);
      }
      throw new Error("Failed to analyze journal entry: Unknown error");
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();