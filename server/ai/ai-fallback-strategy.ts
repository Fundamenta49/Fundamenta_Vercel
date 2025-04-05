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
    // First, check for special phrases like financial education or financial literacy
    const lowerMessage = message.toLowerCase();
    if ((lowerMessage.includes('financial') && lowerMessage.includes('learning')) ||
        (lowerMessage.includes('financial') && lowerMessage.includes('education')) ||
        (lowerMessage.includes('financial literacy')) ||
        (lowerMessage.includes('learn') && lowerMessage.includes('finance')) ||
        (lowerMessage.includes('schedule') && lowerMessage.includes('financial'))) {
      console.log('OpenAI provider - early detection: Financial education query, categorizing as finance');
      return { category: "finance", confidence: 0.95 };
    }
    
    // Check for mental health/wellness indicators which should override any other categorization
    if (lowerMessage.includes('anxiety') || 
        lowerMessage.includes('worried') || 
        lowerMessage.includes('stressed') ||
        lowerMessage.includes('feeling') ||
        lowerMessage.includes('mental health') || 
        lowerMessage.includes('overwhelmed') ||
        lowerMessage.includes('scared') ||
        lowerMessage.includes('nervous') ||
        lowerMessage.includes('afraid') || 
        lowerMessage.includes('panic') ||
        lowerMessage.includes('meditation')) {
      console.log('OpenAI provider - early detection: Mental health/wellness query, categorizing as wellness');
      return { category: "wellness", confidence: 0.9 };
    }
    
    // Only use preferred category if it's not overridden by content-specific categorization
    if (preferredCategory) {
      return { category: preferredCategory, confidence: 0.8 };
    }
    
    try {
      // Check for home maintenance related queries
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('picfix') || 
          lowerMessage.includes('pic fix') || 
          lowerMessage.includes('utilities') ||
          lowerMessage.includes('utility') ||
          lowerMessage.includes('hook up') ||
          lowerMessage.includes('home maintenance') ||
          (lowerMessage.includes('house') && lowerMessage.includes('project')) ||
          (lowerMessage.includes('photo') && (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('diagnose'))) ||
          (lowerMessage.includes('broken') && (lowerMessage.includes('house') || lowerMessage.includes('home') || lowerMessage.includes('appliance') || lowerMessage.includes('fixture'))) ||
          (lowerMessage.includes('repair') && (lowerMessage.includes('house') || lowerMessage.includes('home') || lowerMessage.includes('appliance') || lowerMessage.includes('toilet') || lowerMessage.includes('sink') || lowerMessage.includes('door'))) ||
          (lowerMessage.includes('fix') && (lowerMessage.includes('house') || lowerMessage.includes('home') || lowerMessage.includes('appliance') || lowerMessage.includes('fixture') || lowerMessage.includes('toilet') || lowerMessage.includes('sink'))) ||
          (lowerMessage.includes('diagnose') && (lowerMessage.includes('house') || lowerMessage.includes('home') || lowerMessage.includes('appliance') || lowerMessage.includes('problem'))) ||
          (lowerMessage.includes('camera') && lowerMessage.includes('repair')) ||
          (lowerMessage.includes('leaking') || lowerMessage.includes('water damage') || lowerMessage.includes('plumbing') || lowerMessage.includes('electrical'))) {
        console.log('OpenAI provider - early detection: Home maintenance or PicFix query, categorizing as homeMaintenance');
        return { category: "homeMaintenance", confidence: 0.95 };
      }
      
      const prompt = `
        Analyze the following user message and determine which category it belongs to:
        
        User message: "${message}"
        
        Categories:
        - finance: Financial questions, budgeting, investing, money management, financial education, financial literacy
        - career: Career development, job search, resume help, interview prep
        - wellness: Mental health, meditation, stress management, sleep, self-care
        - learning: Educational topics, skill development, knowledge acquisition (except financial education which belongs in finance)
        - emergency: Urgent situations, health emergencies, accidents, immediate help needed
        - cooking: Food preparation, recipes, meal planning, cooking techniques
        - fitness: Exercise, workouts, physical health, nutrition, sports
        - homeMaintenance: Home repairs, appliance fixes, household maintenance, DIY repairs, property maintenance, repair tools, diagnosing broken items
        - general: General questions that don't fit other categories
        
        Special rules:
        - Messages about financial education, financial literacy, or learning about money should be categorized as "finance", not "learning"
        - Messages about home repairs, broken appliances, maintenance issues, or camera diagnostics for repair should be categorized as "homeMaintenance"
        
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
      
      // Special handling for financial education queries - redirect to finance
      const lowerIntent = mainIntent.toLowerCase();
      if ((lowerIntent.includes('financial') && lowerIntent.includes('learning')) ||
          (lowerIntent.includes('financial') && lowerIntent.includes('education')) ||
          (lowerIntent.includes('financial literacy')) ||
          (lowerIntent.includes('learn') && lowerIntent.includes('finance')) ||
          (lowerIntent.includes('schedule') && lowerIntent.includes('financial'))) {
          
        response = `I understand you're asking about financial education. Your message: "${mainIntent}" seems to be related to learning about finances. I'll direct you to our Finance section where you can find resources on financial literacy, budgeting, investing, and more.`;
        // Override category to ensure proper navigation
        category.category = "finance";
      } else {
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
          case "homeMaintenance":
            response = `I see you're asking about home repairs. Your message: "${mainIntent}" seems to be about fixing or diagnosing a household issue. I can help with maintenance tips, repair guidance, or direct you to our PicFix Smart Repair Assistant, which lets you take a photo of broken items for AI-powered diagnosis, repair instructions, and parts pricing.`;
            break;
          default:
            response = `I've received your message: "${mainIntent}". I'll do my best to assist you with that.`;
        }
      }
      
      // Do not add backup mode message - this creates a poor UX
      // We'll let the UI gracefully handle limitations without explicitly mentioning "backup mode"
      
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
    // First, check for special phrases like financial education or financial literacy
    const lowerMessage = message.toLowerCase();
    if ((lowerMessage.includes('financial') && lowerMessage.includes('learning')) ||
        (lowerMessage.includes('financial') && lowerMessage.includes('education')) ||
        (lowerMessage.includes('financial literacy')) ||
        (lowerMessage.includes('learn') && lowerMessage.includes('finance')) ||
        (lowerMessage.includes('schedule') && lowerMessage.includes('financial'))) {
      console.log('HuggingFace provider - early detection: Financial education query, categorizing as finance');
      return { category: "finance", confidence: 0.95 };
    }
    
    // Check for mental health/wellness indicators which should override any other categorization
    if (lowerMessage.includes('anxiety') || 
        lowerMessage.includes('worried') || 
        lowerMessage.includes('stressed') ||
        lowerMessage.includes('feeling') ||
        lowerMessage.includes('mental health') || 
        lowerMessage.includes('overwhelmed') ||
        lowerMessage.includes('scared') ||
        lowerMessage.includes('nervous') ||
        lowerMessage.includes('afraid') || 
        lowerMessage.includes('panic') ||
        lowerMessage.includes('meditation')) {
      console.log('HuggingFace provider - early detection: Mental health/wellness query, categorizing as wellness');
      return { category: "wellness", confidence: 0.9 };
    }
    
    // Check for home maintenance and utilities related queries
    if (lowerMessage.includes('picfix') || 
        lowerMessage.includes('pic fix') || 
        lowerMessage.includes('utilities') ||
        lowerMessage.includes('utility') ||
        lowerMessage.includes('hook up') ||
        lowerMessage.includes('home maintenance') ||
        (lowerMessage.includes('house') && lowerMessage.includes('project')) ||
        (lowerMessage.includes('photo') && (lowerMessage.includes('repair') || lowerMessage.includes('fix'))) ||
        (lowerMessage.includes('broken') && (lowerMessage.includes('house') || lowerMessage.includes('home'))) ||
        (lowerMessage.includes('repair') && (lowerMessage.includes('house') || lowerMessage.includes('home'))) ||
        (lowerMessage.includes('fix') && (lowerMessage.includes('house') || lowerMessage.includes('home'))) ||
        lowerMessage.includes('leaking') || 
        lowerMessage.includes('plumbing') || 
        lowerMessage.includes('electrical')) {
      console.log('HuggingFace provider - early detection: Home maintenance query, categorizing as homeMaintenance');
      return { category: "homeMaintenance", confidence: 0.9 };
    }
    
    // Only use preferred category if it's not overridden by content-specific categorization
    if (preferredCategory) {
      return { category: preferredCategory, confidence: 0.8 };
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
    // Determine which provider to use based on our fallback strategy
    if (this.shouldUseFallback()) {
      console.log("Using fallback AI provider due to recent failures");
      
      // Forced fallback mode - only use the fallback provider
      try {
        const result = await this.fallbackProvider.generateResponse(
          message, 
          systemPrompt, 
          previousMessages
        );
        return result;
      } catch (error) {
        console.error("Fallback AI provider failed in fallback mode:", error);
        return {
          response: "I'm experiencing technical difficulties with the AI system. Please try again with a simpler question or check back later.",
          sentiment: "apologetic",
          suggestions: [],
          followUpQuestions: []
        };
      }
    }
    
    // Enhanced race strategy with timeouts and fallbacks
    let primaryPromise: Promise<AIResponse> | null = null;
    let fallbackPromise: Promise<AIResponse> | null = null;
    let primaryTimeout: NodeJS.Timeout | null = null;
    let fallbackStartTimeout: NodeJS.Timeout | null = null;
    let isResolved = false;
    
    // Create a promise that resolves with the first successful response
    // or rejects if both providers fail
    return new Promise<AIResponse>((resolve, reject) => {
      // Start the primary provider request immediately
      primaryPromise = this.primaryProvider.generateResponse(
        message, 
        systemPrompt, 
        previousMessages
      );
      
      // Set up a timeout to start the fallback provider after a short delay
      // This gives the primary provider a head start but ensures we don't wait too long
      const FALLBACK_START_DELAY = 300; // ms - give primary provider a head start
      
      fallbackStartTimeout = setTimeout(() => {
        if (!isResolved) {
          console.log("Starting fallback AI provider as backup");
          
          // Start the fallback provider
          fallbackPromise = this.fallbackProvider.generateResponse(
            message, 
            systemPrompt, 
            previousMessages
          );
          
          // Handle fallback provider result
          fallbackPromise
            .then(result => {
              if (!isResolved) {
                isResolved = true;
                console.log("Fallback AI provider responded first");
                this.recordFailure(); // Record that primary was too slow or failed
                clearTimeout(primaryTimeout!);
                resolve(result);
              }
            })
            .catch(fallbackError => {
              console.error("Fallback AI provider failed:", fallbackError);
              // Only reject if primary has also failed/timed out
              if (!isResolved && !primaryPromise) {
                isResolved = true;
                reject(fallbackError);
              }
            });
        }
      }, FALLBACK_START_DELAY);
      
      // Set a timeout for the primary provider
      const PRIMARY_TIMEOUT = 10000; // 10 seconds
      primaryTimeout = setTimeout(() => {
        if (!isResolved) {
          console.log("Primary AI provider timed out after", PRIMARY_TIMEOUT, "ms");
          this.recordFailure();
          // We won't reject here since the fallback might still be pending
        }
      }, PRIMARY_TIMEOUT);
      
      // Handle primary provider result
      primaryPromise
        .then(result => {
          if (!isResolved) {
            isResolved = true;
            console.log("Primary AI provider responded successfully");
            this.recordSuccess();
            
            // Clean up timeouts
            clearTimeout(fallbackStartTimeout!);
            clearTimeout(primaryTimeout!);
            
            resolve(result);
          }
        })
        .catch(primaryError => {
          console.error("Primary AI provider failed:", primaryError);
          this.recordFailure();
          
          // If fallback hasn't started yet, clear its startup timeout and reject
          if (!fallbackPromise && fallbackStartTimeout) {
            clearTimeout(fallbackStartTimeout);
            
            // Start fallback immediately since primary failed
            this.fallbackProvider.generateResponse(message, systemPrompt, previousMessages)
              .then(result => {
                if (!isResolved) {
                  isResolved = true;
                  console.log("Fallback AI provider succeeded after primary failure");
                  resolve(result);
                }
              })
              .catch(fallbackError => {
                if (!isResolved) {
                  isResolved = true;
                  console.error("Both AI providers failed:", fallbackError);
                  reject(new Error("Both AI providers failed"));
                }
              });
          }
          // If fallback is already running, let it continue
        });
    })
    .catch(error => {
      // Ultimate fallback if both providers fail
      console.error("All AI providers failed:", error);
      return {
        response: "I'm experiencing technical difficulties with both AI systems. Please try again with a simpler question or check back later.",
        sentiment: "apologetic",
        suggestions: [],
        followUpQuestions: []
      };
    });
  }
  
  async determineCategory(
    message: string, 
    preferredCategory?: string
  ): Promise<{ category: string; confidence: number }> {
    // Determine which provider to use based on our fallback strategy
    if (this.shouldUseFallback()) {
      console.log("Using fallback AI provider for category determination due to recent failures");
      return this.fallbackProvider.determineCategory(message, preferredCategory);
    }
    
    // Use a similar race approach as generateResponse but simpler since this is a faster operation
    let primaryPromise: Promise<{ category: string; confidence: number }> | null = null;
    let fallbackPromise: Promise<{ category: string; confidence: number }> | null = null;
    let isResolved = false;
    
    // Create a promise that resolves with the first successful response
    // or rejects if both providers fail
    return new Promise<{ category: string; confidence: number }>((resolve, reject) => {
      // Start the primary provider immediately
      primaryPromise = this.primaryProvider.determineCategory(message, preferredCategory);
      
      // Start fallback with a short delay
      setTimeout(() => {
        if (!isResolved) {
          console.log("Starting fallback for category determination as backup");
          fallbackPromise = this.fallbackProvider.determineCategory(message, preferredCategory);
          
          fallbackPromise
            .then(result => {
              if (!isResolved) {
                isResolved = true;
                console.log("Fallback provider determined category first");
                this.recordFailure(); // Primary was too slow
                resolve(result);
              }
            })
            .catch(error => {
              console.error("Fallback category determination failed:", error);
              // Only reject if primary has already failed
              if (!isResolved && !primaryPromise) {
                isResolved = true;
                reject(error);
              }
            });
        }
      }, 200); // 200ms delay
      
      // Handle primary provider result
      primaryPromise
        .then(result => {
          if (!isResolved) {
            isResolved = true;
            console.log("Primary provider determined category successfully");
            this.recordSuccess();
            resolve(result);
          }
        })
        .catch(error => {
          console.error("Primary category determination failed:", error);
          this.recordFailure();
          
          // If fallback is not yet running, start it immediately
          if (!fallbackPromise) {
            this.fallbackProvider.determineCategory(message, preferredCategory)
              .then(result => {
                if (!isResolved) {
                  isResolved = true;
                  resolve(result);
                }
              })
              .catch(fallbackError => {
                if (!isResolved) {
                  isResolved = true;
                  reject(new Error("Both category determination providers failed"));
                }
              });
          }
          // If fallback is already running, let it continue
        });
    })
    .catch(error => {
      // Ultimate fallback if both providers fail
      console.error("All category providers failed:", error);
      return { 
        category: preferredCategory || "general",
        confidence: 0.5
      };
    });
  }
  
  async analyzeEmotion(message: string): Promise<{
    primaryEmotion: string;
    emotionScore: number;
    emotions?: Array<{emotion: string, score: number}>;
  }> {
    // For emotion analysis, try both providers with timing optimization
    // We'll use a Promise.race approach to get the fastest result
    // while also ensuring we have a fallback if one fails
    
    let fallbackPromise: Promise<any> | null = null;
    
    try {
      // Start both providers in parallel but prioritize the specialized one
      const primaryPromise = this.fallbackProvider.analyzeEmotion(message)
        .catch(error => {
          console.log("HuggingFace emotion analysis failed, using OpenAI fallback");
          // If this fails, we need to ensure the fallback is running
          if (!fallbackPromise) {
            fallbackPromise = this.primaryProvider.analyzeEmotion(message);
          }
          // Rethrow to let Promise.race know this one failed
          throw error;
        });
      
      // Start the fallback with a slight delay to give priority to the specialized service
      fallbackPromise = new Promise(resolve => {
        setTimeout(() => {
          // Only run this if we haven't already gotten a result
          this.primaryProvider.analyzeEmotion(message)
            .then(resolve)
            .catch(error => {
              console.error("Both emotion analysis providers failed:", error);
              // Return a neutral default if both fail
              resolve({
                primaryEmotion: "neutral",
                emotionScore: 0.5
              });
            });
        }, 500); // 500ms delay gives the specialized service a head start
      });
      
      // Race between the two, with preference for the specialized one
      return await Promise.race([primaryPromise, fallbackPromise]);
    } catch (error) {
      // If the primary (specialized) provider fails, wait for the fallback
      if (fallbackPromise) {
        return await fallbackPromise;
      }
      
      // Ultimate fallback if everything fails
      console.error("All emotion analysis providers failed:", error);
      return {
        primaryEmotion: "neutral",
        emotionScore: 0.5
      };
    }
  }
}

// Export singleton instance
export const fallbackAIService = new FallbackAIService();