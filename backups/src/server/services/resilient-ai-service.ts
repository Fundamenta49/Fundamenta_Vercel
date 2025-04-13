/**
 * Resilient AI Service
 * 
 * This service integrates circuit breaker, response caching, and fallback mechanisms
 * to create a robust AI chat service that can withstand external service failures.
 * 
 * The architecture ensures:
 * 1. Failed calls to primary AI provider fail fast after a threshold
 * 2. Recent successful responses are cached and can be used as fallbacks
 * 3. Degraded but functional experience when primary AI is unavailable
 * 4. Automatic recovery when primary service becomes available again
 * 5. Isolation from other application failures
 */

import { CircuitBreaker, CircuitState } from './circuit-breaker';
import { ResponseCache } from './response-cache';
import { AIProvider, AIResponse, Message } from '../ai/ai-fallback-strategy';

// Import existing AI providers
import { OpenAIProvider, HuggingFaceProvider } from '../ai/ai-fallback-strategy';

// Create event emitter for service status changes
import { EventEmitter } from 'events';

export enum AIServiceState {
  HEALTHY = 'HEALTHY',          // Everything is working normally
  DEGRADED = 'DEGRADED',        // Using fallback provider
  LIMITED = 'LIMITED',          // Using cache only
  UNAVAILABLE = 'UNAVAILABLE'   // No services available
}

interface AIServiceStatus {
  state: AIServiceState;
  primaryAvailable: boolean;
  fallbackAvailable: boolean;
  cacheAvailable: boolean;
  circuitState: CircuitState;
  lastError?: string;
  healthPercentage: number;
}

