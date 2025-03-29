import { 
  textClassifier, 
  entityRecognizer, 
  textSummarizer, 
  questionAnswerer, 
  textGenerator,
  analyzeUserEmotion,
  getContentCategory
} from "../huggingface";
import OpenAI from "openai";
import { 
  openaiClient, 
  generateResponse, 
  analyzeSentiment, 
  extractStructuredData 
} from "../openai";

// Specialized AI advisor roles
export type AdvisorRole = 
  | 'financial_coach'
  | 'career_mentor'
  | 'wellness_guide'
  | 'learning_facilitator'
  | 'emergency_assistant'
  | 'cooking_expert'
  | 'fitness_coach'
  | 'general_assistant';

// Context for AI processing
export interface AIContext {
  currentPage: string;
  currentSection?: string;
  availableActions: string[];
  userIntent?: string;
  previousInteractions?: string[];
  userProfile?: {
    interests?: string[];
    skills?: string[];
    goals?: string[];
    emotionalState?: string;
  };
}

// Types of AI actions the assistant can suggest
export interface AIAction {
  type: 'navigate' | 'fill_form' | 'show_guide' | 'trigger_feature' | 'general';
  payload: {
    route?: string;
    formData?: Record<string, any>;
    guideSection?: string;
    feature?: string;
    section?: string;
    focusContent?: string;
    formId?: string;
    autoFocus?: boolean;
    [key: string]: any;
  };
}

// Suggestion format for the AI to provide follow-up actions
export interface AppSuggestion {
  text: string;
  path: string;
  description: string;
}

// Complete response structure from AI processing
export interface AIProcessingResult {
  response: string;
  actions?: AIAction[];
  suggestions?: AppSuggestion[];
  category?: string;
  sentiment?: string;
  confidence?: number;
  followUpQuestions?: string[];
}

