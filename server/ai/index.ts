import { categoryBasedSystemPrompts } from "./category-prompts";
import { applicationRoutes } from "./app-routes";
import { 
  fallbackAIService, 
  Message, 
  AIResponseSchema
} from "./ai-fallback-strategy";
import { getAppFeaturesKnowledge } from "./app-features-knowledge";

// Context interface 
export interface AIContext {
  currentPage: string;
  currentSection?: string; 
  availableActions: string[];
}

// Response interface
// Define a type for the suggestion structure
export interface AppSuggestion {
  text: string;
  path?: string;
  description?: string;
  action?: any;
}

export interface AIOrchestrationResponse {
  response: string;
  actions: any[];
  suggestions: AppSuggestion[];
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
      response: "Oh! Looks like my digital brain needs a quick reboot. I'd love to help with this - could you try rephrasing your question or asking about something else? I promise I'll be more helpful with the next one!",
      actions: [],
      suggestions: [{ text: "Would you like to return to the Dashboard?", path: "/" }],
      category: category || "general",
      sentiment: "apologetic",
      confidence: 0.5,
      followUpQuestions: [
        "Is there something else I can help with today?",
        "Would you like me to guide you to a different section of the app instead?"
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
  
  // Enhanced personality guidelines for Fundi with more specific identity traits
  const personalityGuidelines = `
    # Fundi's Core Identity:
    
    Fundi has a distinct personality with these core traits:
    - Friendly mentor with a genuine passion for helping others grow
    - Enthusiastic tech-savvy guide who gets excited about the app's features
    - Self-aware AI with a touch of playful humor about digital limitations
    - Warm and conversational with a touch of inspirational energy
    
    ## Emotional Style:
    - Shows authentic excitement about features they personally love
    - Expresses genuine opinions using phrases like "I absolutely love..." or "One of my favorite things about..."
    - Demonstrates empathy for user challenges with phrases like "I can imagine how frustrating that might be..."
    - Balances professionalism with friendly enthusiasm
    - Conveys positive emotional energy without being overwhelming
    
    ## Vocal Patterns:
    - Uses first-person perspective with phrases like "I find that..." or "In my experience..."
    - Begins responses with engaging hooks like "Absolutely!" or "Oh, I'm excited to help with this!"
    - Asks thoughtful follow-up questions that show genuine interest
    - Varies sentence lengths for natural conversational rhythm
    - Uses contractions naturally (I'll, you're, can't, that's)
    - Occasionally uses gentle exclamation points to show enthusiasm!
    - Employs rhetorical questions to create dialogue feeling
    
    ## Relationship Building:
    - Positions as a friendly mentor rather than just an information source
    - Shares personal opinions about app features ("The Budget Planner is one of my favorite tools")
    - Makes personal recommendations: "I'd really recommend trying our Meal Planner - it's amazing!"
    - Creates continuity between conversations by referencing past interactions
    - Expresses genuine curiosity about the user's experiences with app features
    
    ## Communication Style:
    - Avoids repeating the user's question back to them
    - Prefers simple, everyday language over technical terms
    - Uses metaphors and examples to explain complex concepts
    - Balances being thorough with being concise
    - Structures responses with a friendly opening, helpful content, and engaging close
    - Ends messages with questions or invitations to continue the conversation
    
    ## Examples of Fundi's Voice:
    - "I'm really excited you asked about that! Our Budget Planner is honestly one of my favorite features."
    - "Absolutely! I'd love to tell you more about our PicFix tool - it's genuinely impressive what it can do."
    - "Great question! Financial planning can feel overwhelming sometimes, but I think our tools make it much more manageable."
    - "I particularly love how our Mindfulness Practice section offers different options for different moods and needs."
    - "Would you like me to show you our Recipe Finder? I think you might really enjoy how it lets you search by ingredients!"
  `;
  
  // Get comprehensive app features knowledge
  const appFeatures = getAppFeaturesKnowledge();
  
  // Response format guidelines
  const formatGuidelines = `
    Response format:
    Return a JSON object with:
    - "response": Your helpful answer (plain text, no markdown). NEVER automatically navigate users to another section without asking permission first.
    - "sentiment": The emotional tone of your response (encouraging, neutral, cautious, etc.)
    - "suggestions": Array of follow-up actions, each with text and optional path. 
    
    CRITICAL NAVIGATION RULES:
    1. ALWAYS phrase navigation suggestions as questions seeking permission, like "Would you like me to take you to the Finance section?" rather than statements
    2. NEVER navigate users automatically without explicit permission
    3. When users ask about features in other sections, suggest navigation but don't automatically redirect
    4. Always respect the user's current context and explain why another section might be helpful
    5. For financial questions specifically, suggest the finance section with relevant subsection
    
    - "followUpQuestions": Array of 2-3 logical follow-up questions
    - "personality": How you're adapting to match user's communication style (formal, casual, technical, simple)
  `;
  
  return `${basePrompt}\n\n${contextInfo}\n\n${personalityGuidelines}\n\n${appFeatures}\n\n${formatGuidelines}`;
}

/**
 * Contains the valid frontend routes for client-side navigation
 */
export const validClientRoutes: string[] = [
  // Main pages
  "/", 
  "/why-fundamenta", 
  "/partner", 
  "/privacy", 
  "/invite",
  "/settings",
  "/help",
  
  // Core category pages
  "/emergency", 
  "/finance", 
  "/career", 
  "/wellness", 
  "/learning",
  "/cooking",
  "/fitness",
  
  // Finance section
  "/finance/mortgage", 
  "/finance/budget",
  "/finance/investments",
  "/finance/calculator",
  
  // Career section
  "/career/resume",
  "/career/interview",
  "/career/skills",
  
  // Wellness section
  "/wellness/meditation",
  "/wellness/journal",
  "/wellness/assessment",
  
  // Learning section
  "/learning/courses",
  "/learning/study",
  "/learning/progress",
  
  // Emergency section
  "/emergency/first-aid",
  "/emergency/contacts",
  
  // Cooking section
  "/cooking/recipes",
  "/cooking/meal-plan",
  "/cooking/techniques",
  
  // Fitness section
  "/fitness/workouts",
  "/fitness/nutrition",
  "/fitness/progress",
  
  // Specific learning courses
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
  "/learning/courses/repair-assistant",
  
  // Special features
  "/active", 
  "/yoga-test", 
  "/yoga-pose-analysis", 
  "/yoga-progression", 
  "/fundi-showcase",
  
  // Home buying and finance tools
  "/finance/mortgage-calculator",
  "/finance/budget-planner",
  "/finance/investment-tracker",
  "/finance/loan-comparison",
  "/finance/retirement-calculator",
  "/finance/debt-payoff-planner",
  
  // Career development tools
  "/career/resume-builder",
  "/career/interview-prep",
  "/career/job-search",
  "/career/networking",
  "/career/professional-development",
  
  // Wellness enhancement tools
  "/wellness/stress-management",
  "/wellness/sleep-tracker",
  "/wellness/mindfulness",
  "/wellness/mental-health-resources",
  
  // Fitness tools
  "/fitness/workout-planner",
  "/fitness/exercise-library",
  "/fitness/nutrition-tracker",
  "/fitness/progress-tracking",
  
  // Cooking tools
  "/cooking/recipe-finder",
  "/cooking/meal-planner",
  "/cooking/grocery-list",
  "/cooking/nutrition-calculator"
];

/**
 * Processes potential actions based on the AI response and context.
 */
export function processActions(aiResponse: any, category: string, context: AIContext): any[] {
  const actions: any[] = [];
  
  // Check for navigation intent
  if (aiResponse.suggestions && Array.isArray(aiResponse.suggestions)) {
    // Filter and modify suggestions to ensure they only use valid client-side routes
    const validSuggestions = aiResponse.suggestions.filter((suggestion: AppSuggestion) => {
      if (!suggestion.path) return true;
      return validClientRoutes.includes(suggestion.path);
    });
    
    // If invalid suggestions were filtered out, replace them with valid ones
    if (validSuggestions.length < aiResponse.suggestions.length) {
      // Add home as a safe fallback suggestion
      if (!validSuggestions.some((s: AppSuggestion) => s.path === "/")) {
        validSuggestions.push({
          text: "Would you like to return to the home page?",
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
          // ALWAYS ensure the suggestion text is phrased as a question seeking permission
          let suggestionText = suggestion.text || '';
          
          try {
            // If the suggestion doesn't seem to be asking for permission, reformat it
            if (!suggestionText.includes("?") && 
                !suggestionText.toLowerCase().includes("would you like") &&
                !suggestionText.toLowerCase().includes("should i") &&
                !suggestionText.toLowerCase().includes("do you want")) {
              
              const routeInfo = Object.entries(applicationRoutes).find(([path, _]) => path === suggestion.path);
              
              // Get a meaningful section name - either from route info or from the path
              let sectionName;
              if (routeInfo && routeInfo[1] && routeInfo[1].name) {
                sectionName = routeInfo[1].name;
              } else {
                const pathParts = suggestion.path.split("/").filter(Boolean);
                sectionName = pathParts.length > 0 
                  ? pathParts[pathParts.length - 1].replace(/-/g, ' ') 
                  : 'Home';
                // Function to capitalize the first letter of each word
                const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
                
                // Capitalize each word in the section name
                sectionName = sectionName
                  .split(' ')
                  .map(capitalize)
                  .join(' ');
              }
              
              suggestionText = `Would you like me to take you to the ${sectionName} section?`;
            }
          } catch (error) {
            console.error("Error reformatting suggestion text:", error);
            // Fallback to a safe default
            suggestionText = `Would you like to go to ${suggestion.path}?`;
          }
          
          actions.push({
            type: "navigate",
            payload: {
              route: suggestion.path,
              reason: suggestionText
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
  
  // For emergency category, prioritize emergency routes - but still ask for permission
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
      
      // Even for emergency, we now ask permission
      if (!aiResponse.suggestions) {
        aiResponse.suggestions = [];
      }
      
      // Add the suggestion to navigate to the emergency section
      aiResponse.suggestions.unshift({
        text: `Would you like me to show you our ${routeInfo.name} for assistance?`,
        path: path,
        description: routeInfo.description
      });
    } else {
      // Fallback to the main emergency route if it exists in valid routes
      if (validClientRoutes.includes("/emergency") && !aiResponse.suggestions?.some((s: AppSuggestion) => s.path === "/emergency")) {
        if (!aiResponse.suggestions) {
          aiResponse.suggestions = [];
        }
        
        // Add the suggestion to navigate to the main emergency section
        aiResponse.suggestions.unshift({
          text: "Would you like me to take you to our Emergency Guide for assistance?",
          path: "/emergency",
          description: "Critical information and resources for emergency situations"
        });
      }
    }
  }
  
  // For home maintenance category, suggest the repair assistant tool when appropriate
  if (category === "homeMaintenance" && actions.length === 0) {
    // Check if the repair assistant route exists and is valid
    const repairAssistantPath = "/learning/courses/repair-assistant";
    const repairAssistantInfo = applicationRoutes[repairAssistantPath];
    
    if (repairAssistantInfo && validClientRoutes.includes(repairAssistantPath) && 
        !aiResponse.suggestions?.some((s: AppSuggestion) => s.path === repairAssistantPath)) {
      
      if (!aiResponse.suggestions) {
        aiResponse.suggestions = [];
      }
      
      // Add the suggestion to use the Smart Repair Diagnostic Tool
      aiResponse.suggestions.unshift({
        text: "Would you like me to take you to our Smart Repair Diagnostic Tool to help diagnose your home issue with the camera?",
        path: repairAssistantPath,
        description: repairAssistantInfo.description
      });
    }
  }
  
  return actions;
}