export class ResilientAIService extends EventEmitter {
  private primaryProvider: AIProvider;
  private fallbackProvider: AIProvider;
  private circuitBreaker: CircuitBreaker;
  private responseCache: ResponseCache;
  private serviceState: AIServiceState = AIServiceState.HEALTHY;
  private lastError?: string;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  
  constructor(
    primaryProvider: AIProvider = new OpenAIProvider(),
    fallbackProvider: AIProvider = new HuggingFaceProvider(),
    cacheSize = 100,
    cacheTTL = 3600000, // 1 hour in milliseconds
    failureThreshold = 3,
    resetTimeout = 60000 // 1 minute
  ) {
    super();
    
    this.primaryProvider = primaryProvider;
    this.fallbackProvider = fallbackProvider;
    
    // Initialize caching system
    this.responseCache = new ResponseCache(cacheSize, cacheTTL);
    
    // Initialize circuit breaker
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold,
      resetTimeout,
      onStateChange: (from, to) => {
        console.log(`AI Service circuit state changed: ${from} -> ${to}`);
        this.updateServiceState();
        this.emit('circuitStateChanged', { from, to });
      }
    });
    
    // Set up periodic health check
    this.healthCheckInterval = setInterval(() => this.checkHealth(), 60000); // Check every minute
  }
  
  /**
   * Generate a response to a user message with full resilience
   */
  async generateResponse(
    message: string,
    systemPrompt: string,
    previousMessages: Message[]
  ): Promise<AIResponse> {
    // Prepare cache key - use the full context for best results
    const cacheKey = this.createCacheKey(message, previousMessages);
    
    try {
      // First, check cache for recent identical or very similar queries
      const cachedResponse = this.responseCache.get(cacheKey);
      if (cachedResponse) {
        console.log('Using cached AI response');
        return this.appendCacheNotice(cachedResponse, false); // Don't add fallback notice for cache hits
      }
      
      // If not in cache, try using the circuit breaker to call primary or fallback
      return await this.circuitBreaker.execute(
        // Primary function - try OpenAI first
        async () => {
          const response = await this.primaryProvider.generateResponse(
            message, systemPrompt, previousMessages
          );
          
          // On success, cache the response for future use
          this.responseCache.set(cacheKey, response);
          
          this.updateServiceState();
          return response;
        },
        
        // Fallback function - try HuggingFace or similar
        async () => {
          try {
            // Try the fallback provider
            const fallbackResponse = await this.fallbackProvider.generateResponse(
              message, systemPrompt, previousMessages
            );
            
            // Cache the fallback response but with shorter TTL
            this.responseCache.set(cacheKey, fallbackResponse, 1800000); // 30 minutes
            
            this.updateServiceState(AIServiceState.DEGRADED);
            return this.appendFallbackNotice(fallbackResponse);
          } catch (fallbackError) {
            // Both primary and fallback failed, try to find similar cached response
            const similarResponse = this.responseCache.findSimilar(message);
            if (similarResponse) {
              this.updateServiceState(AIServiceState.LIMITED);
              return this.appendCacheNotice(similarResponse, true);
            }
            
            // Last resort - return a generic response
            this.updateServiceState(AIServiceState.UNAVAILABLE);
            this.lastError = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
            
            return this.createGenericResponse(message);
          }
        }
      );
    } catch (error) {
      // This should not happen - the circuit breaker should handle errors
      console.error('Unexpected error in resilient AI service:', error);
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.updateServiceState(AIServiceState.UNAVAILABLE);
      
      return this.createGenericResponse(message);
    }
  }
  
  /**
   * Get the current AI service status
   */
  public getStatus(): AIServiceStatus {
    const circuitStatus = this.circuitBreaker.getStatus();
    
    return {
      state: this.serviceState,
      primaryAvailable: this.serviceState === AIServiceState.HEALTHY,
      fallbackAvailable: this.serviceState !== AIServiceState.UNAVAILABLE,
      cacheAvailable: true, // Cache is always available, might be empty though
      circuitState: this.circuitBreaker.getState(),
      lastError: this.lastError,
      healthPercentage: circuitStatus.healthPercentage
    };
  }
  
  /**
   * Reset the service to a healthy state
   */
  public reset(): void {
    this.circuitBreaker.reset();
    this.updateServiceState();
    this.lastError = undefined;
    console.log('AI service manually reset');
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
  
  /**
   * Run a health check to verify service status
   */
  private async checkHealth(): Promise<boolean> {
    try {
      // Simple health check message
      const healthCheckMessage = "Are you working properly?";
      
      // Try the primary provider with a simple test
      await this.primaryProvider.generateResponse(
        healthCheckMessage,
        "You are a helpful assistant. Keep your response very short and simple.",
        []
      );
      
      // If we got here, the primary is working
      if (this.serviceState !== AIServiceState.HEALTHY) {
        console.log('Health check: Primary AI provider is healthy again');
        this.circuitBreaker.reset();
        this.updateServiceState(AIServiceState.HEALTHY);
      }
      
      return true;
    } catch (error) {
      // Health check failed, ensure circuit breaker is updated
      console.log('Health check: Primary AI provider is still unhealthy');
      
      // Let the circuit breaker know there was another failure
      // This won't trigger external calls since we're explicitly checking health
      if (this.circuitBreaker.getState() === CircuitState.CLOSED) {
        try {
          await this.circuitBreaker.execute(
            async () => { throw new Error('Health check failed'); },
            async () => { return true; }
          );
        } catch {
          // This should never happen since the fallback returns true
        }
      }
      
      return false;
    }
  }
  
  /**
   * Update the service state based on circuit state
   */
  private updateServiceState(forcedState?: AIServiceState): void {
    if (forcedState) {
      if (this.serviceState !== forcedState) {
        const previousState = this.serviceState;
        this.serviceState = forcedState;
        this.emit('stateChanged', { from: previousState, to: forcedState });
      }
      return;
    }
    
    // Automatically determine state based on circuit breaker
    const circuitState = this.circuitBreaker.getState();
    
    let newState: AIServiceState;
    if (circuitState === CircuitState.CLOSED) {
      newState = AIServiceState.HEALTHY;
    } else if (circuitState === CircuitState.OPEN || circuitState === CircuitState.HALF_OPEN) {
      newState = AIServiceState.DEGRADED;
    } else {
      newState = AIServiceState.HEALTHY;
    }
    
    if (this.serviceState !== newState) {
      const previousState = this.serviceState;
      this.serviceState = newState;
      this.emit('stateChanged', { from: previousState, to: newState });
    }
  }
  
  /**
   * Create a generic response when all else fails
   */
  private createGenericResponse(message: string): AIResponse {
    // Make a very simple generic response
    return {
      response: "I'm sorry, I'm having trouble connecting to my knowledge services right now. Please try again in a few moments.",
      sentiment: "apologetic",
      suggestions: [
        { text: "Would you like to explore our main features instead?", path: "/" }
      ],
      followUpQuestions: [
        "Is there something specific you'd like me to help you with when I'm back online?",
        "Would you like to try a different question?"
      ]
    };
  }
  
  /**
   * Append a notice that this is a fallback response
   */
  private appendFallbackNotice(response: AIResponse): AIResponse {
    // Add a small notice that we're in fallback mode
    const fallbackMessage = "I'm currently using a backup system which may not be as comprehensive.";
    
    // Return the modified response
    return {
      ...response,
      response: response.response,
      // We don't prepend the notice to avoid breaking context, but you could add:
      // response: `${fallbackMessage} ${response.response}`
    };
  }
  
  /**
   * Append a notice that this is a cached response
   */
  private appendCacheNotice(response: AIResponse, addFallbackNotice: boolean): AIResponse {
    // Don't modify the response content, just return it as is to maintain conversation flow
    if (addFallbackNotice) {
      // Only adding an attribute to track it's from cache
      return this.appendFallbackNotice(response);
    }
    return { ...response };
  }
  
  /**
   * Create a cache key from the message and context
   */
  private createCacheKey(message: string, previousMessages: Message[]): string {
    // If no previous messages, just use the message
    if (previousMessages.length === 0) {
      return message;
    }
    
    // Include the last 2 messages for context, but only if they're user messages
    const contextMessages = previousMessages
      .filter(msg => msg.role === 'user')
      .slice(-2)
      .map(msg => msg.content);
    
    // Combine with current message
    return [...contextMessages, message].join(' | ');
  }
}