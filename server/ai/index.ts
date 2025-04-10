import { categoryBasedSystemPrompts } from "./category-prompts";
import { applicationRoutes } from "./app-routes";
import { 
  fallbackAIService, 
  Message, 
  AIResponseSchema
} from "./ai-fallback-strategy";
import { getAppFeaturesKnowledge } from "./app-features-knowledge";
import { getFundiPersonalityPrompt } from "./fundi-personality-integration";
import { userGuidePrompt, quickGuideInstructions, contextualGuidance, userGuideContent } from "./user-guide-content";
import { userGuideService } from "../services/user-guide-service";
import { isValidRoute, getSuggestedAlternativeRoute } from "../../shared/valid-routes";

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
    
    // Check if this is a user guide or help-related question
    const isGuideQuestion = 
      message.toLowerCase().includes("how do i") || 
      message.toLowerCase().includes("help me") ||
      message.toLowerCase().includes("show me how") ||
      message.toLowerCase().includes("guide") ||
      message.toLowerCase().includes("tutorial") ||
      message.toLowerCase().includes("instructions");
    
    // If it's a help question and we have context about the current section, 
    // add contextual guidance from the user guide service
    if (isGuideQuestion && context.currentSection) {
      // Get contextual guidance for the current section
      const contextualGuidance = userGuideService.getContextualGuidance(context.currentSection);
      
      // If it appears to be a how-to question and we have a current section
      if (message.toLowerCase().includes("how") && context.currentSection) {
        const howToAnswer = userGuideService.answerHowToQuestion(message, context.currentSection);
        
        // Add this answer to the previous messages so the AI can build on it
        previousMessages.push({
          role: "assistant",
          content: howToAnswer
        });
      }
      
      // Add the contextual guidance to the previous messages
      previousMessages.push({
        role: "system",
        content: `User is currently in the ${context.currentSection} section. Relevant guidance: ${contextualGuidance}`
      });
    }
    
    // Use the determined category to select the right system prompt
    const systemPrompt = constructSystemPrompt(categoryResult.category, context);
    
    // FIRST - Reset the fallback strategy to ensure we're ALWAYS starting fresh
    // This ensures we never get stuck in fallback mode
    fallbackAIService.resetFailures();
    console.log("🔄 ENTRY-POINT RESET: Forced reset of fallback system before every AI request");
    
    // Generate the detailed response using dual API strategy
    const aiResponse = await fallbackAIService.generateResponse(message, systemPrompt, previousMessages);
    
    // Process potential actions based on user intent
    const actions = processActions(aiResponse, categoryResult.category, context);
    
    // Analyze emotion for more detailed sentiment
    const emotionAnalysis = await fallbackAIService.analyzeEmotion(message);
    
    // Add tour guide suggestions if this seems to be a guidance request
    if (isGuideQuestion && context.currentSection && !aiResponse.suggestions) {
      aiResponse.suggestions = [
        { 
          text: "Would you like me to give you a quick tour of this section?", 
          action: {
            type: "startTour",
            payload: {
              section: context.currentSection
            }
          }
        }
      ];
    }
    
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
  // Base behavior: using a specialized prompt based on the category
  let basePrompt = "";
  
  // ENHANCEMENT: For the main Fundi assistant, combine ALL specialized knowledge
  // This ensures Fundi has the complete knowledge of all specialized assistants
  if (category === "general") {
    // Combine all specialized knowledge into Fundi's general prompt
    basePrompt = categoryBasedSystemPrompts.general + "\n\n";
    
    // Add knowledge from all specialized domains
    basePrompt += "# SPECIALIZED DOMAIN KNOWLEDGE\n";
    basePrompt += "You also have access to all specialized knowledge from these domains:\n\n";
    
    // Add finance knowledge
    basePrompt += "## FINANCE KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.finance) + "\n\n";
    
    // Add career knowledge
    basePrompt += "## CAREER KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.career) + "\n\n";
    
    // Add wellness knowledge
    basePrompt += "## WELLNESS KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.wellness) + "\n\n";
    
    // Add learning knowledge
    basePrompt += "## LEARNING KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.learning) + "\n\n";
    
    // Add emergency knowledge
    basePrompt += "## EMERGENCY KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.emergency) + "\n\n";
    
    // Add cooking knowledge
    basePrompt += "## COOKING KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.cooking) + "\n\n";
    
    // Add fitness knowledge
    basePrompt += "## FITNESS KNOWLEDGE\n";
    basePrompt += extractCapabilitiesFromPrompt(categoryBasedSystemPrompts.fitness) + "\n\n";
  } else {
    // Use the specified category prompt for specialized assistants
    basePrompt = categoryBasedSystemPrompts[category] || categoryBasedSystemPrompts.general;
  }
  
  // Add application context 
  let contextInfo = `
    Current application context:
    - Page: ${context.currentPage}
    - Section: ${context.currentSection || 'N/A'}
    - Available Actions: ${context.availableActions.join(", ")}
    
    Application routes you can navigate to:
  `;
  
  // Show ALL routes for Fundi in general mode to ensure complete knowledge
  const relevantRoutes = Object.entries(applicationRoutes)
    .filter(([_, routeInfo]) => 
      category === "general" || routeInfo.categories.includes(category) || routeInfo.categories.includes("all"))
    .map(([path, routeInfo]) => 
      `- ${routeInfo.name}: ${path} - ${routeInfo.description}`);
  
  contextInfo += relevantRoutes.join("\n");
  
  // Load enhanced personality guidelines from the custom personality file
  // This combines our pre-defined personality traits with user customizations
  const personalityGuidelines = getFundiPersonalityPrompt();
  
