import OpenAI from "openai";
import { textClassifier, analyzeUserEmotion, getContentCategory } from "../huggingface";
import type { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { getFundiPersonalityElements } from "./fundi-personality-integration";
import { userGuideService } from "../services/user-guide-service";
import { userGuideContent, quickGuideInstructions } from "./user-guide-content";

// Initialize OpenAI client - moved to the OpenAIProvider class
// This ensures proper initialization in both development and production environments

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
      path: z.union([z.string(), z.null()]).optional(),
      description: z.string().optional(),
      action: z.any().optional()
    })
  ).optional(),
  followUpQuestions: z.array(z.string()).optional(),
  personality: z.string().optional(),
  isEmergencyResponse: z.boolean().optional()
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
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not provided, Fundi will use fallback systems");
    }
    
    // Initialize the OpenAI client properly to ensure it works in all environments
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async generateResponse(
    message: string,
    systemPrompt: string,
    previousMessages: Message[]
  ): Promise<AIResponse> {
    try {
      // Enhanced greeting detection with more patterns and casual phrases
      const lowerMessage = message.toLowerCase().trim();
      
      // Simple greeting patterns
      const greetingPatterns = [
        'hi', 'hey', 'hello', 'howdy', 'hiya', 'yo', 'sup', 'whats up', "what's up", 'whats good', "what's good",
        'hi there', 'hey there', 'hello there', 'how are you', 'how are ya',
        'how you doing', 'how you doin', 'how is it going', "how's it going", 'hows it going',
        'good morning', 'good afternoon', 'good evening', 'morning', 'afternoon', 'evening'
      ];
      
      // Check for common buddy/friend terms that indicate casual conversation
      const buddyTerms = ['buddy', 'friend', 'pal', 'mate', 'dude', 'my friend', 'my buddy', 'bot buddy'];
      
      // Check if this is a simple greeting
      const isSimpleGreeting = 
        // Direct greeting match
        greetingPatterns.some(greeting => 
          lowerMessage === greeting || 
          lowerMessage.startsWith(greeting + ' ') || 
          lowerMessage.endsWith(' ' + greeting) ||
          lowerMessage.includes(greeting + '!')
        ) ||
        // Or contains buddy terms which almost always indicate casual conversation
        buddyTerms.some(term => lowerMessage.includes(term));
      
      // For special "what's up" pattern detection 
      const whatsUpPatterns = [
        'whats up', "what's up", 'whats good', "what's good", 'wassup', 'sup', 'hows it going', "how's it going", 
        'how are you', 'how are ya', 'how you doing', 'how you doin', 'how are things',
        'how have you been', 'how is everything', 'whats good', "what's good"
      ];
      
      // Check if this is a "what's up" type greeting
      const isWhatsUpGreeting = whatsUpPatterns.some(pattern => 
        lowerMessage === pattern || 
        lowerMessage.startsWith(pattern + ' ') || 
        lowerMessage.endsWith(' ' + pattern) ||
        lowerMessage.includes(pattern + '!') ||
        lowerMessage.includes(pattern + '?')
      );
      
      // For greetings, we can return a friendly response directly
      // This avoids the more formal AI patterns for basic interactions
      if ((isSimpleGreeting || isWhatsUpGreeting) && previousMessages.length === 0) {
        // Get personalized greeting responses from personality data
        const personalityElements = getFundiPersonalityElements();
        
        // Choose the right type of response based on the greeting type
        if (isWhatsUpGreeting) {
          console.log("OpenAI detected 'what's up' greeting, using witty response");
          
          // Get the special "what's up" responses
          const whatsUpResponses = personalityElements.whatsUpResponses || [];
          
          // If we have custom responses, use them
          if (whatsUpResponses.length > 0) {
            const selectedResponse = whatsUpResponses[Math.floor(Math.random() * whatsUpResponses.length)];
            
            return {
              response: selectedResponse,
              sentiment: "enthusiastic",
              suggestions: [{
                text: "Would you like to see what I can help you with?",
                path: "/"
              }],
              followUpQuestions: [
                "Is there a specific feature of the app you'd like to explore?",
                "What skills are you interested in developing today?"
              ]
            };
          }
        }
        
        // For regular greetings or fallback
        console.log("OpenAI detected simple greeting, using direct greeting response");
        const greetingResponses = personalityElements.greetingResponses.map(response => 
          // Make sure responses end with a complete thought - if needed, add a second sentence
          response.endsWith("?") || response.endsWith("!") ? response : response + " What can I help with today?"
        );
        
        return {
          response: greetingResponses[Math.floor(Math.random() * greetingResponses.length)],
          sentiment: "friendly",
          suggestions: [{
            text: "Would you like to see what I can help you with?",
            path: "/"
          }],
          followUpQuestions: [
            "Is there a specific feature of the app you'd like to explore?",
            "Are you interested in any particular life skills today?"
          ]
        };
      }
      
      // For normal requests, proceed with OpenAI
      // Create the messages array
      const messages: ChatCompletionMessageParam[] = [
        { 
          role: "system", 
          content: systemPrompt + "\n\nVery important: Format your response as valid JSON following the structure described above." 
        },
        ...previousMessages.map(msg => ({ 
          role: msg.role, 
          content: msg.content 
        })) as ChatCompletionMessageParam[],
        { 
          role: "user", 
          content: message + " (Please provide your answer in JSON format.)" 
        }
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
      
      try {
        // First try to parse as JSON
        const parsedResponse = JSON.parse(response.choices[0].message.content);
        
        // If we get an object directly with no 'response' field, wrap it
        if (typeof parsedResponse === 'object' && parsedResponse !== null && !parsedResponse.response) {
          // If there's a 'content' field, use that as the response
          if (parsedResponse.content) {
            parsedResponse.response = parsedResponse.content;
            delete parsedResponse.content; // Remove content to avoid duplication
          } else {
            // Wrap the object in a standard format with original as response
            return {
              response: JSON.stringify(parsedResponse),
              sentiment: "neutral"
            };
          }
        }
        
        // Use zod to validate and ensure we have the right format
        return AIResponseSchema.parse(parsedResponse);
      } catch (parseError) {
        // If parsing fails, use the raw content as the response
        console.log("OpenAI response was not valid JSON, using raw text");
        return {
          response: response.choices[0].message.content,
          sentiment: "neutral"
        };
      }
    } catch (error) {
      console.error("OpenAI error:", error);
      
      // Try to provide helpful content from our user guide based on message content
      const lowerMessage = message.toLowerCase();
      
      // Check for specific topics we have defined in our user guide
      if (lowerMessage.includes('mortgage') || 
          (lowerMessage.includes('home') && (lowerMessage.includes('loan') || lowerMessage.includes('buy'))) ||
          (lowerMessage.includes('house') && (lowerMessage.includes('loan') || lowerMessage.includes('buy')))) {
        return {
          response: quickGuideInstructions["fundamenta-mortgage"] || 
                   "Fundamenta Mortgage offers tools to help with home buying, including mortgage calculators, affordability analysis, and guides to the home buying process.",
          sentiment: "helpful",
          suggestions: [
            { text: "Would you like to explore our mortgage calculator?", path: "/finance/mortgage-calculator" },
            { text: "Would you like to learn more about the home buying process?", path: "/finance/mortgage" }
          ],
          followUpQuestions: [
            "Are you looking to calculate a specific mortgage scenario?",
            "Would you like me to explain any mortgage terms that might be confusing?"
          ]
        };
      }
      
      // Check for other topics that match our quick guides
      for (const [featureId, content] of Object.entries(quickGuideInstructions)) {
        if (lowerMessage.includes(featureId.replace('-', ' '))) {
          return {
            response: content,
            sentiment: "helpful",
            suggestions: [
              { text: `Would you like to explore the ${featureId.replace('-', ' ')}?`, path: `/finance/${featureId}` }
            ],
            followUpQuestions: [
              "Is there a specific aspect of this you'd like me to explain further?",
              "Do you have any questions about how to use this feature?"
            ]
          };
        }
      }
      
      // Generic fallback if no matching content found
      return {
        response: "I'm sorry, I couldn't process your request through our primary AI system. I've switched to a backup system that might not be as comprehensive.",
        sentiment: "apologetic",
        suggestions: [
          { text: "Would you like to explore our available features?", path: "/" }
        ],
        followUpQuestions: [
          "Is there a specific topic you're interested in learning about?",
          "Would you like me to tell you about our financial tools?"
        ]
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
          { role: "system", content: "You classify user messages into categories accurately. Respond with valid JSON." },
          { role: "user", content: prompt + " Ensure your response is in JSON format." }
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
          { role: "system", content: "You analyze the emotional tone of messages. Respond with valid JSON." },
          { role: "user", content: prompt + " Ensure your response is in JSON format." }
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
      // We'll use a personality-rich approach with pre-crafted responses
      
      // Extract the main question/intent from the message
      const mainIntent = message.trim();
      
      // Determine the best category for routing
      const category = await this.determineCategory(message);
      
      // Construct a response with strong personality based on the category
      let response = "";
      
      // Engaging conversation starters that show Fundi's personality
      // Get personality elements from JSON file
      const personalityElements = getFundiPersonalityElements();
      
      // Enhanced greeting detection with more patterns and casual phrases
      const lowerMessage = mainIntent.toLowerCase().trim();
      
      // Simple greeting patterns
      const greetingPatterns = [
        'hi', 'hey', 'hello', 'howdy', 'hiya', 'yo', 'sup', 'whats up', "what's up", 'whats good', "what's good",
        'hi there', 'hey there', 'hello there', 'how are you', 'how are ya',
        'how you doing', 'how you doin', 'how is it going', "how's it going", 'hows it going',
        'good morning', 'good afternoon', 'good evening', 'morning', 'afternoon', 'evening'
      ];
      
      // Check for common buddy/friend terms that indicate casual conversation
      const buddyTerms = ['buddy', 'friend', 'pal', 'mate', 'dude', 'my friend', 'my buddy', 'bot buddy'];
      
      // Check if this is a simple greeting
      const isSimpleGreeting = 
        // Direct greeting match
        greetingPatterns.some(greeting => 
          lowerMessage === greeting || 
          lowerMessage.startsWith(greeting + ' ') || 
          lowerMessage.endsWith(' ' + greeting) ||
          lowerMessage.includes(greeting + '!')
        ) ||
        // Or contains buddy terms which almost always indicate casual conversation
        buddyTerms.some(term => lowerMessage.includes(term));
      
      // For special "what's up" pattern detection 
      const whatsUpPatterns = [
        'whats up', "what's up", 'whats good', "what's good", 'wassup', 'sup', 'hows it going', "how's it going", 
        'how are you', 'how are ya', 'how you doing', 'how you doin', 'how are things',
        'how have you been', 'how is everything', 'whats good', "what's good"
      ];
      
      // Check if this is a "what's up" type greeting
      const isWhatsUpGreeting = whatsUpPatterns.some(pattern => 
        lowerMessage === pattern || 
        lowerMessage.startsWith(pattern + ' ') || 
        lowerMessage.endsWith(' ' + pattern) ||
        lowerMessage.includes(pattern + '!') ||
        lowerMessage.includes(pattern + '?')
      );
      
      // Get personalized greeting responses from personality data
      const greetingResponses = personalityElements.greetingResponses;
      const whatsUpResponses = personalityElements.whatsUpResponses || [];
      
      // For normal responses - use a standard set of conversation starters
      // Use fixed conversation starters with the right tone and enthusiasm
      // We intentionally avoid using responseExamples here as they contain specific content examples
      // that should not be mixed with every response
      const conversationStarters = [
        "Absolutely! I'd love to help with that. ",
        "Great question! This is actually something I'm passionate about. ",
        "Oh, I'm so glad you asked about this! ",
        "I'm really excited to talk about this with you! ",
        "This is one of my favorite topics! ",
        "I'd be thrilled to help with that! ",
        "Let me share some insights on this. ",
        "I've got some great information about this. ",
        "That's something I can definitely help with. ",
        "Thanks for asking about this topic! "
      ];
      
      // For greetings at the start of a conversation,
      // respond with a friendly greeting directly bypassing AI
      if ((isSimpleGreeting || isWhatsUpGreeting) && previousMessages.length === 0) {
        // For "what's up" style greetings
        if (isWhatsUpGreeting && whatsUpResponses.length > 0) {
          console.log("HuggingFace detected 'what's up' greeting, using witty response");
          const selectedResponse = whatsUpResponses[Math.floor(Math.random() * whatsUpResponses.length)];
          
          return {
            response: selectedResponse,
            sentiment: "enthusiastic",
            suggestions: [{
              text: "Would you like to see what I can help you with?",
              path: "/"
            }],
            followUpQuestions: [
              "Is there a specific feature of the app you'd like to explore?",
              "What skills are you interested in developing today?"
            ],
            personality: "witty-enthusiastic"
          };
        }
        
        // For regular greetings
        console.log("HuggingFace detected simple greeting, using direct greeting response");
        const selectedGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        
        return {
          response: selectedGreeting,
          sentiment: "friendly",
          suggestions: [{
            text: "Would you like to see what I can help you with?",
            path: "/"
          }],
          followUpQuestions: [
            "Is there a specific feature of the app you'd like to explore?",
            "What skills are you interested in developing today?"
          ],
          personality: "friendly-casual"
        };
      }
      
      // Choose appropriate response type based on message (for non-greetings)
      const personalTouchIntro = isSimpleGreeting 
        ? greetingResponses[Math.floor(Math.random() * greetingResponses.length)]
        : conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
      
      // Special handling for financial education queries - redirect to finance
      const lowerIntent = mainIntent.toLowerCase();
      if ((lowerIntent.includes('financial') && lowerIntent.includes('learning')) ||
          (lowerIntent.includes('financial') && lowerIntent.includes('education')) ||
          (lowerIntent.includes('financial literacy')) ||
          (lowerIntent.includes('learn') && lowerIntent.includes('finance')) ||
          (lowerIntent.includes('schedule') && lowerIntent.includes('financial'))) {
          
        response = `${personalTouchIntro}Financial education is actually something I'm really passionate about! Our Finance section has everything from basics to advanced concepts. I love how our tools make complicated financial topics so much more approachable. What specific part of financial education are you most interested in learning about?`;
        // Override category to ensure proper navigation
        category.category = "finance";
      } else {
        switch (category.category) {
          case "finance":
            response = `${personalTouchIntro}Money matters can sometimes feel overwhelming, but I'm here to make it simpler! I personally love our Budget Planner tool - it's made such a difference for so many users. What specific financial question can I help with today?`;
            break;
          case "career":
            response = `${personalTouchIntro}I'm super excited to help with your career journey! Our Resume Builder is one of my favorite features - it's amazing to see the transformations. What specific career challenge are you tackling right now?`;
            break;
          case "wellness":
            response = `${personalTouchIntro}Taking care of your wellbeing is so important. I find our Mindfulness Practice module incredibly calming when things get hectic. What aspect of wellness would you like to focus on today?`;
            break;
          case "learning":
            response = `${personalTouchIntro}Learning new things is what keeps life interesting! I'm particularly fond of our specialized courses - they're designed to be practical and immediately useful. What specific skill are you hoping to develop?`;
            break;
          case "emergency":
            response = `This sounds urgent. Your safety is my absolute top priority right now. For immediate assistance, please contact emergency services right away. Is there anything I can help you with while you do that?`;
            break;
          case "homeMaintenance":
            response = `${personalTouchIntro}Home repairs can be tricky! Have you tried our PicFix feature yet? It's honestly one of our coolest tools - just snap a photo of what's broken, and I'll help diagnose the issue, walk you through the repair, and even tell you what parts you'll need. What's giving you trouble around the house?`;
            break;
          default:
            response = `${personalTouchIntro}I'd love to help make your day a bit better. What's on your mind? I'm here to chat about anything from finances to fitness, or just be a friendly digital face if you need one!`;
        }
      }
      
      // Enhanced suggestion that feels more personalized
      const suggestedText = category.category === "homeMaintenance" 
        ? "Would you like to check out our amazing PicFix tool? I think you'd love it!" 
        : `Would you like to explore our ${category.category} section? I think you might find exactly what you need there!`;
      
      return {
        response,
        sentiment: "enthusiastic",
        suggestions: [
          {
            text: suggestedText,
            path: `/${category.category}`
          }
        ],
        followUpQuestions: [
          "What specific part of this would you like me to explain in more detail?",
          "Is there a particular feature you'd like to know more about?"
        ],
        personality: "friendly-enthusiastic"
      };
    } catch (error) {
      console.error("HuggingFace generateResponse error:", error);
      
      // Try to provide helpful content from our user guide based on message content
      const lowerMessage = message.toLowerCase();
      
      // Check for mortgage-related questions
      if (lowerMessage.includes('mortgage') || 
          (lowerMessage.includes('home') && (lowerMessage.includes('loan') || lowerMessage.includes('buy'))) ||
          (lowerMessage.includes('house') && (lowerMessage.includes('loan') || lowerMessage.includes('buy')))) {
        return {
          response: quickGuideInstructions["fundamenta-mortgage"] || 
                   "Fundamenta Mortgage offers tools to help with home buying, including mortgage calculators, affordability analysis, and guides to the home buying process.",
          sentiment: "helpful",
          suggestions: [
            { text: "Would you like to explore our mortgage calculator?", path: "/finance/mortgage-calculator" },
            { text: "Would you like to learn more about the home buying process?", path: "/finance/mortgage" }
          ],
          followUpQuestions: [
            "Are you looking to calculate a specific mortgage scenario?",
            "Would you like me to explain any mortgage terms that might be confusing?"
          ]
        };
      }
      
      // Check for other topics that match our quick guides
      for (const [featureId, content] of Object.entries(quickGuideInstructions)) {
        if (lowerMessage.includes(featureId.replace('-', ' '))) {
          return {
            response: content,
            sentiment: "helpful",
            suggestions: [
              { text: `Would you like to explore the ${featureId.replace('-', ' ')}?`, path: `/finance/${featureId}` }
            ],
            followUpQuestions: [
              "Is there a specific aspect of this you'd like me to explain further?",
              "Do you have any questions about how to use this feature?"
            ]
          };
        }
      }
      
      // Generic fallback if no matching content found
      return {
        response: "Oh! Looks like my digital brain is having a moment of inspiration overload! I'd love to help with your question - maybe we could try approaching it from a slightly different angle? I'm really excited to get this conversation back on track!",
        sentiment: "enthusiastic",
        suggestions: [
          {
            text: "Would you like to explore our most popular features instead?",
            path: "/"
          }
        ],
        followUpQuestions: [
          "Is there a specific app feature you'd like to learn more about?", 
          "Would you like me to tell you about one of my favorite tools in the app?"
        ],
        personality: "friendly-enthusiastic"
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
    
    // Check for career-related queries - putting this before home maintenance to prioritize it
    if (lowerMessage.includes('resume') || 
        lowerMessage.includes('job interview') || 
        lowerMessage.includes('career') ||
        lowerMessage.includes('promotion') ||
        lowerMessage.includes('job search') ||
        lowerMessage.includes('linkedin') ||
        lowerMessage.includes('networking') ||
        lowerMessage.includes('cv') ||
        lowerMessage.includes('cover letter') ||
        lowerMessage.includes('job application')) {
      console.log('HuggingFace provider - early detection: Career query, categorizing as career');
      return { category: "career", confidence: 0.95 };
    }
    
    // Check for home maintenance and utilities related queries - exclude resume-related terms
    if ((lowerMessage.includes('picfix') || 
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
        lowerMessage.includes('electrical')) &&
        // Exclude resume and career terms from triggering home maintenance
        !lowerMessage.includes('resume') &&
        !lowerMessage.includes('cv') &&
        !lowerMessage.includes('cover letter') &&
        !lowerMessage.includes('job')) {
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
  // Change from private to public so orchestrator can use primary directly if needed
  public primaryProvider: AIProvider;
  public fallbackProvider: AIProvider;
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
      console.log("Using fallback provider (forced via toggle)");
      return true;
    }
    
    // If we've had too many failures recently, use fallback
    if (this.failureCount >= this.MAX_FAILURES) {
      // Check if cooldown period has passed
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.COOLDOWN_PERIOD * this.failureCount) {
        console.log(`Using fallback provider (automatic due to ${this.failureCount} failures in the last ${timeSinceLastFailure/1000}s)`);
        return true;
      } else {
        // Reset failure count after cooldown
        console.log("Cooldown period passed, resetting failure count");
        this.failureCount = 0;
      }
    }
    
    return false;
  }
  
  /**
   * Manually reset the failure counter and fallback status
   * @returns The complete fallback status after reset
   */
  public resetFailures() {
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.forceUseFallback = false;
    console.log("Manually reset failure counter and fallback status");
    
    // Return the complete status object for consistency with the API
    return this.getFallbackStatus();
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
    // AUTOMATICALLY RESET ON EVERY REQUEST - This is more aggressive than the health check
    // to prevent getting stuck in the fallback/preset response mode
    if (this.failureCount > 0 || this.forceUseFallback) {
      console.log("🔄 AUTO-RESET: Proactively resetting AI fallback system on every request");
      // Reset everything so we always try OpenAI first
      this.resetFailures();
    }
    
    // Check if this is a simple greeting - this happens first, before any API calls
    // to ensure consistent handling of greetings regardless of API status
    const lowerMessage = message.toLowerCase().trim();
    
    // Simple greeting patterns
    const greetingPatterns = [
      'hi', 'hey', 'hello', 'howdy', 'hiya', 'yo', 'sup', 'whats up', "what's up", 'whats good', "what's good",
      'hi there', 'hey there', 'hello there', 'how are you', 'how are ya',
      'how you doing', 'how you doin', 'how is it going', "how's it going", 'hows it going',
      'good morning', 'good afternoon', 'good evening', 'morning', 'afternoon', 'evening'
    ];
    
    // Check for common buddy/friend terms that indicate casual conversation
    const buddyTerms = ['buddy', 'friend', 'pal', 'mate', 'dude', 'my friend', 'my buddy', 'bot buddy'];
    
    // For special "what's up" pattern detection 
    const whatsUpPatterns = [
      'whats up', "what's up", 'whats good', "what's good", 'wassup', 'sup', 'hows it going', "how's it going", 
      'how are you', 'how are ya', 'how you doing', 'how you doin', 'how are things',
      'how have you been', 'how is everything', 'whats good', "what's good"
    ];
    
    // Check if this is a "what's up" type greeting
    const isWhatsUpGreeting = whatsUpPatterns.some(pattern => 
      lowerMessage === pattern || 
      lowerMessage.startsWith(pattern + ' ') || 
      lowerMessage.endsWith(' ' + pattern) ||
      lowerMessage.includes(pattern + '!') ||
      lowerMessage.includes(pattern + '?')
    );
    
    // Check if this is a simple greeting (but not a "what's up" greeting)
    const isSimpleGreeting = 
      // Direct greeting match
      greetingPatterns.some(greeting => 
        lowerMessage === greeting || 
        lowerMessage.startsWith(greeting + ' ') || 
        lowerMessage.endsWith(' ' + greeting) ||
        lowerMessage.includes(greeting + '!') ||
        lowerMessage.includes(greeting + '?')
      ) ||
      // Or contains buddy terms which almost always indicate casual conversation
      buddyTerms.some(term => lowerMessage.includes(term));
    
    // If this is a greeting at the start of a conversation,
    // respond with a friendly greeting directly, bypassing the AI providers
    if ((isSimpleGreeting || isWhatsUpGreeting) && previousMessages.length === 0) {
      try {
        // Get personalized greeting responses from personality data
        const personalityElements = getFundiPersonalityElements();
        
        // Choose the right type of response based on the greeting type
        if (isWhatsUpGreeting) {
          console.log("Detected 'what's up' greeting, using witty response");
          
          // Get the special "what's up" responses
          const whatsUpResponses = personalityElements.whatsUpResponses || [];
          
          // If we have custom responses, use them
          if (whatsUpResponses.length > 0) {
            const selectedResponse = whatsUpResponses[Math.floor(Math.random() * whatsUpResponses.length)];
            
            return {
              response: selectedResponse,
              sentiment: "enthusiastic",
              suggestions: [{
                text: "Would you like to see what I can help you with?",
                path: "/"
              }],
              followUpQuestions: [
                "Is there a specific feature of the app you'd like to explore?",
                "What skills are you interested in developing today?"
              ],
              personality: "witty-enthusiastic"
            };
          }
        }
        
        // For regular greetings or if no what's up responses are available
        console.log("Detected simple greeting, using direct greeting response");
        const greetingResponses = personalityElements.greetingResponses.map(response => 
          // Make sure responses end with a complete thought
          response.endsWith("?") || response.endsWith("!") ? response : response + " What can I help with today?"
        );
        
        const selectedGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        
        return {
          response: selectedGreeting,
          sentiment: "friendly",
          suggestions: [{
            text: "Would you like to see what I can help you with?",
            path: "/"
          }],
          followUpQuestions: [
            "Is there a specific feature of the app you'd like to explore?",
            "What skills are you interested in developing today?"
          ],
          personality: "friendly-casual"
        };
      } catch (error) {
        console.error("Error loading personality for greeting response:", error);
        // Even if there's an error loading personality, still provide a direct greeting
        return {
          response: "Hey there! Great to see you. What's on your mind today?",
          sentiment: "friendly",
          suggestions: [{
            text: "Want to explore the app's features?",
            path: "/"
          }],
          followUpQuestions: [
            "How can I help you today?",
            "Anything specific you'd like to learn about?"
          ],
          personality: "friendly-casual"
        };
      }
    }
    
    // If not a simple greeting, proceed with normal AI processing
    
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
          response: "Oh! I got so excited thinking about all the ways I could help with that, my digital circuits got a little overloaded! I'd love to try a different approach - what specific aspect of this topic interests you most?",
          sentiment: "enthusiastic",
          suggestions: [
            {
              text: "Would you like to explore one of our popular features instead?",
              path: "/"
            }
          ],
          followUpQuestions: [
            "Is there a different feature you'd like to learn about?", 
            "What's something else you've been curious about in the app?"
          ],
          personality: "friendly-enthusiastic"
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
      
      // Set up a timeout to start the fallback provider after a delay
      // This gives the primary provider enough time to respond before falling back
      const FALLBACK_START_DELAY = 8000; // ms - give primary provider an 8-second head start
      
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
      const PRIMARY_TIMEOUT = 15000; // 15 seconds - increased from 10 seconds
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
      // Get personality elements from the user's custom settings
      const personalityElements = getFundiPersonalityElements();
      
      // Let's check message for keywords that might match our user guide content
      const lowerMessage = message.toLowerCase();
      
      // First, check for specific topic keywords
      if (lowerMessage.includes('mortgage') || 
          (lowerMessage.includes('home') && (lowerMessage.includes('loan') || lowerMessage.includes('buy'))) ||
          (lowerMessage.includes('house') && (lowerMessage.includes('loan') || lowerMessage.includes('buy')))) {
        // If it's about mortgages, serve our comprehensive mortgage guide content
        return {
          response: quickGuideInstructions["fundamenta-mortgage"] || 
                    "Fundamenta Mortgage offers tools to help with home buying, including mortgage calculators, affordability analysis, and guides to the home buying process.",
          sentiment: "helpful",
          suggestions: [
            { text: "Would you like to explore our mortgage calculator?", path: "/finance/mortgage-calculator" },
            { text: "Would you like to learn more about the home buying process?", path: "/finance/mortgage" }
          ],
          followUpQuestions: [
            "Are you looking to calculate a specific mortgage scenario?",
            "Would you like me to explain any mortgage terms that might be confusing?"
          ],
          personality: "knowledgeable-helpful"
        };
      }
      
      // Check for other keywords that match our quick guides
      for (const [featureId, content] of Object.entries(quickGuideInstructions)) {
        if (lowerMessage.includes(featureId.replace('-', ' '))) {
          return {
            response: content,
            sentiment: "helpful",
            suggestions: [
              { text: `Would you like to explore the ${featureId.replace('-', ' ')}?`, path: `/finance/${featureId}` }
            ],
            followUpQuestions: [
              "Is there a specific aspect of this you'd like me to explain further?",
              "Do you have any questions about how to use this feature?"
            ],
            personality: "knowledgeable-helpful"
          };
        }
      }
      
      // Use Fundi's favorite quote rather than mixing in random examples which can create confusing responses
      let personalizedTouch = "";
      if (personalityElements.favoriteQuote) {
        personalizedTouch = `As I like to say, "${personalityElements.favoriteQuote}" `;
      }
      
      return {
        response: `${personalizedTouch}Wow, I just had a flash of inspiration about how to help you better! Let's take a fresh approach. What are you most excited to learn about today? I'd love to show you some of my favorite features in the app!`,
        sentiment: "enthusiastic",
        suggestions: [{ text: "Would you like to explore our dashboard for inspiration?", path: "/" }],
        followUpQuestions: [
          "Is there a particular area of the app you're curious about?", 
          "Would you like me to recommend a feature I think you might enjoy?"
        ],
        personality: "friendly-enthusiastic"
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
      
      // Start fallback with a longer delay to give primary provider time to respond
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
      }, 3000); // 3000ms (3 second) delay - increased from 200ms
      
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
      
      // Start the fallback with a significant delay to give priority to the specialized service
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
        }, 2000); // 2000ms (2 second) delay - increased from 500ms
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