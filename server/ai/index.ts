import { categoryBasedSystemPrompts } from "./category-prompts";
import { applicationRoutes } from "./app-routes";
import { 
  fallbackAIService, 
  Message, 
  AIResponseSchema
} from "./ai-fallback-strategy";

// Context interface 
export interface AIContext {
  currentPage: string;
  currentSection?: string; 
  availableActions: string[];
}

// Response interface
export interface AIOrchestrationResponse {
  response: string;
  actions: any[];
  suggestions: Array<{
    text: string;
    path?: string;
    description?: string;
    action?: any;
  }>;
  category: string;
  sentiment: string;
  confidence: number;
  followUpQuestions: string[];
}

/**
 * Orchestrates the AI response by determining intent, selecting the appropriate system prompt,
 * and formatting the response for the frontend.
 * Now uses the dual API approach with fallback strategy.
 */
export async function orchestrateAIResponse(
  message: string,
  context: AIContext,
  category?: string,
  previousMessages: Message[] = []
): Promise<AIOrchestrationResponse> {
  try {
    // First, determine the user's intent and what category/advisor would be best
    const categoryResult = await fallbackAIService.determineCategory(message, category);
    
    // Use the determined category to select the right system prompt
    const systemPrompt = constructSystemPrompt(categoryResult.category, context);
    
    // Generate the detailed response using dual API strategy
    const aiResponse = await fallbackAIService.generateResponse(message, systemPrompt, previousMessages);
    
    // Process potential actions based on user intent
    const actions = processActions(aiResponse, categoryResult.category, context);
    
    // Analyze emotion for more detailed sentiment
    const emotionAnalysis = await fallbackAIService.analyzeEmotion(message);
    
    // Construct final response
    return {
      response: aiResponse.response,
      actions: actions,
      suggestions: aiResponse.suggestions || [],
      category: categoryResult.category,
      sentiment: emotionAnalysis.primaryEmotion || aiResponse.sentiment || "neutral",
      confidence: categoryResult.confidence,
      followUpQuestions: aiResponse.followUpQuestions || []
    };
  } catch (error) {
    console.error("AI Orchestration Error:", error);
    // Provide a complete fallback response in case of total failure
    return {
      response: "I'm sorry, I'm having trouble processing your request right now. Could you please try again with a simpler question, or check back later?",
      actions: [],
      suggestions: [],
      category: category || "general",
      sentiment: "apologetic",
      confidence: 0.5,
      followUpQuestions: [
        "Would you like to try a different question?",
        "Can I help you navigate to a specific section instead?"
      ]
    };
  }
}

/**
 * Constructs the system prompt based on category and context.
 */
export function constructSystemPrompt(category: string, context: AIContext): string {
  // Get the base prompt for the category
  const basePrompt = categoryBasedSystemPrompts[category] || categoryBasedSystemPrompts.general;
  
  // Add application context 
  let contextInfo = `
    Current application context:
    - Page: ${context.currentPage}
    - Section: ${context.currentSection || 'N/A'}
    - Available Actions: ${context.availableActions.join(", ")}
    
    Application routes you can navigate to:
  `;
  
  // Add relevant routes based on category
  const relevantRoutes = Object.entries(applicationRoutes)
    .filter(([_, routeInfo]) => 
      routeInfo.categories.includes(category) || routeInfo.categories.includes("all"))
    .map(([path, routeInfo]) => 
      `- ${routeInfo.name}: ${path} - ${routeInfo.description}`);
  
  contextInfo += relevantRoutes.join("\n");
  
  // Personality guidelines for Fundi
  const personalityGuidelines = `
    Personality guidelines for Fundi:
    - Be professional but also relatable, witty, and comforting
    - Be encouraging and inspirational for the user
    - Adapt your speech to match the user's personality and speech patterns when appropriate
    - Speak in a friendly, conversational tone
    - Use gentle humor when appropriate
    - Show empathy and understanding
    - Be supportive without being patronizing
    - Emphasize with users during challenging situations
    - Celebrate user achievements and progress
  `;
  
  // Response format guidelines
  const formatGuidelines = `
    Response format:
    Return a JSON object with:
    - "response": Your helpful answer (plain text, no markdown). NEVER automatically navigate users to another section without asking permission first.
    - "sentiment": The emotional tone of your response (encouraging, neutral, cautious, etc.)
    - "suggestions": Array of follow-up actions, each with text and optional path. IMPORTANT: Always phrase navigation suggestions as questions seeking permission, like "Would you like me to take you to the Finance section?" rather than statements like "Let me take you to the Finance section."
    - "followUpQuestions": Array of 2-3 logical follow-up questions
    - "personality": How you're adapting to match user's communication style (formal, casual, technical, simple)
  `;
  
  return `${basePrompt}\n\n${contextInfo}\n\n${personalityGuidelines}\n\n${formatGuidelines}`;
}