// Helper function to extract capabilities from specialized prompts
function extractCapabilitiesFromPrompt(prompt: string): string {
  if (!prompt) return "";
  
  // Look for the "Capabilities:" section which typically contains the specialized knowledge
  const capabilitiesMatch = prompt.match(/Capabilities:([\s\S]*?)(?=Limitations:|When responding:|$)/i);
  if (capabilitiesMatch && capabilitiesMatch[1]) {
    return capabilitiesMatch[1].trim();
  }
  
  // If no Capabilities section, try to extract anything useful
  const sections = prompt.split('\n\n');
  for (const section of sections) {
    if (!section.includes("You are") && section.includes("help") && section.length > 100) {
      return section.trim();
    }
  }
  
  return ""; // Return empty string if nothing found
}
  
  // Get comprehensive app features knowledge
  const appFeatures = getAppFeaturesKnowledge();
  
  // Add user-friendly guidance approach
  const userGuidanceApproach = userGuidePrompt;
  
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
    
    CRITICAL FORMATTING RULES:
    1. NEVER use asterisks (*) for emphasis or formatting in your responses
    2. NEVER use markdown-style formatting like **bold** or *italic* text
    3. NEVER use emoji or special characters for formatting
    4. NEVER structure responses like a chatbot with bullet points and sections
    5. Speak naturally like a helpful human mentor would, with a conversational tone
    6. Write in paragraphs with natural pauses, not in a rigid structured format
    
    - "followUpQuestions": Array of 2-3 logical follow-up questions
    - "personality": How you're adapting to match user's communication style (formal, casual, technical, simple)
  `;
  
  return `${basePrompt}\n\n${contextInfo}\n\n${personalityGuidelines}\n\n${appFeatures}\n\n${userGuidanceApproach}\n\n${formatGuidelines}`;
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
  "/fundi-showcase", // Added Fundi showcase page
  
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
  "/learning/identity-documents", // Added identity documents page
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
      // If no path is provided, it's not a navigation suggestion, so keep it
      if (!suggestion.path) return true;
      
      // Check that the path exists using our validated routes utility
      const pathIsValid = isValidRoute(suggestion.path);
      
      // If the route is invalid, try to find an alternative route
      if (!pathIsValid) {
        console.warn(`Invalid route suggested: ${suggestion.path}`);
        const alternativeRoute = getSuggestedAlternativeRoute(suggestion.path);
        
        // Update the suggestion with the valid alternative route
        if (alternativeRoute) {
          console.log(`Replacing invalid route ${suggestion.path} with alternative: ${alternativeRoute}`);
          suggestion.path = alternativeRoute;
          return true;
        } else {
          console.warn(`No alternative found for invalid route: ${suggestion.path}`);
        }
      }
      
      return pathIsValid;
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
        // Verify the path is valid using our route validation utility
        if (isValidRoute(suggestion.path)) {
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
              reason: suggestionText,
              permissionGranted: false, // Default to requiring explicit permission
              requiresPermission: true // Flag that indicates this action needs explicit user permission
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
        // Check if route is both for emergency category and exists in valid routes
        return routeInfo.categories.includes("emergency") && 
               isValidRoute(path);
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
      if (isValidRoute("/emergency") && !aiResponse.suggestions?.some((s: AppSuggestion) => s.path === "/emergency")) {
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
    
    if (repairAssistantInfo && isValidRoute(repairAssistantPath) && 
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