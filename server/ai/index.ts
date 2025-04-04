import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";
import { categoryBasedSystemPrompts } from "./category-prompts";
import { applicationRoutes } from "./app-routes";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Context interface 
interface AIContext {
  currentPage: string;
  currentSection?: string; 
  availableActions: string[];
}

// Response interface
interface AIOrchestrationResponse {
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

// Message interface for conversation history
type MessageRole = "user" | "assistant" | "system";

interface Message {
  role: MessageRole;
  content: string;
}

/**
 * Orchestrates the AI response by determining intent, selecting the appropriate system prompt,
 * and formatting the response for the frontend.
 */
export async function orchestrateAIResponse(
  message: string,
  context: AIContext,
  category?: string,
  previousMessages: Message[] = []
): Promise<AIOrchestrationResponse> {
  // First, determine the user's intent and what category/advisor would be best
  const categoryResult = await determineCategory(message, category);
  
  // Use the determined category to select the right system prompt
  const systemPrompt = constructSystemPrompt(categoryResult.category, context);
  
  // Generate the detailed response
  const aiResponse = await generateResponse(message, systemPrompt, previousMessages);
  
  // Process potential actions based on user intent
  const actions = processActions(aiResponse, categoryResult.category, context);
  
  // Construct final response
  return {
    response: aiResponse.response,
    actions: actions,
    suggestions: aiResponse.suggestions || [],
    category: categoryResult.category,
    sentiment: aiResponse.sentiment || "neutral",
    confidence: categoryResult.confidence,
    followUpQuestions: aiResponse.followUpQuestions || []
  };
}

/**
 * Determines which category the user's message belongs to.
 */
async function determineCategory(
  message: string, 
  preferredCategory?: string
): Promise<{ category: string; confidence: number }> {
  // If a category is already provided and valid, respect that
  if (preferredCategory && Object.keys(categoryBasedSystemPrompts).includes(preferredCategory)) {
    return { category: preferredCategory, confidence: 1.0 };
  }
  
  // Otherwise, determine the most appropriate category
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
      3. "reasoning": Brief explanation for your choice
    `;
    
    const response = await openai.chat.completions.create({
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
    console.error("Error determining category:", error);
    // Default to general category if there's an error
    return { category: "general", confidence: 0.5 };
  }
}

/**
 * Constructs the system prompt based on category and context.
 */
function constructSystemPrompt(category: string, context: AIContext): string {
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
    - "response": Your helpful answer (plain text, no markdown)
    - "sentiment": The emotional tone of your response (encouraging, neutral, cautious, etc.)
    - "suggestions": Array of follow-up actions, each with text and optional path
    - "followUpQuestions": Array of 2-3 logical follow-up questions
    - "personality": How you're adapting to match user's communication style (formal, casual, technical, simple)
  `;
  
  return `${basePrompt}\n\n${contextInfo}\n\n${personalityGuidelines}\n\n${formatGuidelines}`;
}

/**
 * Generates the AI response using the OpenAI API.
 */
async function generateResponse(
  message: string,
  systemPrompt: string,
  previousMessages: Message[]
): Promise<any> {
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    // Parse and return the response
    if (!response.choices[0].message?.content) {
      throw new Error("Empty response from OpenAI");
    }
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating response:", error);
    // Provide a fallback response
    return {
      response: "I'm sorry, I couldn't process your request right now. Could you please try again?",
      sentiment: "apologetic",
      suggestions: [],
      followUpQuestions: []
    };
  }
}

/**
 * Processes potential actions based on the AI response and context.
 */
function processActions(aiResponse: any, category: string, context: AIContext): any[] {
  const actions = [];
  
  // Check for navigation intent
  if (aiResponse.suggestions && Array.isArray(aiResponse.suggestions)) {
    for (const suggestion of aiResponse.suggestions) {
      if (suggestion.path) {
        // Find the matching route
        const route = Object.entries(applicationRoutes).find(([path]) => path === suggestion.path);
        
        if (route) {
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
    const emergencyRoutes = Object.entries(applicationRoutes)
      .filter(([_, routeInfo]) => routeInfo.categories.includes("emergency"));
    
    if (emergencyRoutes.length > 0) {
      const [path, routeInfo] = emergencyRoutes[0];
      actions.push({
        type: "navigate",
        payload: {
          route: path,
          reason: `I'm redirecting you to our ${routeInfo.name} for immediate assistance.`
        }
      });
    }
  }
  
  return actions;
}