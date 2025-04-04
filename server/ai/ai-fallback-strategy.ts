import OpenAI from "openai";
import { textClassifier, analyzeUserEmotion, getContentCategory } from "../huggingface";
import type { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Message interface for conversation history
 */
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

/**
 * AIResponse schema for validation
 */
export const AIResponseSchema = z.object({
  response: z.string(),
  sentiment: z.string().optional(),
  suggestions: z.array(
    z.object({
      text: z.string(),
      path: z.string().optional(),
      description: z.string().optional(),
      action: z.any().optional()
    })
  ).optional(),
  followUpQuestions: z.array(z.string()).optional(),
  personality: z.string().optional()
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

/**
 * Interface for AI providers
 */
export interface AIProvider {
  generateResponse(
    message: string,
    systemPrompt: string,
    previousMessages: Message[]
  ): Promise<AIResponse>;
  
  determineCategory(
    message: string, 
    preferredCategory?: string
  ): Promise<{ category: string; confidence: number }>;
  
  analyzeEmotion(message: string): Promise<{
    primaryEmotion: string;
    emotionScore: number;
    emotions?: Array<{emotion: string, score: number}>;
  }>;
}

/**
 * OpenAI implementation of AIProvider
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  
  constructor() {
    this.client = openai;
  }
  
  async generateResponse(
    message: string,
    systemPrompt: string,
    previousMessages: Message[]
  ): Promise<AIResponse> {
    try {
      // Create the messages array
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...previousMessages.map(msg => ({ 
          role: msg.role, 
          content: msg.content 
        })) as ChatCompletionMessageParam[],
        { role: "user", content: message }
      ];
      
      // Call the OpenAI API
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      
      // Parse and validate the response
      if (!response.choices[0].message?.content) {
        throw new Error("Empty response from OpenAI");
      }
      
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      // Use zod to validate and ensure we have the right format
      return AIResponseSchema.parse(parsedResponse);
    } catch (error) {
      console.error("OpenAI error:", error);
      // Return a fallback response
      return {
        response: "I'm sorry, I couldn't process your request through our primary AI system. I've switched to a backup system that might not be as comprehensive.",
        sentiment: "apologetic",
        suggestions: [],
        followUpQuestions: []
      };
    }
  }
  
  async determineCategory(
    message: string, 
    preferredCategory?: string
  ): Promise<{ category: string; confidence: number }> {
    if (preferredCategory) {
      return { category: preferredCategory, confidence: 1.0 };
    }
    
    try {
      const prompt = `
        Analyze the following user message and determine which category it belongs to:
        
        User message: "${message}"
        
        Categories:
        - finance: Financial questions, budgeting, investing, money management
        - career: Career development, job search, resume help, interview prep
        - wellness: Mental health, meditation, stress management, sleep, self-care
        - learning: Educational topics, skill development, knowledge acquisition
        - emergency: Urgent situations, health emergencies, accidents, immediate help needed
        - cooking: Food preparation, recipes, meal planning, cooking techniques
        - fitness: Exercise, workouts, physical health, nutrition, sports
        - general: General questions that don't fit other categories
        
        Respond with a JSON object containing:
        1. "category": The most appropriate category from the list above
        2. "confidence": A number between 0 and 1 indicating confidence
      `;
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You classify user messages into categories accurately." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        category: result.category || "general",
        confidence: result.confidence || 0.7
      };
    } catch (error) {
      console.error("Error determining category with OpenAI:", error);
      return { category: "general", confidence: 0.5 };
    }
  }
  
  async analyzeEmotion(message: string): Promise<{
    primaryEmotion: string;
    emotionScore: number;
  }> {
    try {
      const prompt = `
        Analyze the emotional tone of this message: "${message}"
        
        Respond with a JSON object containing:
        1. "primaryEmotion": The main emotion (happy, sad, angry, curious, confused, etc.)
        2. "emotionScore": A number between 0 and 1 indicating strength of the emotion
      `;
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You analyze the emotional tone of messages." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        primaryEmotion: result.primaryEmotion || "neutral",
        emotionScore: result.emotionScore || 0.5
      };
    } catch (error) {
      console.error("Error analyzing emotion with OpenAI:", error);
      return {
        primaryEmotion: "neutral",
        emotionScore: 0.5
      };
    }
  }
}

/**
 * HuggingFace implementation of AIProvider
 */
export class HuggingFaceProvider implements AIProvider {
  async generateResponse(
    message: string,
    systemPrompt: string,
    previousMessages: Message[]
  ): Promise<AIResponse> {
    try {
      // HuggingFace doesn't have a direct equivalent to OpenAI's chat completions
      // We'll use a simplified approach that combines the available models
      
      // Extract the main question/intent from the message
      const mainIntent = message.trim();
      
      // Determine the best category for routing
      const category = await this.determineCategory(message);
      
      // Construct a basic response based on the category
      let response = "";
      
      switch (category.category) {
        case "finance":
          response = `I understand you're asking about finances. Your message: "${mainIntent}" seems to be related to financial matters. I can help with budgeting, investing, and financial planning.`;
          break;
        case "career":
          response = `I see you're interested in career development. Your message: "${mainIntent}" appears to be about professional growth. I can help with job searches, resume building, and interview preparation.`;
          break;
        case "wellness":
          response = `I understand you're focused on wellness. Your message: "${mainIntent}" seems to be about well-being. I can help with stress management, mental health tips, and self-care routines.`;
          break;
        case "learning":
          response = `I see you're interested in learning. Your message: "${mainIntent}" appears to be about education or skill development. I can help with study techniques, learning resources, and knowledge acquisition.`;
          break;
        case "emergency":
          response = `I notice this might be an emergency situation. Your message: "${mainIntent}" seems urgent. For immediate help, please contact emergency services or visit our emergency section.`;
          break;
        default:
          response = `I've received your message: "${mainIntent}". While I'm operating in backup mode with limited capabilities, I'll do my best to help you.`;
      }
      
      // Add a note about operating in backup mode
      response += " (Note: I'm currently operating in backup mode with more limited capabilities than usual. For more detailed assistance, you may want to try again later when our primary AI system is available.)";
      
      return {
        response,
        sentiment: "helpful",
        suggestions: [
          {
            text: "Visit related section",
            path: `/${category.category}`
          }
        ],
        followUpQuestions: [
          "Would you like to try a different question?",
          "Can I help you with something more specific?"
        ]
      };
    } catch (error) {
      console.error("HuggingFace generateResponse error:", error);
      return {
        response: "I'm currently experiencing some technical difficulties. Please try again with a simpler question or check back later.",
        sentiment: "apologetic",
        suggestions: [],
        followUpQuestions: []
      };
    }
  }
  
  async determineCategory(
    message: string, 
    preferredCategory?: string
  ): Promise<{ category: string; confidence: number }> {
    if (preferredCategory) {
      return { category: preferredCategory, confidence: 1.0 };
    }
    
    try {
      const category = await getContentCategory(message);
      return {
        category,
        confidence: 0.7 // HuggingFace doesn't always return confidence scores, so we use a default
      };
    } catch (error) {
      console.error("Error determining category with HuggingFace:", error);
      return { category: "general", confidence: 0.5 };
    }
  }
  
  async analyzeEmotion(message: string): Promise<{
    primaryEmotion: string;
    emotionScore: number;
    emotions: Array<{emotion: string, score: number}>;
  }> {
    try {
      return await analyzeUserEmotion(message);
    } catch (error) {
      console.error("Error analyzing emotion with HuggingFace:", error);
      return {
        primaryEmotion: "neutral",
        emotionScore: 0.5,
        emotions: [{ emotion: "neutral", score: 0.5 }]
      };
    }
  }
}

/**
 * FallbackAIService that tries OpenAI first, then falls back to HuggingFace
 */
export class FallbackAIService {
  private primaryProvider: AIProvider;
  private fallbackProvider: AIProvider;
  private lastFailureTime: number = 0;
  private failureCount: number = 0;
  private readonly COOLDOWN_PERIOD = 60000; // 1 minute cooldown
  private readonly MAX_FAILURES = 3; // Number of consecutive failures before extended cooldown
  private forceUseFallback: boolean = false;
  
  constructor() {
    this.primaryProvider = new OpenAIProvider();
    this.fallbackProvider = new HuggingFaceProvider();
  }
  
  /**
   * Toggle between primary and fallback providers
   * @param useFallback If true, forces the use of the fallback provider
   * @returns The current setting after the toggle
   */
  public toggleFallbackMode(useFallback?: boolean): { useFallback: boolean } {
    if (useFallback !== undefined) {
      this.forceUseFallback = useFallback;
    } else {
      // If no parameter is provided, toggle the current setting
      this.forceUseFallback = !this.forceUseFallback;
    }
    
    return { useFallback: this.forceUseFallback };
  }
  
  /**
   * Get the current fallback mode status
   * @returns Object containing the fallback mode status and statistics
   */
  public getFallbackStatus(): { 
    useFallback: boolean; 
    failureCount: number; 
    timeSinceLastFailure: number | null;
    cooldownPeriod: number;
    maxFailures: number;
    primaryProvider: string;
    fallbackProvider: string;
  } {
    return {
      useFallback: this.forceUseFallback || this.shouldUseFallback(),
      failureCount: this.failureCount,
      timeSinceLastFailure: this.lastFailureTime > 0 ? Date.now() - this.lastFailureTime : null,
      cooldownPeriod: this.COOLDOWN_PERIOD,
      maxFailures: this.MAX_FAILURES,
      primaryProvider: 'OpenAI',
      fallbackProvider: 'HuggingFace'
    };
  }
  
  private shouldUseFallback(): boolean {
    // If we're forcing fallback mode, always use fallback
    if (this.forceUseFallback) {
      return true;
    }
    
    // If we've had too many failures recently, use fallback
    if (this.failureCount >= this.MAX_FAILURES) {
      // Check if cooldown period has passed
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.COOLDOWN_PERIOD * this.failureCount) {
        return true;
      } else {
        // Reset failure count after cooldown
        this.failureCount = 0;
      }
    }
    
    return false;
  }
  
  private recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }
  
  private recordSuccess() {
    // Gradually reduce the failure count on success
    if (this.failureCount > 0) {
      this.failureCount--;
    }
  }
  
  async generateResponse(
    message: string,
    systemPrompt: string,
    previousMessages: Message[]
  ): Promise<AIResponse> {
    // Determine which provider to use
    if (this.shouldUseFallback()) {
      console.log("Using fallback AI provider due to recent failures");
      try {
        return await this.fallbackProvider.generateResponse(message, systemPrompt, previousMessages);
      } catch (error) {
        console.error("Both primary and fallback AI providers failed:", error);
        return {
          response: "I'm experiencing technical difficulties with both AI systems. Please try again with a simpler question or check back later.",
          sentiment: "apologetic",
          suggestions: [],
          followUpQuestions: []
        };
      }
    }
    
    // Try primary provider first
    try {
      const result = await this.primaryProvider.generateResponse(message, systemPrompt, previousMessages);
      this.recordSuccess();
      return result;
    } catch (error) {
      console.error("Primary AI provider failed, falling back:", error);
      this.recordFailure();
      
      // Try fallback provider
      try {
        return await this.fallbackProvider.generateResponse(message, systemPrompt, previousMessages);
      } catch (fallbackError) {
        console.error("Fallback AI provider also failed:", fallbackError);
        return {
          response: "I'm experiencing technical difficulties with both AI systems. Please try again with a simpler question or check back later.",
          sentiment: "apologetic",
          suggestions: [],
          followUpQuestions: []
        };
      }
    }
  }
  
  async determineCategory(
    message: string, 
    preferredCategory?: string
  ): Promise<{ category: string; confidence: number }> {
    if (this.shouldUseFallback()) {
      return this.fallbackProvider.determineCategory(message, preferredCategory);
    }
    
    try {
      const result = await this.primaryProvider.determineCategory(message, preferredCategory);
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      return this.fallbackProvider.determineCategory(message, preferredCategory);
    }
  }
  
  async analyzeEmotion(message: string): Promise<{
    primaryEmotion: string;
    emotionScore: number;
    emotions?: Array<{emotion: string, score: number}>;
  }> {
    // For emotion analysis, prefer HuggingFace as it's specialized for this
    try {
      return await this.fallbackProvider.analyzeEmotion(message);
    } catch (error) {
      console.log("HuggingFace emotion analysis failed, using OpenAI instead");
      return this.primaryProvider.analyzeEmotion(message);
    }
  }
}

// Export singleton instance
export const fallbackAIService = new FallbackAIService();