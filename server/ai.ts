import OpenAI from "openai";

// Interfaces
interface AIAction {
  type: 'resume' | 'recipe' | 'budget' | 'career' | 'wellness' | 'general';
  payload: any;
}

interface ChatContext {
  currentPage: string;
  currentSection?: string;
  availableActions: string[];
  userData?: any;
}

interface ResumeData {
  targetPosition: string;
  content: string;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000,
});

// Update the system prompts to include action capabilities
const systemPrompts = {
  orchestrator: `You are Fundamenta's AI Assistant, capable of helping users across all app features.

  Available Actions:
  1. Resume Management:
     - Edit and improve resumes
     - Generate cover letters
     - Provide interview tips

  2. Recipe Generation:
     - Create personalized recipes
     - Suggest meal plans
     - Provide cooking tips

  3. Financial Management:
     - Update budgets
     - Analyze spending patterns
     - Provide financial advice

  4. Career Development:
     - Career path suggestions
     - Skill development plans
     - Job search strategies

  5. Wellness Support:
     - Mental health resources
     - Exercise recommendations
     - Meditation guidance

  Important Guidelines:
  1. Always understand the current context before suggesting actions
  2. Provide specific steps for accessing features
  3. Maintain conversation history for context
  4. Use available app features before suggesting external resources`
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
    - Available Actions: ${context.availableActions.join(', ')}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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

    return {
      response: jsonResponse.response || "I apologize, I couldn't process that request.",
      actions: jsonResponse.actions,
      suggestions: jsonResponse.suggestions
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to process request: " + error.message);
  }
}

// Helper functions
function getPreferredStyle(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter(m => m.role === "user");
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

function getInterests(messages: { role: string; content: string }[]): string {
  const content = messages.map(m => m.content.toLowerCase()).join(" ");

  if (content.includes("career") || content.includes("job")) return "career development";
  if (content.includes("learn") || content.includes("study")) return "education";
  if (content.includes("health") || content.includes("exercise")) return "wellness";
  if (content.includes("money") || content.includes("budget")) return "finance";

  return "general";
}

function getLearningStyle(messages: { role: string; content: string }[]): string {
  const content = messages.map(m => m.content.toLowerCase()).join(" ");

  if (content.includes("show") || content.includes("see")) return "visual";
  if (content.includes("explain") || content.includes("tell")) return "auditory";
  if (content.includes("try") || content.includes("practice")) return "kinesthetic";

  return "mixed";
}

export { getPreferredStyle, getInterests, getLearningStyle, orchestrateAIResponse };