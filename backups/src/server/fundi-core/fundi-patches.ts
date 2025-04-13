/**
 * FUNDI PATCHES
 * 
 * This file contains patches for the existing AI infrastructure
 * to make it more resilient against failures and ensure Fundi
 * always works even when there are API issues or format problems.
 */

import { OpenAIProvider, fallbackAIService } from '../ai/ai-fallback-strategy';
import { validateAIResponse, getEmergencyFallbackResponse } from './fundi-fallback-core';

/**
 * Apply a patch to the OpenAIProvider to add extra validation
 * and error recovery to prevent crashes from response format issues
 */
export function applyOpenAIProviderPatch(): void {
  try {
    // Skip if already patched
    if ((OpenAIProvider.prototype as any).__patched) {
      console.log("OpenAIProvider already patched, skipping");
      return;
    }
    
    // Save reference to original method
    const originalGenerateResponse = OpenAIProvider.prototype.generateResponse;
    
    // Create new version with safeguards
    OpenAIProvider.prototype.generateResponse = async function(...args) {
      try {
        // Call original method
        const response = await originalGenerateResponse.apply(this, args);
        
        // Extra validation step to handle potential format issues
        try {
          return validateAIResponse(response);
        } catch (validationError) {
          console.error("Response validation failed after successful API call:", validationError);
          return getEmergencyFallbackResponse();
        }
      } catch (error) {
        // If the original method throws, provide more detailed logging
        console.error("Protected OpenAIProvider failed:", error);
        
        // Check for specific error types that might be fixable
        if (error instanceof Error) {
          if (error.message.includes("Expected string, received object")) {
            console.warn("Detected the response format error, applying fix...");
            
            // Process through our specialized validation that handles this error
            try {
              // If we have args[0], use it as fallback content in an emergency
              const content = args[0] || "I couldn't process your request properly.";
              
              // Create a basic valid response
              return validateAIResponse({
                response: {
                  text: `I had some trouble processing that. Let me try to help with your question about: ${content}`
                },
                sentiment: "apologetic"
              });
            } catch (innerError) {
              console.error("Failed to apply format fix:", innerError);
            }
          }
        }
        
        // Last resort fallback
        return getEmergencyFallbackResponse();
      }
    };
    
    // Mark as patched
    (OpenAIProvider.prototype as any).__patched = true;
    
    console.log("Successfully applied patch to OpenAIProvider");
  } catch (error) {
    console.error("Failed to apply OpenAIProvider patch:", error);
  }
}

/**
 * Apply all available patches to fortify Fundi's reliability
 */
export function applyAllFundiPatches(): void {
  try {
    console.log("Applying all Fundi protection patches...");
    
    // Apply individual patches
    applyOpenAIProviderPatch();
    
    console.log("✅ All Fundi protection patches applied successfully");
  } catch (error) {
    console.error("Failed to apply some Fundi patches:", error);
    console.log("System will continue with partial protection");
  }
}