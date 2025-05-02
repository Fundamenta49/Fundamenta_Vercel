import type { Message } from "./ai-fallback-strategy";

// Map topics to specific disclaimer language
const topicDisclaimerMap: Record<string, string> = {
  nutrition: "Remember this is educational information, not personalized nutrition advice. Individual dietary needs vary and may require consultation with a registered dietitian or healthcare provider.",
  
  exercise: "This represents general fitness information, not personalized training advice. Exercise programs should be tailored to individual fitness levels, health conditions, and goals. Consider consulting with a fitness professional for personalized guidance.",
  
  mental_health: "This is educational content about mental wellbeing, not psychological treatment or therapy. If you're experiencing significant mental health challenges, please consider speaking with a mental health professional.",
  
  finance: "This is educational financial information, not personalized investment or financial advice. Consider consulting with financial professionals for guidance specific to your financial situation.",
  
  legal: "This represents general information about legal concepts, not legal advice. Laws vary by jurisdiction and individual situations differ. Consider consulting with a legal professional for advice on your specific situation.",
  
  medication: "This information is educational and should not be used to make medication decisions. Always consult with a healthcare provider before starting, stopping, or changing any medication.",
  
  employment: "This is general information about employment concepts, not personalized career or workplace advice. Employment laws and practices vary by location and industry. Consider consulting with a career counselor or employment attorney for your specific situation."
};

// Detect topics in user message
export function detectTopics(message: string): string[] {
  const topics: string[] = [];
  
  const topicKeywords: Record<string, string[]> = {
    nutrition: ["diet", "food", "eat", "nutrition", "meal", "calorie", "weight", "vitamin", "protein", "carb", "fat"],
    exercise: ["workout", "exercise", "fitness", "training", "cardio", "strength", "gym", "running", "weights", "muscle"],
    mental_health: ["anxiety", "depression", "therapy", "mental health", "stress", "emotions", "mood", "therapist", "psychiatrist"],
    finance: ["money", "budget", "invest", "finance", "loan", "mortgage", "tax", "retirement", "debt", "credit", "insurance"],
    legal: ["legal", "law", "rights", "contract", "attorney", "court", "lawsuit", "sue", "lawyer", "liability"],
    medication: ["medicine", "drug", "prescription", "side effect", "dosage", "medication", "pill", "treatment"],
    employment: ["job", "career", "interview", "resume", "workplace", "employer", "salary", "benefits", "hr", "promotion"]
  };
  
  // Check each topic
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
}

// Add appropriate disclaimers to system prompt
export function injectDisclaimers(
  systemPrompt: string, 
  userMessage: string
): string {
  const topics = detectTopics(userMessage);
  let modifiedPrompt = systemPrompt;
  
  // For each detected topic, add appropriate disclaimer guidance
  topics.forEach(topic => {
    if (topicDisclaimerMap[topic]) {
      modifiedPrompt += `\n\nWhen responding about ${topic}: ${topicDisclaimerMap[topic]}`;
    }
  });
  
  return modifiedPrompt;
}

// Insert into the AI response generation pipeline
export function enhanceSystemPromptWithDisclaimers(
  messages: Message[], 
  userMessage: string
): Message[] {
  // Find the system message
  const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
  
  if (systemMessageIndex >= 0) {
    // Clone the messages array
    const enhancedMessages = [...messages];
    
    // Get the original system prompt
    const originalSystemPrompt = enhancedMessages[systemMessageIndex].content;
    
    // Add disclaimers based on detected topics
    const enhancedSystemPrompt = injectDisclaimers(originalSystemPrompt, userMessage);
    
    // Update the system message
    enhancedMessages[systemMessageIndex] = {
      ...enhancedMessages[systemMessageIndex],
      content: enhancedSystemPrompt
    };
    
    return enhancedMessages;
  }
  
  // If no system message found, return original messages
  return messages;
}

// Function to detect potential crisis situations in user messages
export function detectCrisis(message: string): boolean {
  const crisisKeywords = [
    "suicide", "kill myself", "want to die", "end my life",
    "hurt myself", "self-harm", "cutting myself",
    "domestic violence", "being abused", "spouse hit",
    "emergency", "overdose", "immediate help"
  ];
  
  return crisisKeywords.some(word => 
    message.toLowerCase().includes(word)
  );
}

// Determine the type of crisis for appropriate response
export function determineCrisisType(message: string): string {
  const message_lower = message.toLowerCase();
  
  if (message_lower.includes("suicide") || 
      message_lower.includes("kill myself") || 
      message_lower.includes("want to die") || 
      message_lower.includes("end my life")) {
    return "suicide";
  }
  
  if (message_lower.includes("hurt myself") || 
      message_lower.includes("self-harm") || 
      message_lower.includes("cutting myself")) {
    return "self_harm";
  }
  
  if (message_lower.includes("domestic violence") || 
      message_lower.includes("being abused") || 
      message_lower.includes("spouse hit") || 
      message_lower.includes("partner hurt")) {
    return "domestic_violence";
  }
  
  if (message_lower.includes("overdose") || 
      message_lower.includes("took too many pills") || 
      message_lower.includes("drug overdose")) {
    return "substance";
  }
  
  // Default crisis type if specific one can't be determined
  return "general";
}