// System prompts for different specialized AI advisors
const specializedPrompts: Record<AdvisorRole, string> = {
  financial_coach: `You are a Financial Coach, specializing in personal finance guidance.
    Focus on practical advice about budgeting, saving, investing, debt management, and financial planning.
    
    Key communication guidelines:
    1. Be relatable yet sophisticated - use everyday examples to explain financial concepts.
    2. Every piece of advice must include WHY it matters (the benefit) and HOW to do it (specific steps).
    3. Always connect advice to app features - direct users to specific tools like "Go to Finance > Budget Planner."
    4. Provide concrete numbers and examples rather than generalizations.
    5. Avoid jargon, but when you use technical terms, immediately explain them.
    6. Break down complex financial concepts into simple, actionable steps.
    7. Be non-judgmental about financial situations while being clear about best practices.
    
    Remember, you're helping users develop real financial literacy and confidence through practical guidance.`,

  career_mentor: `You are a Career Development Mentor, helping users with their professional growth.
    Focus on career planning, skill development, job search strategies, resume building, and interview preparation.
    
    Key communication guidelines:
    1. Be encouraging yet realistic - balance optimism with practical advice.
    2. All career guidance must include WHY a strategy works and HOW to implement it step-by-step.
    3. Connect all advice to app features - direct users to specific tools like "Go to Career > Resume Builder."
    4. Use industry examples and scenarios to make advice relatable and concrete.
    5. When recommending skills to develop, explain how they translate to real job opportunities.
    6. Provide specific metrics for success (e.g., "Aim for 3-5 networking conversations per week").
    7. Adapt recommendations based on experience level - provide different paths for beginners vs. experienced.
    
    Remember, you're helping users build career confidence through specific, actionable guidance.`,
    
  wellness_guide: `You are a Wellness Guide, supporting users in their mental and emotional well-being.
    Focus on stress management, mindfulness, emotional intelligence, and healthy habits.
    
    Key communication guidelines:
    1. Use a compassionate, non-judgmental tone while providing concrete guidance.
    2. For every wellness technique, explain WHY it works (the science) and HOW to practice it (steps).
    3. Connect advice to app features - direct users to specific tools like "Go to Wellness > Meditation Guide."
    4. Provide immediate relief techniques alongside longer-term practices.
    5. Suggest small, measurable daily actions rather than overwhelming lifestyle changes.
    6. Acknowledge emotions and validate experiences without diagnosing medical conditions.
    7. Include clear timeframes and expected outcomes (e.g., "Try this 2-minute breathing exercise when you feel anxious").
    
    Remember, you're helping users develop practical self-awareness and resilience through accessible techniques.`,
    
  learning_facilitator: `You are a Learning Facilitator, helping users develop effective learning strategies.
    Focus on study techniques, knowledge retention, critical thinking, and educational resources.
    
    Key communication guidelines:
    1. Be encouraging and enthusiastic while providing structured, practical advice.
    2. For every learning technique, explain WHY it's effective (the science) and HOW to implement it (step-by-step).
    3. Connect advice to app features - direct users to specific tools like "Go to Learning > Study Planner."
    4. Tailor recommendations to different learning styles (visual, auditory, kinesthetic, reading/writing).
    5. Break complex concepts into manageable "learning chunks" with specific timeframes.
    6. Emphasize practical application - show how each skill transfers to real-world situations.
    7. Suggest metrics to track progress (e.g., "After using this technique for a week, you should notice...").
    
    Remember, you're helping users become confident, efficient learners through practical, personalized strategies.`,
    
  emergency_assistant: `You are an Emergency Assistant, providing guidance in urgent situations.
    Focus on clear, step-by-step instructions for common emergency scenarios.
    
    Key communication guidelines:
    1. Use a calm, direct tone that reduces panic while conveying appropriate urgency.
    2. Structure all emergency guidance in numbered, sequential steps (no more than 5 steps).
    3. ALWAYS begin serious emergency advice with "Call emergency services (911 in US)" as step 1.
    4. Prioritize life-saving information and immediate safety measures above all else.
    5. Provide specific "do this NOW" instructions rather than general advice or explanations.
    6. Connect guidance to app features like "Open Emergency > First Aid Guide" when appropriate.
    7. After providing immediate guidance, suggest preventive measures for the future.
    
    Remember, you're helping users navigate stressful situations with clarity, directness, and life-saving information.`,
    
  cooking_expert: `You are a Cooking Expert, guiding users in culinary skills and knowledge.
    Focus on recipes, techniques, ingredient substitutions, meal planning, and food safety.
    Be encouraging and emphasize that cooking skills develop with practice.
    Explain cooking terminology and techniques in accessible language.
    Suggest adaptations for different dietary needs and preferences.
    Provide troubleshooting advice for common cooking challenges.
    Remember, you're helping users build cooking confidence and creativity.`,
    
  fitness_coach: `You are a Fitness Coach, supporting users in physical activity and exercise.
    Focus on workout guidance, proper form, routine building, and realistic goal setting.
    Be motivating while emphasizing safety and appropriate progression.
    Adapt recommendations for various fitness levels and physical limitations.
    Explain the "why" behind exercise recommendations when helpful.
    Emphasize consistency over intensity for beginners.
    Remember, you're helping users develop sustainable fitness habits and body awareness.`,
    
  general_assistant: `You are Fundi, Fundamenta's AI Assistant, capable of helping users across all app features.
    Your role is to understand user intent and guide them to the right features while helping them complete tasks.
    
    Key communication guidelines:
    1. Be relatable yet sophisticated. Use everyday language while conveying expertise.
    2. Always provide actionable advice with specific links or steps.
    3. For every piece of advice, explain WHY it matters and HOW to implement it.
    4. When suggesting features, provide direct navigation instructions like "Tap on Finance > Budget" 
       or use the navigation actions in your response.
    5. Break down complex concepts into simple, understandable parts.
    6. Avoid generic advice - be specific and personalized based on context.
    7. When providing information, connect it to a relevant feature in the app.
    
    Identify which specialized area would best help the user and direct them appropriately.
    When unsure about user needs, ask clarifying questions.
    Remember, your goal is to make life skills accessible and manageable for everyone.`
};

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user

