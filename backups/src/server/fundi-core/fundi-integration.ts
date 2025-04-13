/**
 * FUNDI INTEGRATION
 * 
 * This file integrates the isolated Fundi core with the existing application.
 * It provides a bridge between the new protective facade and the existing
 * FallbackAIService implementation.
 */

import { getFundiFacade } from './fundi-facade';
import { fallbackAIService } from '../ai/ai-fallback-strategy';
import { FallbackAIService } from '../ai/ai-fallback-strategy'; // This is just for typing
import { Message } from './fundi-fallback-core';
import { applyAllFundiPatches } from './fundi-patches';

/**
 * Check if Fundi facade is properly working by calling its core methods
 * with simple test data. This helps verify the system is operational.
 */
export async function verifyFundiCore(): Promise<boolean> {
  try {
    const fundiFacade = getFundiFacade();
    fundiFacade.initialize();
    
    // Test simple category determination
    const categoryResult = await fundiFacade.determineCategory("How can I improve my credit score?");
    console.log("Fundi core test - Category determination:", categoryResult);
    
    // Test simple emotion analysis
    const emotionResult = await fundiFacade.analyzeEmotion("I'm really excited about using this app!");
    console.log("Fundi core test - Emotion analysis:", emotionResult);
    
    return true;
  } catch (error) {
    console.error("Fundi core verification failed:", error);
    return false;
  }
}

/**
 * Apply Fundi protection patches to safeguard against OpenAI failures
 * This injects our fallback protection at strategic points without completely
 * rewriting the existing code.
 */
export function applyFundiProtectionPatches(): void {
  try {
    const originalGenerateResponse = (fallbackAIService as any).generateResponse;
    const fundiFacade = getFundiFacade();
    
    // Only apply patches if we haven't already
    if ((fallbackAIService as any).__patchedWithFundiCore) {
      console.log("Fundi protection patches already applied");
      return;
    }
    
    // Patch the generateResponse method to add our protection
    (fallbackAIService as any).generateResponse = async function(
      message: string,
      systemPrompt: string,
      previousMessages: Message[]
    ) {
      try {
        // Try the original method first
        return await originalGenerateResponse.call(this, message, systemPrompt, previousMessages);
      } catch (error) {
        console.error("FallbackAIService.generateResponse failed, using Fundi facade as final fallback:", error);
        
        // Format the previousMessages to match what the facade expects
        // Our facade will always return something, even if all else fails
        return await fundiFacade.generateResponse(
          message,
          0, // Conversation ID (not critical)
          previousMessages
        );
      }
    };
    
    // Mark as patched so we don't double-patch
    (fallbackAIService as any).__patchedWithFundiCore = true;
    
    console.log("Successfully applied Fundi protection patches");
  } catch (error) {
    console.error("Failed to apply Fundi protection patches:", error);
    // Even if patching fails, the app will continue to function with the original implementation
  }
}

/**
 * Initialize and configure the Fundi core system
 * This should be called during application startup
 */
export async function initializeFundiCore(): Promise<void> {
  try {
    console.log("Initializing Fundi core system...");
    
    // Initialize the facade
    const fundiFacade = getFundiFacade();
    fundiFacade.initialize();
    
    // Apply all available patches
    // This includes our FallbackAIService patch and OpenAI provider patches
    applyFundiProtectionPatches();
    applyAllFundiPatches();
    
    // Verify core functionality is working
    const isVerified = await verifyFundiCore();
    
    if (isVerified) {
      console.log("✅ Fundi core system successfully initialized and verified");
    } else {
      console.warn("⚠️ Fundi core system initialized but verification failed - basic fallbacks will still work");
    }
  } catch (error) {
    console.error("Error initializing Fundi core system:", error);
    console.log("⚠️ Fundi will operate in limited fallback-only mode");
  }
}