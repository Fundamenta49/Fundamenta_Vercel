/**
 * FUNDI CORE FALLBACK SYSTEM
 * 
 * !!! IMPORTANT WARNING !!!
 * This file contains the core fallback functionality for Fundi.
 * DO NOT MODIFY THIS FILE unless you are specifically working on improving Fundi's core reliability.
 * Changes to this file can impact Fundi's ability to function properly across the entire application.
 */

import { z } from "zod";
import type { ChatCompletionMessageParam } from "openai/resources";
import OpenAI from "openai";

// === CORE TYPES - DO NOT MODIFY === //

// Message type used for conversation history
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

// Response schema with strict validation
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
  personality: z.string().optional()
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

// === EMERGENCY FALLBACK RESPONSES === //

// These are guaranteed to work even if all AI services fail
const EMERGENCY_FALLBACK_RESPONSES: AIResponse[] = [
  {
    response: "I'm here to help with your questions about personal development, finances, wellness, and more. What would you like to explore today?",
    sentiment: "helpful",
    suggestions: [
      { text: "Tell me about financial planning", path: "/finance" },
      { text: "I need help with fitness goals", path: "/fitness" }
    ],
    followUpQuestions: [
      "What skills are you most interested in developing?",
      "Is there a specific life challenge you're facing right now?"
    ]
  },
  {
    response: "I'm experiencing a temporary issue connecting to my knowledge services. I can still help with basic questions and guide you to different sections of the app.",
    sentiment: "apologetic",
    suggestions: [
      { text: "Explore fitness features", path: "/fitness" },
      { text: "Check out financial tools", path: "/finance" },
      { text: "View wellness resources", path: "/wellness" }
    ],
    followUpQuestions: [
      "Would you like to try asking a different question?",
      "Is there a specific feature of the app you'd like to explore?"
    ]
  },
  {
    response: "I'm having trouble accessing my advanced reasoning capabilities at the moment. Let me help guide you to some useful resources instead.",
    sentiment: "helpful",
    suggestions: [
      { text: "View learning resources", path: "/learning" },
      { text: "Check progress on your goals", path: "/dashboard" }
    ],
    followUpQuestions: [
      "What topic are you most interested in exploring today?",
      "Would you like me to show you some of our popular tools?"
    ]
  }
];

// === CORE FALLBACK FUNCTION === //

/**
 * Get an emergency fallback response that will always work
 * This function is the final safety net if all other AI systems fail
 */
export function getEmergencyFallbackResponse(): AIResponse {
  try {
    // Select a random response from our emergency options
    const randomIndex = Math.floor(Math.random() * EMERGENCY_FALLBACK_RESPONSES.length);
    return EMERGENCY_FALLBACK_RESPONSES[randomIndex];
  } catch (error) {
    // Absolute final fallback if even the random selection fails
    return {
      response: "I'm here to help but having some technical difficulties. Please try again in a moment.",
      sentiment: "apologetic",
      suggestions: [
        { text: "Return to home", path: "/" }
      ],
      followUpQuestions: [
        "Would you like to try again?"
      ]
    };
  }
}

/**
 * Safe wrapper for generating responses that guarantees a response
 * even if the underlying AI services completely fail
 */
export async function generateSafeFundiResponse(
  primaryProvider: any,
  fallbackProvider: any,
  message: string,
  systemPrompt: string,
  previousMessages: Message[]
): Promise<AIResponse> {
  try {
    // First try the primary provider (likely OpenAI)
    try {
      const response = await primaryProvider.generateResponse(
        message,
        systemPrompt,
        previousMessages
      );
      
      // Validate the response format
      return AIResponseSchema.parse(response);
    } catch (primaryError) {
      console.error("Primary AI provider failed:", primaryError);
      
      // If primary fails, try the fallback provider (likely HuggingFace)
      try {
        const fallbackResponse = await fallbackProvider.generateResponse(
          message,
          systemPrompt,
          previousMessages
        );
        
        // Validate the fallback response
        return AIResponseSchema.parse(fallbackResponse);
      } catch (fallbackError) {
        console.error("Fallback AI provider also failed:", fallbackError);
        throw new Error("Both primary and fallback providers failed");
      }
    }
  } catch (error) {
    console.error("Critical failure in Fundi response generation:", error);
    
    // Return a guaranteed response from our emergency fallbacks
    return getEmergencyFallbackResponse();
  }
}

/**
 * Validate any AI response to ensure it conforms to our schema
 * This helps catch issues with AI responses before they cause application errors
 */
export function validateAIResponse(response: any): AIResponse {
  try {
    // First attempt direct parsing
    try {
      return AIResponseSchema.parse(response);
    } catch (validationError) {
      // If validation fails, check for the specific issue in logs
      // The error is often "Expected string, received object" for the response field
      if (validationError instanceof Error && validationError.message.includes("Expected string, received object")) {
        console.warn("Detected common response format error, attempting to fix");
        
        // Check if response is an object with a response property that's also an object
        if (response && typeof response === 'object' && 'response' in response && 
            response.response && typeof response.response === 'object') {
          
          // Try to extract text from inner response object
          const innerResponse = response.response;
          let textValue = "";
          
          if ('text' in innerResponse && typeof innerResponse.text === 'string') {
            textValue = innerResponse.text;
          } else if ('content' in innerResponse && typeof innerResponse.content === 'string') {
            textValue = innerResponse.content;
          } else if ('message' in innerResponse && typeof innerResponse.message === 'string') {
            textValue = innerResponse.message;
          } else {
            // Last resort: stringify the object
            try {
              textValue = JSON.stringify(innerResponse);
            } catch (e) {
              textValue = "Unable to parse response";
            }
          }
          
          // Create new response with fixed string format
          const fixedResponse = {
            ...response,
            response: textValue
          };
          
          // Try to validate again
          return AIResponseSchema.parse(fixedResponse);
        }
      }
      
      // Re-throw if we couldn't fix it
      throw validationError;
    }
  } catch (error) {
    console.error("AI response validation failed:", error);
    return getEmergencyFallbackResponse();
  }
}