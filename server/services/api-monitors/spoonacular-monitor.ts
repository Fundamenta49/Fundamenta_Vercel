import axios from 'axios';
import apiHealthMonitor from '../api-health-monitor';

// Constants
const API_NAME = 'spoonacular';
const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Spoonacular API monitoring and auto-recovery
 */
export class SpoonacularMonitor {
  private spoonacularApiKey: string | null = null;
  private isRateLimited: boolean = false;
  private rateLimitResetTime: Date | null = null;
  
  constructor() {
    this.spoonacularApiKey = process.env.SPOONACULAR_API_KEY || null;
    
    // Start monitoring if API key is available
    if (this.spoonacularApiKey) {
      this.startMonitoring();
    } else {
      console.warn('[SpoonacularMonitor] No API key available, monitoring not started');
    }
  }
  
  /**
   * Start monitoring Spoonacular API health
   */
  public startMonitoring(): void {
    if (!this.spoonacularApiKey) {
      console.error('[SpoonacularMonitor] Cannot start monitoring without API key');
      return;
    }
    
    apiHealthMonitor.startMonitoring(
      API_NAME,
      `${BASE_URL}/food/ingredients/search?query=apple&number=1&apiKey=${this.spoonacularApiKey}`,
      CHECK_INTERVAL,
      this.checkSpoonacularHealth.bind(this)
    );
    
    // Listen for status changes
    apiHealthMonitor.onStatusChange(API_NAME, (isHealthy) => {
      console.log(`[SpoonacularMonitor] Status changed to ${isHealthy ? 'healthy' : 'unhealthy'}`);
      
      if (isHealthy && this.isRateLimited) {
        console.log('[SpoonacularMonitor] Rate limit appears to be reset');
        this.isRateLimited = false;
        this.rateLimitResetTime = null;
      }
    });
    
    console.log('[SpoonacularMonitor] Monitoring started');
  }
  
  /**
   * Stop monitoring Spoonacular API
   */
  public stopMonitoring(): void {
    apiHealthMonitor.stopMonitoring(API_NAME);
    console.log('[SpoonacularMonitor] Monitoring stopped');
  }
  
  /**
   * Force a health check of the Spoonacular API
   * @returns Promise resolving to health status
   */
  public async forceCheck(): Promise<boolean> {
    return apiHealthMonitor.forceCheck(API_NAME);
  }
  
  /**
   * Get current API status
   * @returns Status object with health info
   */
  public getStatus(): {
    isHealthy: boolean;
    isRateLimited: boolean;
    rateLimitResetTime: Date | null;
    lastChecked: Date | null;
  } {
    return {
      isHealthy: apiHealthMonitor.isHealthy(API_NAME),
      isRateLimited: this.isRateLimited,
      rateLimitResetTime: this.rateLimitResetTime,
      lastChecked: apiHealthMonitor.getLastChecked(API_NAME)
    };
  }
  
  /**
   * Update the API key
   * @param apiKey New API key
   */
  public updateApiKey(apiKey: string): void {
    this.spoonacularApiKey = apiKey;
    
    // Restart monitoring with new key
    this.stopMonitoring();
    this.startMonitoring();
  }
  
  /**
   * Check if Spoonacular API is rate limited
   * @returns Boolean indicating rate limit status
   */
  public isApiRateLimited(): boolean {
    return this.isRateLimited;
  }
  
  /**
   * Handle a rate limit error response
   * @param retryAfterSeconds Optional seconds until rate limit resets
   */
  public handleRateLimitError(retryAfterSeconds?: number): void {
    this.isRateLimited = true;
    
    // Set approximate reset time
    if (retryAfterSeconds) {
      this.rateLimitResetTime = new Date(Date.now() + (retryAfterSeconds * 1000));
    } else {
      // Default to 24 hours if no retry-after header provided
      this.rateLimitResetTime = new Date(Date.now() + (24 * 60 * 60 * 1000));
    }
    
    console.warn(`[SpoonacularMonitor] API rate limited, reset around ${this.rateLimitResetTime.toLocaleString()}`);
  }
  
  /**
   * Predict if a request would be rate limited
   * @returns Boolean predicting if request would be limited
   */
  public shouldThrottleRequest(): boolean {
    // If we know we're rate limited and have a reset time
    if (this.isRateLimited && this.rateLimitResetTime) {
      // Check if reset time has passed
      if (new Date() < this.rateLimitResetTime) {
        return true;
      } else {
        // Reset time has passed, allow request and check again
        this.isRateLimited = false;
        this.rateLimitResetTime = null;
        return false;
      }
    }
    
    return false;
  }
  
  /**
   * Custom health check for Spoonacular API
   */
  private async checkSpoonacularHealth(): Promise<boolean> {
    try {
      // Skip health check if we're in a known rate-limited state
      if (this.shouldThrottleRequest()) {
        console.log('[SpoonacularMonitor] Skipping health check due to rate limiting');
        return false;
      }
      
      // Simple API call to test the key
      const response = await axios.get(`${BASE_URL}/food/ingredients/search`, {
        params: {
          apiKey: this.spoonacularApiKey,
          query: 'apple',
          number: 1
        },
        timeout: 5000
      });
      
      // Check if response indicates rate limiting (comes back as 200 status with failure message)
      if (response.data?.status === 'failure' && response.data?.code === 402) {
        console.log('[SpoonacularMonitor] API rate limit detected:', response.data.message);
        this.handleRateLimitError();
        return false;
      }
      
      return true;
    } catch (error) {
      // Check for rate limit error in response
      if (axios.isAxiosError(error) && 
          (error.response?.status === 402 || 
           (error.response?.data?.status === 'failure' && error.response?.data?.code === 402))) {
        // Extract retry-after if available
        const retryAfter = error.response?.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after'], 10)
          : undefined;
        
        this.handleRateLimitError(retryAfter);
        return false;
      }
      
      console.error('[SpoonacularMonitor] Health check error:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new SpoonacularMonitor();