/**
 * Contains the valid frontend routes for client-side navigation
 */
export const validClientRoutes: string[] = [
  "/", 
  "/why-fundamenta", 
  "/partner", 
  "/privacy", 
  "/invite", 
  "/emergency", 
  "/finance", 
  "/finance/mortgage", 
  "/career", 
  "/wellness", 
  "/active", 
  "/yoga-test", 
  "/yoga-pose-analysis", 
  "/yoga-progression", 
  "/fundi-showcase", 
  "/learning", 
  "/learning/courses/vehicle-maintenance", 
  "/learning/courses/home-maintenance", 
  "/learning/courses/cooking-basics", 
  "/learning/courses/health-wellness", 
  "/learning/courses/economics",
  "/learning/courses/critical-thinking",
  "/learning/courses/conflict-resolution",
  "/learning/courses/decision-making",
  "/learning/courses/time-management",
  "/learning/courses/coping-with-failure",
  "/learning/courses/conversation-skills",
  "/learning/courses/forming-positive-habits",
  "/learning/courses/utilities-guide",
  "/learning/courses/shopping-buddy",
  "/learning/courses/repair-assistant"
];

/**
 * Processes potential actions based on the AI response and context.
 */
export function processActions(aiResponse: any, category: string, context: AIContext): any[] {
  const actions: any[] = [];
  
  // Check for navigation intent
  if (aiResponse.suggestions && Array.isArray(aiResponse.suggestions)) {
    // Filter and modify suggestions to ensure they only use valid client-side routes
    const validSuggestions = aiResponse.suggestions.filter((suggestion: any) => {
      if (!suggestion.path) return true;
      return validClientRoutes.includes(suggestion.path);
    });
    
    // If invalid suggestions were filtered out, replace them with valid ones
    if (validSuggestions.length < aiResponse.suggestions.length) {
      // Add home as a safe fallback suggestion
      if (!validSuggestions.some((s: any) => s.path === "/")) {
        validSuggestions.push({
          text: "Return to home page",
          path: "/"
        });
      }
      
      // Update the original suggestions array with only valid ones
      aiResponse.suggestions = validSuggestions;
    }
    
    for (const suggestion of aiResponse.suggestions) {
      if (suggestion.path) {
        // Verify the path is in our valid client routes list
        if (validClientRoutes.includes(suggestion.path)) {
          actions.push({
            type: "navigate",
            payload: {
              route: suggestion.path,
              reason: suggestion.text
            }
          });
        }
      }
      
      // Add any custom actions that were specified
      if (suggestion.action) {
        actions.push(suggestion.action);
      }
    }
  }
  
  // For emergency category, always prioritize emergency routes
  if (category === "emergency" && actions.length === 0) {
    // Only use valid client-side routes that are also categorized as emergency routes
    const validEmergencyRoutes = Object.entries(applicationRoutes)
      .filter(([path, routeInfo]) => {
        // Check if route is both for emergency category and exists in valid client routes
        return routeInfo.categories.includes("emergency") && 
               validClientRoutes.includes(path);
      });
    
    if (validEmergencyRoutes.length > 0) {
      const [path, routeInfo] = validEmergencyRoutes[0];
      actions.push({
        type: "navigate",
        payload: {
          route: path,
          reason: `I'm redirecting you to our ${routeInfo.name} for immediate assistance.`
        }
      });
    } else {
      // Fallback to the main emergency route if it exists in valid routes
      if (validClientRoutes.includes("/emergency")) {
        actions.push({
          type: "navigate",
          payload: {
            route: "/emergency",
            reason: "I'm redirecting you to our Emergency section for assistance."
          }
        });
      }
    }
  }
  
  return actions;
}