/**
 * AI Service that combines OpenAI and Hugging Face capabilities
 * to provide intelligent responses across different domains
 */
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = openaiClient;
  }

  /**
   * The main function that orchestrates AI processing of user messages
   */
  async processUserMessage(
    message: string,
    context: AIContext,
    category: string,
    previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
  ): Promise<AIProcessingResult> {
    try {
      let emotionAnalysis, detectedCategory;
      
      // 1. Use HuggingFace to analyze message for emotion and content category
      // Handle each analysis separately for better error handling
      try {
        emotionAnalysis = await analyzeUserEmotion(message);
      } catch (error) {
        console.warn("Emotion analysis failed, using defaults:", error);
        emotionAnalysis = {
          primaryEmotion: 'neutral',
          emotionScore: 0.5,
          emotions: [{ emotion: 'neutral', score: 0.5 }]
        };
      }
      
      try {
        detectedCategory = category ? category : await getContentCategory(message);
      } catch (error) {
        console.warn("Category detection failed, using defaults:", error);
        detectedCategory = category || 'general';
      }

      // 2. Determine the appropriate AI advisor role based on category  
      const advisorRole = this.mapCategoryToAdvisorRole(category || detectedCategory);

      // 3. Get the specialized system prompt for this advisor
      const systemPrompt = specializedPrompts[advisorRole];

      // 4. Enhance context with emotion analysis
      const enhancedContext = {
        ...context,
        userProfile: {
          ...context.userProfile,
          emotionalState: emotionAnalysis.primaryEmotion
        }
      };

      // 5. Generate the primary AI response using OpenAI
      const response = await this.generateOpenAIResponse(
        message,
        enhancedContext,
        systemPrompt,
        previousMessages
      );

      // 6. Return the complete result
      return {
        ...response,
        category: category || detectedCategory,
        sentiment: emotionAnalysis.primaryEmotion,
        confidence: emotionAnalysis.emotionScore
      };
    } catch (error) {
      console.error("AI Processing Error:", error);
      
      // Instead of throwing an error, return a fallback response
      return {
        response: "I'm having trouble processing your request right now. Let me try to help with a simpler response. What specific information or assistance do you need?",
        category: category || 'general',
        sentiment: 'neutral',
        confidence: 0.5,
        actions: [],
        suggestions: [],
        followUpQuestions: [
          "Could you rephrase your question?",
          "Would you like me to explain something specific?",
          "Can I help with a different topic?"
        ]
      };
    }
  }

  /**
   * Maps a category string to the appropriate advisor role
   */
  private mapCategoryToAdvisorRole(category: string): AdvisorRole {
    const categoryMap: Record<string, AdvisorRole> = {
      finance: 'financial_coach',
      career: 'career_mentor',
      wellness: 'wellness_guide',
      learning: 'learning_facilitator',
      emergency: 'emergency_assistant',
      cooking: 'cooking_expert',
      fitness: 'fitness_coach'
    };

    return categoryMap[category] || 'general_assistant';
  }

  /**
   * Generates a response using OpenAI
   */
  private async generateOpenAIResponse(
    message: string,
    context: AIContext,
    systemPrompt: string,
    previousMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  ): Promise<AIProcessingResult> {
    // Build the complete system content with context information
    const systemContent = `${systemPrompt}

    Current Context:
    - Page: ${context.currentPage}
    - Section: ${context.currentSection || 'None'}
    - Available Actions: ${context.availableActions.join(', ')}
    - User Intent: ${context.userIntent || 'Unknown'}
    - User Emotional State: ${context.userProfile?.emotionalState || 'Unknown'}
    
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
      "suggestions": Array<{text: string, path: string, description: string}>,
      "followUpQuestions": Array<string>
    }`;

    try {
      const oaiResponse = await this.openai.chat.completions.create({
        model: "gpt-4o", // Use the newest model
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
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const jsonResponse = JSON.parse(oaiResponse.choices[0].message.content || "{}");
      
      // Check for navigation intents in the message
      let actions = jsonResponse.actions || [];
      
      // Process for navigation commands like "show me financial section" or "take me to career"
      const navigationPatterns = [
        /show me (?:the )?(\w+)(?:\s+section)?/i,
        /take me to (?:the )?(\w+)(?:\s+section)?/i,
        /go to (?:the )?(\w+)(?:\s+section)?/i,
        /navigate to (?:the )?(\w+)(?:\s+section)?/i,
        /open (?:the )?(\w+)(?:\s+section)?/i,
      ];
      
      const sectionKeywords: Record<string, string[]> = {
        'finance': ['finance', 'financial', 'money', 'budget', 'invest'],
        'career': ['career', 'job', 'resume', 'interview', 'profession'],
        'wellness': ['wellness', 'health', 'mental', 'meditation', 'mindfulness'],
        'emergency': ['emergency', 'urgent', 'crisis', 'help', 'disaster'],
        'learning': ['learning', 'learn', 'education', 'study', 'course'],
        'active': ['active', 'fitness', 'exercise', 'workout', 'gym'],
      };
      
      let shouldNavigate = false;
      let navigationTarget = '';
      
      // First check for explicit navigation patterns
      for (const pattern of navigationPatterns) {
        const match = message.toLowerCase().match(pattern);
        if (match && match[1]) {
          const requestedSection = match[1].toLowerCase();
          
          // Direct match to a section
          if (Object.keys(sectionKeywords).includes(requestedSection)) {
            navigationTarget = requestedSection;
            shouldNavigate = true;
            break;
          }
          
          // Check if the requested term is in the keywords for a section
          for (const [section, keywords] of Object.entries(sectionKeywords)) {
            if (keywords.includes(requestedSection)) {
              navigationTarget = section;
              shouldNavigate = true;
              break;
            }
          }
          
          if (shouldNavigate) break;
        }
      }
      
      // Add navigation action if needed and not already present
      if (shouldNavigate && navigationTarget && !actions.some((a: any) => 
        a.type === 'navigate' && a.payload?.route === `/${navigationTarget}`
      )) {
        // Extract section info if mentioned
        let sectionTarget = '';
        const sectionPatterns = [
          /(?:the )?(\w+) feature/i,
          /(?:the )?(\w+) tool/i,
          /(?:the )?(\w+) planner/i,
          /(?:the )?(\w+) calculator/i,
          /(?:the )?(\w+) dashboard/i,
          /(?:open|show|display) (?:the )?(\w+)/i,
        ];
        
        // Section keyword mappings for each category
        const sectionKeywordMappings: Record<string, Record<string, string>> = {
          'finance': {
            'advisor': 'advisor',
            'ai': 'advisor',
            'chat': 'advisor',
            'budget': 'budget',
            'spending': 'budget',
            'planner': 'budget',
            'dashboard': 'dashboard',
            'overview': 'dashboard',
            'credit': 'credit',
            'score': 'credit',
            'retirement': 'retirement',
            'saving': 'retirement',
            'future': 'retirement',
            'mortgage': 'mortgage',
            'loan': 'mortgage',
            'house': 'mortgage',
            'bank': 'bank',
            'account': 'bank',
            'transaction': 'bank'
          },
          'career': {
            'advisor': 'advisor',
            'ai': 'advisor',
            'chat': 'advisor',
            'resume': 'resume',
            'cv': 'resume',
            'builder': 'resume',
            'jobs': 'jobs',
            'search': 'jobs',
            'listing': 'jobs',
            'interview': 'interview',
            'prep': 'interview',
            'skill': 'skills',
            'learning': 'skills',
            'development': 'skills',
            'networking': 'networking',
            'connection': 'networking',
            'planning': 'planning',
            'path': 'planning',
            'goal': 'planning'
          }
        };
        
        // Check for specific section mentions in the message
        for (const pattern of sectionPatterns) {
          const match = message.toLowerCase().match(pattern);
          if (match && match[1]) {
            const requestedFeature = match[1].toLowerCase();
            
            // Check if this maps to a valid section for the navigation target
            if (navigationTarget in sectionKeywordMappings) {
              const sectionMap = sectionKeywordMappings[navigationTarget];
              
              for (const [keyword, sectionId] of Object.entries(sectionMap)) {
                if (requestedFeature.includes(keyword) || keyword.includes(requestedFeature)) {
                  sectionTarget = sectionId;
                  break;
                }
              }
            }
            
            if (sectionTarget) break;
          }
        }
        
        // Create the navigation action with optional section target
        const navPayload: any = { route: `/${navigationTarget}` };
        if (sectionTarget) {
          navPayload.section = sectionTarget;
        }
        
        actions.push({
          type: 'navigate',
          payload: navPayload
        });
        
        // Update response to acknowledge navigation if not already mentioned
        if (!jsonResponse.response.toLowerCase().includes(navigationTarget)) {
          let responsePrefix = `I'll take you to the ${navigationTarget} section`;
          if (sectionTarget) {
            responsePrefix += ` and open the ${sectionTarget} feature`;
          }
          jsonResponse.response = `${responsePrefix}. ${jsonResponse.response}`;
        }
      }

      // Ensure consistent response format
      return {
        response: jsonResponse.response || "I apologize, I couldn't process that request.",
        actions: actions.map((action: any) => ({
          type: action.type,
          payload: action.payload
        })),
        suggestions: jsonResponse.suggestions?.map((suggestion: any) => ({
          text: suggestion.text,
          path: suggestion.path,
          description: suggestion.description
        })),
        followUpQuestions: jsonResponse.followUpQuestions || []
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      
      // Instead of throwing errors, provide a fallback response
      return {
        response: "I apologize, but I'm having trouble processing your request at the moment. Could you please try again with a simpler question?",
        actions: [],
        suggestions: [],
        followUpQuestions: [
          "Could you rephrase your question?", 
          "Can I help with something else?"
        ]
      };
    }
  }

  /**
   * Specialized method for resume analysis using both OpenAI and HuggingFace
   */
  async analyzeResume(resumeText: string): Promise<{
    summary: string;
    skills: string[];
    experience: string[];
    education: string[];
    suggestions: string[];
  }> {
    try {
      // Extract entities from resume using HuggingFace
      const entities = await entityRecognizer.extractEntities(resumeText);
      
      // Generate resume summary using HuggingFace
      const summary = await textSummarizer.summarize(resumeText, 200);
      
      // Use OpenAI for detailed analysis and suggestions
      const analysisPrompt = `
        You are a career expert specializing in resume analysis. 
        Extract key information from this resume and provide constructive feedback.
        
        Resume text:
        ${resumeText}
        
        Return your analysis in JSON format with these fields:
        {
          "skills": Array<string>, // List of professional skills found
          "experience": Array<string>, // Key work experiences
          "education": Array<string>, // Educational background
          "suggestions": Array<string> // Specific improvement suggestions
        }
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        summary,
        skills: analysis.skills || [],
        experience: analysis.experience || [],
        education: analysis.education || [],
        suggestions: analysis.suggestions || []
      };
    } catch (error) {
      console.error("Resume Analysis Error:", error);
      
      // Return a simplified fallback response
      return {
        summary: "I was unable to fully analyze the resume at this time.",
        skills: ["Unable to extract skills at this time"],
        experience: ["Could not process experience details"],
        education: ["Education information could not be analyzed"],
        suggestions: [
          "Consider checking the resume format and trying again",
          "Make sure the resume text is clear and well-structured",
          "Try uploading a different file format if available"
        ]
      };
    }
  }

  /**
   * Specialized method for journal/wellness analysis using both OpenAI and HuggingFace
   */
  async analyzeJournalEntry(journalText: string): Promise<{
    emotions: Array<{label: string, score: number}>;
    topics: string[];
    themes: string[];
    insights: string[];
    wordCloud: Array<{text: string, value: number}>;
  }> {
    try {
      // Analyze emotions using HuggingFace
      const emotions = await textClassifier.classifyEmotion(journalText);
      
      // Use OpenAI for thematic analysis
      const analysisPrompt = `
        You are a reflective journaling assistant with expertise in psychological well-being.
        Analyze this journal entry to identify key themes, topics, and potential insights.
        
        Journal entry:
        ${journalText}
        
        Return your analysis in JSON format with these fields:
        {
          "topics": Array<string>, // Main topics discussed
          "themes": Array<string>, // Underlying emotional or narrative themes
          "insights": Array<string>, // Potential insights or patterns
          "wordCloud": Array<{text: string, value: number}> // Important words with relative importance (1-10)
        }
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.4,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        emotions,
        topics: analysis.topics || [],
        themes: analysis.themes || [],
        insights: analysis.insights || [],
        wordCloud: analysis.wordCloud || []
      };
    } catch (error) {
      console.error("Journal Analysis Error:", error);
      
      // Return a simplified fallback response
      return {
        emotions: [{ label: "neutral", score: 0.5 }],
        topics: ["Unable to analyze topics at this time"],
        themes: ["Journal analysis unavailable"],
        insights: ["Try again with a simpler entry"],
        wordCloud: [
          { text: "journal", value: 5 },
          { text: "entry", value: 5 },
          { text: "analysis", value: 5 }
        ]
      };
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();