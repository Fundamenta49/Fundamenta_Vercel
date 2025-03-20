import OpenAI from "openai";

// Enhanced interfaces
interface AIAction {
  type: 'navigate' | 'fill_form' | 'show_guide' | 'trigger_feature' | 'general';
  payload: {
    route?: string;
    formData?: Record<string, any>;
    guideSection?: string;
    feature?: string;
    section?: string; // Added section field for navigation
    focusContent?: string; // Added focusContent for show_guide
    formId?: string; // Added formId for fill_form
    autoFocus?: boolean; // Added autoFocus for fill_form
    [key: string]: any;
  };
}

interface ChatContext {
  currentPage: string;
  currentSection?: string;
  availableActions: string[];
  userIntent?: string;
  previousInteractions?: string[];
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000,
});

const systemPrompts = {
  orchestrator: `You are Fundi, Fundamenta's AI Assistant, capable of helping users across all app features.
    Your role is to understand user intent and guide them to the right features while helping them complete tasks.

    When responding to cooking-related queries:
    1. First navigate to the cooking section
    2. Specify the exact subsection (recipes, techniques, meal-planning)
    3. Include relevant content focus

    Example for cooking scallops:
    {
      "response": "I'll help you learn how to cook scallops! Let's go to our cooking section where you'll find detailed instructions.",
      "actions": [
        {
          "type": "navigate",
          "payload": {
            "route": "/cooking",
            "section": "recipes",
            "focusContent": "seafood"
          }
        },
        {
          "type": "show_guide",
          "payload": {
            "guideSection": "scallops",
            "focusContent": "preparation"
          }
        }
      ],
      "suggestions": [
        {
          "text": "View related seafood recipes",
          "path": "/cooking/recipes/seafood",
          "description": "Explore other seafood cooking techniques"
        }
      ]
    }

    Always follow this pattern for all sections:
    1. Navigation action must come first
    2. Include specific section and subsection information
    3. Provide focused content guidance
    4. Add relevant suggestions for further exploration

    Content Areas and Their Sections:
    - Cooking (/cooking):
      - recipes
      - techniques
      - meal-planning

    - Career (/career):
      - planning
      - skill-matching
      - interview-prep

    - Finance (/finance):
      - budgeting
      - investing
      - planning

    - Wellness (/wellness):
      - stress-management
      - meditation
      - sleep

    - Learning (/learning):
      - study-tips
      - skill-development
      - time-management

    - Fitness (/fitness):
      - workout-plans
      - nutrition
      - tracking

    Always include complete navigation paths and section identifiers in your actions.
    Maintain a friendly, conversational tone while providing clear, actionable guidance.`
};

export async function orchestrateAIResponse(
  message: string,
  context: ChatContext,
  previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
): Promise<{
  response: string;
  actions?: AIAction[];
  suggestions?: Array<{
    text: string;
    path: string;
    description: string;
  }>;
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const systemContent = `${systemPrompts.orchestrator}

    Current Context:
    - Page: ${context.currentPage}
    - Section: ${context.currentSection || 'None'}
    - Available Actions: ${context.availableActions.join(', ')}
    - User Intent: ${context.userIntent || 'Unknown'}
    
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
      "suggestions": Array<{text: string, path: string, description: string}>
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
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
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(response.choices[0].message.content || "{}");

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
      }))
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to process request: " + error.message);
  }
}

export function getPreferredStyle(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter(m => m.role === "user");
  if (userMessages.length === 0) return "concise";

  const avgLength = userMessages.reduce((acc, m) => acc + m.content.length, 0) / userMessages.length;
  const hasQuestions = userMessages.some(m => m.content.includes("?"));
  const hasTechnicalTerms = userMessages.some(m => 
    m.content.match(/\b(api|function|code|error|bug|interface|component)\b/i)
  );

  if (avgLength > 100) return "detailed";
  if (hasQuestions) return "inquisitive";
  if (hasTechnicalTerms) return "technical";
  return "concise";
}

export function getInterests(messages: { role: string; content: string }[]): string[] {
  const content = messages.map(m => m.content.toLowerCase()).join(" ");
  const interests = [];

  if (content.includes("car") || content.includes("vehicle")) interests.push("vehicle");
  if (content.includes("cook") || content.includes("recipe")) interests.push("cooking");
  if (content.includes("job") || content.includes("career")) interests.push("career");
  if (content.includes("money") || content.includes("budget")) interests.push("finance");
  if (content.includes("learn") || content.includes("study")) interests.push("education");
  if (content.includes("health") || content.includes("exercise")) interests.push("wellness");

  return interests;
}

export function analyzeUserIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("show me") || lowerMessage.includes("how to")) {
    return "guide_request";
  }
  if (lowerMessage.includes("create") || lowerMessage.includes("make")) {
    return "creation_request";
  }
  if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
    return "assistance_request";
  }
  if (lowerMessage.includes("what") || lowerMessage.includes("why") || lowerMessage.includes("how")) {
    return "information_request";
  }

  return "general_request";
}