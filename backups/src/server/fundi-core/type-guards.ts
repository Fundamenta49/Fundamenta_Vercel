/**
 * Type Guard Utilities for Fundi
 * 
 * These utilities provide safe type checking and response normalization
 * to help prevent runtime errors from propagating.
 */

import { AIResponse, AIResponseSchema } from './fundi-fallback-core';
import { z } from 'zod';

/**
 * Check if a value is a plain object (not null, not array, actual object)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a string or can be reasonably converted to a string
 */
export function isStringLike(value: unknown): value is string {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/**
 * Safely convert a response object to match AIResponse structure
 * This is used to fix common issues where an API might return data
 * in a slightly incorrect format
 */
export function normalizeAIResponse(input: unknown): AIResponse {
  try {
    // If it's already a string, wrap it
    if (typeof input === 'string') {
      return {
        response: input,
        sentiment: 'neutral'
      };
    }
    
    // Handle common error: response is an object instead of string
    if (isPlainObject(input) && 'response' in input) {
      const responseValue = input.response;
      
      // If response is an object but should be a string, convert it
      if (isPlainObject(responseValue)) {
        // Try to grab a text value from the nested object or stringify it
        let responseText = '';
        if ('text' in responseValue && isStringLike(responseValue.text)) {
          responseText = String(responseValue.text);
        } else if ('content' in responseValue && isStringLike(responseValue.content)) {
          responseText = String(responseValue.content);
        } else if ('message' in responseValue && isStringLike(responseValue.message)) {
          responseText = String(responseValue.message);
        } else {
          // Stringify the object as a last resort
          try {
            responseText = JSON.stringify(responseValue);
          } catch (e) {
            responseText = "Error: Unable to parse response object";
          }
        }
        
        // Create a fixed version of the input with response as string
        const fixedInput = {
          ...input,
          response: responseText
        };
        
        // Try to validate with our schema
        return AIResponseSchema.parse(fixedInput);
      }
      
      // Continue with normal schema validation if response isn't an object
      return AIResponseSchema.parse(input);
    }
    
    // If it's not a direct match, try to create a valid response
    if (isPlainObject(input)) {
      // Look for any string properties that might be the response
      for (const key of ['text', 'message', 'content', 'answer', 'output']) {
        if (key in input && isStringLike(input[key])) {
          return {
            response: String(input[key]),
            sentiment: 'neutral'
          };
        }
      }
      
      // Last resort - stringify the object
      return {
        response: "I received a response I couldn't properly format. Let me try to help with something else.",
        sentiment: 'apologetic'
      };
    }
    
    // If all else fails, return a fallback response
    return {
      response: "I'm sorry, but I received an unexpected response format. How else can I help you?",
      sentiment: 'apologetic',
      suggestions: [
        { text: "Try asking a different question", path: null }
      ]
    };
  } catch (error) {
    console.error("Error normalizing AI response:", error);
    
    // Return a simple valid response
    return {
      response: "I encountered an issue processing that request. Let's try a different approach.",
      sentiment: 'apologetic'
    };
  }
}

/**
 * Safe parser for AI responses that handles validation errors
 * by normalizing the response instead of throwing
 */
export const SafeAIResponseSchema = z.unknown().transform((val, ctx) => {
  try {
    // First try direct parsing
    return AIResponseSchema.parse(val);
  } catch (error) {
    // If direct parsing fails, try normalizing first
    try {
      return normalizeAIResponse(val);
    } catch (normalizeError) {
      // If normalization also fails, return a basic valid response
      console.error("Failed to normalize AI response:", normalizeError);
      return {
        response: "I encountered an unexpected error. Let's try a different approach.",
        sentiment: 'apologetic'
      };
    }
  }
});