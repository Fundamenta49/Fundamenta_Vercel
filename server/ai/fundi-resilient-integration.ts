/**
 * Integration of the Resilient AI Service with the existing Fundi system
 * 
 * This file creates a bridge between the new resilient architecture
 * and the existing fallback AI system. It allows for gradual migration
 * without disrupting the current functionality.
 */

import { ResilientAIService, AIServiceState } from '../services/resilient-ai-service';
import { OpenAIProvider, HuggingFaceProvider, Message, AIResponse } from './ai-fallback-strategy';
import { getFundiPersonalityElements } from './fundi-personality-integration';

// Create singleton instance of the resilient service
const openAIProvider = new OpenAIProvider();
const huggingFaceProvider = new HuggingFaceProvider();

// Initialize with the existing providers and sensible defaults
export const resilientAIService = new ResilientAIService(
  openAIProvider,
  huggingFaceProvider,
  200,          // Cache size
  3600000,      // Cache TTL (1 hour)
  3,            // Failure threshold
  60000         // Reset timeout (1 minute)
);

// Set up event listeners for logging/monitoring
resilientAIService.on('stateChanged', ({ from, to }) => {
  console.log(`🔄 Fundi AI service state changed: ${from} -> ${to}`);
  
  // You could add alerting or metrics here
  if (to === AIServiceState.DEGRADED) {
    console.warn('⚠️ Fundi AI service degraded - using fallback provider');
  } else if (to === AIServiceState.LIMITED) {
    console.warn('⚠️ Fundi AI service limited - using cache only');
  } else if (to === AIServiceState.UNAVAILABLE) {
    console.error('🚨 Fundi AI service unavailable - using generic responses');
  } else if (to === AIServiceState.HEALTHY) {
    console.log('✅ Fundi AI service healthy again');
  }
});

resilientAIService.on('circuitStateChanged', ({ from, to }) => {
  console.log(`🔌 Fundi AI circuit breaker state: ${from} -> ${to}`);
});

/**
 * Modified generateFundiResponse that uses the resilient service
 * This function maintains the same signature as the original for backward compatibility
 */
export async function generateFundiResponse(
  message: string,
  conversationId: number,
  previousMessages: Message[] = []
): Promise<AIResponse> {
  // Get personality elements for the system prompt
  const personalityElements = getFundiPersonalityElements();
  
  // Create the system prompt
  const systemPrompt = `
    You are Fundi, a helpful AI assistant built into the Fundamenta application.
    
    ${personalityElements.tone ? `Tone: ${personalityElements.tone}` : ''}
    ${personalityElements.styleTraits ? `Style: ${personalityElements.styleTraits.join(', ')}` : ''}
    
    When responding, provide a conversational and helpful response. Be friendly and engaging.
    
    Your response should be in the following JSON format:
    {
      "response": "Your conversational response to the user",
      "sentiment": "friendly|helpful|enthusiastic|neutral|apologetic",
      "suggestions": [
        {
          "text": "A follow-up question or suggestion phrased as a question",
          "path": "/optional/app/route"
        }
      ],
      "followUpQuestions": [
        "A follow-up question to continue the conversation",
        "Another potential follow-up question"
      ]
    }
  `;
  
  try {
    // Use the resilient service to generate a response
    return await resilientAIService.generateResponse(
      message,
      systemPrompt,
      previousMessages
    );
  } catch (error) {
    console.error('Error in resilient Fundi response generation:', error);
    
    // Emergency fallback - this should almost never happen
    return {
      response: "I'm having trouble connecting to my services right now. Please try again in a moment.",
      sentiment: "apologetic",
      suggestions: [
        { text: "Would you like to try again?", path: "/" }
      ],
      followUpQuestions: [
        "Is there something else I can help you with in the meantime?"
      ]
    };
  }
}

/**
 * Get the current status of the Fundi AI service
 */
export function getFundiAIStatus() {
  return resilientAIService.getStatus();
}

/**
 * Manually reset the Fundi AI service
 */
export function resetFundiAIService() {
  console.log('Manually resetting Fundi AI service');
  return resilientAIService.reset();
}

/**
 * Clean up resources when shutting down
 */
export function disposeFundiAIService() {
  resilientAIService.dispose();
}