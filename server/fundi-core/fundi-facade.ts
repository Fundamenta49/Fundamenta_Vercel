/**
 * FUNDI FACADE
 * 
 * This file provides a stable interface to interact with Fundi's AI capabilities.
 * It creates a protective layer between the application and Fundi's core services.
 * 
 * IMPORTANT: This facade should be the ONLY way that other parts of the application
 * interact with Fundi's AI capabilities. Direct access to the underlying providers
 * should be avoided to ensure stability.
 */

import { OpenAIProvider, HuggingFaceProvider } from '../ai/ai-fallback-strategy';
import { AIResponse, Message, getEmergencyFallbackResponse, validateAIResponse, generateSafeFundiResponse } from './fundi-fallback-core';
import { getFundiPersonalityElements } from '../ai/fundi-personality-integration';

/**
 * FundiFacade - Singleton class that provides a stable interface
 * to Fundi's AI capabilities with guaranteed fallback behavior
 */
export class FundiFacade {
  private static instance: FundiFacade;
  private primaryProvider: any;
  private fallbackProvider: any;
  private isInitialized: boolean = false;

  private constructor() {
    // Initialize will be called separately to avoid constructor errors
    this.isInitialized = false;
  }

  /**
   * Get the singleton instance of FundiFacade
   */
  public static getInstance(): FundiFacade {
    if (!FundiFacade.instance) {
      FundiFacade.instance = new FundiFacade();
    }
    return FundiFacade.instance;
  }

  /**
   * Initialize the providers
   * This is separate from constructor to handle potential errors
   */
  public initialize(): void {
    if (this.isInitialized) return;
    
    try {
      this.primaryProvider = new OpenAIProvider();
      this.fallbackProvider = new HuggingFaceProvider();
      this.isInitialized = true;
      console.log("Fundi Facade successfully initialized");
    } catch (error) {
      console.error("Failed to initialize Fundi Facade:", error);
      // We continue even if initialization fails - the facade will use emergency fallbacks
    }
  }

  /**
   * Generate a response from Fundi with guaranteed fallback behavior
   * This is the main method that should be used by the application
   */
  public async generateResponse(
    message: string,
    conversationId: number,
    previousMessages: Message[] = []
  ): Promise<AIResponse> {
    // Make sure we're initialized
    if (!this.isInitialized) {
      this.initialize();
    }
    
    try {
      // Get personality elements for the system prompt
      const personalityElements = getFundiPersonalityElements();
      
      // Create the system prompt
      const systemPrompt = `
        You are Fundi, a helpful AI assistant built into the Fundamenta application.
        
        ${personalityElements.tone ? `Tone: ${personalityElements.tone}` : ''}
        ${personalityElements.styleTraits ? `Style: ${personalityElements.styleTraits.join(', ')}` : ''}
        
        When responding, provide a conversational and helpful response. Be friendly and engaging.
        
        Your response should be in the following JSON format:
        {
          "response": "Your conversational response to the user",
          "sentiment": "friendly|helpful|enthusiastic|neutral|apologetic",
          "suggestions": [
            {
              "text": "A follow-up question or suggestion phrased as a question",
              "path": "/optional/app/route"
            }
          ],
          "followUpQuestions": [
            "A follow-up question to continue the conversation",
            "Another potential follow-up question"
          ]
        }
      `;
      
      // Use our safe response generator that handles all failure cases
      return await generateSafeFundiResponse(
        this.primaryProvider,
        this.fallbackProvider,
        message,
        systemPrompt,
        previousMessages
      );
    } catch (error) {
      console.error("Critical error in Fundi facade:", error);
      
      // Final safety net - guaranteed to return something usable
      return getEmergencyFallbackResponse();
    }
  }

  /**
   * Analyze emotion in a message with fallback handling
   */
  public async analyzeEmotion(message: string): Promise<{
    primaryEmotion: string;
    emotionScore: number;
    emotions?: Array<{emotion: string, score: number}>;
  }> {
    // Make sure we're initialized
    if (!this.isInitialized) {
      this.initialize();
    }
    
    try {
      // Try primary provider first
      try {
        return await this.primaryProvider.analyzeEmotion(message);
      } catch (primaryError) {
        console.error("Primary emotion analysis failed:", primaryError);
        
        // Try fallback provider
        try {
          return await this.fallbackProvider.analyzeEmotion(message);
        } catch (fallbackError) {
          console.error("Fallback emotion analysis failed:", fallbackError);
          throw new Error("Both providers failed for emotion analysis");
        }
      }
    } catch (error) {
      console.error("Critical error in emotion analysis:", error);
      
      // Fallback to a neutral emotion analysis
      return {
        primaryEmotion: "neutral",
        emotionScore: 0.5,
        emotions: [
          { emotion: "neutral", score: 0.5 },
          { emotion: "calm", score: 0.3 },
          { emotion: "interest", score: 0.2 }
        ]
      };
    }
  }

  /**
   * Determine category with fallback handling
   */
  public async determineCategory(
    message: string, 
    preferredCategory?: string
  ): Promise<{ category: string; confidence: number }> {
    // Make sure we're initialized
    if (!this.isInitialized) {
      this.initialize();
    }
    
    try {
      // Try primary provider first
      try {
        return await this.primaryProvider.determineCategory(message, preferredCategory);
      } catch (primaryError) {
        console.error("Primary category determination failed:", primaryError);
        
        // Try fallback provider
        try {
          return await this.fallbackProvider.determineCategory(message, preferredCategory);
        } catch (fallbackError) {
          console.error("Fallback category determination failed:", fallbackError);
          throw new Error("Both providers failed for category determination");
        }
      }
    } catch (error) {
      console.error("Critical error in category determination:", error);
      
      // Return a reliable default
      return {
        category: preferredCategory || "general",
        confidence: 0.6
      };
    }
  }
}

// Export a factory function to get the instance
export function getFundiFacade(): FundiFacade {
  return FundiFacade.getInstance();
}